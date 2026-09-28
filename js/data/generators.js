// Générateurs d'exercices aléatoires (« exercices infinis »).
// Chaque niveau possède plusieurs modèles paramétrés (montants, taux, comptes, scénarios aléatoires).
// Tous les calculs se font en CENTIMES entiers : les corrigés sont donc équilibrés par construction,
// et generateExercise() revalide chaque exercice (équilibre, comptes du plan, montants positifs).

import { D, C, eu, pct, randomKit } from '../util.js';
import { accountExists } from './accounts.js';

// ------------------------------------------------------------------ jeux de données
const FOURNISSEURS = ['Vergers Duval', 'Cave des Coteaux', 'Grossiste Lemoine', 'Papeteries Morel', 'Établissements Garnier', 'Distribution Bertrand', 'Maison Rousseau', 'Fontaine & Fils', 'Comptoir Lambert', 'Sud-Négoce'];
const CLIENTS = ['Restaurant Le Bistrot', 'Hôtel de la Gare', 'Boutique Zoé', 'Épicerie Lambert', 'Camping Les Pins', 'Martin Événements', 'Librairie du Port', 'Pharmacie Delmas', 'Café des Arts', 'Garage Perrin'];
const MARCHANDISES = ['articles de sport', 'mobilier de jardin', "produits d'entretien", 'petit électroménager', 'articles de papeterie', 'vêtements de travail', "produits d'épicerie fine", 'outillage à main'];
const MATIERES = ['bois de chêne', 'farine et sucre', 'tissu', "tôle d'acier", 'cuir', 'peinture professionnelle'];
const PRODUITS_FINIS = ['des meubles de cuisine', 'des chaises artisanales', 'des sacs en cuir', 'des lots de confitures'];
const PRESTATIONS = ['travaux de réparation', 'une mission de conseil', 'des prestations de maintenance', 'une formation du personnel'];
const SALARIES = ['Mme Petit', 'M. Garcia', 'Mme Leroy', 'M. Moreau', 'Mme Roux', 'M. Fournier'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const TAUX_TVA = [20, 20, 20, 20, 10, 10, 5.5];

const ASSETS = [
  { acc: '2183', amort: '28183', name: 'du matériel informatique', of: 'du matériel informatique' },
  { acc: '2184', amort: '28184', name: 'du mobilier de bureau', of: 'du mobilier de bureau' },
  { acc: '2154', amort: '28154', name: 'une machine de production', of: 'de la machine de production' },
  { acc: '2182', amort: '28182', name: 'une camionnette de livraison', of: 'de la camionnette de livraison' },
];

// ------------------------------------------------------------------ petites aides (centimes)
const m = (cents) => eu(cents / 100); // 250000 -> « 2 500 € »
const e = (cents) => cents / 100; // centimes -> euros (pour les lignes du corrigé)
const vat = (baseCents, rate) => Math.round((baseCents * rate) / 100);
const dateFr = (r) => `${r.int(1, 28)} ${r.pick(MOIS)}`;
const list = (items) => items.join(' ; ');
/** « du mois d'avril », « du mois de mars » */
const duMois = (mois) => `du mois ${/^[aeiouéèô]/i.test(mois) ? "d'" : 'de '}${mois}`;

/** Facture : HT, taux, TVA, TTC (centimes). */
function invoice(r, { min = 200, max = 9000, step = 10, rates = TAUX_TVA } = {}) {
  const ht = r.step(min, max, step) * 100;
  const rate = r.pick(rates);
  const tva = vat(ht, rate);
  return { ht, rate, tva, ttc: ht + tva };
}

const ex = (title, statement, hint, parts, explanation) => ({ title, statement, hint, parts, explanation });

// ============================================================ NIVEAU 1 — LES BASES
const N1 = [
  {
    key: 'apport',
    make(r) {
      const kind = r.pick(['banque', 'banque', 'caisse', 'nature', 'mixte']);
      const nom = r.pick(['« Le Comptoir Vert »', '« Atelier Lumière »', '« Sport Loisirs 77 »', '« Maison Bertin »']);
      const date = dateFr(r);
      if (kind === 'banque') {
        const cap = r.step(5000, 90000, 500) * 100;
        return ex(
          'Apport en capital',
          `Le ${date}, les associés de la SARL ${nom} apportent <strong>${m(cap)}</strong> en numéraire. Les fonds sont déposés sur le compte bancaire de la société.<br>Enregistrez l'apport en capital.`,
          "La banque augmente (actif → débit). L'argent vient des associés : capital social (101).",
          [{ lines: [D('512', e(cap)), C('101', e(cap))] }],
          `<p>Banque (512) en <strong>débit</strong> : l'actif augmente. Capital (101) en <strong>crédit</strong> : c'est la ressource apportée par les associés (capitaux propres).</p>`,
        );
      }
      if (kind === 'caisse') {
        const cap = r.step(200, 3000, 100) * 100;
        return ex(
          'Apport en espèces',
          `Le ${date}, un associé de la SARL ${nom} apporte <strong>${m(cap)}</strong> en espèces, conservés dans la caisse de l'entreprise.<br>Enregistrez l'apport.`,
          'Les espèces sont dans la caisse (compte 530). Contrepartie : le capital (101).',
          [{ lines: [D('530', e(cap), ['53', '531']), C('101', e(cap))] }],
          `<p>Caisse (530) en <strong>débit</strong> ; capital (101) en <strong>crédit</strong>.</p>`,
        );
      }
      if (kind === 'nature') {
        const a = r.pick(ASSETS);
        const val = r.step(1000, 30000, 500) * 100;
        return ex(
          'Apport en nature',
          `Le ${date}, un associé de la SARL ${nom} apporte <strong>${a.name}</strong> évalué à <strong>${m(val)}</strong> en contrepartie de parts sociales.<br>Enregistrez l'apport en nature.`,
          "Un bien durable apporté à l'entreprise est une immobilisation (classe 2). Contrepartie : le capital (101).",
          [{ lines: [D(a.acc, e(val)), C('101', e(val))] }],
          `<p>Le bien entre dans l'entreprise : immobilisation <strong>${a.acc}</strong> en <strong>débit</strong>. Il n'y a pas d'argent en jeu, mais le capital (101) augmente autant : <strong>crédit</strong>.</p>`,
        );
      }
      const banque = r.step(5000, 50000, 500) * 100;
      const val = r.step(1000, 15000, 500) * 100;
      return ex(
        'Apport mixte (numéraire et nature)',
        `Le ${date}, les associés de la SARL ${nom} apportent <strong>${m(banque)}</strong> en numéraire (déposés en banque) et du <strong>matériel informatique</strong> évalué à <strong>${m(val)}</strong>.<br>Enregistrez l'apport (capital total : ${m(banque + val)}).`,
        'Deux actifs entrent : la banque et du matériel informatique (2183). Une seule ressource : le capital (101).',
        [{ lines: [D('512', e(banque)), D('2183', e(val)), C('101', e(banque + val))] }],
        `<p>Deux emplois (512 et 2183) au débit pour un total de ${m(banque + val)} ; une seule ressource (101) au crédit pour le même montant.</p>`,
      );
    },
  },
  {
    key: 'achat-credit',
    make(r) {
      const inv = invoice(r);
      const kind = r.pick(['607', '607', '6011', '6064']);
      const f = r.pick(FOURNISSEURS);
      const date = dateFr(r);
      const conf = {
        607: [`des marchandises (${r.pick(MARCHANDISES)}) destinées à la revente`, '607', 'Achats de marchandises'],
        6011: [`des matières premières (${r.pick(MATIERES)})`, '6011', 'Achats de matières premières'],
        6064: ['des fournitures administratives (papier, cartouches...)', '6064', 'Fournitures administratives'],
      }[kind];
      return ex(
        'Achat à crédit avec TVA',
        `Le ${date}, vous recevez de « ${f} » une facture pour ${conf[0]} : <strong>${m(inv.ht)} HT</strong>, TVA ${pct(inv.rate)}. Paiement à 30 jours.<br>Enregistrez la facture d'achat.`,
        `TVA = HT × ${pct(inv.rate)}. Trois comptes : la charge (${conf[1]}), la TVA déductible sur ABS (44566) et le fournisseur (TTC).`,
        [{ lines: [D(conf[1], e(inv.ht)), D('44566', e(inv.tva)), C('401', e(inv.ttc))] }],
        `<p>TVA = ${m(inv.ht)} × ${pct(inv.rate)} = ${m(inv.tva)} ; TTC = ${m(inv.ttc)}.</p><ul><li><strong>${conf[1]}</strong> ${conf[2]} → débit HT.</li><li><strong>44566</strong> TVA déductible → débit.</li><li><strong>401</strong> Fournisseurs → crédit TTC.</li></ul>`,
      );
    },
  },
  {
    key: 'vente-credit',
    make(r) {
      const inv = invoice(r);
      const kind = r.pick(['707', '707', '701', '706']);
      const c = r.pick(CLIENTS);
      const date = dateFr(r);
      const conf = {
        707: [`des marchandises (${r.pick(MARCHANDISES)})`, '707', 'Ventes de marchandises'],
        701: [`des produits finis (${r.pick(PRODUITS_FINIS)})`, '701', 'Ventes de produits finis'],
        706: [r.pick(PRESTATIONS), '706', 'Prestations de services'],
      }[kind];
      return ex(
        'Vente à crédit avec TVA',
        `Le ${date}, vous facturez à « ${c} » ${conf[0]} pour <strong>${m(inv.ht)} HT</strong>, TVA ${pct(inv.rate)}. Paiement à 30 jours.<br>Enregistrez la facture de vente.`,
        `Le client doit le TTC (411). Le produit est en HT (${conf[1]}). La TVA est due à l'État : 44571.`,
        [{ lines: [D('411', e(inv.ttc)), C(conf[1], e(inv.ht)), C('44571', e(inv.tva))] }],
        `<p>TVA = ${m(inv.ht)} × ${pct(inv.rate)} = ${m(inv.tva)} ; TTC = ${m(inv.ttc)}.</p><ul><li><strong>411</strong> Clients → débit TTC.</li><li><strong>${conf[1]}</strong> ${conf[2]} → crédit HT.</li><li><strong>44571</strong> TVA collectée → crédit.</li></ul>`,
      );
    },
  },
  {
    key: 'reglement-fournisseur',
    make(r) {
      const f = r.pick(FOURNISSEURS);
      const espèces = r.chance(0.2);
      const amt = espèces ? r.step(100, 1000, 10) * 100 : r.step(300, 15000, 10) * 100;
      const mode = espèces ? 'en espèces (prélevées dans la caisse)' : r.pick(['par virement bancaire', 'par chèque', 'par prélèvement bancaire']);
      const cpt = espèces ? '530' : '512';
      return ex(
        'Règlement d’un fournisseur',
        `Le ${dateFr(r)}, vous réglez ${mode} la facture de « ${f} » d'un montant de <strong>${m(amt)} TTC</strong>.<br>Enregistrez le règlement.`,
        `La dette (401) diminue → débit. ${espèces ? 'La caisse' : 'La banque'} diminue → crédit.`,
        [{ lines: [D('401', e(amt)), C(cpt, e(amt), espèces ? ['53', '531'] : [])] }],
        `<p><strong>401</strong> Fournisseurs au <strong>débit</strong> : la dette est éteinte. <strong>${cpt}</strong> ${espèces ? 'Caisse' : 'Banque'} au <strong>crédit</strong> : la trésorerie diminue. Pas de TVA : elle a été comptabilisée à la facture.</p>`,
      );
    },
  },
  {
    key: 'encaissement-client',
    make(r) {
      const c = r.pick(CLIENTS);
      const espèces = r.chance(0.2);
      const amt = espèces ? r.step(100, 1000, 10) * 100 : r.step(300, 15000, 10) * 100;
      const mode = espèces ? 'en espèces (versées dans la caisse)' : r.pick(['par virement', 'par chèque remis immédiatement en banque', 'par carte bancaire']);
      const cpt = espèces ? '530' : '512';
      return ex(
        'Encaissement d’un client',
        `Le ${dateFr(r)}, le client « ${c} » règle ${mode} sa facture de <strong>${m(amt)} TTC</strong>.<br>Enregistrez l'encaissement.`,
        `${espèces ? 'La caisse' : 'La banque'} augmente → débit. La créance client (411) disparaît → crédit.`,
        [{ lines: [D(cpt, e(amt), espèces ? ['53', '531'] : []), C('411', e(amt))] }],
        `<p><strong>${cpt}</strong> ${espèces ? 'Caisse' : 'Banque'} au <strong>débit</strong> (l'argent arrive) ; <strong>411</strong> Clients au <strong>crédit</strong> (la créance est soldée).</p>`,
      );
    },
  },
  {
    key: 'caisse',
    make(r) {
      const amt = r.step(100, 2000, 50) * 100;
      if (r.chance(0.5)) {
        return ex(
          'Alimentation de la caisse',
          `Le ${dateFr(r)}, vous retirez <strong>${m(amt)}</strong> en espèces à la banque pour alimenter la caisse.<br>Enregistrez l'opération.`,
          'Deux comptes de trésorerie : la caisse (530) augmente, la banque (512) diminue.',
          [{ lines: [D('530', e(amt), ['53', '531']), C('512', e(amt))] }],
          `<p>Caisse (530) au <strong>débit</strong>, banque (512) au <strong>crédit</strong> : seule la « localisation » de l'argent change.</p>`,
        );
      }
      return ex(
        'Versement d’espèces en banque',
        `Le ${dateFr(r)}, vous déposez <strong>${m(amt)}</strong> en espèces de la caisse sur le compte bancaire de l'entreprise.<br>Enregistrez l'opération.`,
        'La banque (512) augmente, la caisse (530) diminue.',
        [{ lines: [D('512', e(amt)), C('530', e(amt), ['53', '531'])] }],
        `<p>Banque (512) au <strong>débit</strong>, caisse (530) au <strong>crédit</strong>.</p>`,
      );
    },
  },
  {
    key: 'achat-comptant',
    make(r) {
      const inv = invoice(r, { max: 1500 });
      const espèces = r.chance(0.25);
      const cpt = espèces ? '530' : '512';
      const mode = espèces ? 'en espèces' : r.pick(['par chèque', 'par carte bancaire']);
      return ex(
        'Achat payé comptant',
        `Le ${dateFr(r)}, vous achetez des marchandises (${r.pick(MARCHANDISES)}) pour <strong>${m(inv.ht)} HT</strong>, TVA ${pct(inv.rate)}, et vous les payez immédiatement ${mode}.<br>Enregistrez l'achat.`,
        `Comme à crédit, mais la contrepartie n'est plus le fournisseur : c'est ${espèces ? 'la caisse' : 'la banque'}, qui diminue.`,
        [{ lines: [D('607', e(inv.ht)), D('44566', e(inv.tva)), C(cpt, e(inv.ttc), espèces ? ['53', '531'] : [])] }],
        `<p>TVA = ${m(inv.tva)} ; TTC = ${m(inv.ttc)}. Le paiement est immédiat : <strong>${cpt}</strong> au crédit pour le TTC, sans passer par le compte fournisseur.</p>`,
      );
    },
  },
  {
    key: 'vente-comptant',
    make(r) {
      const inv = invoice(r, { max: 2500 });
      const espèces = r.chance(0.4) && inv.ttc <= 100000;
      const cpt = espèces ? '530' : '512';
      const mode = espèces ? 'en espèces' : 'par carte bancaire';
      return ex(
        'Vente au comptant',
        `Le ${dateFr(r)}, vous vendez des marchandises (${r.pick(MARCHANDISES)}) pour <strong>${m(inv.ht)} HT</strong>, TVA ${pct(inv.rate)}, encaissées immédiatement ${mode}.<br>Enregistrez la vente.`,
        `Le client paie tout de suite : l'argent entre en ${espèces ? 'caisse (530)' : 'banque (512)'}, pas dans un compte client.`,
        [{ lines: [D(cpt, e(inv.ttc), espèces ? ['53', '531'] : []), C('707', e(inv.ht)), C('44571', e(inv.tva))] }],
        `<p>TVA = ${m(inv.tva)} ; TTC encaissé = ${m(inv.ttc)}. <strong>${cpt}</strong> au débit, <strong>707</strong> (HT) et <strong>44571</strong> (TVA) au crédit.</p>`,
      );
    },
  },
];

// ============================================================ NIVEAU 2 — TVA & OPÉRATIONS COURANTES
const N2 = [
  {
    key: 'remise',
    make(r) {
      const brut = r.step(1000, 20000, 100) * 100;
      const rem = r.pick([5, 10, 15, 20]);
      const remise = Math.round((brut * rem) / 100);
      const net = brut - remise;
      const rate = r.pick([20, 20, 20, 10]);
      const tva = vat(net, rate);
      const ttc = net + tva;
      const achat = r.chance(0.5);
      const tiers = achat ? r.pick(FOURNISSEURS) : r.pick(CLIENTS);
      const expl = `<p>Remise : ${m(brut)} × ${rem} % = ${m(remise)} → <strong>net commercial ${m(net)}</strong>. TVA = ${m(net)} × ${pct(rate)} = ${m(tva)} ; TTC = ${m(ttc)}.</p><p>Une remise figurant sur la facture n'est <strong>jamais comptabilisée</strong> : on enregistre le net commercial.</p>`;
      if (achat) {
        return ex(
          'Facture d’achat avec remise',
          `Le ${dateFr(r)}, « ${tiers} » vous adresse une facture de marchandises : prix brut <strong>${m(brut)} HT</strong>, <strong>remise de ${rem} %</strong> figurant sur la facture, TVA ${pct(rate)}, paiement à 30 jours.<br>Enregistrez la facture.`,
          "Enregistrez le net commercial (brut − remise). La TVA se calcule sur le net commercial.",
          [{ lines: [D('607', e(net)), D('44566', e(tva)), C('401', e(ttc))] }],
          expl,
        );
      }
      return ex(
        'Facture de vente avec remise',
        `Le ${dateFr(r)}, vous facturez à « ${tiers} » des marchandises : prix brut <strong>${m(brut)} HT</strong>, <strong>remise de ${rem} %</strong> accordée sur la facture, TVA ${pct(rate)}, paiement à 30 jours.<br>Enregistrez la facture de vente.`,
        "Enregistrez le net commercial (brut − remise). La TVA se calcule sur le net commercial.",
        [{ lines: [D('411', e(ttc)), C('707', e(net)), C('44571', e(tva))] }],
        expl,
      );
    },
  },
  {
    key: 'escompte',
    make(r) {
      const variant = r.pick(['encaissement', 'reglement', 'facture']);
      const ht = r.step(1000, 15000, 100) * 100;
      const rate = r.pick([20, 20, 10]);
      const esc = r.pick([1, 2, 3]);
      const escHt = Math.round((ht * esc) / 100);
      const escTva = vat(escHt, rate);
      const tva = vat(ht, rate);
      const ttc = ht + tva;
      const paye = ttc - escHt - escTva;
      if (variant === 'encaissement') {
        const c = r.pick(CLIENTS);
        return ex(
          'Encaissement avec escompte accordé',
          `Le ${dateFr(r)}, « ${c} » règle par virement sa facture (<strong>${m(ht)} HT</strong> + TVA ${pct(rate)} = ${m(ttc)} TTC) avant l'échéance. Il bénéficie d'un <strong>escompte de règlement de ${esc} % du HT</strong>, TVA régularisée sur l'escompte. Virement reçu : <strong>${m(paye)}</strong>.<br>Enregistrez l'encaissement.`,
          "Escompte accordé = charge financière (665) HT ; la TVA collectée diminue d'autant (44571 au débit). Le compte client est soldé pour le TTC initial.",
          [{ lines: [D('512', e(paye)), D('665', e(escHt)), D('44571', e(escTva)), C('411', e(ttc))] }],
          `<p>Escompte HT : ${m(ht)} × ${esc} % = ${m(escHt)} ; TVA régularisée : ${m(escTva)}. Encaissé : ${m(ttc)} − ${m(escHt + escTva)} = ${m(paye)}.</p><p><strong>665</strong> Escomptes accordés (charge financière) et <strong>44571</strong> au débit, <strong>512</strong> pour l'encaissement réel, <strong>411</strong> soldé au crédit pour ${m(ttc)}.</p>`,
        );
      }
      if (variant === 'reglement') {
        const f = r.pick(FOURNISSEURS);
        return ex(
          'Règlement avec escompte obtenu',
          `Le ${dateFr(r)}, vous réglez par virement la facture de « ${f} » (<strong>${m(ht)} HT</strong> + TVA ${pct(rate)} = ${m(ttc)} TTC) avant l'échéance et obtenez un <strong>escompte de ${esc} % du HT</strong>, TVA régularisée sur l'escompte. Virement émis : <strong>${m(paye)}</strong>.<br>Enregistrez le règlement.`,
          "Escompte obtenu = produit financier (765) HT ; la TVA déductible diminue d'autant (44566 au crédit). Le fournisseur est soldé pour le TTC initial.",
          [{ lines: [D('401', e(ttc)), C('512', e(paye)), C('765', e(escHt)), C('44566', e(escTva))] }],
          `<p>Escompte HT : ${m(escHt)} ; TVA régularisée : ${m(escTva)}. Décaissé : ${m(ttc)} − ${m(escHt + escTva)} = ${m(paye)}.</p><p><strong>401</strong> soldé au débit pour ${m(ttc)} ; <strong>512</strong> au crédit pour le décaissement réel ; <strong>765</strong> Escomptes obtenus (produit financier) et <strong>44566</strong> au crédit.</p>`,
        );
      }
      // facture d'achat mentionnant l'escompte : net commercial, escompte, net financier, TVA sur le net financier
      const f = r.pick(FOURNISSEURS);
      const netFin = ht - escHt;
      const tvaF = vat(netFin, rate);
      const ttcF = netFin + tvaF;
      return ex(
        'Facture d’achat avec escompte',
        `Le ${dateFr(r)}, « ${f} » vous facture des marchandises : net commercial <strong>${m(ht)}</strong>, <strong>escompte de ${esc} %</strong> mentionné sur la facture pour paiement rapide (dont vous bénéficiez), TVA ${pct(rate)} calculée sur le net financier.<br>Enregistrez la facture : total TTC à payer <strong>${m(ttcF)}</strong>.`,
        "L'achat s'enregistre au net commercial (607) ; l'escompte est un produit financier (765). La dette (401) est le TTC à payer.",
        [{ lines: [D('607', e(ht)), D('44566', e(tvaF)), C('401', e(ttcF)), C('765', e(escHt))] }],
        `<p>Net financier = ${m(ht)} − ${m(escHt)} = ${m(netFin)} ; TVA = ${m(netFin)} × ${pct(rate)} = ${m(tvaF)} ; TTC = ${m(ttcF)}.</p><p><strong>607</strong> au débit pour le net commercial, <strong>44566</strong> au débit, <strong>401</strong> au crédit pour le TTC réellement dû, <strong>765</strong> Escomptes obtenus au crédit.</p><p>${m(ht)} + ${m(tvaF)} = ${m(ttcF)} + ${m(escHt)} ✔</p>`,
      );
    },
  },
  {
    key: 'avoir',
    make(r) {
      const inv = invoice(r, { max: 5000, rates: [20, 20, 10] });
      const kind = r.pick(['retour-fournisseur', 'retour-client', 'rabais-obtenu', 'rabais-accorde']);
      const date = dateFr(r);
      if (kind === 'retour-fournisseur') {
        const f = r.pick(FOURNISSEURS);
        return ex(
          "Avoir reçu (retour de marchandises)",
          `Le ${date}, vous retournez à « ${f} » des marchandises défectueuses facturées <strong>${m(inv.ht)} HT</strong> (TVA ${pct(inv.rate)}). Le fournisseur vous adresse un avoir de <strong>${m(inv.ttc)} TTC</strong> (facture initiale non réglée).<br>Enregistrez l'avoir.`,
          "Un avoir est l'écriture d'achat « à l'envers » : la dette, la charge et la TVA déductible diminuent.",
          [{ lines: [D('401', e(inv.ttc)), C('607', e(inv.ht)), C('44566', e(inv.tva))] }],
          `<p>Écriture inverse de l'achat : <strong>401</strong> au débit (dette diminuée de ${m(inv.ttc)}), <strong>607</strong> au crédit (${m(inv.ht)}), <strong>44566</strong> au crédit (${m(inv.tva)}).</p>`,
        );
      }
      if (kind === 'retour-client') {
        const c = r.pick(CLIENTS);
        return ex(
          "Avoir émis (retour de marchandises)",
          `Le ${date}, « ${c} » vous retourne des marchandises facturées <strong>${m(inv.ht)} HT</strong> (TVA ${pct(inv.rate)}). Vous établissez un avoir de <strong>${m(inv.ttc)} TTC</strong> (facture initiale non réglée).<br>Enregistrez l'avoir émis.`,
          "C'est l'écriture de vente « à l'envers » : la créance client, le produit et la TVA collectée diminuent.",
          [{ lines: [D('707', e(inv.ht)), D('44571', e(inv.tva)), C('411', e(inv.ttc))] }],
          `<p>Écriture inverse de la vente : <strong>707</strong> au débit (${m(inv.ht)}), <strong>44571</strong> au débit (${m(inv.tva)}), <strong>411</strong> au crédit (${m(inv.ttc)}).</p>`,
        );
      }
      if (kind === 'rabais-obtenu') {
        const f = r.pick(FOURNISSEURS);
        return ex(
          'Ristourne obtenue (avoir sur achats)',
          `Le ${date}, « ${f} » vous accorde, après facturation, une <strong>ristourne de fin d'année</strong> de <strong>${m(inv.ht)} HT</strong> (TVA ${pct(inv.rate)}) et vous adresse un avoir de <strong>${m(inv.ttc)} TTC</strong>.<br>Enregistrez l'avoir reçu.`,
          'Les rabais, remises et ristournes obtenus après coup s\'enregistrent dans un compte spécifique : 609.',
          [{ lines: [D('401', e(inv.ttc)), C('609', e(inv.ht)), C('44566', e(inv.tva))] }],
          `<p>La ristourne réduit le coût d'achat, mais l'achat initial est déjà comptabilisé : on crédite <strong>609</strong> Rabais, remises et ristournes obtenus. La TVA déductible est régularisée (<strong>44566</strong> au crédit) et la dette diminue (<strong>401</strong> au débit).</p>`,
        );
      }
      const c = r.pick(CLIENTS);
      return ex(
        'Rabais accordé (avoir sur ventes)',
        `Le ${date}, suite à un retard de livraison, vous accordez au client « ${c} » un <strong>rabais de ${m(inv.ht)} HT</strong> (TVA ${pct(inv.rate)}) sur une facture non encore réglée. Avoir émis : <strong>${m(inv.ttc)} TTC</strong>.<br>Enregistrez l'avoir émis.`,
        'Les rabais, remises et ristournes accordés après coup s\'enregistrent dans un compte spécifique : 709.',
        [{ lines: [D('709', e(inv.ht)), D('44571', e(inv.tva)), C('411', e(inv.ttc))] }],
        `<p><strong>709</strong> Rabais, remises et ristournes accordés (débit, ${m(inv.ht)}), <strong>44571</strong> TVA collectée régularisée (débit, ${m(inv.tva)}), <strong>411</strong> créance diminuée (crédit, ${m(inv.ttc)}).</p>`,
      );
    },
  },
  {
    key: 'port',
    make(r) {
      const rate = r.pick([20, 20, 20, 10]);
      const ht = r.step(500, 9000, 50) * 100;
      const port = r.step(30, 400, 10) * 100;
      const tva = vat(ht + port, rate);
      const ttc = ht + port + tva;
      if (r.chance(0.5)) {
        const c = r.pick(CLIENTS);
        return ex(
          'Vente avec port facturé',
          `Le ${dateFr(r)}, vente à « ${c} » de marchandises pour <strong>${m(ht)} HT</strong>. Vous facturez en plus <strong>${m(port)} HT de frais de port</strong> (port forfaitaire refacturé). TVA ${pct(rate)} sur l'ensemble, paiement à 30 jours.<br>Enregistrez la facture.`,
          'Le port refacturé est un produit annexe (7085). La TVA porte sur marchandises + port.',
          [{ lines: [D('411', e(ttc)), C('707', e(ht)), C('7085', e(port)), C('44571', e(tva))] }],
          `<p>Base de TVA : ${m(ht + port)} ; TVA = ${m(tva)} ; TTC = ${m(ttc)}.</p><ul><li><strong>707</strong> ${m(ht)} et <strong>7085</strong> ${m(port)} au crédit (produits) ;</li><li><strong>44571</strong> ${m(tva)} au crédit ;</li><li><strong>411</strong> ${m(ttc)} au débit.</li></ul>`,
        );
      }
      const f = r.pick(FOURNISSEURS);
      return ex(
        'Achat avec frais de transport',
        `Le ${dateFr(r)}, « ${f} » vous facture des marchandises pour <strong>${m(ht)} HT</strong> et le <strong>transport pour ${m(port)} HT</strong> (facture unique, TVA ${pct(rate)} sur l'ensemble). Paiement à 30 jours.<br>Enregistrez la facture (le transport est comptabilisé en charges externes).`,
        'Transports sur achats : compte 6241. La TVA est déductible sur la marchandise et sur le transport.',
        [{ lines: [D('607', e(ht)), D('6241', e(port)), D('44566', e(tva)), C('401', e(ttc))] }],
        `<p>Base de TVA : ${m(ht + port)} ; TVA = ${m(tva)} ; TTC = ${m(ttc)}.</p><ul><li><strong>607</strong> ${m(ht)} et <strong>6241</strong> Transports sur achats ${m(port)} au débit ;</li><li><strong>44566</strong> ${m(tva)} au débit ;</li><li><strong>401</strong> ${m(ttc)} au crédit.</li></ul>`,
      );
    },
  },
  {
    key: 'liquidation',
    make(r) {
      const coll = r.step(1500, 12000, 10) * 100;
      const aba = r.step(500, 9000, 10) * 100;
      const immo = r.chance(0.6) ? r.step(100, 2500, 10) * 100 : 0;
      const prev = r.chance(0.3) ? r.step(100, 1500, 10) * 100 : 0;
      const deductibles = aba + immo + prev;
      const solde = coll - deductibles;
      const mois = r.pick(MOIS);
      const items = [`TVA collectée : <strong>${m(coll)}</strong>`, `TVA déductible sur autres biens et services : <strong>${m(aba)}</strong>`];
      if (immo) items.push(`TVA déductible sur immobilisations : <strong>${m(immo)}</strong>`);
      items.push(prev ? `crédit de TVA du mois précédent à reporter : <strong>${m(prev)}</strong>` : 'aucun crédit de TVA antérieur');
      const lines = [D('44571', e(coll)), C('44566', e(aba))];
      if (immo) lines.push(C('44562', e(immo)));
      if (prev) lines.push(C('44567', e(prev)));
      let concl;
      if (solde > 0) {
        lines.push(C('44551', e(solde)));
        concl = `TVA à décaisser = ${m(coll)} − ${m(deductibles)} = <strong>${m(solde)}</strong> → compte <strong>44551</strong> au crédit.`;
      } else if (solde < 0) {
        lines.push(D('44567', e(-solde)));
        concl = `Les déductibles (${m(deductibles)}) dépassent la collectée (${m(coll)}) : <strong>crédit de TVA de ${m(-solde)}</strong> à reporter → compte <strong>44567</strong> au débit.`;
      } else {
        concl = 'La TVA collectée égale exactement la TVA déductible : rien à payer, rien à reporter.';
      }
      return ex(
        'Liquidation de la TVA',
        `À la fin ${duMois(mois)}, les comptes de TVA présentent : ${list(items)}.<br>Enregistrez la liquidation de la TVA du mois.`,
        'On solde les comptes de TVA : la collectée (crédit) au débit, les déductibles (débit) au crédit. Le solde va en TVA à décaisser (44551) ou en crédit de TVA à reporter (44567).',
        [{ lines }],
        `<p>${concl}</p><p>Total débit = total crédit = ${m(Math.max(coll, deductibles))} ✔</p>`,
      );
    },
  },
  {
    key: 'tva-paiement',
    make(r) {
      const amt = r.step(300, 9000, 10) * 100;
      const kind = r.pick(['paiement', 'demande', 'remboursement']);
      if (kind === 'paiement') {
        return ex(
          'Paiement de la TVA',
          `Le ${r.int(15, 24)} ${r.pick(MOIS)}, vous payez par virement à l'administration fiscale la <strong>TVA à décaisser</strong> de <strong>${m(amt)}</strong> lors du dépôt de la déclaration CA3.<br>Enregistrez le paiement.`,
          'La dette de TVA à décaisser (44551) disparaît ; la banque diminue.',
          [{ lines: [D('44551', e(amt)), C('512', e(amt))] }],
          `<p><strong>44551</strong> TVA à décaisser au <strong>débit</strong> (dette soldée) ; <strong>512</strong> au <strong>crédit</strong>.</p>`,
        );
      }
      if (kind === 'demande') {
        return ex(
          'Demande de remboursement de crédit de TVA',
          `Le ${dateFr(r)}, votre déclaration de TVA fait apparaître un <strong>crédit de TVA de ${m(amt)}</strong> (compte 44567). Vous en demandez le <strong>remboursement</strong> à l'administration fiscale.<br>Enregistrez la demande de remboursement.`,
          'Le crédit de TVA à reporter (44567) est transféré vers « Remboursement de taxe sur le chiffre d\'affaires demandé » (44583).',
          [{ lines: [D('44583', e(amt)), C('44567', e(amt))] }],
          `<p>La créance change de nature : de « crédit à reporter » (<strong>44567</strong>, au crédit pour le solder) à « remboursement demandé » (<strong>44583</strong>, au débit).</p>`,
        );
      }
      return ex(
        'Remboursement de crédit de TVA reçu',
        `Le ${dateFr(r)}, l'administration fiscale rembourse par virement le crédit de TVA de <strong>${m(amt)}</strong> demandé le mois précédent (compte 44583).<br>Enregistrez le remboursement reçu.`,
        'La banque augmente ; la créance « remboursement de TVA demandé » (44583) est soldée.',
        [{ lines: [D('512', e(amt)), C('44583', e(amt))] }],
        `<p><strong>512</strong> au débit (l'argent arrive), <strong>44583</strong> au crédit (la créance sur l'État est soldée).</p>`,
      );
    },
  },
];

// ============================================================ NIVEAU 3 — IMMOBILISATIONS, PROVISIONS, PAIE
const N3 = [
  {
    key: 'acquisition',
    make(r) {
      const a = r.pick(ASSETS);
      const ht = r.step(1500, 60000, 100) * 100;
      const frais = r.chance(0.3) ? r.step(100, 900, 50) * 100 : 0;
      const base = ht + frais;
      const rate = 20;
      const tva = vat(base, rate);
      const ttc = base + tva;
      const credit = r.chance(0.6);
      const contre = credit ? '404' : '512';
      return ex(
        "Acquisition d'une immobilisation",
        `Le ${dateFr(r)}, vous achetez ${a.name} pour <strong>${m(ht)} HT</strong>${frais ? `, plus <strong>${m(frais)} HT</strong> de frais d'installation facturés par le même fournisseur (à inclure dans le coût d'acquisition)` : ''}. TVA ${pct(rate)} déductible. ${credit ? 'Facture payable à 60 jours.' : 'Payé immédiatement par virement.'}<br>Enregistrez l'acquisition.`,
        `Un bien durable est une immobilisation (classe 2), pas une charge. TVA sur immobilisations : 44562. Contrepartie : ${credit ? 'fournisseur d\'immobilisations (404)' : 'la banque (512)'}.`,
        [{ lines: [D(a.acc, e(base)), D('44562', e(tva)), C(contre, e(ttc))] }],
        `<p>Coût d'acquisition = ${m(ht)}${frais ? ` + ${m(frais)} de frais d'installation = ${m(base)}` : ''}. TVA = ${m(tva)} ; TTC = ${m(ttc)}.</p><ul><li><strong>${a.acc}</strong> immobilisation → débit (${m(base)}).</li><li><strong>44562</strong> TVA déductible sur immobilisations → débit.</li><li><strong>${contre}</strong> ${credit ? 'Fournisseurs d\'immobilisations' : 'Banque'} → crédit (${m(ttc)}).</li></ul>`,
      );
    },
  },
  {
    key: 'dotation',
    make(r) {
      const a = r.pick(ASSETS);
      const years = r.pick([3, 4, 5, 8, 10]);
      const k = r.step(50, 1000, 10);
      const valeur = years * 12 * k * 100;
      const annuite = valeur / years;
      const prorata = r.chance(0.4);
      const startMonth = r.int(2, 11); // mise en service le 1er du mois
      const mois = 12 - (startMonth - 1);
      const dot = prorata ? Math.round((annuite * mois) / 12) : annuite;
      return ex(
        'Dotation aux amortissements',
        `Au 31 décembre, vous constatez l'amortissement ${a.of}. Coût d'acquisition : <strong>${m(valeur)} HT</strong> ; ${prorata ? `mise en service le 1er ${MOIS[startMonth - 1]}` : 'mise en service le 1er janvier'} ; amortissement <strong>linéaire sur ${years} ans</strong> (sans valeur résiduelle)${prorata ? ', avec calcul <em>prorata temporis</em> pour la première année' : ''}.<br>Enregistrez la dotation de l'exercice.`,
        `Annuité = valeur ÷ durée${prorata ? ', puis × mois d\'utilisation ÷ 12' : ''}. Débit : 6811. Crédit : le compte d'amortissement (28…) du poste, jamais l'immobilisation.`,
        [{ lines: [D('6811', e(dot)), C(a.amort, e(dot))] }],
        `<p>Annuité = ${m(valeur)} ÷ ${years} = ${m(annuite)}${prorata ? `. Prorata : ${m(annuite)} × ${mois}/12 = <strong>${m(dot)}</strong>` : ''}.</p><ul><li><strong>6811</strong> Dotations aux amortissements → débit.</li><li><strong>${a.amort}</strong> Amortissements → crédit. Le compte ${a.acc} n'est pas modifié.</li></ul>`,
      );
    },
  },
  {
    key: 'douteux',
    make(r) {
      const c = r.pick(CLIENTS);
      const ht = r.step(1000, 20000, 500) * 100;
      const rate = 20;
      const tva = vat(ht, rate);
      const ttc = ht + tva;
      const p = r.pick([20, 30, 40, 50, 60, 75, 80]);
      const dep = Math.round((ht * p) / 100);
      if (r.chance(0.65)) {
        return ex(
          'Client douteux et dépréciation',
          `Le client « ${c} » doit <strong>${m(ttc)} TTC</strong> (${m(ht)} HT + ${m(tva)} de TVA) et est placé en redressement judiciaire. Au 31 décembre, vous estimez perdre <strong>${p} % de la créance HT</strong>.<br><strong>1)</strong> Reclassez la créance en client douteux. <strong>2)</strong> Constatez la dépréciation.`,
          '1) Transfert 411 → 416 pour le TTC. 2) Dépréciation calculée sur le HT : dotation 6817 contre 491.',
          [
            { title: 'Écriture 1 — Reclassement en client douteux', lines: [D('416', e(ttc)), C('411', e(ttc))] },
            { title: 'Écriture 2 — Dépréciation', lines: [D('6817', e(dep)), C('491', e(dep))] },
          ],
          `<p><strong>1)</strong> <strong>416</strong> Clients douteux au débit, <strong>411</strong> au crédit : ${m(ttc)} TTC.</p><p><strong>2)</strong> Dépréciation = ${m(ht)} × ${p} % = <strong>${m(dep)}</strong>. <strong>6817</strong> Dotations aux dépréciations des actifs circulants (débit) / <strong>491</strong> Dépréciations des comptes de clients (crédit).</p>`,
        );
      }
      return ex(
        'Créance irrécouvrable et reprise de dépréciation',
        `Le client « ${c} », en liquidation judiciaire, ne paiera jamais sa dette de <strong>${m(ttc)} TTC</strong> (${m(ht)} HT + ${m(tva)} de TVA), comptabilisée en client douteux (416) et <strong>dépréciée à ${p} % du HT</strong> lors de l'exercice précédent.<br><strong>1)</strong> Constatez la perte définitive. <strong>2)</strong> Reprenez la dépréciation devenue inutile.`,
        '1) Perte sur créance irrécouvrable (654) pour le HT, TVA collectée régularisée (44571 au débit), client douteux soldé (416). 2) Reprise : 491 au débit, 7817 au crédit.',
        [
          { title: 'Écriture 1 — Perte définitive', lines: [D('654', e(ht)), D('44571', e(tva)), C('416', e(ttc))] },
          { title: 'Écriture 2 — Reprise de la dépréciation', lines: [D('491', e(dep)), C('7817', e(dep))] },
        ],
        `<p><strong>1)</strong> La perte est constatée pour le HT (<strong>654</strong>, ${m(ht)}) ; la TVA déjà versée à l'État est récupérée par régularisation de la TVA collectée (<strong>44571</strong> au débit, ${m(tva)}) ; <strong>416</strong> est soldé au crédit (${m(ttc)}).</p><p><strong>2)</strong> La dépréciation de ${m(dep)} (${m(ht)} × ${p} %) n'a plus d'objet : <strong>491</strong> au débit, <strong>7817</strong> Reprises sur dépréciations des actifs circulants au crédit.</p>`,
      );
    },
  },
  {
    key: 'salaire',
    make(r) {
      const s = r.pick(SALARIES);
      const brut = r.step(1500, 6000, 50) * 100;
      const cot = Math.round((brut * r.pick([21, 22, 23])) / 100);
      const pas = r.chance(0.4) ? Math.round(((brut - cot) * r.pick([2, 4, 6, 8])) / 100) : 0;
      const net = brut - cot - pas;
      const lines = [D('641', e(brut), ['6411']), C('431', e(cot))];
      if (pas) lines.push(C('4421', e(pas)));
      lines.push(C('421', e(net)));
      return ex(
        'Écriture de salaire',
        `Bulletin de paie de ${r.pick(MOIS)} de ${s} : <strong>salaire brut ${m(brut)}</strong> ; cotisations salariales retenues <strong>${m(cot)}</strong>${pas ? ` ; prélèvement à la source retenu <strong>${m(pas)}</strong>` : ''} ; net à payer <strong>${m(net)}</strong>. Le salaire n'est pas encore versé.<br>Enregistrez la charge de salaire.`,
        `Le brut est une charge (641). Les retenues et le net sont des dettes : cotisations (431)${pas ? ', prélèvement à la source (4421)' : ''} et personnel (421).`,
        [{ lines }],
        `<p>Brut ${m(brut)} = cotisations ${m(cot)}${pas ? ` + PAS ${m(pas)}` : ''} + net ${m(net)}.</p><ul><li><strong>641</strong> Rémunérations du personnel → débit (brut).</li><li><strong>431</strong> Sécurité sociale → crédit (cotisations retenues).</li>${pas ? `<li><strong>4421</strong> Prélèvement à la source → crédit.</li>` : ''}<li><strong>421</strong> Personnel – rémunérations dues → crédit (net à payer).</li></ul>`,
      );
    },
  },
  {
    key: 'charges-patronales',
    make(r) {
      const s = r.pick(SALARIES);
      const brut = r.step(1500, 6000, 50) * 100;
      const taux = r.pick([38, 40, 42, 44]);
      const patron = Math.round((brut * taux) / 100);
      const split = r.chance(0.35);
      if (split) {
        const retraite = Math.round(patron * 0.3);
        const urssaf = patron - retraite;
        return ex(
          'Charges patronales (URSSAF et retraite complémentaire)',
          `Pour le bulletin de ${s} (brut ${m(brut)}), les cotisations patronales s'élèvent à <strong>${m(patron)}</strong> (${taux} % du brut) : <strong>${m(urssaf)}</strong> dus à l'URSSAF (compte 431) et <strong>${m(retraite)}</strong> dus aux caisses de retraite complémentaire (compte 437).<br>Enregistrez les charges sociales de l'employeur.`,
          'Charges de sécurité sociale et de prévoyance (645) au débit. Les dettes envers les organismes sociaux (431 et 437) au crédit.',
          [{ lines: [D('645', e(patron), ['6451']), C('431', e(urssaf)), C('437', e(retraite))] }],
          `<p><strong>645</strong> Charges de sécurité sociale (débit, ${m(patron)}) ; <strong>431</strong> (${m(urssaf)}) et <strong>437</strong> Autres organismes sociaux (${m(retraite)}) au crédit.</p><p>Coût total employeur = ${m(brut)} + ${m(patron)} = ${m(brut + patron)}.</p>`,
        );
      }
      return ex(
        'Charges patronales',
        `Pour le bulletin de ${s} (brut ${m(brut)}), les <strong>cotisations patronales</strong> représentent <strong>${taux} %</strong> du brut, dues aux organismes sociaux (URSSAF, retraite, prévoyance).<br>Enregistrez les charges sociales de l'employeur.`,
        'Ce sont des charges en plus du brut : 645 au débit. La dette envers les organismes sociaux (431) au crédit.',
        [{ lines: [D('645', e(patron), ['6451']), C('431', e(patron))] }],
        `<p>Cotisations patronales = ${m(brut)} × ${taux} % = <strong>${m(patron)}</strong>.</p><p><strong>645</strong> au débit (charge) ; <strong>431</strong> au crédit (dette). Coût total employeur = ${m(brut + patron)}.</p>`,
      );
    },
  },
  {
    key: 'paiement-paie',
    make(r) {
      const amt = r.step(800, 5000, 10) * 100;
      if (r.chance(0.5)) {
        return ex(
          'Paiement du salaire net',
          `Le 28 ${r.pick(MOIS)}, vous versez par virement le salaire net de ${r.pick(SALARIES)} : <strong>${m(amt)}</strong>.<br>Enregistrez le paiement.`,
          'La dette envers le personnel (421) disparaît ; la banque diminue.',
          [{ lines: [D('421', e(amt)), C('512', e(amt))] }],
          `<p><strong>421</strong> au <strong>débit</strong> (dette soldée) ; <strong>512</strong> au <strong>crédit</strong>.</p>`,
        );
      }
      return ex(
        'Paiement des cotisations sociales',
        `Le 15 ${r.pick(MOIS)}, l'URSSAF prélève sur le compte bancaire les cotisations sociales du mois : <strong>${m(amt)}</strong> (compte 431).<br>Enregistrez le prélèvement.`,
        'La dette envers la Sécurité sociale (431) disparaît ; la banque diminue.',
        [{ lines: [D('431', e(amt)), C('512', e(amt))] }],
        `<p><strong>431</strong> Sécurité sociale au <strong>débit</strong> (dette soldée) ; <strong>512</strong> au <strong>crédit</strong>.</p>`,
      );
    },
  },
  {
    key: 'provision',
    make(r) {
      const kind = r.pick(['constitution', 'constitution', 'ajustement', 'reprise']);
      const nature = r.pick([
        ['1511', "un litige avec un ancien salarié (conseil de prud'hommes)", 'Provisions pour litiges'],
        ['1512', 'la garantie donnée aux clients sur les produits vendus', 'Provisions pour garanties données aux clients'],
      ]);
      const p1 = r.step(2000, 40000, 500) * 100;
      if (kind === 'constitution') {
        return ex(
          'Provision pour risque',
          `Au 31 décembre, l'entreprise doit faire face à ${nature[1]}. Le risque de sortie de ressources est <strong>probable</strong> et estimé à <strong>${m(p1)}</strong>.<br>Enregistrez la provision.`,
          `Ce n'est pas une perte certaine : provision pour risques (${nature[0]}) avec une dotation en charge (6815).`,
          [{ lines: [D('6815', e(p1), ['6875']), C(nature[0], e(p1))] }],
          `<p><strong>6815</strong> Dotations aux provisions d'exploitation (charge → débit) ; <strong>${nature[0]}</strong> ${nature[2]} (passif → crédit) : ${m(p1)}.</p>`,
        );
      }
      const p0 = r.step(2000, 40000, 500) * 100;
      if (kind === 'ajustement') {
        if (p1 > p0) {
          return ex(
            'Ajustement de provision à la hausse',
            `Au 31 décembre, ${nature[1]} : une provision de <strong>${m(p0)}</strong> (compte ${nature[0]}) existe déjà. Le risque est maintenant estimé à <strong>${m(p1)}</strong>.<br>Enregistrez l'ajustement.`,
            'Seule la différence est à comptabiliser : complément de dotation (6815).',
            [{ lines: [D('6815', e(p1 - p0), ['6875']), C(nature[0], e(p1 - p0))] }],
            `<p>Complément = ${m(p1)} − ${m(p0)} = <strong>${m(p1 - p0)}</strong> : <strong>6815</strong> au débit, <strong>${nature[0]}</strong> au crédit.</p>`,
          );
        }
        if (p1 < p0) {
          return ex(
            'Ajustement de provision à la baisse',
            `Au 31 décembre, ${nature[1]} : une provision de <strong>${m(p0)}</strong> (compte ${nature[0]}) existe déjà. Le risque n'est plus estimé qu'à <strong>${m(p1)}</strong>.<br>Enregistrez l'ajustement.`,
            'Seule la différence est à comptabiliser : reprise de provision (7815 au crédit).',
            [{ lines: [D(nature[0], e(p0 - p1)), C('7815', e(p0 - p1), ['7875'])] }],
            `<p>Reprise = ${m(p0)} − ${m(p1)} = <strong>${m(p0 - p1)}</strong> : <strong>${nature[0]}</strong> au débit, <strong>7815</strong> Reprises sur provisions d'exploitation au crédit.</p>`,
          );
        }
      }
      return ex(
        'Reprise de provision devenue sans objet',
        `L'entreprise avait provisionné <strong>${m(p1)}</strong> (compte ${nature[0]}) pour ${nature[1]}. Le risque a disparu : l'affaire est définitivement réglée <strong>sans aucun paiement</strong>.<br>Enregistrez la reprise de la provision.`,
        'La provision n\'a plus d\'objet : on la solde (débit) et on constate un produit (7815).',
        [{ lines: [D(nature[0], e(p1)), C('7815', e(p1), ['7875'])] }],
        `<p><strong>${nature[0]}</strong> au débit (le passif disparaît) ; <strong>7815</strong> Reprises sur provisions d'exploitation au crédit (produit).</p>`,
      );
    },
  },
  {
    key: 'depreciation-stock',
    make(r) {
      const cout = r.step(4000, 40000, 500) * 100;
      const dep = r.step(200, Math.max(300, Math.floor(cout / 100 / 3)), 100) * 100;
      const reprise = r.chance(0.35);
      if (!reprise) {
        return ex(
          'Dépréciation de stock',
          `À l'inventaire du 31 décembre, un stock de marchandises est inscrit pour <strong>${m(cout)}</strong> (coût d'achat). Sa valeur actuelle de marché n'est plus que de <strong>${m(cout - dep)}</strong> (produits démodés).<br>Enregistrez la dépréciation.`,
          'Perte de valeur probable d\'un stock : dotation aux dépréciations des actifs circulants (6817) contre 397.',
          [{ lines: [D('6817', e(dep)), C('397', e(dep))] }],
          `<p>Dépréciation = ${m(cout)} − ${m(cout - dep)} = <strong>${m(dep)}</strong>. <strong>6817</strong> au débit (charge) ; <strong>397</strong> Dépréciations des stocks de marchandises au crédit. Le compte 37 n'est pas modifié.</p>`,
        );
      }
      return ex(
        'Reprise de dépréciation de stock',
        `Une dépréciation de <strong>${m(dep)}</strong> avait été constatée l'an dernier sur un stock de marchandises. Ce stock a été vendu à un prix supérieur au coût : la dépréciation est <strong>devenue sans objet</strong>.<br>Enregistrez la reprise.`,
        'La dépréciation (397) est soldée au débit ; un produit de reprise (7817) est constaté.',
        [{ lines: [D('397', e(dep)), C('7817', e(dep))] }],
        `<p><strong>397</strong> au débit (le compte correcteur est soldé) ; <strong>7817</strong> Reprises sur dépréciations des actifs circulants au crédit (produit).</p>`,
      );
    },
  },
];

