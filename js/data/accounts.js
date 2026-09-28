// Plan de comptes (inspiré du Plan Comptable Général français, ANC 2014-03) — classes 1 à 9.
// Format compact : une ligne = « numéro libellé ». La classe = 1er chiffre du numéro.
// Le parent d'un compte = le plus long compte existant dont le numéro en est un préfixe
// (ex. : 44551 -> 4455 -> 445 -> 44 -> classe 4).

const RAW = `
10 Capital et réserves
101 Capital
1013 Capital souscrit - appelé, versé
104 Primes liées au capital social
1041 Primes d'émission
105 Écarts de réévaluation
106 Réserves
1061 Réserve légale
1068 Autres réserves
108 Compte de l'exploitant
11 Report à nouveau
110 Report à nouveau (solde créditeur)
119 Report à nouveau (solde débiteur)
12 Résultat de l'exercice
120 Résultat de l'exercice (bénéfice)
129 Résultat de l'exercice (perte)
13 Subventions d'investissement
131 Subventions d'équipement
139 Subventions d'investissement inscrites au compte de résultat
14 Provisions réglementées
145 Amortissements dérogatoires
15 Provisions
151 Provisions pour risques
1511 Provisions pour litiges
1512 Provisions pour garanties données aux clients
1514 Provisions pour amendes et pénalités
1518 Autres provisions pour risques
153 Provisions pour pensions et obligations similaires
154 Provisions pour restructurations
155 Provisions pour impôts
158 Autres provisions pour charges
1582 Provisions pour charges sociales et fiscales sur congés à payer
16 Emprunts et dettes assimilées
161 Emprunts obligataires convertibles
163 Autres emprunts obligataires
164 Emprunts auprès des établissements de crédit
165 Dépôts et cautionnements reçus
166 Participation des salariés aux résultats
167 Emprunts et dettes assortis de conditions particulières
168 Autres emprunts et dettes assimilées
1681 Autres emprunts
1688 Intérêts courus
16884 Intérêts courus sur emprunts auprès des établissements de crédit
169 Primes de remboursement des obligations
17 Dettes rattachées à des participations
18 Comptes de liaison des établissements et sociétés en participation
181 Comptes de liaison des établissements
20 Immobilisations incorporelles
201 Frais d'établissement
203 Frais de recherche et de développement
205 Concessions et droits similaires, brevets, licences, marques, logiciels
206 Droit au bail
207 Fonds commercial
208 Autres immobilisations incorporelles
21 Immobilisations corporelles
211 Terrains
2111 Terrains nus
212 Agencements et aménagements de terrains
213 Constructions
2131 Bâtiments
214 Constructions sur sol d'autrui
215 Installations techniques, matériel et outillage industriels
2154 Matériel industriel
2155 Outillage industriel
218 Autres immobilisations corporelles
2181 Installations générales, agencements, aménagements divers
2182 Matériel de transport
2183 Matériel de bureau et matériel informatique
2184 Mobilier
2185 Cheptel
2186 Emballages récupérables
23 Immobilisations en cours
231 Immobilisations corporelles en cours
237 Avances et acomptes versés sur immobilisations incorporelles
238 Avances et acomptes versés sur commandes d'immobilisations corporelles
26 Participations et créances rattachées à des participations
261 Titres de participation
266 Autres formes de participation
267 Créances rattachées à des participations
27 Autres immobilisations financières
271 Titres immobilisés (droit de propriété)
274 Prêts
275 Dépôts et cautionnements versés
276 Autres créances immobilisées
28 Amortissements des immobilisations
280 Amortissements des immobilisations incorporelles
2805 Amortissements des concessions, brevets, licences, logiciels
2807 Amortissements du fonds commercial
281 Amortissements des immobilisations corporelles
2813 Amortissements des constructions
2815 Amortissements des installations techniques, matériel et outillage industriels
28154 Amortissements du matériel industriel
2818 Amortissements des autres immobilisations corporelles
28182 Amortissements du matériel de transport
28183 Amortissements du matériel de bureau et matériel informatique
28184 Amortissements du mobilier
29 Dépréciations des immobilisations
290 Dépréciations des immobilisations incorporelles
2907 Dépréciations du fonds commercial
291 Dépréciations des immobilisations corporelles
2911 Dépréciations des terrains
296 Dépréciations des participations et créances rattachées à des participations
2961 Dépréciations des titres de participation
297 Dépréciations des autres immobilisations financières
31 Matières premières (et fournitures)
311 Matières (ou groupe) A
312 Matières (ou groupe) B
32 Autres approvisionnements
321 Matières consommables
322 Fournitures consommables
3221 Combustibles
326 Emballages
33 En-cours de production de biens
331 Produits en cours
335 Travaux en cours
34 En-cours de production de services
341 Études en cours
345 Prestations de services en cours
35 Stocks de produits
355 Produits finis
358 Produits résiduels (ou matières de récupération)
37 Stocks de marchandises
371 Marchandises (ou groupe) A
372 Marchandises (ou groupe) B
39 Dépréciations des stocks et en-cours
391 Dépréciations des matières premières
392 Dépréciations des autres approvisionnements
395 Dépréciations des stocks de produits
397 Dépréciations des stocks de marchandises
40 Fournisseurs et comptes rattachés
401 Fournisseurs
4011 Fournisseurs - Achats de biens ou de prestations de services
403 Fournisseurs - Effets à payer
404 Fournisseurs d'immobilisations
408 Fournisseurs - Factures non parvenues
409 Fournisseurs débiteurs
4091 Fournisseurs - Avances et acomptes versés sur commandes
4096 Fournisseurs - Créances pour emballages et matériels à rendre
41 Clients et comptes rattachés
411 Clients
4111 Clients - Ventes de biens ou de prestations de services
413 Clients - Effets à recevoir
416 Clients douteux ou litigieux
418 Clients - Produits non encore facturés
4181 Clients - Factures à établir
419 Clients créditeurs
4191 Clients - Avances et acomptes reçus sur commandes
4196 Clients - Dettes sur emballages et matériels consignés
42 Personnel et comptes rattachés
421 Personnel - Rémunérations dues
424 Participation des salariés aux résultats
425 Personnel - Avances et acomptes
428 Personnel - Charges à payer et produits à recevoir
4282 Dettes provisionnées pour congés à payer
4286 Autres charges à payer
43 Sécurité sociale et autres organismes sociaux
431 Sécurité sociale
437 Autres organismes sociaux
438 Organismes sociaux - Charges à payer et produits à recevoir
4386 Autres charges à payer
44 État et autres collectivités publiques
441 État - Subventions à recevoir
442 État - Impôts et taxes recouvrables sur des tiers
4421 Prélèvement à la source (impôt sur le revenu)
444 État - Impôts sur les bénéfices
445 État - Taxes sur le chiffre d'affaires
4455 Taxes sur le chiffre d'affaires à décaisser
44551 TVA à décaisser
4456 Taxes sur le chiffre d'affaires déductibles
44562 TVA déductible sur immobilisations
44564 TVA sur prestations à l'encaissement (compte d'usage)
44566 TVA déductible sur autres biens et services (ABS)
44567 Crédit de TVA à reporter
4457 Taxes sur le chiffre d'affaires collectées par l'entreprise
44571 TVA collectée
44574 TVA sur encaissements (compte d'usage)
4458 Taxes sur le chiffre d'affaires à régulariser ou en attente
44583 Remboursement de taxe sur le chiffre d'affaires demandé
44586 Taxes sur le chiffre d'affaires sur factures non parvenues
44587 Taxes sur le chiffre d'affaires sur factures à établir
448 État - Charges à payer et produits à recevoir
45 Groupe et associés
455 Associés - Comptes courants
456 Associés - Opérations sur le capital
457 Associés - Dividendes à payer
46 Débiteurs divers et créditeurs divers
462 Créances sur cessions d'immobilisations
467 Autres comptes débiteurs ou créditeurs
468 Divers - Charges à payer et produits à recevoir
47 Comptes transitoires ou d'attente
471 Comptes d'attente
476 Différence de conversion - Actif
477 Différences de conversion - Passif
48 Comptes de régularisation
481 Charges à répartir sur plusieurs exercices
486 Charges constatées d'avance
487 Produits constatés d'avance
49 Dépréciations des comptes de tiers
491 Dépréciations des comptes de clients
495 Dépréciations des comptes du groupe et des associés
496 Dépréciations des comptes de débiteurs divers
50 Valeurs mobilières de placement
503 Actions
506 Obligations
51 Banques, établissements financiers et assimilés
511 Valeurs à l'encaissement
5112 Chèques à encaisser
5113 Effets à l'encaissement
5114 Effets à l'escompte
512 Banques
5121 Banques - Comptes en euros
514 Chèques postaux
518 Intérêts courus
519 Concours bancaires courants
53 Caisse
530 Caisse
531 Caisse siège social
58 Virements internes
580 Virements internes
59 Dépréciations des comptes financiers
60 Achats (sauf 603)
601 Achats stockés - Matières premières (et fournitures)
6011 Matières premières (ou groupe) A
602 Achats stockés - Autres approvisionnements
6021 Matières consommables
6022 Fournitures consommables
60221 Combustibles
60222 Produits d'entretien
60223 Fournitures d'atelier et d'usine
60224 Fournitures de magasin
60225 Fournitures de bureau
60261 Emballages perdus
60265 Emballages récupérables non identifiables
603 Variations des stocks (approvisionnements et marchandises)
6031 Variation des stocks de matières premières (et fournitures)
6037 Variation des stocks de marchandises
604 Achats d'études et prestations de services
605 Achats de matériel, équipements et travaux
606 Achats non stockés de matières et fournitures
6061 Fournitures non stockables (eau, énergie...)
6063 Fournitures d'entretien et de petit équipement
6064 Fournitures administratives
6068 Autres matières et fournitures
607 Achats de marchandises
6071 Achats de marchandises (ou groupe) A
608 Frais accessoires d'achat (compte récapitulatif)
609 Rabais, remises et ristournes obtenus sur achats
61 Services extérieurs
611 Sous-traitance générale
612 Redevances de crédit-bail
6122 Crédit-bail mobilier
6125 Crédit-bail immobilier
613 Locations
6132 Locations immobilières
6135 Locations mobilières
6136 Malis sur emballages rendus
614 Charges locatives et de copropriété
615 Entretien et réparations
6152 Entretien et réparations sur biens immobiliers
6155 Entretien et réparations sur biens mobiliers
6156 Maintenance
616 Primes d'assurances
6161 Assurance multirisques
617 Études et recherches
618 Divers
6181 Documentation générale
6183 Documentation technique
6185 Frais de colloques, séminaires, conférences
62 Autres services extérieurs
621 Personnel extérieur à l'entreprise
6211 Personnel intérimaire
6214 Personnel détaché ou prêté à l'entreprise
622 Rémunérations d'intermédiaires et honoraires
6221 Commissions et courtages sur achats
6222 Commissions et courtages sur ventes
6224 Rémunérations des transitaires
6226 Honoraires
6227 Frais d'actes et de contentieux
6228 Divers (rémunérations d'intermédiaires)
623 Publicité, publications, relations publiques
6231 Annonces et insertions
6232 Échantillons
6234 Cadeaux à la clientèle
6236 Catalogues et imprimés
6237 Publications
6238 Divers (pourboires, dons courants...)
624 Transports de biens et transports collectifs du personnel
6241 Transports sur achats
6242 Transports sur ventes
6244 Transports administratifs
625 Déplacements, missions et réceptions
6251 Voyages et déplacements
6255 Frais de déménagement
6256 Missions
626 Frais postaux et frais de télécommunications
627 Services bancaires et assimilés
6272 Commissions et frais sur émission d'emprunts
628 Divers
6281 Concours divers (cotisations...)
63 Impôts, taxes et versements assimilés
631 Impôts, taxes et versements assimilés sur rémunérations (administrations des impôts)
633 Impôts, taxes et versements assimilés sur rémunérations (autres organismes)
635 Autres impôts, taxes et versements assimilés (administrations des impôts)
6352 Taxe sur le chiffre d'affaires non récupérable
64 Charges de personnel
641 Rémunérations du personnel
6411 Salaires, appointements
645 Charges de sécurité sociale et de prévoyance
6451 Cotisations à l'URSSAF
65 Autres charges de gestion courante
651 Redevances pour concessions, brevets, licences, marques, procédés, logiciels
653 Jetons de présence
654 Pertes sur créances irrécouvrables
6541 Créances de l'exercice
6544 Créances des exercices antérieurs
658 Charges diverses de gestion courante
66 Charges financières
661 Charges d'intérêts
6611 Intérêts des emprunts et dettes
665 Escomptes accordés
666 Pertes de change
668 Autres charges financières
67 Charges exceptionnelles
671 Charges exceptionnelles sur opérations de gestion
6712 Pénalités, amendes fiscales et pénales
6714 Créances devenues irrécouvrables dans l'exercice
675 Valeurs comptables des éléments d'actif cédés
6752 Valeurs comptables des immobilisations corporelles cédées
678 Autres charges exceptionnelles
68 Dotations aux amortissements, aux dépréciations et aux provisions
681 Dotations - Charges d'exploitation
6811 Dotations aux amortissements des immobilisations incorporelles et corporelles
6815 Dotations aux provisions d'exploitation
6816 Dotations aux dépréciations des immobilisations incorporelles et corporelles
6817 Dotations aux dépréciations des actifs circulants
686 Dotations - Charges financières
687 Dotations - Charges exceptionnelles
6875 Dotations aux provisions exceptionnelles
69 Participation des salariés - Impôts sur les bénéfices et assimilés
691 Participation des salariés aux résultats
695 Impôts sur les bénéfices
6951 Impôts dus en France
697 Imposition forfaitaire annuelle des sociétés
70 Ventes de produits fabriqués, prestations de services, marchandises
701 Ventes de produits finis
702 Ventes de produits intermédiaires
703 Ventes de produits résiduels
704 Travaux
705 Études
706 Prestations de services
707 Ventes de marchandises
7071 Ventes de marchandises (ou groupe) A
708 Produits des activités annexes
7081 Produits des services exploités dans l'intérêt du personnel
7082 Commissions et courtages
7083 Locations diverses
7085 Ports et frais accessoires facturés
7086 Bonis sur reprises d'emballages consignés
709 Rabais, remises et ristournes accordés par l'entreprise
71 Production stockée (ou déstockage)
713 Variation des stocks (en-cours de production, produits)
71355 Variation des stocks de produits finis
72 Production immobilisée
74 Subventions d'exploitation
75 Autres produits de gestion courante
751 Redevances pour concessions, brevets, licences, marques, procédés, logiciels
752 Revenus des immeubles non affectés à des activités professionnelles
758 Produits divers de gestion courante
76 Produits financiers
761 Produits de participations
762 Produits des autres immobilisations financières
763 Revenus des autres créances
764 Revenus des valeurs mobilières de placement
765 Escomptes obtenus
766 Gains de change
767 Produits nets sur cessions de valeurs mobilières de placement
768 Autres produits financiers
77 Produits exceptionnels
771 Produits exceptionnels sur opérations de gestion
775 Produits des cessions d'éléments d'actif
778 Autres produits exceptionnels
78 Reprises sur amortissements, dépréciations et provisions
781 Reprises - Produits d'exploitation
7811 Reprises sur amortissements des immobilisations incorporelles et corporelles
7815 Reprises sur provisions d'exploitation
7817 Reprises sur dépréciations des actifs circulants
79 Transferts de charges
791 Transferts de charges d'exploitation
80 Engagements
801 Engagements donnés par l'entité
802 Engagements reçus par l'entité
809 Contrepartie des engagements
88 Résultat en instance d'affectation
880 Résultat en instance d'affectation : bénéfice
889 Résultat en instance d'affectation : perte
89 Bilan
890 Bilan d'ouverture
891 Bilan de clôture
90 Comptes réciproques (reflets de la comptabilité générale)
901 Reflet des comptes de charges (classe 6)
902 Reflet des comptes de produits (classe 7)
91 Comptes de reclassement des charges par nature
911 Reclassement - Achats
912 Reclassement - Services extérieurs
913 Reclassement - Impôts et taxes
914 Reclassement - Charges de personnel
915 Reclassement - Charges financières
92 Centres d'analyse
921 Centres auxiliaires
922 Centres principaux
93 Coûts de production des produits fabriqués
931 Coût d'achat des matières premières
932 Coût de production
933 Coût de production des produits vendus
94 Stocks (comptabilité analytique)
945 Stocks de produits
95 Coûts hors production
96 Écarts sur coûts préétablis
97 Différences de traitement comptable
98 Résultats de l'analytique
981 Coût de revient des produits vendus
982 Chiffre d'affaires analytique
983 Résultat analytique sur produits
99 Comptes de liaison internes
1011 Capital souscrit - non appelé
1012 Capital souscrit - appelé, non versé
1062 Réserves indisponibles
1063 Réserves statutaires ou contractuelles
1064 Réserves réglementées
1513 Provisions pour pertes sur marchés à terme
1515 Provisions pour pertes de change
1516 Provisions pour pertes sur contrats
156 Provisions pour renouvellement des immobilisations
2011 Frais de constitution
2012 Frais de premier établissement
2013 Frais d'augmentation de capital et d'opérations diverses
2135 Installations générales, agencements, aménagements des constructions
2151 Installations complexes spécialisées
2153 Installations à caractère spécifique
2312 Terrains en cours
2313 Constructions en cours
2315 Installations techniques, matériel et outillage industriels en cours
2751 Dépôts versés
2755 Cautionnements versés
28155 Amortissements de l'outillage industriel
28181 Amortissements des installations générales, agencements et aménagements divers
28185 Amortissements du cheptel
2801 Amortissements des frais d'établissement
2808 Amortissements des autres immobilisations incorporelles
3222 Produits d'entretien (stock)
3223 Fournitures d'atelier et d'usine (stock)
3224 Fournitures de magasin (stock)
3225 Fournitures de bureau (stock)
351 Produits intermédiaires (stock)
393 Dépréciations des en-cours de production de biens
394 Dépréciations des en-cours de production de services
4017 Fournisseurs - Retenues de garantie
4081 Fournisseurs - Factures non parvenues (exploitation)
4084 Fournisseurs d'immobilisations - Factures non parvenues
4088 Fournisseurs - Intérêts courus
4097 Fournisseurs - Autres avoirs
4098 Rabais, remises, ristournes à obtenir et autres avoirs non encore reçus
4117 Clients - Retenues de garantie
4188 Clients - Intérêts courus
4197 Clients - Autres avoirs
4198 Rabais, remises, ristournes à accorder et autres avoirs à établir
4287 Personnel - Produits à recevoir
4382 Charges sociales sur congés à payer
4387 Organismes sociaux - Produits à recevoir
4411 État - Subventions d'investissement à recevoir
4417 État - Subventions d'exploitation à recevoir
4486 État - Charges à payer
4487 État - Produits à recevoir
44563 TVA transférée par d'autres entreprises
44581 Acomptes - Régime simplifié d'imposition
44584 TVA récupérée d'avance
4562 Apporteurs - Capital appelé, non versé
4563 Associés - Versements reçus sur augmentation de capital
464 Dettes sur acquisitions de valeurs mobilières de placement
465 Créances sur cessions de valeurs mobilières de placement
4686 Divers - Charges à payer
4687 Divers - Produits à recevoir
4816 Frais d'émission des emprunts
4955 Dépréciations des comptes courants d'associés
4962 Dépréciations des créances sur cessions d'immobilisations
532 Caisse succursale (ou usine) A
533 Caisse succursale (ou usine) B
6012 Matières premières (ou groupe) B
6017 Fournitures A, B, C
60267 Emballages à usage mixte
6026 Emballages
6032 Variation des stocks des autres approvisionnements
6072 Achats de marchandises (ou groupe) B
6094 Rabais, remises et ristournes obtenus sur études et prestations de services
6097 Rabais, remises et ristournes obtenus sur marchandises
6452 Cotisations aux mutuelles
6453 Cotisations aux caisses de retraites
6511 Redevances pour concessions, brevets, licences, marques, procédés
7011 Ventes de produits finis (ou groupe) A
7084 Mise à disposition de personnel facturée
7087 Bonifications obtenues des clients et des fournisseurs
7088 Autres produits d'activités annexes
7096 Rabais, remises et ristournes accordés sur prestations de services
7097 Rabais, remises et ristournes accordés sur ventes de marchandises
8011 Avals, cautions, garanties donnés
8021 Avals, cautions, garanties reçus
8091 Contrepartie 801
8092 Contrepartie 802
86 Emplois des contributions volontaires en nature
903 Reflet des comptes de stocks (classe 3)
916 Charges supplétives
917 Charges non incorporables
9221 Centre approvisionnement
9222 Centre production
9223 Centre distribution
7875 Reprises sur provisions exceptionnelles
`;

