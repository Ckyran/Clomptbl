#!/usr/bin/env node
// Contrôles qualité de CptblT (aucune dépendance) :  node tools/check.mjs  [--runs=300]
//   1. syntaxe de tous les modules JS ;
//   2. plan de comptes (unicité, classes, arborescence) ;
//   3. exercices fixes : 25 exercices, corrigés équilibrés, comptes du plan ;
//   4. exercices générés : chaque modèle est tiré N fois, mêmes vérifications ;
//   5. cours (17 leçons × 3 niveaux), aide-mémoire ;
//   6. tests unitaires de la correction automatique ;
//   7. chemins relatifs dans index.html.

import { readdirSync, readFileSync, statSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RUNS = Number((process.argv.find((a) => a.startsWith('--runs=')) ?? '--runs=300').split('=')[1]);
const load = (rel) => import(pathToFileURL(join(ROOT, rel)).href);

let failures = 0;
let checks = 0;
const section = (name) => console.log(`\n▸ ${name}`);
function check(cond, message) {
  checks++;
  if (!cond) {
    failures++;
    console.log(`  ✘ ${message}`);
  }
}
const ok = (message) => console.log(`  ✔ ${message}`);

// ------------------------------------------------------------------ 1. syntaxe
section('Syntaxe des modules JavaScript');
function jsFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (name === 'node_modules' || name.startsWith('.')) return [];
    return statSync(p).isDirectory() ? jsFiles(p) : /\.(m?js)$/.test(name) ? [p] : [];
  });
}
const files = [...jsFiles(join(ROOT, 'js')), ...jsFiles(join(ROOT, 'tools'))];
const tmp = mkdtempSync(join(tmpdir(), 'cptblt-'));
for (const f of files) {
  // On copie en .mjs pour forcer l'analyse « module ES », quelle que soit la config de Node.
  const copy = join(tmp, 'probe.mjs');
  writeFileSync(copy, readFileSync(f, 'utf8'));
  const r = spawnSync(process.execPath, ['--check', copy], { encoding: 'utf8' });
  check(r.status === 0, `erreur de syntaxe dans ${relative(ROOT, f)}\n${r.stderr}`);
}
rmSync(tmp, { recursive: true, force: true });
ok(`${files.length} fichiers analysés`);

// ------------------------------------------------------------------ modules
const A = await load('js/data/accounts.js');
const X = await load('js/data/exercises.js');
const G = await load('js/data/generators.js');
const K = await load('js/data/course.js');
const U = await load('js/util.js');
const R = await load('js/grading.js');

// ------------------------------------------------------------------ 2. plan de comptes
section('Plan de comptes');
const nums = A.ACCOUNTS.map((a) => a.num);
check(new Set(nums).size === nums.length, 'numéros de comptes en double');
check(A.ACCOUNTS.length >= 480 && A.ACCOUNTS.length <= 620, `nombre de comptes inattendu : ${A.ACCOUNTS.length} (attendu ≈ 500)`);
for (const a of A.ACCOUNTS) {
  check(/^[1-9]\d+$/.test(a.num), `numéro invalide : ${a.num}`);
  check(a.label.length > 1, `libellé vide : ${a.num}`);
  check(a.cls === Number(a.num[0]), `classe incohérente : ${a.num}`);
}
for (let c = 1; c <= 9; c++) check(A.ACCOUNTS.some((a) => a.cls === c), `classe ${c} vide`);
const { byNum, roots } = A.buildTree();
check(roots.length === 9, 'il doit y avoir 9 classes racines');
for (const a of A.ACCOUNTS) {
  const node = byNum.get(a.num);
  check(node.parent != null, `compte sans parent : ${a.num}`);
  if (node.parent && !node.parent.isClass) {
    check(a.num.startsWith(node.parent.num), `parent non préfixe : ${a.num} -> ${node.parent.num}`);
    // le parent doit être le plus long préfixe existant
    for (let len = a.num.length - 1; len > node.parent.num.length; len--) {
      check(!A.accountExists(a.num.slice(0, len)), `parent non maximal pour ${a.num} (${a.num.slice(0, len)} existe)`);
    }
  }
}
const chain = [];
for (let n = byNum.get('44551'); n; n = n.parent) chain.push(n.num);
check(chain.join('>') === '44551>4455>445>44>4', `chaîne 44551 inattendue : ${chain.join('>')}`);
for (const g of A.EQUIV_GROUPS) for (const n of g) check(A.accountExists(n), `groupe d'équivalence : compte inconnu ${n}`);
ok(`${A.ACCOUNTS.length} comptes, ${roots.length} classes, arborescence cohérente`);