// ============================================================ NIVEAU 4 — CAS COMPLETS & RÉGULARISATIONS
const N4 = [
  {
    key: 'cession',
    make(r) {
      const a = r.pick(ASSETS);
      const brut = r.step(4000, 80000, 1000) * 100;
      const pctAmort = r.pick([40, 50, 60, 70, 80]);
      const cumul = Math.round((brut * pctAmort) / 100);
      const vnc = brut - cumul;
      const delta = Math.round((r.int(-40, 40) / 100) * vnc);
      const prix = Math.max(50000, Math.round((vnc + delta) / 10000) * 10000);
      const tva = vat(prix, 20);
      const ttc = prix + tva;
      const cash = r.chance(0.4);
      const res = prix - vnc;
      const part1 = cash
        ? [D('512', e(ttc)), C('775', e(prix)), C('44571', e(tva))]
        : [D('462', e(ttc)), C('775', e(prix)), C('44571', e(tva))];
      return ex(
        "Cession d'immobilisation (2 écritures)",
        `Le 31 décembre, vous cédez ${a.name} (coût d'acquisition <strong>${m(brut)} HT</strong> ; <strong>amortissements cumulés : ${m(cumul)}</strong> à cette date, dotation de l'exercice comprise). Prix de cession : <strong>${m(prix)} HT</strong> + TVA 20 % = ${m(ttc)} TTC, ${cash ? 'encaissés immédiatement par virement' : 'à encaisser ultérieurement'}.<br><strong>1)</strong> Enregistrez la cession. <strong>2)</strong> Enregistrez la sortie du bien de l'actif.`,
        `1) Produit de cession (775), TVA collectée, et ${cash ? 'banque' : 'créance sur cession d\'immobilisation (462)'}. 2) Solder l'immobilisation (${a.acc}) et ses amortissements (${a.amort}) ; la valeur nette comptable part en charge (675).`,
        [
          { title: 'Écriture 1 — Constatation de la cession', lines: part1 },
          { title: "Écriture 2 — Sortie du bien de l'actif", lines: [D(a.amort, e(cumul)), D('675', e(vnc)), C(a.acc, e(brut))] },
        ],
        `<p><strong>1)</strong> Prix HT ${m(prix)} → <strong>775</strong> au crédit ; TVA ${m(tva)} → <strong>44571</strong> au crédit ; ${cash ? '<strong>512</strong>' : '<strong>462</strong> Créances sur cessions d\'immobilisations'} au débit (${m(ttc)}).</p><p><strong>2)</strong> VNC = ${m(brut)} − ${m(cumul)} = <strong>${m(vnc)}</strong>. <strong>${a.acc}</strong> soldé au crédit (${m(brut)}), <strong>${a.amort}</strong> soldé au débit (${m(cumul)}), <strong>675</strong> au débit (${m(vnc)}).</p><p>Résultat de cession = ${m(prix)} − ${m(vnc)} = <strong>${res >= 0 ? 'plus-value' : 'moins-value'} de ${m(Math.abs(res))}</strong>.</p>`,
      );
    },
  },
  {
    key: 'cca',
    make(r) {
      const charge = r.pick([
        ['616', "la prime d'assurance du local commercial"],
        ['6132', 'le loyer du local'],
        ['6135', "la location d'un photocopieur"],
        ['6156', "le contrat de maintenance du matériel informatique"],
      ]);
      const duree = r.pick([6, 12, 12, 12, 24]);
      const debut = r.int(Math.max(7, 14 - duree), 12); // mois de début (1er du mois), même année
      const ecoules = 13 - debut;
      const restants = duree - ecoules; // toujours >= 1
      const k = r.step(20, 300, 10);
      const total = duree * k * 100;
      const cca = restants * k * 100;
      return ex(
        "Charges constatées d'avance",
        `Le 1er ${MOIS[debut - 1]}, vous avez payé <strong>${m(total)}</strong> pour ${charge[1]}, couvrant <strong>${duree} mois</strong> à compter de cette date. La totalité a été enregistrée en charge (compte ${charge[0]}).<br>À la clôture du 31 décembre, passez l'écriture de régularisation.`,
        `Comptez les mois écoulés à la clôture (${ecoules}) et ceux qui concernent l'exercice suivant : ils forment la charge constatée d'avance (486).`,
        [{ lines: [D('486', e(cca)), C(charge[0], e(cca))] }],
        `<p>Coût mensuel : ${m(total)} ÷ ${duree} = ${m(k * 100)}. Mois consommés : ${ecoules} ; mois restants : ${restants}.</p><p>CCA = ${m(k * 100)} × ${restants} = <strong>${m(cca)}</strong> : <strong>486</strong> au débit (actif), <strong>${charge[0]}</strong> au crédit (on retire cette part des charges).</p>`,
      );
    },
  },
  {
    key: 'pca',
    make(r) {
      const produit = r.pick([
        ['7083', 'le loyer de la sous-location de vos locaux'],
        ['706', "l'abonnement annuel de maintenance facturé d'avance à un client"],
        ['752', "le loyer d'un appartement non affecté à l'activité"],
      ]);
      const duree = r.pick([6, 12, 12, 3]);
      const debut = r.int(Math.max(8, 14 - duree), 12);
      const ecoules = 13 - debut;
      const restants = duree - ecoules; // toujours >= 1
      const k = r.step(50, 500, 10);
      const total = duree * k * 100;
      const pca = restants * k * 100;
      return ex(
        "Produits constatés d'avance",
        `Le 1er ${MOIS[debut - 1]}, vous avez encaissé <strong>${m(total)}</strong> pour ${produit[1]}, couvrant <strong>${duree} mois</strong> à compter de cette date. La totalité a été enregistrée en produit (compte ${produit[0]}).<br>À la clôture du 31 décembre, passez l'écriture de régularisation.`,
        `Les mois qui concernent l'exercice suivant (${restants}) ne sont pas un produit de cette année : ils forment un produit constaté d'avance (487).`,
        [{ lines: [D(produit[0], e(pca)), C('487', e(pca))] }],
        `<p>Produit mensuel : ${m(total)} ÷ ${duree} = ${m(k * 100)}. Mois écoulés : ${ecoules} ; restants : ${restants}.</p><p>PCA = ${m(k * 100)} × ${restants} = <strong>${m(pca)}</strong> : <strong>${produit[0]}</strong> au débit (on retire cette part des produits), <strong>487</strong> au crédit (passif).</p>`,
      );
    },
  },
  {
    key: 'stocks',
    make(r) {
      const si = r.step(3000, 60000, 500) * 100;
      let sf = r.step(3000, 60000, 500) * 100;
      if (sf === si) sf += 50000;
      const mat = r.chance(0.35);
      const stock = mat ? '31' : '37';
      const variation = mat ? '6031' : '6037';
      const nom = mat ? 'de matières premières' : 'de marchandises';
      const ecart = si - sf;
      return ex(
        `Variation des stocks ${nom} (2 écritures)`,
        `À l'inventaire du 31 décembre (inventaire intermittent) : <strong>stock initial ${nom} ${m(si)}</strong>, <strong>stock final ${m(sf)}</strong>.<br><strong>1)</strong> Annulez le stock initial. <strong>2)</strong> Constatez le stock final.`,
        `Compte de stock : ${stock}. Compte de variation : ${variation}. Annuler le stock initial = le sortir du bilan (${stock} au crédit).`,
        [
          { title: 'Écriture 1 — Annulation du stock initial', lines: [D(variation, e(si)), C(stock, e(si))] },
          { title: 'Écriture 2 — Constatation du stock final', lines: [D(stock, e(sf)), C(variation, e(sf))] },
        ],
        `<p><strong>1)</strong> <strong>${variation}</strong> au débit / <strong>${stock}</strong> au crédit : ${m(si)}.</p><p><strong>2)</strong> <strong>${stock}</strong> au débit / <strong>${variation}</strong> au crédit : ${m(sf)}.</p><p>Variation de stock = SI − SF = ${m(si)} − ${m(sf)} = ${ecart >= 0 ? m(ecart) : '−' + m(-ecart)} : le compte ${variation} est ${ecart >= 0 ? `<strong>débiteur de ${m(ecart)}</strong> (déstockage : charge)` : `<strong>créditeur de ${m(-ecart)}</strong> (stockage : diminution des charges)`}.</p>`,
      );
    },
  },
  {
    key: 'emprunt',
    make(r) {
      const cap = r.step(10000, 200000, 5000) * 100;
      const frais = r.chance(0.7) ? r.step(100, 1500, 50) * 100 : 0;
      const years = r.pick([3, 5, 7, 10]);
      const lines = [D('512', e(cap - frais))];
      if (frais) lines.push(D('627', e(frais), ['6272']));
      lines.push(C('164', e(cap)));
      return ex(
        "Obtention d'un emprunt",
        `Le ${dateFr(r)}, la banque accorde à l'entreprise un <strong>emprunt de ${m(cap)}</strong> sur ${years} ans.${frais ? ` Des <strong>frais de dossier de ${m(frais)}</strong> (exonérés de TVA) sont prélevés sur le montant versé : la banque crédite donc le compte de <strong>${m(cap - frais)}</strong>.` : ` Les fonds sont versés intégralement sur le compte bancaire.`}<br>Enregistrez l'opération.`,
        `La dette porte sur le capital emprunté (164). ${frais ? 'Les frais de dossier sont des services bancaires (627). ' : ''}La banque n'augmente que du montant réellement reçu.`,
        [{ lines }],
        `<p><strong>164</strong> Emprunts auprès des établissements de crédit → crédit pour la totalité (${m(cap)}).</p><p><strong>512</strong> → débit pour ce qui est reçu (${m(cap - frais)}).${frais ? ` Les <strong>${m(frais)}</strong> de frais sont une charge : <strong>627</strong> au débit.` : ''}</p>`,
      );
    },
  },
  {
    key: 'echeance',
    make(r) {
      const years = r.pick([5, 8, 10]);
      const tranche = r.step(2000, 30000, 1000) * 100;
      const K0 = tranche * years;
      const taux = r.pick([2, 2.5, 3, 3.5, 4, 5]);
      const annee = r.int(1, 3);
      const restant = K0 - (annee - 1) * tranche;
      const interets = Math.round((restant * taux) / 100);
      const total = tranche + interets;
      if (r.chance(0.6)) {
        return ex(
          `Échéance d'emprunt (année ${annee})`,
          `Emprunt initial de <strong>${m(K0)}</strong> à <strong>${pct(taux)}</strong> par an, remboursable par <strong>amortissements constants</strong> sur ${years} ans (${m(tranche)} par an). Intérêts calculés sur le capital restant dû en début d'année. Le 31 décembre de l'année ${annee}, la banque prélève l'échéance de <strong>${m(total)}</strong>.<br>Enregistrez le prélèvement.`,
          "Intérêts = capital restant dû en début d'année × taux. Échéance = capital remboursé + intérêts. Capital → 164 (débit) ; intérêts → charge financière 6611.",
          [{ lines: [D('6611', e(interets)), D('164', e(tranche)), C('512', e(total))] }],
          `<p>Capital restant dû en début d'année ${annee} : ${m(restant)}. Intérêts = ${m(restant)} × ${pct(taux)} = <strong>${m(interets)}</strong>. Capital remboursé : ${m(tranche)}.</p><ul><li><strong>6611</strong> Intérêts des emprunts → débit.</li><li><strong>164</strong> Emprunts → débit (la dette diminue).</li><li><strong>512</strong> Banque → crédit (${m(total)}).</li></ul>`,
        );
      }
      return ex(
        `Échéance d'emprunt (tableau d'amortissement)`,
        `Le tableau d'amortissement d'un emprunt indique, pour l'échéance du 31 décembre : <strong>capital restant dû en début de période ${m(restant)}</strong>, taux annuel <strong>${pct(taux)}</strong>, <strong>échéance prélevée : ${m(total)}</strong>.<br>Enregistrez le prélèvement (calculez la part d'intérêts et la part de capital).`,
        "Intérêts = capital restant dû × taux. Part de capital = échéance − intérêts. Capital → 164 (débit) ; intérêts → 6611.",
        [{ lines: [D('6611', e(interets)), D('164', e(tranche)), C('512', e(total))] }],
        `<p>Intérêts = ${m(restant)} × ${pct(taux)} = <strong>${m(interets)}</strong>. Part de capital = ${m(total)} − ${m(interets)} = <strong>${m(tranche)}</strong>.</p><p><strong>6611</strong> et <strong>164</strong> au débit, <strong>512</strong> au crédit pour ${m(total)}.</p>`,
      );
    },
  },
  {
    key: 'fnp-fae',
    make(r) {
      const ht = r.step(500, 9000, 100) * 100;
      const tva = vat(ht, 20);
      const ttc = ht + tva;
      if (r.chance(0.55)) {
        const ch = r.pick([
          ['6226', 'honoraires du cabinet comptable'],
          ['6061', "consommation d'électricité"],
          ['6155', 'réparations du matériel'],
          ['6231', 'annonces publicitaires'],
        ]);
        return ex(
          'Facture non parvenue',
          `À la clôture du 31 décembre, vous avez bénéficié de prestations (${ch[1]}) pour <strong>${m(ht)} HT</strong> (TVA 20 %) dont la <strong>facture n'est pas encore parvenue</strong>.<br>Enregistrez la charge à payer.`,
          "La charge appartient à cet exercice : compte de charge au débit, TVA sur factures non parvenues (44586), dette 'factures non parvenues' (408).",
          [{ lines: [D(ch[0], e(ht)), D('44586', e(tva)), C('408', e(ttc))] }],
          `<p>TVA = ${m(tva)} ; TTC = ${m(ttc)}.</p><ul><li><strong>${ch[0]}</strong> → débit ${m(ht)} (la charge rattachée à l'exercice).</li><li><strong>44586</strong> TVA sur factures non parvenues → débit ${m(tva)}.</li><li><strong>408</strong> Fournisseurs – factures non parvenues → crédit ${m(ttc)}.</li></ul>`,
        );
      }
      const c = r.pick(CLIENTS);
      return ex(
        'Facture à établir',
        `À la clôture du 31 décembre, vous avez réalisé une prestation de services pour « ${c} » pour <strong>${m(ht)} HT</strong> (TVA 20 %) mais vous <strong>n'avez pas encore émis la facture</strong>.<br>Enregistrez le produit à recevoir.`,
        "Le produit appartient à cet exercice : prestation de services (706) au crédit, TVA sur factures à établir (44587) au crédit, créance 'factures à établir' (4181) au débit.",
        [{ lines: [D('4181', e(ttc)), C('706', e(ht)), C('44587', e(tva))] }],
        `<p>TVA = ${m(tva)} ; TTC = ${m(ttc)}.</p><ul><li><strong>4181</strong> Clients – factures à établir → débit ${m(ttc)}.</li><li><strong>706</strong> Prestations de services → crédit ${m(ht)}.</li><li><strong>44587</strong> TVA sur factures à établir → crédit ${m(tva)}.</li></ul>`,
      );
    },
  },
  {
    key: 'icne',
    make(r) {
      const K = r.step(20000, 200000, 5000) * 100;
      const taux = r.pick([2, 3, 4, 5]);
      const debut = r.int(2, 11); // échéance annuelle le 1er du mois "debut"
      const mois = 13 - debut;
      const icne = Math.round((K * taux * mois) / 1200);
      return ex(
        'Intérêts courus non échus',
        `Un emprunt de <strong>${m(K)}</strong> au taux de <strong>${taux} %</strong> par an est remboursé in fine ; ses intérêts sont payés une fois par an, le 1er ${MOIS[debut - 1]} (le dernier paiement a bien été effectué). À la clôture du 31 décembre, les intérêts courus depuis cette date ne sont pas encore payés.<br>Enregistrez les intérêts courus non échus.`,
        `Intérêts de ${mois} mois (du 1er ${MOIS[debut - 1]} au 31 décembre). Charge financière (6611) et dette rattachée : intérêts courus sur emprunts auprès des établissements de crédit (16884).`,
        [{ lines: [D('6611', e(icne)), C('16884', e(icne), ['1688'])] }],
        `<p>ICNE = ${m(K)} × ${taux} % × ${mois}/12 = <strong>${m(icne)}</strong>.</p><p><strong>6611</strong> Intérêts des emprunts → débit (charge de l'exercice) ; <strong>16884</strong> Intérêts courus → crédit (dette).</p>`,
      );
    },
  },
];

