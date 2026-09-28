// CptblT — logique de l'application (navigation, cours, exercices, plan de comptes, outils, thème).
// 100 % statique : modules ES natifs, aucun framework, aucun build.

import { ACCOUNTS, CLASSES, buildTree, accountLabel } from './data/accounts.js';
import { LEVELS, EXERCISES } from './data/exercises.js';
import { generateExercise } from './data/generators.js';
import { LESSONS, MEMO, SYMBOLIC_LABELS } from './data/course.js';
import { esc, fmtEuro, fmtNum, parseAmount, norm, round2 } from './util.js';
import { gradePart, totals } from './grading.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// =====================================================================================
// Stockage local (localStorage protégé : il peut être indisponible ou bloqué)
// =====================================================================================
const KEYS = { progress: 'cptblt.progress.v1', theme: 'cptblt.theme' };

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* stockage indisponible : l'application fonctionne sans mémorisation */
    }
  },
};

function loadProgress() {
  const base = { status: {}, generated: {}, lessonsRead: [], level: 'teen' };
  try {
    const saved = JSON.parse(storage.get(KEYS.progress));
    if (saved && typeof saved === 'object') {
      return {
        ...base,
        ...saved,
        status: { ...saved.status },
        generated: { ...saved.generated },
        lessonsRead: Array.isArray(saved.lessonsRead) ? saved.lessonsRead : [],
        level: ['kid', 'teen', 'adult'].includes(saved.level) ? saved.level : base.level,
      };
    }
  } catch {
    /* données absentes ou corrompues : on repart de zéro */
  }
  return base;
}

const progress = loadProgress();
const saveProgress = () => storage.set(KEYS.progress, JSON.stringify(progress));

const STATUS_LABEL = { todo: 'À faire', progress: 'En cours', done: 'Réussi' };
const STATUS_ICON = { todo: '○', progress: '◐', done: '✓' };

// =====================================================================================
// Thème jour / nuit
// =====================================================================================
const themeBtn = $('#theme-toggle');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const dark = theme === 'dark';
  themeBtn.textContent = dark ? '☀️' : '🌙';
  themeBtn.setAttribute('aria-label', dark ? 'Passer en thème clair' : 'Passer en thème sombre');
  themeBtn.title = dark ? 'Passer en thème clair' : 'Passer en thème sombre';
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#272e78' : '#4f46e5');
}

function initTheme() {
  const saved = storage.get(KEYS.theme);
  applyTheme(saved === 'dark' || saved === 'light' ? saved : systemDark.matches ? 'dark' : 'light');
  themeBtn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storage.set(KEYS.theme, next);
  });
  // Tant que l'utilisateur n'a rien choisi, on suit la préférence système.
  systemDark.addEventListener?.('change', (e) => {
    const s = storage.get(KEYS.theme);
    if (s !== 'dark' && s !== 'light') applyTheme(e.matches ? 'dark' : 'light');
  });
}

// =====================================================================================
// Rendu commun : tableaux d'écritures
// =====================================================================================
const amountCell = (v) => (v == null ? '' : typeof v === 'number' ? fmtNum(v) : esc(v));

/** lines : [[compte, débit, crédit], ...] — montants numériques ou symboliques ('HT', 'TVA'...). */
function entryTable(lines) {
  const allNumeric = lines.every(([, d, c]) => (d == null || typeof d === 'number') && (c == null || typeof c === 'number'));
  const rows = lines
    .map(([acc, d, c]) => {
      const label = accountLabel(acc) ?? SYMBOLIC_LABELS[acc] ?? '';
      return `<tr class="${d == null && c != null ? 'is-credit' : ''}"><td class="acc">${esc(acc)}</td><td class="lbl">${esc(label)}</td><td class="amt">${amountCell(d)}</td><td class="amt">${amountCell(c)}</td></tr>`;
    })
    .join('');
  let foot = '';
  if (allNumeric) {
    const td = lines.reduce((s, [, d]) => s + (d ?? 0), 0);
    const tc = lines.reduce((s, [, , c]) => s + (c ?? 0), 0);
    foot = `<tfoot><tr><td colspan="2">Total <span class="ok-eq">${round2(td) === round2(tc) ? '✔ équilibré' : ''}</span></td><td class="amt">${fmtNum(td)}</td><td class="amt">${fmtNum(tc)}</td></tr></tfoot>`;
  }
  return `<div class="table-wrap"><table class="entry"><thead><tr><th>N°</th><th>Libellé</th><th class="amt">Débit</th><th class="amt">Crédit</th></tr></thead><tbody>${rows}</tbody>${foot}</table></div>`;
}

const entryCard = ({ title, note, lines }) =>
  `<article class="entry-card"><header><strong>${esc(title)}</strong>${note ? `<span>${esc(note)}</span>` : ''}</header>${entryTable(lines)}</article>`;

/** Lignes de corrigé {acc, side, amount} -> tuples pour entryTable. */
const solutionLines = (lines) => lines.map((l) => [l.acc, l.side === 'D' ? l.amount : null, l.side === 'C' ? l.amount : null]);

// =====================================================================================
// Routage par hash (compatible GitHub Pages) : #/cours/3, #/exercices/n1-01, #/exercices/infini/2/xyz ...
// =====================================================================================
const TABS = ['cours', 'exercices', 'plan', 'outils', 'memo'];
const TAB_TITLES = { cours: 'Cours', exercices: 'Exercices', plan: 'Plan de comptes', outils: 'Outils', memo: 'Aide-mémoire' };
const panels = Object.fromEntries(TABS.map((t) => [t, $(`#tab-${t}`)]));
const built = { plan: false, outils: false, memo: false };

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  const parts = raw.split('/').filter(Boolean).map((p) => {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  });
  const tab = TABS.includes(parts[0]) ? parts[0] : 'cours'; // « Cours » = onglet par défaut
  return { tab, args: parts.slice(1) };
}

