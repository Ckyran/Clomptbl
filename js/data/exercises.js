// Exercices fixes (énoncés + corrigés), regroupés en 4 niveaux progressifs.
//
// Structure d'un exercice :
// {
//   id:          identifiant unique et stable (sert à mémoriser la progression),
//   level:       1 à 4,
//   title:       titre court,
//   statement:   énoncé (HTML simple autorisé),
//   hint:        indice repliable (HTML simple),
//   parts:       [{ title?, lines: [D('512', 100), C('101', 100, ['1013'])] }]   // 1 partie = 1 écriture,
//   explanation: explication détaillée affichée après réussite / correction (HTML simple),
// }
// D(compte, montant, comptesEquivalents?) et C(...) : ligne au débit / au crédit.

import { D, C } from '../util.js';

export const LEVELS = [
  {
    id: 1,
    icon: '🌱',
    title: 'Niveau 1 — Les bases',
    short: 'Les bases',
    desc: "Apport en capital, achats et ventes à crédit avec TVA, règlements et caisse.",
  },
  {
    id: 2,
    icon: '🧾',
    title: 'Niveau 2 — TVA & opérations courantes',
    short: 'TVA & opérations courantes',
    desc: 'Remises, escompte, avoirs, ports facturés, liquidation et paiement de la TVA.',
  },
  {
    id: 3,
    icon: '🏭',
    title: 'Niveau 3 — Immobilisations, provisions, paie',
    short: 'Immobilisations, provisions, paie',
    desc: 'Acquisitions, amortissements, clients douteux, provisions, salaires et charges sociales.',
  },
  {
    id: 4,
    icon: '🧩',
    title: 'Niveau 4 — Cas complets & régularisations',
    short: 'Cas complets & régularisations',
    desc: "Cessions, charges et produits constatés d'avance, stocks, emprunts.",
  },
];