// ------------------------------------------------------------------ 3. exercices fixes
section('Exercices fixes');
check(X.EXERCISES.length === 25, `25 exercices attendus, ${X.EXERCISES.length} trouvés`);
const perLevel = [1, 2, 3, 4].map((l) => X.EXERCISES.filter((e) => e.level === l).length);
check(perLevel.every((n) => n > 0), `niveau vide : ${perLevel}`);
check(new Set(X.EXERCISES.map((e) => e.id)).size === X.EXERCISES.length, 'identifiants en double');
for (const e of X.EXERCISES) {
  const errs = G.validateExercise(e);
  check(errs.length === 0, `exercice ${e.id} : ${errs.join(' ; ')}`);
  check([1, 2, 3, 4].includes(e.level), `${e.id} : niveau invalide`);
}
ok(`${X.EXERCISES.length} exercices (niveaux : ${perLevel.join(' / ')}), tous équilibrés, comptes existants`);

// ------------------------------------------------------------------ 4. exercices générés
section(`Exercices générés (${RUNS} tirages par modèle)`);
let generated = 0;
for (const level of [1, 2, 3, 4]) {
  const templates = G.TEMPLATES[level];
  check(templates.length >= 5, `niveau ${level} : moins de 5 modèles`);
  for (const tpl of templates) {
    for (let seed = 1; seed <= RUNS; seed++) {
      const r = U.randomKit(U.makeRng(seed * 104729 + level * 31));
      let exo;
      try {
        exo = tpl.make(r);
      } catch (err) {
        check(false, `niveau ${level} / ${tpl.key} / seed ${seed} : exception ${err.message}`);
        break;
      }
      const errs = G.validateExercise(exo);
      check(errs.length === 0, `niveau ${level} / ${tpl.key} / seed ${seed} : ${errs.join(' ; ')}`);
      generated++;
      if (errs.length) break;
    }
  }
  for (let i = 0; i < 50; i++) {
    const exo = G.generateExercise(level, { rng: U.makeRng(i + 1) });
    check(exo.generated === true && exo.level === level, 'métadonnées de generateExercise');
    check(G.validateExercise(exo).length === 0, `generateExercise niveau ${level}`);
  }
  ok(`niveau ${level} : ${templates.length} modèles (${templates.map((t) => t.key).join(', ')})`);
}
// Le validateur doit bien détecter les anomalies.
const bad = { title: 't', statement: 's', hint: 'h', explanation: 'e', parts: [{ lines: [U.D('512', 100), U.C('999999', 100)] }] };
check(G.validateExercise(bad).some((m) => m.includes('inconnu')), 'le validateur doit détecter un compte inconnu');
const unbalanced = { ...bad, parts: [{ lines: [U.D('512', 100), U.C('101', 90)] }] };
check(G.validateExercise(unbalanced).some((m) => m.includes('déséquilibrée')), 'le validateur doit détecter un déséquilibre');
const negative = { ...bad, parts: [{ lines: [U.D('512', -100), U.C('101', -100)] }] };
check(G.validateExercise(negative).some((m) => m.includes('non positif')), 'le validateur doit détecter un montant négatif');
ok(`${generated} exercices générés contrôlés + validateur testé`);

// ------------------------------------------------------------------ 5. cours et aide-mémoire
section('Cours et aide-mémoire');
check(K.LESSONS.length === 17, `17 leçons attendues, ${K.LESSONS.length} trouvées`);
const expectedTitles = ['sert la comptabilité', 'partie double', 'Débit', 'Journal', 'plan de comptes', 'TVA', 'achats', 'réductions', 'règlements', 'Immobilisations', 'Dépréciations', 'paie', 'stocks', 'régularisations', 'cession', 'emprunts', 'Méthode'];
K.LESSONS.forEach((l, i) => {
  check(l.id === i + 1, `leçon ${i + 1} : id incohérent`);
  check(l.title.toLowerCase().includes(expectedTitles[i].toLowerCase()), `leçon ${i + 1} : titre inattendu « ${l.title} »`);
  for (const lv of ['kid', 'teen', 'adult']) {
    const d = l.levels[lv];
    check(d && d.html && d.html.length > 200, `leçon ${l.id} / ${lv} : contenu trop court ou absent`);
  }
  check(l.levels.adult.entries?.length > 0, `leçon ${l.id} : le niveau Adulte doit contenir des exemples d'écritures`);
  check(l.practice >= 1 && l.practice <= 4, `leçon ${l.id} : niveau d'entraînement invalide`);
  for (const lv of ['kid', 'teen', 'adult']) {
    for (const en of l.levels[lv].entries ?? []) {
      let d = 0;
      let c = 0;
      for (const [acc, dd, cc] of en.lines) {
        check(A.accountExists(acc), `leçon ${l.id} « ${en.title} » : compte inconnu ${acc}`);
        d += U.toCents(dd ?? 0);
        c += U.toCents(cc ?? 0);
        check(dd == null || cc == null, `leçon ${l.id} « ${en.title} » : ligne avec débit ET crédit`);
      }
      check(d === c && d > 0, `leçon ${l.id} « ${en.title} » : écriture déséquilibrée (${d / 100} ≠ ${c / 100})`);
    }
  }
});
for (const s of K.MEMO.schemas) {
  const groups = s.entries ? s.entries.map((e) => e.lines) : [s.lines];
  for (const lines of groups) for (const [acc] of lines) check(A.accountExists(acc) || K.SYMBOLIC_LABELS[acc], `aide-mémoire « ${s.title} » : compte inconnu ${acc}`);
}
check(K.MEMO.rules.length === 4, "l'aide-mémoire doit décrire 4 natures de comptes");
ok(`${K.LESSONS.length} leçons × 3 niveaux, ${K.MEMO.schemas.length} schémas d'écritures`);

