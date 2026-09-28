// Correction automatique d'une écriture : logique pure (sans DOM), testable sous Node.
import { sameAccount } from './data/accounts.js';
import { toCents } from './util.js';

/** Tolérance d'arrondi : 1 centime. */
export const TOLERANCE_CENTS = 1;

/**
 * Normalise une ligne saisie par l'élève.
 * @param {{acc:string, d:number|null, c:number|null}} row  d / c : nombre, null (vide) ou NaN (illisible)
 * @returns {{empty:boolean, acc:string, side:'D'|'C'|null, cents:number, problem:string|null}}
 */
export function normalizeRow(row) {
  const acc = String(row.acc ?? '').trim();
  const d = row.d;
  const c = row.c;
  const hasD = d !== null && d !== undefined;
  const hasC = c !== null && c !== undefined;
  if (acc === '' && !hasD && !hasC) return { empty: true, acc, side: null, cents: 0, problem: null };
  if ((hasD && Number.isNaN(d)) || (hasC && Number.isNaN(c))) {
    return { empty: false, acc, side: null, cents: 0, problem: 'Montant illisible : utilisez des chiffres (ex. 1 250,50).' };
  }
  const dPos = hasD && d > 0;
  const cPos = hasC && c > 0;
  if (dPos && cPos) {
    return { empty: false, acc, side: null, cents: 0, problem: 'Une ligne ne peut pas avoir à la fois un débit et un crédit.' };
  }
  if (!dPos && !cPos) {
    return { empty: false, acc, side: null, cents: 0, problem: 'Ligne incomplète : indiquez un montant au débit ou au crédit.' };
  }
  if (acc === '') {
    return { empty: false, acc, side: dPos ? 'D' : 'C', cents: toCents(dPos ? d : c), problem: 'Indiquez le numéro de compte.' };
  }
  return { empty: false, acc, side: dPos ? 'D' : 'C', cents: toCents(dPos ? d : c), problem: null };
}

/**
 * Compare les lignes saisies au corrigé d'UNE écriture.
 * Comparaison indépendante de l'ordre ; comptes équivalents acceptés ; tolérance d'arrondi.
 *
 * @param {{acc:string, side:'D'|'C', amount:number, alt?:string[]}[]} expected
 * @param {{acc:string, d:number|null, c:number|null}[]} rows
 * @returns {{
 *   rows: {index:number, state:'ok'|'bad', reason:string}[],   // une entrée par ligne NON vide saisie
 *   missing: number,       // lignes attendues non trouvées
 *   okCount: number,
 *   badCount: number,
 *   correct: boolean,
 *   empty: boolean
 * }}
 */
export function gradePart(expected, rows) {
  const exp = expected.map((e) => ({ ...e, cents: toCents(e.amount), used: false }));
  const got = rows
    .map((row, index) => ({ index, ...normalizeRow(row) }))
    .filter((r) => !r.empty);

  const results = new Map();
  const near = (a, b) => Math.abs(a - b) <= TOLERANCE_CENTS;

  // 1re passe : correspondances exactes (compte + sens + montant).
  for (const g of got) {
    if (g.problem) continue;
    const hit = exp.find((e) => !e.used && e.side === g.side && sameAccount(g.acc, e.acc, e.alt) && near(e.cents, g.cents));
    if (hit) {
      hit.used = true;
      results.set(g.index, { index: g.index, state: 'ok', reason: 'Ligne juste.' });
    }
  }

  // 2e passe : diagnostic des lignes restantes.
  for (const g of got) {
    if (results.has(g.index)) continue;
    let reason;
    if (g.problem) {
      reason = g.problem;
    } else {
      const sameAcc = exp.filter((e) => sameAccount(g.acc, e.acc, e.alt));
      const free = sameAcc.filter((e) => !e.used);
      if (free.some((e) => e.side === g.side)) {
        reason = 'Bon compte et bon sens, mais le montant est incorrect.';
      } else if (free.some((e) => e.side !== g.side)) {
        reason = 'Bon compte, mais le sens est inversé (débit ↔ crédit).';
      } else if (sameAcc.length > 0) {
        reason = 'Ce compte est déjà utilisé : ligne en trop ou en double.';
      } else {
        reason = "Ce compte n'est pas attendu dans cette écriture.";
      }
    }
    results.set(g.index, { index: g.index, state: 'bad', reason });
  }

  const list = [...results.values()].sort((a, b) => a.index - b.index);
  const okCount = list.filter((r) => r.state === 'ok').length;
  const badCount = list.length - okCount;
  const missing = exp.filter((e) => !e.used).length;
  return {
    rows: list,
    missing,
    okCount,
    badCount,
    correct: got.length > 0 && badCount === 0 && missing === 0,
    empty: got.length === 0,
  };
}

/** Totaux d'un ensemble de lignes saisies (les valeurs illisibles sont ignorées). */
export function totals(rows) {
  let d = 0;
  let c = 0;
  for (const r of rows) {
    if (typeof r.d === 'number' && !Number.isNaN(r.d)) d += toCents(r.d);
    if (typeof r.c === 'number' && !Number.isNaN(r.c)) c += toCents(r.c);
  }
  return { debit: d / 100, credit: c / 100, gap: (d - c) / 100, balanced: d === c && d > 0, empty: d === 0 && c === 0 };
}