function render() {
  const { tab, args } = parseRoute();
  for (const t of TABS) {
    panels[t].hidden = t !== tab;
  }
  for (const a of $$('.tab')) {
    if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  document.title = `${TAB_TITLES[tab]} — CptblT`;
  $(`.tab[data-tab="${tab}"]`).scrollIntoView({ inline: 'center', block: 'nearest' }); // barre d'onglets défilante (mobile)

  if (tab === 'cours') renderCours(Number(args[0]) || 1);
  else if (tab === 'exercices') renderExercisesRoute(args);
  else if (tab === 'plan') {
    if (!built.plan) initPlan();
  } else if (tab === 'outils') {
    if (!built.outils) initTools();
  } else if (tab === 'memo') {
    if (!built.memo) initMemo();
  }
  if (!(tab === 'plan' && pendingReveal)) window.scrollTo({ top: 0 });
}

// =====================================================================================
// 1) COURS
// =====================================================================================
const LEVEL_BUTTONS = [
  ['kid', '🧒 Enfant'],
  ['teen', '🧑 Jeune'],
  ['adult', '👩‍💼 Adulte'],
];

function renderCours(id) {
  const root = panels.cours;
  const lesson = LESSONS.find((l) => l.id === id) ?? LESSONS[0];
  if (!progress.lessonsRead.includes(lesson.id)) {
    progress.lessonsRead.push(lesson.id);
    saveProgress();
  }
  const idx = LESSONS.indexOf(lesson);
  const prev = LESSONS[idx - 1];
  const next = LESSONS[idx + 1];

  root.innerHTML = `
    <div class="course-layout">
      <aside class="toc" id="toc" aria-label="Sommaire du cours">
        <button class="toc-toggle" type="button" aria-expanded="false" data-action="toggle-toc">
          <span>☰ Sommaire — leçon ${lesson.id} / ${LESSONS.length}</span><span aria-hidden="true">▾</span>
        </button>
        <h3 class="toc-title">Sommaire · ${LESSONS.length} leçons</h3>
        <ol class="toc-list">
          ${LESSONS.map(
            (l) => `<li><a class="toc-link ${progress.lessonsRead.includes(l.id) ? 'read' : ''}" href="#/cours/${l.id}" ${l.id === lesson.id ? 'aria-current="page"' : ''}>
              <span class="toc-num">${l.id}</span><span>${esc(l.title)}</span></a></li>`,
          ).join('')}
        </ol>
      </aside>
      <article class="lesson" aria-labelledby="lesson-title">
        <div class="level-switch" role="group" aria-label="Niveau d'explication">
          ${LEVEL_BUTTONS.map(([k, label]) => `<button type="button" data-level="${k}" aria-pressed="${progress.level === k}">${label}</button>`).join('')}
        </div>
        <div class="lesson-kicker">Leçon ${lesson.id} / ${LESSONS.length}</div>
        <h2 id="lesson-title">${lesson.icon} ${esc(lesson.title)}</h2>
        <div class="lesson-body" id="lesson-body"></div>
        <nav class="lesson-nav" aria-label="Navigation entre leçons">
          ${prev ? `<a class="btn btn-ghost" href="#/cours/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}
          <a class="btn btn-accent" href="#/exercices">✍️ S'entraîner (niveau ${lesson.practice})</a>
          ${next ? `<a class="btn btn-primary" href="#/cours/${next.id}">${esc(next.title)} →</a>` : '<span></span>'}
        </nav>
      </article>
    </div>`;

  fillLessonBody(lesson);
}

function fillLessonBody(lesson) {
  const level = progress.level;
  const data = lesson.levels[level];
  let html = data.html;
  if (data.entries?.length) {
    html += `<h3 class="examples-title">📝 Exemples d'écritures</h3>${data.entries.map(entryCard).join('')}`;
  } else if (level !== 'adult' && lesson.levels.adult.entries?.length) {
    html += `<div class="cta-adult"><span>👩‍💼 Envie de voir les <strong>écritures avec les vrais numéros de comptes</strong> ?</span>
      <button class="btn btn-primary btn-sm" type="button" data-level="adult">Passer en niveau Adulte</button></div>`;
  }
  const body = $('#lesson-body');
  body.innerHTML = html;
  // Les tableaux du cours défilent horizontalement dans leur cadre sur petit écran.
  for (const table of $$('table.mini', body)) {
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    table.replaceWith(wrap);
    wrap.appendChild(table);
  }
  for (const b of $$('.level-switch button')) b.setAttribute('aria-pressed', String(b.dataset.level === level));
}

panels.cours.addEventListener('click', (e) => {
  const levelBtn = e.target.closest('[data-level]');
  if (levelBtn) {
    progress.level = levelBtn.dataset.level;
    saveProgress();
    const cur = LESSONS.find((l) => l.id === (Number(parseRoute().args[0]) || 1)) ?? LESSONS[0];
    fillLessonBody(cur);
    return;
  }
  if (e.target.closest('[data-action="toggle-toc"]')) {
    const toc = $('#toc');
    const open = toc.classList.toggle('open');
    $('[data-action="toggle-toc"]', toc).setAttribute('aria-expanded', String(open));
    return;
  }
  if (e.target.closest('.toc-link')) $('#toc')?.classList.remove('open');
});