/** Modèles disponibles par niveau. */
export const TEMPLATES = { 1: N1, 2: N2, 3: N3, 4: N4 };

// ------------------------------------------------------------------ validation
/**
 * Vérifie qu'un exercice est correct : comptes existants, montants strictement positifs,
 * chaque écriture équilibrée (débit = crédit) et d'au moins deux lignes.
 * @returns {string[]} liste d'anomalies (vide = exercice valide)
 */
export function validateExercise(exo) {
  const errors = [];
  if (!exo.parts?.length) errors.push('aucune écriture');
  (exo.parts ?? []).forEach((part, p) => {
    if (!part.lines?.length || part.lines.length < 2) errors.push(`écriture ${p + 1} : moins de 2 lignes`);
    let d = 0;
    let c = 0;
    for (const l of part.lines ?? []) {
      if (!accountExists(l.acc)) errors.push(`écriture ${p + 1} : compte inconnu « ${l.acc} »`);
      for (const a of l.alt ?? []) if (!accountExists(a)) errors.push(`écriture ${p + 1} : compte équivalent inconnu « ${a} »`);
      if (!Number.isFinite(l.amount) || l.amount <= 0) errors.push(`écriture ${p + 1} : montant non positif sur ${l.acc}`);
      const cents = Math.round(l.amount * 100);
      if (Math.abs(l.amount * 100 - cents) > 1e-6) errors.push(`écriture ${p + 1} : montant à plus de 2 décimales sur ${l.acc}`);
      if (l.side === 'D') d += cents;
      else if (l.side === 'C') c += cents;
      else errors.push(`écriture ${p + 1} : sens invalide sur ${l.acc}`);
    }
    if (d !== c) errors.push(`écriture ${p + 1} : déséquilibrée (débit ${d / 100} ≠ crédit ${c / 100})`);
  });
  for (const field of ['title', 'statement', 'hint', 'explanation']) {
    if (!exo[field] || String(exo[field]).includes('undefined') || String(exo[field]).includes('NaN')) errors.push(`champ « ${field} » vide ou invalide`);
  }
  return errors;
}

let counter = 0;

/**
 * Génère un exercice aléatoire pour un niveau (1 à 4).
 * @param {number} level
 * @param {{ rng?: () => number, avoidKey?: string, templateKey?: string }} [opts]
 *   rng : source aléatoire (Math.random par défaut) ; avoidKey : évite de répéter le même modèle ;
 *   templateKey : force un modèle (tests).
 */
export function generateExercise(level, opts = {}) {
  const templates = TEMPLATES[level];
  if (!templates) throw new Error(`Niveau inconnu : ${level}`);
  const r = randomKit(opts.rng ?? Math.random);
  for (let attempt = 0; attempt < 25; attempt++) {
    let pool = templates;
    if (opts.templateKey) pool = templates.filter((t) => t.key === opts.templateKey);
    else if (opts.avoidKey && templates.length > 1) pool = templates.filter((t) => t.key !== opts.avoidKey);
    const tpl = r.pick(pool);
    const exo = tpl.make(r);
    if (validateExercise(exo).length === 0) {
      counter += 1;
      return { ...exo, id: `gen-${level}-${counter}`, level, generated: true, template: tpl.key };
    }
  }
  throw new Error(`Impossible de générer un exercice valide (niveau ${level})`);
}