// ------------------------------------------------------------------ 6. correction automatique
section('Correction automatique (tests unitaires)');
const exp = [U.D('607', 2500), U.D('44566', 500), U.C('401', 3000)];
const row = (acc, d = null, c = null) => ({ acc, d, c });
let g = R.gradePart(exp, [row('607', 2500), row('44566', 500), row('401', null, 3000)]);
check(g.correct && g.okCount === 3, 'réponse exacte acceptée');
g = R.gradePart(exp, [row('401', null, 3000), row('607', 2500), row('44566', 500)]);
check(g.correct, "l'ordre des lignes ne doit pas compter");
g = R.gradePart(exp, [row('607', 2500.004), row('44566', 500), row('401', null, 2999.995)]);
check(g.correct, "tolérance d'arrondi d'un centime");
g = R.gradePart(exp, [row('607', 2400), row('44566', 500), row('401', null, 3000)]);
check(!g.correct && g.rows[0].state === 'bad' && /montant/.test(g.rows[0].reason), 'montant faux détecté');
g = R.gradePart(exp, [row('607', null, 2500), row('44566', 500), row('401', null, 3000)]);
check(!g.correct && /sens/.test(g.rows[0].reason), 'sens inversé détecté');
g = R.gradePart(exp, [row('607', 2500), row('44566', 500), row('401', null, 3000), row('512', 10)]);
check(!g.correct && g.rows[3].state === 'bad', 'ligne en trop détectée');
g = R.gradePart(exp, [row('607', 2500), row('401', null, 3000)]);
check(!g.correct && g.missing === 1, 'ligne manquante détectée');
g = R.gradePart(exp, [row('607', 2500, 2500), row('44566', 500), row('401', null, 3000)]);
check(!g.correct && g.rows[0].state === 'bad', 'ligne avec débit ET crédit refusée');
g = R.gradePart(exp, [row('', null, null), row('', null, null)]);
check(g.empty && !g.correct, 'saisie vide');
g = R.gradePart(exp, [row('607', 2500), row('607', 2500), row('44566', 500), row('401', null, 3000)]);
check(!g.correct && g.rows.filter((r) => r.state === 'bad').length === 1, 'doublon détecté');
const cash = [U.D('530', 500, ['53', '531']), U.C('512', 500)];
for (const acc of ['530', '531', '53']) check(R.gradePart(cash, [row(acc, 500), row('512', null, 500)]).correct, `caisse : ${acc} accepté`);
check(!R.gradePart(cash, [row('512', 500), row('512', null, 500)]).correct, 'deux comptes identiques ≠ caisse');
check(R.gradePart([U.D('401', 10), U.C('512', 10)], [row('4011', 10), row('5121', null, 10)]).correct, 'comptes équivalents (4011, 5121) acceptés');
const t = R.totals([row('a', 100.1), row('b', null, 100.1)]);
check(t.balanced && t.gap === 0, 'totaux équilibrés (sans dérive flottante)');
check(!R.totals([row('a', 100), row('b', null, 90)]).balanced, 'écart détecté');
check(U.parseAmount('1 234,56') === 1234.56 && U.parseAmount('') === null && Number.isNaN(U.parseAmount('abc')), 'lecture des montants saisis');
ok('correction automatique validée');

// ------------------------------------------------------------------ 7. chemins relatifs
section('Chemins relatifs (GitHub Pages)');
const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
for (const m of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
  const url = m[1];
  if (/^(https?:|data:|#)/.test(url)) continue;
  check(!url.startsWith('/'), `chemin absolu dans index.html : ${url}`);
}
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/from\s+'([^']+)'/g)) check(m[1].startsWith('.') || m[1].startsWith('node:'), `import non relatif dans ${relative(ROOT, f)} : ${m[1]}`);
}
ok('tous les chemins locaux sont relatifs');

console.log(`\n${failures === 0 ? '✅' : '❌'} ${checks} contrôles, ${failures} échec(s)`);
process.exit(failures === 0 ? 0 : 1);