// =====================================================================================
// 2) EXERCICES
// =====================================================================================
const exState = {
  current: null, // { ex, generated, counted, status, nonce }
  drafts: new Map(), // id -> [[{acc,d,c}, ...] par écriture]
  gen: new Map(), // nonce -> exercice généré (permet retour / avance du navigateur)
  lastKey: null, // dernier modèle généré (évite les répétitions)
};

const getStatus = (cur) => (cur.generated ? cur.status ?? 'todo' : progress.status[cur.ex.id] ?? 'todo');
function setStatus(cur, status) {
  if (cur.generated) cur.status = status;
  else {
    progress.status[cur.ex.id] = status;
    saveProgress();
  }
  paintStatus(cur);
}
const fixedStatus = (id) => progress.status[id] ?? 'todo';
const generatedTotal = () => Object.values(progress.generated).reduce((s, n) => s + (Number(n) || 0), 0);

function renderExercisesRoute(args) {
  if (args[0] === 'infini') {
    const level = Number(args[1]);
    const nonce = args[2] || Math.random().toString(36).slice(2, 8);
    if (LEVELS.some((l) => l.id === level)) {
      let entry = exState.gen.get(nonce);
      if (!entry) {
        const ex = generateExercise(level, { avoidKey: exState.lastKey });
        exState.lastKey = ex.template;
        entry = { ex, generated: true, counted: false, status: 'todo', nonce };
        exState.gen.set(nonce, entry);
      }
      if (!args[2]) history.replaceState(null, '', `#/exercices/infini/${level}/${nonce}`);
      return openExercise(entry);
    }
  } else if (args[0]) {
    const ex = EXERCISES.find((e) => e.id === args[0]);
    if (ex) return openExercise({ ex, generated: false });
  }
  exState.current = null;
  renderExerciseList();
}

function renderExerciseList() {
  const total = EXERCISES.length;
  const done = EXERCISES.filter((e) => fixedStatus(e.id) === 'done').length;
  const pct = Math.round((done / total) * 100);
  const gen = generatedTotal();

  const levelBlocks = LEVELS.map((lvl) => {
    const list = EXERCISES.filter((e) => e.level === lvl.id);
    const lvlDone = list.filter((e) => fixedStatus(e.id) === 'done').length;
    return `
    <section class="card level-block" aria-labelledby="lvl-${lvl.id}">
      <header class="level-head">
        <div>
          <h3 id="lvl-${lvl.id}">${lvl.icon} ${esc(lvl.title)}</h3>
          <p class="muted">${esc(lvl.desc)}</p>
        </div>
        <div class="level-actions">
          <span class="level-count">${lvlDone} / ${list.length} réussis${progress.generated[lvl.id] ? ` · 🎲 ${progress.generated[lvl.id]}` : ''}</span>
          <button class="btn btn-accent btn-sm" type="button" data-action="infinite" data-level="${lvl.id}">🎲 Exercice infini</button>
          <button class="btn btn-ghost btn-sm" type="button" data-action="reset-level" data-level="${lvl.id}">↻ Reprendre</button>
        </div>
      </header>
      <ul class="ex-list">
        ${list
          .map((e) => {
            const st = fixedStatus(e.id);
            return `<li><a class="ex-item st-${st}" href="#/exercices/${e.id}">
              <span class="ex-status" aria-hidden="true">${STATUS_ICON[st]}</span>
              <span class="ex-name">${EXERCISES.indexOf(e) + 1}. ${esc(e.title)}</span>
              <span class="ex-state">${STATUS_LABEL[st]}</span></a></li>`;
          })
          .join('')}
      </ul>
    </section>`;
  }).join('');

  panels.exercices.innerHTML = `
    <div class="page-title"><h2>✍️ Exercices</h2><span class="muted">Saisissez vos écritures comme dans un journal comptable.</span></div>
    <section class="dashboard" aria-label="Tableau de bord">
      <div class="card dash-main">
        <div class="dash-figures"><span class="big-num">${done} / ${total}</span><span>exercices réussis</span><strong>· ${pct} %</strong></div>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Progression"><span style="width:${pct}%"></span></div>
      </div>
      <div class="card dash-gen">
        <span class="big-num">${gen}</span>
        <span>exercice${gen > 1 ? 's' : ''} généré${gen > 1 ? 's' : ''} réussi${gen > 1 ? 's' : ''} 🎲</span>
      </div>
    </section>
    ${levelBlocks}`;
}

panels.exercices.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === 'infinite' || action === 'new-generated') {
    const level = Number(btn.dataset.level ?? exState.current?.ex.level);
    location.hash = `#/exercices/infini/${level}/${Math.random().toString(36).slice(2, 8)}`;
  } else if (action === 'reset-level') {
    const level = Number(btn.dataset.level);
    const lvl = LEVELS.find((l) => l.id === level);
    if (confirm(`Réinitialiser la progression du « ${lvl.title} » uniquement ?\n(Les autres niveaux ne sont pas modifiés.)`)) {
      for (const ex of EXERCISES.filter((x) => x.level === level)) {
        delete progress.status[ex.id];
        exState.drafts.delete(ex.id);
      }
      progress.generated[level] = 0;
      saveProgress();
      renderExerciseList();
    }
  } else if (action === 'verify') verifyExercise();
  else if (action === 'show-solution') toggleSolution();
  else if (action === 'next') goNext();
  else if (action === 'add-row') addRow($('.jrows', btn.closest('.part')), null, true);
  else if (action === 'del-row') deleteRow(btn.closest('.jrow'));
});