/** Intitulés des 9 classes. */
export const CLASSES = {
  1: 'Comptes de capitaux',
  2: "Comptes d'immobilisations",
  3: 'Comptes de stocks et en-cours',
  4: 'Comptes de tiers',
  5: 'Comptes financiers',
  6: 'Comptes de charges',
  7: 'Comptes de produits',
  8: 'Comptes spéciaux',
  9: 'Comptabilité analytique',
};

/** Tous les comptes : [{ num, label, cls }], triés par numéro (les préfixes précèdent leurs sous-comptes). */
export const ACCOUNTS = RAW.trim()
  .split('\n')
  .map((line) => {
    const i = line.indexOf(' ');
    const num = line.slice(0, i);
    return { num, label: line.slice(i + 1).trim(), cls: Number(num[0]) };
  })
  .sort((a, b) => (a.num < b.num ? -1 : a.num > b.num ? 1 : 0));

export const ACCOUNT_MAP = new Map(ACCOUNTS.map((a) => [a.num, a]));

export const accountExists = (num) => ACCOUNT_MAP.has(String(num).trim());

/** Libellé d'un compte, ou null s'il n'existe pas. */
export const accountLabel = (num) => ACCOUNT_MAP.get(String(num).trim())?.label ?? null;

/**
 * Comptes considérés comme équivalents lors de la correction
 * (le compte de la 1re colonne du groupe ou n'importe quel autre du groupe est accepté).
 */
