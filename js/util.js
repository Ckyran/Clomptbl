// Utilitaires partagés (formatage, saisie, aléatoire, constructeurs de lignes d'écriture)

const EUR = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const NUM = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Arrondi au centime. */
export const round2 = (x) => Math.round((x + Number.EPSILON) * 100) / 100;
/** Euros -> centimes entiers (évite les dérives de virgule flottante). */
export const toCents = (x) => Math.round(x * 100 + (x < 0 ? -1e-9 : 1e-9));
/** Centimes -> euros. */
export const fromCents = (c) => c / 100;

/** 1234.5 -> « 1 234,50 € » */
export const fmtEuro = (x) => EUR.format(x);
/** 1234.5 -> « 1 234,50 » */
export const fmtNum = (x) => NUM.format(x);
/** Montant « court » pour les énoncés : 2500 -> « 2 500 € », 2500.5 -> « 2 500,50 € ». */
export const eu = (x) => (Number.isInteger(round2(x)) ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(x) : EUR.format(x));
/** Pourcentage : 5.5 -> « 5,5 % » */
export const pct = (x) => `${String(x).replace('.', ',')} %`;

/**
 * Lit un montant saisi (« 1 234,56 », « 1234.5 », « 12 € »).
 * @returns {number|null} null si vide, NaN si invalide.
 */
export function parseAmount(raw) {
  if (raw == null) return null;
  const s = String(raw).replace(/[\s  €]/g, '').replace(',', '.');
  if (s === '') return null;
  if (!/^\d*\.?\d*$/.test(s) || s === '.') return NaN;
  return Number(s);
}

/** Minuscules sans accents (recherches). */
export const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Échappement HTML. */
export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Ligne de corrigé au débit / au crédit. `alt` = comptes équivalents acceptés en plus. */
export const D = (acc, amount, alt = []) => ({ acc: String(acc), side: 'D', amount, alt });
export const C = (acc, amount, alt = []) => ({ acc: String(acc), side: 'C', amount, alt });

// ---------------------------------------------------------------- aléatoire
/** Générateur pseudo-aléatoire déterministe (mulberry32) pour les tests. */
export function makeRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Boîte à outils aléatoire construite sur un rng() quelconque. */
export function randomKit(rng = Math.random) {
  const int = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
  return {
    rng,
    int,
    /** Multiple de `step` entre min et max (inclus). */
    step: (min, max, step) => int(Math.ceil(min / step), Math.floor(max / step)) * step,
    pick: (arr) => arr[int(0, arr.length - 1)],
    chance: (p) => rng() < p,
  };
}