// ----------------------------------------------------------- vue d'un exercice
function openExercise(cur) {
  exState.current = cur; // pour un exercice généré, c'est la même référence que dans le cache (retour / avance)
  const { ex, generated } = exState.current;
  const lvl = LEVELS.find((l) => l.id === ex.level);
  const idx = EXERCISES.findIndex((e) => e.id === ex.id);
  const nextEx = EXERCISES[idx + 1];

  const nextBtn = generated
    ? `<button class="btn btn-accent" type="button" data-action="new-generated" data-level="${ex.level}" id="btn-next">🎲 Nouvel exercice aléatoire</button>`
    : `<button class="btn btn-accent" type="button" data-action="next" id="btn-next">${nextEx ? 'Exercice suivant →' : 'Terminer ✓'}</button>`;

  panels.exercices.innerHTML = `
    <div class="ex-view">
      <div class="ex-top">
        <a class="btn btn-ghost btn-sm" href="#/exercices">← Tous les exercices</a>
        <div class="ex-badges">
          <span class="badge lvl">${lvl.icon} Niveau ${ex.level}</span>
          ${generated ? '<span class="badge gen">🎲 Exercice généré</span>' : `<span class="badge">Exercice ${idx + 1} / ${EXERCISES.length}</span>`}
          <span class="badge" id="ex-status"></span>
        </div>
      </div>
      <h2 class="ex-title">${esc(ex.title)}</h2>
      <div class="card statement"><h3>Énoncé</h3><p>${ex.statement}</p></div>
      <details class="hint"><summary>💡 Indice</summary><div>${ex.hint}</div></details>
      ${ex.parts
        .map(
          (part, i) => `
        <section class="part" data-part="${i}">
          ${part.title ? `<h3 class="part-title">${esc(part.title)}</h3>` : ''}
          <div class="journal" role="group" aria-label="${part.title ? esc(part.title) : "Saisie de l'écriture"}">
            <div class="jhead" aria-hidden="true"><span>N° de compte</span><span>Libellé</span><span>Débit</span><span>Crédit</span><span></span></div>
            <div class="jrows"></div>
            <div class="jfoot">
              <button class="btn btn-ghost btn-sm" type="button" data-action="add-row">+ Ajouter une ligne</button>
              <div class="balance is-empty" aria-live="polite">
                <span>Total débit <b class="td">0,00 €</b></span>
                <span>Total crédit <b class="tc">0,00 €</b></span>
                <span class="bal-state">—</span>
              </div>
            </div>
          </div>
        </section>`,
        )
        .join('')}
      <div class="ex-actions">
        <button class="btn btn-primary" type="button" data-action="verify">✔ Vérifier</button>
        <button class="btn btn-ghost" type="button" data-action="show-solution" aria-expanded="false" aria-controls="ex-solution">👁 Voir la correction</button>
        <span class="spacer"></span>
        ${nextBtn}
      </div>
      <div id="ex-result" class="result" role="status" aria-live="polite"></div>
      <div id="ex-solution" class="solution" hidden></div>
    </div>`;

  const draft = exState.drafts.get(ex.id);
  $$('.part', panels.exercices).forEach((partEl, i) => {
    const rowsEl = $('.jrows', partEl);
    const saved = draft?.[i];
    const rows = saved?.length ? saved : [{}, {}, {}];
    rows.forEach((values) => addRow(rowsEl, values, false));
    updateBalance(partEl);
  });
  paintStatus(exState.current);
}

function paintStatus(cur) {
  const el = $('#ex-status');
  if (!el) return;
  const st = getStatus(cur);
  el.className = `badge st-${st}`;
  el.textContent = `${STATUS_ICON[st]} ${STATUS_LABEL[st]}`;
}

// ----------------------------------------------------------- grille de saisie
function rowHtml() {
  return `
    <div class="jrow">
      <input class="acc" type="text" inputmode="numeric" autocomplete="off" list="accounts-list" maxlength="6" placeholder="N°" aria-label="Numéro de compte" />
      <span class="lbl" aria-live="off"></span>
      <input class="d" type="text" inputmode="decimal" autocomplete="off" placeholder="Débit" aria-label="Montant au débit" />
      <input class="c" type="text" inputmode="decimal" autocomplete="off" placeholder="Crédit" aria-label="Montant au crédit" />
      <button class="del" type="button" data-action="del-row" title="Supprimer la ligne" aria-label="Supprimer la ligne">✕</button>
      <div class="fb" role="note"></div>
    </div>`;
}

function addRow(rowsEl, values, focus) {
  rowsEl.insertAdjacentHTML('beforeend', rowHtml());
  const row = rowsEl.lastElementChild;
  if (values) {
    $('.acc', row).value = values.acc ?? '';
    $('.d', row).value = values.d ?? '';
    $('.c', row).value = values.c ?? '';
    refreshLabel(row);
  }
  if (focus) $('.acc', row).focus();
  return row;
}

function deleteRow(row) {
  const rowsEl = row.parentElement;
  const partEl = row.closest('.part');
  if (rowsEl.children.length <= 1) {
    for (const input of $$('input', row)) input.value = '';
    clearRowState(row);
    refreshLabel(row);
  } else {
    row.remove();
  }
  updateBalance(partEl);
  saveDraft();
}

function clearRowState(row) {
  row.classList.remove('ok', 'bad');
  $('.fb', row).textContent = '';
}

function refreshLabel(row) {
  const v = $('.acc', row).value.trim();
  const out = $('.lbl', row);
  out.className = 'lbl';
  if (!v) {
    out.textContent = '';
    return;
  }
  const label = accountLabel(v);
  if (label) out.textContent = label;
  else if (v.length === 1 && CLASSES[v]) {
    out.textContent = `Classe ${v} — ${CLASSES[v]}`;
    out.classList.add('partial');
  } else if (ACCOUNTS.some((a) => a.num.startsWith(v))) {
    out.textContent = '…';
    out.classList.add('partial');
  } else {
    out.textContent = 'Compte inconnu dans le plan';
    out.classList.add('unknown');
  }
}