export const EXERCISES = [
  // ======================================================================= NIVEAU 1
  {
    id: 'n1-01',
    level: 1,
    title: 'Apport en capital',
    statement:
      "Le 2 janvier, Mme Martin et M. Benali créent la SARL « Épicerie du Marché ». Ils apportent chacun 15 000 € en numéraire. Le capital de 30 000 € est <strong>intégralement libéré</strong> et les fonds sont déposés sur le compte bancaire de la société.<br>Enregistrez l'écriture de constitution du capital.",
    hint: "L'argent arrive en banque (un actif qui augmente : on le débite). Il vient des associés : c'est le capital social (capitaux propres, compte 101).",
    parts: [{ lines: [D('512', 30000), C('101', 30000)] }],
    explanation:
      "<p>Le compte en banque <strong>augmente</strong> : 512 est un compte d'actif (trésorerie), on le <strong>débite</strong>.</p><p>L'origine de cet argent, ce sont les associés : le capital (101) est une ressource durable de l'entreprise, un compte de capitaux propres (passif), on le <strong>crédite</strong>.</p><p>Total débit = total crédit = 30 000 € ✔</p>",
  },
  {
    id: 'n1-02',
    level: 1,
    title: 'Achat de marchandises à crédit',
    statement:
      "Le 5 janvier, l'Épicerie du Marché reçoit de son fournisseur « Vergers Duval » la facture n° F-118 : marchandises destinées à la revente, <strong>2 500 € HT</strong>, TVA 20 %, paiement à 30 jours.<br>Enregistrez la facture d'achat.",
    hint: "Trois comptes : l'achat (charge, HT), la TVA déductible sur autres biens et services (44566) et la dette envers le fournisseur (TTC).",
    parts: [{ lines: [D('607', 2500), D('44566', 500), C('401', 3000)] }],
    explanation:
      "<p>TVA = 2 500 × 20 % = 500 € ; TTC = 3 000 €.</p><ul><li><strong>607</strong> Achats de marchandises (charge) au débit pour le montant HT.</li><li><strong>44566</strong> TVA déductible : l'entreprise la récupérera, c'est une créance sur l'État → débit.</li><li><strong>401</strong> Fournisseurs : dette pour le montant TTC → crédit.</li></ul><p>2 500 + 500 = 3 000 ✔</p>",
  },
  {
    id: 'n1-03',
    level: 1,
    title: 'Vente de marchandises à crédit',
    statement:
      "Le 12 janvier, l'entreprise vend au « Restaurant Le Bistrot » des marchandises pour <strong>1 800 € HT</strong> (TVA 20 %). Facture n° V-001, payable à 30 jours.<br>Enregistrez la facture de vente.",
    hint: 'Le client nous doit le TTC (compte 411). La vente est un produit (HT). La TVA est due à l\'État : TVA collectée (44571).',
    parts: [{ lines: [D('411', 2160), C('707', 1800), C('44571', 360)] }],
    explanation:
      "<p>TVA = 1 800 × 20 % = 360 € ; TTC = 2 160 €.</p><ul><li><strong>411</strong> Clients : créance TTC → débit.</li><li><strong>707</strong> Ventes de marchandises (produit) : HT → crédit.</li><li><strong>44571</strong> TVA collectée : dette envers l'État → crédit.</li></ul><p>2 160 = 1 800 + 360 ✔</p>",
  },
  {
    id: 'n1-04',
    level: 1,
    title: 'Règlement d’un fournisseur',
    statement:
      "Le 4 février, vous réglez par virement bancaire la facture n° F-118 de « Vergers Duval » (<strong>3 000 € TTC</strong>).<br>Enregistrez le règlement.",
    hint: 'La dette envers le fournisseur disparaît (elle diminue → débit) ; la banque diminue (crédit).',
    parts: [{ lines: [D('401', 3000), C('512', 3000)] }],
    explanation:
      "<p>Le paiement éteint la dette : <strong>401</strong> Fournisseurs (passif) diminue → <strong>débit</strong>. La <strong>banque</strong> (actif) diminue → <strong>crédit</strong>.</p><p>Aucune TVA ici : elle a déjà été comptabilisée à la facture.</p>",
  },
  {
    id: 'n1-05',
    level: 1,
    title: 'Encaissement d’un client',
    statement:
      "Le 10 février, le « Restaurant Le Bistrot » règle par chèque de <strong>2 160 €</strong> la facture n° V-001. Le chèque est remis immédiatement à la banque (enregistrez-le directement en banque).<br>Enregistrez l'encaissement.",
    hint: "La banque augmente (débit). La créance sur le client disparaît (crédit).",
    parts: [{ lines: [D('512', 2160), C('411', 2160)] }],
    explanation:
      "<p>La <strong>banque</strong> augmente (actif → débit) ; la créance <strong>411</strong> Clients disparaît (actif qui diminue → crédit).</p><p>Là encore, pas de TVA : elle a été comptabilisée à la vente.</p>",
  },
  {
    id: 'n1-06',
    level: 1,
    title: 'Alimentation de la caisse',
    statement:
      "Le 15 février, vous retirez <strong>500 € en espèces</strong> au guichet de votre banque pour alimenter la caisse de l'entreprise.<br>Enregistrez l'opération.",
    hint: "Deux comptes de trésorerie : l'un augmente, l'autre diminue. Le compte de caisse est le 530 (ou 53 / 531).",
    parts: [{ lines: [D('530', 500, ['53', '531']), C('512', 500)] }],
    explanation:
      "<p>Virement interne de trésorerie : la <strong>caisse</strong> (530) augmente → débit ; la <strong>banque</strong> (512) diminue → crédit. Le patrimoine total ne change pas, seul son « emplacement » change.</p>",
  },

  // ======================================================================= NIVEAU 2
  {
    id: 'n2-01',
    level: 2,
    title: 'Facture avec remise commerciale',
    statement:
      "Le 3 mars, vous recevez de « Cave des Coteaux » la facture n° 2203 : marchandises, prix brut <strong>5 000 € HT</strong>, <strong>remise de 10 %</strong> accordée sur la facture. TVA 20 %. Règlement à 30 jours.<br>Enregistrez la facture.",
    hint: 'On enregistre le net commercial (prix brut − remise) : la remise elle-même n\'apparaît dans aucun compte. La TVA se calcule sur le net commercial.',
    parts: [{ lines: [D('607', 4500), D('44566', 900), C('401', 5400)] }],
    explanation:
      "<p>Remise : 5 000 × 10 % = 500 € → <strong>net commercial = 4 500 €</strong>. TVA = 4 500 × 20 % = 900 € ; TTC = 5 400 €.</p><p>Une remise <em>commerciale</em> figurant sur la facture n'est <strong>jamais comptabilisée</strong> : on enregistre directement le net commercial en charge (607).</p>",
  },
  {
    id: 'n2-02',
    level: 2,
    title: 'Escompte de règlement',
    statement:
      "Le 20 mars, le client « Hôtel de la Gare » règle par virement la facture n° V-017 (4 000 € HT + TVA 20 % = 4 800 € TTC) <strong>avant l'échéance</strong>. Il bénéficie d'un <strong>escompte de règlement de 2 % du montant HT</strong>, TVA régularisée sur l'escompte. Le virement reçu est de <strong>4 704 €</strong>.<br>Enregistrez l'encaissement.",
    hint: "Escompte accordé = charge financière (665) pour le montant HT. La TVA collectée est réduite d'autant (44571 au débit). Le compte client est soldé pour le TTC initial.",
    parts: [{ lines: [D('512', 4704), D('665', 80), D('44571', 16), C('411', 4800)] }],
    explanation:
      "<p>Escompte HT : 4 000 × 2 % = 80 €. TVA correspondante : 80 × 20 % = 16 €. Le client paie 4 800 − 96 = 4 704 €.</p><ul><li><strong>512</strong> : ce qui est réellement encaissé (4 704 €).</li><li><strong>665</strong> Escomptes accordés : charge financière (80 €) — c'est le « cadeau » fait au client pour payer vite.</li><li><strong>44571</strong> : la TVA collectée diminue de 16 € (on régularise l'excédent de TVA facturé).</li><li><strong>411</strong> : la créance est soldée pour son montant initial (4 800 €).</li></ul><p>4 704 + 80 + 16 = 4 800 ✔</p><p><em>À ne pas confondre</em> avec la remise : la remise est commerciale (jamais comptabilisée), l'escompte est financier (comptabilisé en 665 / 765).</p>",
  },
  {
    id: 'n2-03',
    level: 2,
    title: "Facture d'avoir (retour de marchandises)",
    statement:
      "Le 8 avril, vous retournez à « Vergers Duval » des marchandises défectueuses facturées <strong>1 000 € HT</strong> (TVA 20 %). Le fournisseur vous adresse la facture d'avoir n° AV-04 de <strong>1 200 € TTC</strong>. La facture initiale n'est pas encore réglée.<br>Enregistrez l'avoir reçu.",
    hint: "Un avoir annule (en tout ou partie) la facture : c'est l'écriture d'achat « à l'envers ».",
    parts: [{ lines: [D('401', 1200), C('607', 1000), C('44566', 200)] }],
    explanation:
      "<p>L'achat initial était : D 607 / D 44566 / C 401. L'avoir passe <strong>l'écriture inverse</strong> :</p><ul><li>401 au <strong>débit</strong> : la dette envers le fournisseur diminue de 1 200 € TTC ;</li><li>607 au <strong>crédit</strong> : la charge d'achat diminue de 1 000 € HT ;</li><li>44566 au <strong>crédit</strong> : la TVA déductible récupérable diminue de 200 €.</li></ul>",
  },
  {
    id: 'n2-04',
    level: 2,
    title: 'Vente avec port facturé',
    statement:
      "Le 14 avril, vente à « Boutique Zoé » de marchandises pour <strong>3 000 € HT</strong>. Vous facturez en plus <strong>150 € HT de frais de port</strong> (port forfaitaire). TVA 20 % sur l'ensemble. Paiement à 30 jours.<br>Enregistrez la facture de vente.",
    hint: 'Le port refacturé est un produit annexe (compte 7085). La TVA porte sur marchandises + port.',
    parts: [{ lines: [D('411', 3780), C('707', 3000), C('7085', 150), C('44571', 630)] }],
    explanation:
      "<p>Base de TVA : 3 000 + 150 = 3 150 € ; TVA = 630 € ; TTC = 3 780 €.</p><ul><li><strong>707</strong> Ventes de marchandises : 3 000 €.</li><li><strong>7085</strong> Ports et frais accessoires facturés : 150 € (produit annexe).</li><li><strong>44571</strong> TVA collectée : 630 €.</li><li><strong>411</strong> Clients : 3 780 € TTC.</li></ul>",
  },
  {
    id: 'n2-05',
    level: 2,
    title: 'Liquidation de la TVA',
    statement:
      "Au 30 avril, les comptes de TVA présentent : <strong>TVA collectée 5 600 €</strong> ; <strong>TVA déductible sur autres biens et services 2 900 €</strong> ; <strong>TVA déductible sur immobilisations 700 €</strong>. Il n'y a pas de crédit de TVA antérieur.<br>Enregistrez la liquidation de la TVA du mois.",
    hint: 'On solde les comptes de TVA : la collectée (crédit) se solde au débit, les déductibles (débit) se soldent au crédit. La différence est la TVA à décaisser (44551).',
    parts: [{ lines: [D('44571', 5600), C('44566', 2900), C('44562', 700), C('44551', 2000)] }],
    explanation:
      "<p>TVA à décaisser = collectée − déductible = 5 600 − (2 900 + 700) = <strong>2 000 €</strong>.</p><ul><li><strong>44571</strong> au débit : on solde la TVA collectée ;</li><li><strong>44566</strong> et <strong>44562</strong> au crédit : on solde les TVA déductibles ;</li><li><strong>44551</strong> au crédit : dette envers l'État à payer avec la déclaration.</li></ul><p>Débit 5 600 = Crédit 2 900 + 700 + 2 000 ✔</p>",
  },
  {
    id: 'n2-06',
    level: 2,
    title: 'Paiement de la TVA',
    statement:
      "Le 20 mai, vous payez par virement à l'administration fiscale la TVA à décaisser du mois d'avril (<strong>2 000 €</strong>), lors du dépôt de la déclaration CA3.<br>Enregistrez le paiement.",
    hint: "La dette de TVA à décaisser (44551) disparaît ; la banque diminue.",
    parts: [{ lines: [D('44551', 2000), C('512', 2000)] }],
    explanation:
      "<p>Le paiement solde la dette : <strong>44551</strong> TVA à décaisser au <strong>débit</strong> ; la banque (<strong>512</strong>) diminue → <strong>crédit</strong>.</p>",
  },

  // ======================================================================= NIVEAU 3
  {
    id: 'n3-01',
    level: 3,
    title: "Acquisition d'une immobilisation",
    statement:
      "Le 6 juin, vous achetez à « Info-Services » un ordinateur de bureau et ses périphériques pour <strong>2 400 € HT</strong> (TVA 20 %) — facture n° 5521 payable à 60 jours. Ce matériel servira plusieurs années.<br>Enregistrez la facture.",
    hint: "Un bien durable n'est pas une charge : c'est une immobilisation (classe 2). Le fournisseur est un « fournisseur d'immobilisations » (404) et la TVA se range dans un compte spécifique (44562).",
    parts: [{ lines: [D('2183', 2400), D('44562', 480), C('404', 2880)] }],
    explanation:
      "<p>TVA = 2 400 × 20 % = 480 € ; TTC = 2 880 €.</p><ul><li><strong>2183</strong> Matériel de bureau et informatique : immobilisation (actif) → débit HT.</li><li><strong>44562</strong> TVA déductible sur immobilisations → débit.</li><li><strong>404</strong> Fournisseurs d'immobilisations → crédit TTC.</li></ul>",
  },
  {
    id: 'n3-02',
    level: 3,
    title: 'Dotation aux amortissements',
    statement:
      "Au 31 décembre, vous constatez l'amortissement annuel de la camionnette de livraison (matériel de transport) acquise le 1er janvier pour <strong>30 000 € HT</strong>, amortie en <strong>linéaire sur 5 ans</strong> (sans valeur résiduelle).<br>Enregistrez la dotation de l'exercice.",
    hint: 'Annuité = valeur d\'origine ÷ durée. Charge : dotation (6811). Contrepartie : compte d\'amortissement du poste concerné (28…), jamais l\'immobilisation elle-même.',
    parts: [{ lines: [D('6811', 6000), C('28182', 6000)] }],
    explanation:
      "<p>Annuité = 30 000 ÷ 5 = <strong>6 000 €</strong>.</p><ul><li><strong>6811</strong> Dotations aux amortissements : charge d'exploitation → débit.</li><li><strong>28182</strong> Amortissements du matériel de transport : compte correcteur de l'actif → crédit. Le compte 2182 n'est <em>pas</em> touché : il garde sa valeur d'origine.</li></ul><p>Valeur nette comptable en fin d'année 1 : 30 000 − 6 000 = 24 000 €.</p>",
  },
  {
    id: 'n3-03',
    level: 3,
    title: 'Client douteux et dépréciation',
    statement:
      "Le client « Bar Chez Marcel » doit <strong>6 000 € TTC</strong> (5 000 € HT + 1 000 € de TVA). Il est placé en redressement judiciaire. Au 31 décembre, l'entreprise estime qu'elle perdra <strong>50 % de la créance HT</strong>.<br><strong>1)</strong> Reclassez la créance en « client douteux ». <strong>2)</strong> Constatez la dépréciation.",
    hint: "1) Transfert 411 → 416 pour le TTC. 2) La dépréciation se calcule sur le HT : dotation (6817, actif circulant) contre 491 Dépréciations des comptes clients.",
    parts: [
      { title: 'Écriture 1 — Reclassement en client douteux', lines: [D('416', 6000), C('411', 6000)] },
      { title: 'Écriture 2 — Dépréciation', lines: [D('6817', 2500), C('491', 2500)] },
    ],
    explanation:
      "<p><strong>1)</strong> La créance n'a pas disparu, elle change de compte : <strong>416</strong> Clients douteux ou litigieux au débit, <strong>411</strong> au crédit, pour 6 000 € TTC.</p><p><strong>2)</strong> La perte probable porte sur le HT (la TVA sera récupérée si la perte devient définitive) : 5 000 × 50 % = <strong>2 500 €</strong>. Dotation aux dépréciations des actifs circulants (<strong>6817</strong>, charge) contre <strong>491</strong> Dépréciations des comptes de clients (compte correcteur de l'actif).</p>",
  },
  {
    id: 'n3-04',
    level: 3,
    title: 'Écriture de salaire',
    statement:
      "Bulletin de paie de janvier de Mme Petit, vendeuse : <strong>salaire brut 2 500 €</strong> ; cotisations salariales retenues <strong>550 €</strong> ; net à payer <strong>1 950 €</strong>. Le salaire n'est pas encore versé.<br>Enregistrez la charge de salaire.",
    hint: "Le brut est une charge de personnel (641). Deux dettes naissent : envers la salariée (421, le net) et envers les organismes sociaux (431, les cotisations retenues).",
    parts: [{ lines: [D('641', 2500, ['6411']), C('431', 550), C('421', 1950)] }],
    explanation:
      "<p>Brut 2 500 = cotisations salariales 550 + net 1 950.</p><ul><li><strong>641</strong> Rémunérations du personnel : le salaire brut est la charge de l'entreprise → débit.</li><li><strong>431</strong> Sécurité sociale : les cotisations retenues sont dues aux organismes → crédit.</li><li><strong>421</strong> Personnel – rémunérations dues : le net à payer à la salariée → crédit.</li></ul>",
  },
  {
    id: 'n3-05',
    level: 3,
    title: 'Charges patronales',
    statement:
      "Pour le même bulletin, les <strong>cotisations patronales</strong> s'élèvent à <strong>1 000 €</strong> (dues à l'URSSAF et aux caisses de retraite et de prévoyance).<br>Enregistrez les charges sociales de l'employeur.",
    hint: "Ce sont des charges supplémentaires pour l'entreprise (645) ; la dette est envers les organismes sociaux (431).",
    parts: [{ lines: [D('645', 1000, ['6451']), C('431', 1000)] }],
    explanation:
      "<p>Les cotisations patronales sont un <strong>coût en plus du brut</strong> : <strong>645</strong> Charges de sécurité sociale et de prévoyance au débit ; la dette envers les organismes (<strong>431</strong>) au crédit.</p><p>Coût total pour l'employeur = 2 500 + 1 000 = 3 500 €.</p>",
  },
  {
    id: 'n3-06',
    level: 3,
    title: 'Paiement du salaire net',
    statement:
      "Le 31 janvier, vous versez par virement bancaire le salaire net de Mme Petit (<strong>1 950 €</strong>).<br>Enregistrez le paiement.",
    hint: 'La dette envers le personnel (421) disparaît ; la banque diminue.',
    parts: [{ lines: [D('421', 1950), C('512', 1950)] }],
    explanation:
      "<p>Le virement solde la dette : <strong>421</strong> au <strong>débit</strong> ; la banque <strong>512</strong> au <strong>crédit</strong>.</p>",
  },
  {
    id: 'n3-07',
    level: 3,
    title: 'Provision pour risque',
    statement:
      "Un ancien salarié conteste son licenciement devant le conseil de prud'hommes. Au 31 décembre, l'avocat estime que la condamnation de l'entreprise est <strong>probable</strong> pour un montant de <strong>12 000 €</strong>.<br>Enregistrez la provision.",
    hint: "Ce n'est pas une perte certaine : c'est une provision pour risques (compte 151…, litiges) avec une dotation en charge (6815).",
    parts: [{ lines: [D('6815', 12000, ['6875']), C('1511', 12000)] }],
    explanation:
      "<p>L'obligation existe (litige en cours), la sortie de ressources est probable mais son montant / son échéance est incertain : c'est une <strong>provision pour risques</strong>.</p><ul><li><strong>6815</strong> Dotations aux provisions d'exploitation : charge → débit.</li><li><strong>1511</strong> Provisions pour litiges : passif → crédit.</li></ul><p>Si le litige se règle ou disparaît, on fera une <em>reprise</em> : D 1511 / C 7815.</p>",
  },

  // ======================================================================= NIVEAU 4
  {
    id: 'n4-01',
    level: 4,
    title: "Cession d'immobilisation (2 écritures)",
    statement:
      "Le 31 décembre, vous cédez à un client un camion (matériel de transport) acquis <strong>30 000 € HT</strong>, <strong>amorti à hauteur de 18 000 €</strong> à cette date (la dotation de l'exercice est déjà comptabilisée). Prix de cession : <strong>9 000 € HT</strong> + TVA 20 % = 10 800 € TTC, à encaisser ultérieurement.<br><strong>1)</strong> Enregistrez la cession (créance et produit). <strong>2)</strong> Enregistrez la sortie du bien de l'actif.",
    hint: "1) Créance sur cession d'immobilisation (462), produit de cession (775) et TVA collectée. 2) Il faut solder l'immobilisation (2182) et ses amortissements (28182) ; la différence est la valeur nette comptable, charge exceptionnelle (675).",
    parts: [
      { title: 'Écriture 1 — Constatation de la cession', lines: [D('462', 10800), C('775', 9000), C('44571', 1800)] },
      { title: "Écriture 2 — Sortie du bien de l'actif", lines: [D('28182', 18000), D('675', 12000), C('2182', 30000)] },
    ],
    explanation:
      "<p><strong>1)</strong> Prix de cession HT 9 000 € (<strong>775</strong> Produits des cessions d'éléments d'actif), TVA 1 800 € (<strong>44571</strong>), créance TTC 10 800 € (<strong>462</strong> Créances sur cessions d'immobilisations).</p><p><strong>2)</strong> Valeur nette comptable (VNC) = 30 000 − 18 000 = <strong>12 000 €</strong>. On solde l'immobilisation (<strong>2182</strong> au crédit pour sa valeur d'origine), on solde les amortissements (<strong>28182</strong> au débit) et la VNC part en charge (<strong>675</strong> Valeurs comptables des éléments d'actif cédés).</p><p>Résultat de cession = 9 000 − 12 000 = <strong>moins-value de 3 000 €</strong>.</p>",
  },
  {
    id: 'n4-02',
    level: 4,
    title: "Charges constatées d'avance",
    statement:
      "Le 1er octobre, vous avez payé la prime annuelle d'assurance du local commercial : <strong>2 400 €</strong> pour 12 mois (du 01/10 au 30/09), enregistrée en charge (compte 616).<br>À la clôture du 31 décembre, passez l'écriture de régularisation.",
    hint: "Seuls 3 mois (octobre à décembre) concernent l'exercice. Les 9 autres mois concernent l'exercice suivant : charge constatée d'avance (486).",
    parts: [{ lines: [D('486', 1800), C('616', 1800)] }],
    explanation:
      "<p>Charge de l'exercice : 2 400 × 3/12 = 600 €. Charge de l'an prochain : 2 400 × 9/12 = <strong>1 800 €</strong>.</p><p>On <strong>retire</strong> 1 800 € des charges (<strong>616</strong> au crédit) et on les inscrit à l'actif en <strong>486</strong> Charges constatées d'avance (débit). Cette écriture sera extournée à l'ouverture de l'exercice suivant.</p>",
  },
  {
    id: 'n4-03',
    level: 4,
    title: "Produits constatés d'avance",
    statement:
      "Vous sous-louez une partie de vos locaux. Le 1er novembre, vous avez encaissé le loyer semestriel de <strong>3 600 €</strong> (6 mois, du 01/11 au 30/04), enregistré en produit (compte 7083).<br>À la clôture du 31 décembre, passez l'écriture de régularisation.",
    hint: 'Seuls 2 mois (novembre, décembre) appartiennent à l\'exercice. Le reste est un produit constaté d\'avance (487).',
    parts: [{ lines: [D('7083', 2400), C('487', 2400)] }],
    explanation:
      "<p>Produit de l'exercice : 3 600 × 2/6 = 1 200 €. Produit de l'an prochain : 3 600 × 4/6 = <strong>2 400 €</strong>.</p><p>On <strong>retire</strong> 2 400 € des produits (<strong>7083</strong> au débit) et on les inscrit au passif en <strong>487</strong> Produits constatés d'avance (crédit) : c'est une dette de service envers le locataire.</p>",
  },
  {
    id: 'n4-04',
    level: 4,
    title: 'Variation des stocks (2 écritures)',
    statement:
      "À l'inventaire du 31 décembre (inventaire intermittent) : <strong>stock initial de marchandises 18 000 €</strong>, <strong>stock final 21 500 €</strong>.<br><strong>1)</strong> Annulez le stock initial. <strong>2)</strong> Constatez le stock final.",
    hint: 'Compte de stock : 37. Compte de variation : 6037. Annuler le stock initial = le sortir du bilan (37 au crédit).',
    parts: [
      { title: 'Écriture 1 — Annulation du stock initial', lines: [D('6037', 18000), C('37', 18000)] },
      { title: 'Écriture 2 — Constatation du stock final', lines: [D('37', 21500), C('6037', 21500)] },
    ],
    explanation:
      "<p><strong>1)</strong> Le stock initial a été « consommé » par les ventes de l'année : <strong>6037</strong> au débit (charge), <strong>37</strong> au crédit (le stock initial sort du bilan).</p><p><strong>2)</strong> Le stock final compté à l'inventaire est inscrit au bilan : <strong>37</strong> au débit, <strong>6037</strong> au crédit (il vient en déduction des charges).</p><p>Variation de stock = SI − SF = 18 000 − 21 500 = −3 500 € : le compte 6037 est finalement <strong>créditeur de 3 500 €</strong> (le stock a augmenté, donc les charges de l'exercice diminuent).</p>",
  },
  {
    id: 'n4-05',
    level: 4,
    title: "Obtention d'un emprunt",
    statement:
      "Le 2 janvier, la banque accorde à l'entreprise un <strong>emprunt de 50 000 €</strong> sur 5 ans. Des <strong>frais de dossier de 500 €</strong> (exonérés de TVA) sont prélevés sur le montant versé : la banque crédite donc le compte de <strong>49 500 €</strong>.<br>Enregistrez l'opération.",
    hint: "Le capital emprunté est une dette de 50 000 € (164). Les frais de dossier sont des services bancaires (627). La banque n'augmente que du net reçu.",
    parts: [{ lines: [D('512', 49500), D('627', 500, ['6272']), C('164', 50000)] }],
    explanation:
      "<p>La dette envers la banque porte sur la totalité du capital emprunté : <strong>164</strong> Emprunts auprès des établissements de crédit → crédit 50 000 €.</p><p>L'entreprise ne reçoit que 49 500 € : <strong>512</strong> au débit. Les 500 € de frais sont une charge (<strong>627</strong> Services bancaires) au débit, sans TVA.</p><p>49 500 + 500 = 50 000 ✔</p>",
  },
  {
    id: 'n4-06',
    level: 4,
    title: "Échéance d'emprunt",
    statement:
      "L'emprunt de <strong>50 000 €</strong> est remboursable par <strong>amortissements constants de 10 000 € par an</strong>, au taux annuel de <strong>4 %</strong> (intérêts calculés sur le capital restant dû en début d'année). Le 31 décembre, la banque prélève la première échéance (<strong>12 000 €</strong>).<br>Enregistrez le prélèvement.",
    hint: 'Intérêts = capital restant dû × taux. L\'échéance = capital remboursé + intérêts : la partie « capital » diminue la dette (164), la partie « intérêts » est une charge financière (6611).',
    parts: [{ lines: [D('6611', 2000), D('164', 10000), C('512', 12000)] }],
    explanation:
      "<p>Intérêts de l'année 1 = 50 000 × 4 % = <strong>2 000 €</strong>. Échéance = 10 000 + 2 000 = 12 000 €.</p><ul><li><strong>6611</strong> Intérêts des emprunts : charge financière → débit.</li><li><strong>164</strong> Emprunts : la dette diminue de 10 000 € → débit.</li><li><strong>512</strong> Banque : sortie de 12 000 € → crédit.</li></ul><p>Nouveau capital restant dû : 40 000 €.</p>",
  },
];