export const EQUIV_GROUPS = [
  ['53', '530', '531'], // caisse
  ['401', '4011'], // fournisseurs
  ['411', '4111'], // clients
  ['512', '5121'], // banque
  ['607', '6071'], // achats de marchandises
  ['707', '7071'], // ventes de marchandises
  ['37', '371'], // stocks de marchandises
  ['641', '6411'], // rémunérations du personnel
  ['645', '6451'], // charges sociales patronales
];

const EQUIV = new Map();
for (const group of EQUIV_GROUPS) for (const n of group) EQUIV.set(n, group);

/** Vrai si `given` est le compte attendu `expected` (ou l'un de ses équivalents / `alt`). */
export function sameAccount(given, expected, alt = []) {
  const g = String(given).trim();
  const e = String(expected).trim();
  if (g === e || alt.includes(g)) return true;
  return (EQUIV.get(e) ?? []).includes(g);
}

// ---------------------------------------------------------------- arborescence
/**
 * Construit l'arborescence : classes 1..9 -> comptes.
 * Le parent d'un compte est le plus long compte existant dont le numéro en est un préfixe strict.
 * @returns {{ roots: Node[], byNum: Map<string, Node> }}
 *   Node = { num, label, cls, children: Node[], parent: Node|null, isClass?: true }
 */
export function buildTree() {
  const roots = Object.entries(CLASSES).map(([n, label]) => ({
    num: n,
    label: `Classe ${n} — ${label}`,
    cls: Number(n),
    children: [],
    parent: null,
    isClass: true,
  }));
  const byNum = new Map(roots.map((r) => [r.num, r]));
  for (const a of ACCOUNTS) byNum.set(a.num, { ...a, children: [], parent: null });
  for (const a of ACCOUNTS) {
    const node = byNum.get(a.num);
    let parent = null;
    for (let len = a.num.length - 1; len >= 1 && !parent; len--) {
      parent = byNum.get(a.num.slice(0, len)) ?? null;
    }
    node.parent = parent;
    parent.children.push(node);
  }
  return { roots, byNum };
}