/** Lit une ligne : d / c valent null (vide), un nombre, ou NaN (illisible). */
function readRow(row) {
  return { acc: $('.acc', row).value.trim(), d: parseAmount($('.d', row).value), c: parseAmount($('.c', row).value), el: row };
}
const readRows = (partEl) => $$('.jrow', partEl).map(readRow);

function updateBalance(partEl) {
  const t = totals(readRows(partEl));
  const bal = $('.balance', partEl);
  $('.td', bal).textContent = fmtEuro(t.debit);
  $('.tc', bal).textContent = fmtEuro(t.credit);
  const state = $('.bal-state', bal);
  bal.classList.remove('is-empty', 'is-balanced', 'is-gap');
  if (t.empty) {
    bal.classList.add('is-empty');
    state.textContent = '—';
  } else if (t.balanced) {
    bal.classList.add('is-balanced');
    state.textContent = '✔ Équilibré';
  } else {
    bal.classList.add('is-gap');
    state.textContent = `⚠ Écart ${fmtEuro(Math.abs(t.gap))}`;
  }
}

function saveDraft() {
  const cur = exState.current;
  if (!cur) return;
  exState.drafts.set(
    cur.ex.id,
    $$('.part', panels.exercices).map((partEl) =>
      $$('.jrow', partEl).map((row) => ({ acc: $('.acc', row).value, d: $('.d', row).value, c: $('.c', row).value })),
    ),
  );
}

panels.exercices.addEventListener('input', (e) => {
  const input = e.target;
  const row = input.closest('.jrow');
  if (!row) return;
  clearRowState(row);
  if (input.classList.contains('acc')) {
    const clean = input.value.replace(/\D/g, '');
    if (clean !== input.value) input.value = clean;
    refreshLabel(row);
  } else if (input.classList.contains('d') || input.classList.contains('c')) {
    const other = $(input.classList.contains('d') ? '.c' : '.d', row);
    if (input.value.trim() !== '' && other.value !== '') other.value = ''; // une ligne = débit OU crédit
    input.classList.toggle('invalid', Number.isNaN(parseAmount(input.value)));
  }
  updateBalance(row.closest('.part'));
  saveDraft();
  const cur = exState.current;
  if (cur && getStatus(cur) === 'todo') setStatus(cur, 'progress');
});

panels.exercices.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const input = e.target;
  if (!(input instanceof HTMLInputElement)) return;
  const row = input.closest('.jrow');
  if (!row) return;
  e.preventDefault();
  if (input.classList.contains('acc')) return void $('.d', row).focus();
  if (input.classList.contains('d') && !input.value.trim()) return void $('.c', row).focus();
  const nextRow = row.nextElementSibling ?? addRow(row.parentElement, null, false);
  $('.acc', nextRow).focus();
});

// ----------------------------------------------------------- vérification
function verifyExercise() {
  const cur = exState.current;
  if (!cur) return;
  const partEls = $$('.part', panels.exercices);
  const results = partEls.map((partEl, i) => {
    const rows = readRows(partEl);
    for (const r of rows) clearRowState(r.el);
    const res = gradePart(cur.ex.parts[i].lines, rows.map(({ acc, d, c }) => ({ acc, d, c })));
    for (const rr of res.rows) {
      const row = rows[rr.index].el;
      row.classList.add(rr.state);
      $('.fb', row).textContent = `${rr.state === 'ok' ? '✔' : '✘'} ${rr.reason}`;
    }
    const t = totals(rows);
    return { res, t, title: cur.ex.parts[i].title, expected: cur.ex.parts[i].lines.length };
  });

  const box = $('#ex-result');
  if (results.every((r) => r.res.empty)) {
    box.innerHTML = `<div class="msg info">✏️ Saisissez d'abord votre écriture (numéro de compte + montant au débit ou au crédit), puis cliquez sur <strong>Vérifier</strong>.</div>`;
    return;
  }

  const allCorrect = results.every((r) => r.res.correct);
  if (allCorrect) {
    setStatus(cur, 'done');
    let extra = '';
    if (cur.generated && !cur.counted) {
      cur.counted = true;
      progress.generated[cur.ex.level] = (Number(progress.generated[cur.ex.level]) || 0) + 1;
      saveProgress();
      extra = ` <strong>+1 exercice généré réussi</strong> (total : ${generatedTotal()}).`;
    }
    box.innerHTML = `
      <div class="msg success">🎉 <strong>Bravo !</strong> Toutes les lignes sont justes${results.length > 1 ? ' dans les deux écritures' : ''}.${extra}</div>
      <div class="explain"><h4>Explication</h4>${cur.ex.explanation}</div>`;
    $('#btn-next')?.classList.add('pulse');
  } else {
    if (getStatus(cur) !== 'done') setStatus(cur, 'progress');
    const items = results.map((r, i) => {
      const label = results.length > 1 ? `<strong>${esc(r.title ?? `Écriture ${i + 1}`)}</strong> : ` : '';
      if (r.res.empty) return `<li>${label}rien de saisi.</li>`;
      const bits = [`${r.res.okCount} ligne(s) juste(s)`];
      if (r.res.badCount) bits.push(`${r.res.badCount} à corriger (en rouge)`);
      if (r.res.missing) bits.push(`${r.res.missing} ligne(s) manquante(s)`);
      if (!r.t.balanced) bits.push(`écriture non équilibrée (écart ${fmtEuro(Math.abs(r.t.gap))})`);
      return `<li>${label}${bits.join(' · ')}.</li>`;
    });
    box.innerHTML = `<div class="msg fail">❌ <strong>Pas encore.</strong> Corrigez les lignes en rouge et complétez l'écriture.<ul>${items.join('')}</ul></div>`;
  }
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  paintStatus(cur);
}

function toggleSolution() {
  const cur = exState.current;
  const panel = $('#ex-solution');
  const btn = $('[data-action="show-solution"]');
  const show = panel.hidden;
  if (show) {
    panel.innerHTML = `
      <div class="card">
        <h3>✅ Correction</h3>
        ${cur.ex.parts
          .map(
            (p) => `${p.title ? `<h4 class="part-title">${esc(p.title)}</h4>` : ''}<article class="entry-card"><header><strong>Écriture attendue</strong></header>${entryTable(solutionLines(p.lines))}</article>`,
          )
          .join('')}
        <div class="explain"><h4>Explication</h4>${cur.ex.explanation}</div>
      </div>`;
    if (getStatus(cur) === 'todo') setStatus(cur, 'progress');
  }
  panel.hidden = !show;
  btn.setAttribute('aria-expanded', String(show));
  btn.textContent = show ? '🙈 Masquer la correction' : '👁 Voir la correction';
  if (show) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function goNext() {
  const cur = exState.current;
  const idx = EXERCISES.findIndex((e) => e.id === cur.ex.id);
  const next = EXERCISES[idx + 1];
  location.hash = next ? `#/exercices/${next.id}` : '#/exercices';
}

// =====================================================================================
// 3) PLAN DE COMPTES (arborescence repliable + recherche)
// =====================================================================================
let pendingReveal = null;
const tree = buildTree();

function countDescendants(node) {
  return node.children.reduce((s, c) => s + 1 + countDescendants(c), 0);
}

function nodeHtml(node) {
  const cls = `c${node.cls}`;
  const num = node.isClass ? node.num : esc(node.num);
  if (!node.children.length) {
    return `<div class="leaf ${cls}" id="acc-${node.num}"><span class="num">${num}</span><span class="lbl">${esc(node.label)}</span></div>`;
  }
  return `<details class="node ${cls} ${node.isClass ? 'depth-class' : ''}" id="acc-${node.num}">
    <summary><span class="num">${node.isClass ? `Cl. ${num}` : num}</span><span class="lbl">${esc(node.label)}</span><span class="count">${countDescendants(node)}</span></summary>
    <div class="children">${node.children.map(nodeHtml).join('')}</div></details>`;
}

function pathOf(node) {
  const chain = [];
  for (let n = node.parent; n; n = n.parent) chain.unshift(n.num);
  return chain.join(' › ');
}

function initPlan() {
  built.plan = true;
  const root = panels.plan;
  root.innerHTML = `
    <div class="page-title"><h2>🗂️ Plan de comptes</h2><span class="muted">${ACCOUNTS.length} comptes et sous-comptes · classes 1 à 9 · la classe se déduit du 1<sup>er</sup> chiffre</span></div>
    <div class="plan-toolbar">
      <input id="plan-search" class="search-input" type="search" placeholder="Rechercher un numéro ou un libellé (ex. 44571, TVA collectée, amortissement)…" aria-label="Rechercher un compte" autocomplete="off" />
      <button class="btn btn-ghost" type="button" data-action="expand-all">⊕ Tout déplier</button>
      <button class="btn btn-ghost" type="button" data-action="collapse-all">⊖ Tout replier</button>
    </div>
    <p id="plan-info" class="muted" aria-live="polite">Cliquez sur un compte pour le déplier. Astuce : dépliez <strong>44 → 445 → 4455 → 44551</strong>.</p>
    <div id="plan-tree" class="tree">${tree.roots.map(nodeHtml).join('')}</div>
    <div id="plan-results" class="results" hidden></div>`;

  const search = $('#plan-search', root);
  const treeEl = $('#plan-tree', root);
  const results = $('#plan-results', root);
  const info = $('#plan-info', root);

  const normLabels = new Map(ACCOUNTS.map((a) => [a.num, norm(a.label)]));

  function runSearch() {
    const q = norm(search.value.trim());
    if (!q) {
      treeEl.hidden = false;
      results.hidden = true;
      info.innerHTML = 'Cliquez sur un compte pour le déplier. Astuce : dépliez <strong>44 → 445 → 4455 → 44551</strong>.';
      return;
    }
    const tokens = q.split(/\s+/);
    const hits = ACCOUNTS.filter((a) => tokens.every((t) => a.num.startsWith(t) || normLabels.get(a.num).includes(t)));
    treeEl.hidden = true;
    results.hidden = false;
    info.textContent = `${hits.length} résultat${hits.length > 1 ? 's' : ''} pour « ${search.value.trim()} » — cliquez sur un compte pour le retrouver dans l'arborescence.`;
    results.innerHTML = hits.length
      ? hits
          .map((a) => {
            const node = tree.byNum.get(a.num);
            return `<div class="leaf c${a.cls}" role="button" tabindex="0" data-num="${a.num}"><span class="num">${a.num}</span><span class="lbl">${esc(a.label)}</span><span class="path">${esc(pathOf(node))}</span><span class="chip">Classe ${a.cls}</span></div>`;
          })
          .join('')
      : '<div class="empty">Aucun compte ne correspond à cette recherche.</div>';
  }

  function reveal(num) {
    search.value = '';
    runSearch();
    const target = document.getElementById(`acc-${num}`);
    if (!target) return;
    for (let el = target.parentElement; el && el !== treeEl; el = el.parentElement) if (el.tagName === 'DETAILS') el.open = true;
    pendingReveal = true;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('flash');
    setTimeout(() => {
      target.classList.remove('flash');
      pendingReveal = null;
    }, 1700);
  }

  search.addEventListener('input', runSearch);
  root.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'expand-all') for (const d of $$('details', treeEl)) d.open = true;
    else if (action === 'collapse-all') for (const d of $$('details', treeEl)) d.open = false;
    const hit = e.target.closest('#plan-results [data-num]');
    if (hit) reveal(hit.dataset.num);
  });
  root.addEventListener('keydown', (e) => {
    const hit = e.target.closest?.('#plan-results [data-num]');
    if (hit && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      reveal(hit.dataset.num);
    }
  });
}

// =====================================================================================
// 4) OUTILS : calculateur de TVA + vérificateur d'équilibre
// =====================================================================================
const RATES = [20, 10, 5.5, 2.1];

function initTools() {
  built.outils = true;
  const root = panels.outils;
  root.innerHTML = `
    <div class="page-title"><h2>🧰 Outils</h2><span class="muted">Deux petits utilitaires pour vos calculs.</span></div>
    <div class="tools-grid">
      <section class="card tool" id="tool-tva" aria-labelledby="tva-title">
        <h3 id="tva-title">🧮 Calculateur de TVA</h3>
        <label class="lbl-field" for="tva-amount">Montant</label>
        <input id="tva-amount" class="field" type="text" inputmode="decimal" placeholder="ex. 1 200" autocomplete="off" />
        <fieldset class="seg">
          <legend>Le montant saisi est…</legend>
          <div class="seg-options">
            <label><input type="radio" name="tva-mode" value="ht" checked /><span>HT → TTC</span></label>
            <label><input type="radio" name="tva-mode" value="ttc" /><span>TTC → HT</span></label>
          </div>
        </fieldset>
        <fieldset class="seg">
          <legend>Taux de TVA</legend>
          <div class="seg-options">
            ${RATES.map((r, i) => `<label><input type="radio" name="tva-rate" value="${r}" ${i === 0 ? 'checked' : ''} /><span>${String(r).replace('.', ',')} %</span></label>`).join('')}
          </div>
        </fieldset>
        <div class="tiles" aria-live="polite">
          <div class="tile"><span>Montant HT</span><b id="out-ht">—</b></div>
          <div class="tile"><span>TVA</span><b id="out-tva">—</b></div>
          <div class="tile strong"><span>Montant TTC</span><b id="out-ttc">—</b></div>
        </div>
        <p class="formula muted" id="tva-formula">TVA = HT × taux · TTC = HT + TVA · HT = TTC ÷ (1 + taux)</p>
      </section>

      <section class="card tool" id="tool-bal" aria-labelledby="bal-title">
        <h3 id="bal-title">⚖️ Vérificateur d'équilibre</h3>
        <p class="muted">Saisissez les montants de votre écriture : le total des débits doit être égal au total des crédits.</p>
        <table class="bal-table">
          <thead><tr><th>Libellé (facultatif)</th><th class="r">Débit</th><th class="r">Crédit</th><th></th></tr></thead>
          <tbody id="bal-rows"></tbody>
        </table>
        <div class="tool-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-action="bal-add">+ Ajouter une ligne</button>
          <button class="btn btn-ghost btn-sm" type="button" data-action="bal-clear">Effacer</button>
        </div>
        <div class="bal-summary" aria-live="polite">
          <div class="tile"><span>Total débit</span><b id="bal-d">0,00 €</b></div>
          <div class="tile"><span>Total crédit</span><b id="bal-c">0,00 €</b></div>
          <div class="tile strong"><span>Écart</span><b id="bal-gap">0,00 €</b></div>
        </div>
        <div class="bal-verdict" id="bal-verdict">Saisissez des montants pour vérifier l'équilibre.</div>
      </section>
    </div>`;

  // ----- TVA
  const amountEl = $('#tva-amount', root);
  const compute = () => {
    const mode = $('input[name="tva-mode"]:checked', root).value;
    const rate = Number($('input[name="tva-rate"]:checked', root).value);
    const amount = parseAmount(amountEl.value);
    amountEl.classList.toggle('invalid', Number.isNaN(amount));
    const set = (ht, tva, ttc) => {
      $('#out-ht', root).textContent = ht;
      $('#out-tva', root).textContent = tva;
      $('#out-ttc', root).textContent = ttc;
    };
    const rateTxt = String(rate).replace('.', ',');
    if (amount == null || Number.isNaN(amount)) {
      set('—', '—', '—');
      $('#tva-formula', root).textContent = 'TVA = HT × taux · TTC = HT + TVA · HT = TTC ÷ (1 + taux)';
      return;
    }
    let ht;
    let ttc;
    if (mode === 'ht') {
      ht = round2(amount);
      ttc = round2(ht + round2((ht * rate) / 100));
    } else {
      ttc = round2(amount);
      ht = round2(ttc / (1 + rate / 100));
    }
    const tva = round2(ttc - ht);
    set(fmtEuro(ht), fmtEuro(tva), fmtEuro(ttc));
    $('#tva-formula', root).textContent =
      mode === 'ht'
        ? `TVA = ${fmtEuro(ht)} × ${rateTxt} % = ${fmtEuro(tva)} · TTC = ${fmtEuro(ht)} + ${fmtEuro(tva)} = ${fmtEuro(ttc)}`
        : `HT = ${fmtEuro(ttc)} ÷ ${(1 + rate / 100).toFixed(3).replace('.', ',')} = ${fmtEuro(ht)} · TVA = ${fmtEuro(ttc)} − ${fmtEuro(ht)} = ${fmtEuro(tva)}`;
  };
  $('#tool-tva', root).addEventListener('input', compute);
  $('#tool-tva', root).addEventListener('change', compute);

  // ----- équilibre
  const rowsEl = $('#bal-rows', root);
  const addBalRow = () => {
    rowsEl.insertAdjacentHTML(
      'beforeend',
      `<tr><td><input type="text" class="lab" placeholder="Compte ou libellé" aria-label="Libellé" autocomplete="off" /></td>
        <td><input type="text" class="amt d" inputmode="decimal" placeholder="0,00" aria-label="Débit" autocomplete="off" /></td>
        <td><input type="text" class="amt c" inputmode="decimal" placeholder="0,00" aria-label="Crédit" autocomplete="off" /></td>
        <td><button class="del" type="button" data-action="bal-del" aria-label="Supprimer la ligne">✕</button></td></tr>`,
    );
  };
  const updateBal = () => {
    let d = 0;
    let c = 0;
    let any = false;
    for (const input of $$('input.amt', rowsEl)) {
      const v = parseAmount(input.value);
      input.classList.toggle('invalid', Number.isNaN(v));
      if (typeof v === 'number' && !Number.isNaN(v)) {
        any = true;
        if (input.classList.contains('d')) d += Math.round(v * 100);
        else c += Math.round(v * 100);
      }
    }
    $('#bal-d', root).textContent = fmtEuro(d / 100);
    $('#bal-c', root).textContent = fmtEuro(c / 100);
    $('#bal-gap', root).textContent = fmtEuro(Math.abs(d - c) / 100);
    const verdict = $('#bal-verdict', root);
    verdict.className = 'bal-verdict';
    if (!any) verdict.textContent = "Saisissez des montants pour vérifier l'équilibre.";
    else if (d === c) {
      verdict.classList.add('ok');
      verdict.textContent = '✔ Équilibré : total débit = total crédit.';
    } else {
      verdict.classList.add('gap');
      verdict.textContent = d > c ? `⚠ Écart de ${fmtEuro((d - c) / 100)} : il manque ${fmtEuro((d - c) / 100)} au crédit.` : `⚠ Écart de ${fmtEuro((c - d) / 100)} : il manque ${fmtEuro((c - d) / 100)} au débit.`;
    }
  };
  for (let i = 0; i < 4; i++) addBalRow();
  $('#tool-bal', root).addEventListener('input', updateBal);
  $('#tool-bal', root).addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'bal-add') addBalRow();
    else if (action === 'bal-clear') {
      rowsEl.innerHTML = '';
      for (let i = 0; i < 4; i++) addBalRow();
      updateBal();
    } else if (action === 'bal-del') {
      const tr = e.target.closest('tr');
      if (rowsEl.children.length > 1) tr.remove();
      else for (const input of $$('input', tr)) input.value = '';
      updateBal();
    }
  });
  compute();
}

// =====================================================================================
// 5) AIDE-MÉMOIRE
// =====================================================================================
function initMemo() {
  built.memo = true;
  const schemaHtml = (s) => {
    if (s.entries) {
      return `<article class="entry-card"><header><strong>${esc(s.title)}</strong>${s.note ? `<span>${esc(s.note)}</span>` : ''}</header>
        ${s.entries.map((en) => `<div class="entry-sub">${esc(en.label)}</div>${entryTable(en.lines)}`).join('')}</article>`;
    }
    return entryCard(s);
  };
  panels.memo.innerHTML = `
    <div class="page-title"><h2>📌 Aide-mémoire</h2><span class="muted">La règle du débit / crédit et les schémas d'écritures types.</span></div>

    <section class="memo-section">
      <h3>Règle du débit et du crédit selon la nature du compte</h3>
      <div class="rules-table"><div class="table-wrap"><table>
        <thead><tr><th>Nature</th><th>Ce que c'est</th><th>Débit</th><th>Crédit</th><th>Solde normal</th><th>Exemples</th></tr></thead>
        <tbody>
          ${MEMO.rules
            .map(
              (r) => `<tr><td class="nature">${esc(r.nature)}</td><td>${esc(r.what)}</td>
                <td class="${r.d === 'Augmente' ? 'inc' : 'dec'}">${esc(r.d)}</td><td class="${r.c === 'Augmente' ? 'inc' : 'dec'}">${esc(r.c)}</td>
                <td>${esc(r.solde)}</td><td><code>${esc(r.ex)}</code></td></tr>`,
            )
            .join('')}
        </tbody>
      </table></div></div>
      <div class="tips">${MEMO.tips.map((t) => `<div class="card">💡 ${t}</div>`).join('')}</div>
    </section>

    <section class="memo-section">
      <h3>Réductions commerciales ou financières ?</h3>
      <div class="rules-table"><div class="table-wrap"><table class="compare-table">
        <thead><tr>${MEMO.compare.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${MEMO.compare.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div></div>
    </section>

    <section class="memo-section">
      <h3>Schémas d'écritures types</h3>
      <div class="schemas">${MEMO.schemas.map(schemaHtml).join('')}</div>
    </section>`;
}

// =====================================================================================
// Démarrage
// =====================================================================================
function init() {
  initTheme();
  $('#accounts-list').innerHTML = ACCOUNTS.map((a) => `<option value="${a.num}" label="${esc(a.label)}"></option>`).join('');
  window.addEventListener('hashchange', render);
  render();
}

init();
