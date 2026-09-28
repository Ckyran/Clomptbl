// Contenu du cours : 17 leçons, chacune expliquée de 3 façons (enfant, jeune, adulte).
//
// Une leçon : { id, icon, title, practice, levels: { kid, teen, adult } }
// Un niveau : { html, entries? }   (le HTML est du contenu statique de confiance)
// Une écriture d'exemple : { title, note?, lines: [[compte, débit, crédit], ...] }
//   - montants : nombre (contrôlé automatiquement : débit = crédit) ou texte symbolique ('HT', 'TVA', 'TTC')
//   - le libellé du compte est ajouté automatiquement à partir du plan de comptes.

const tip = (t) => `<div class="callout tip"><strong>💡 À retenir</strong><p>${t}</p></div>`;
const warn = (t) => `<div class="callout warn"><strong>⚠️ Attention</strong><p>${t}</p></div>`;
const play = (t) => `<div class="callout play"><strong>🎯 À toi de jouer</strong><p>${t}</p></div>`;

export const LESSONS = [
  // ------------------------------------------------------------------ 1
  {
    id: 1,
    icon: '📒',
    title: 'À quoi sert la comptabilité',
    practice: 1,
    levels: {
      kid: {
        html: `
<p>Imagine que tu tiens un <strong>stand de limonade</strong>. Pour savoir si tu gagnes de l'argent, tu as besoin d'un <strong>grand cahier</strong> où tu écris tout ce qui se passe : les citrons que tu achètes, les verres que tu vends, l'argent que tu ranges dans ta tirelire. Ce cahier, c'est la <strong>comptabilité</strong>.</p>
<p>Ce cahier te donne deux « images » de ton stand :</p>
<ul>
  <li>📸 <strong>La photo du jour (le bilan)</strong> : ce que tu <em>as</em> (ta tirelire, tes citrons, ton pichet) et ce que tu <em>dois</em> (les 5 € que ta grande sœur t'a prêtés).</li>
  <li>🎬 <strong>Le film de l'été (le compte de résultat)</strong> : tout l'argent que tu as <em>gagné</em> en vendant ta limonade, et tout celui que tu as <em>dépensé</em> pour la fabriquer.</li>
</ul>
<p>Si tu as gagné plus que dépensé, tu as fait un <strong>bénéfice</strong> 🎉. Si tu as dépensé plus que gagné, c'est une <strong>perte</strong>.</p>
${tip("La comptabilité répond à deux questions : « Qu'est-ce que j'ai et qu'est-ce que je dois ? » (la photo) et « Est-ce que je gagne de l'argent ? » (le film).")}
${play('Dans ta chambre, qu\'est-ce qui ressemble à la « photo » (ce que tu possèdes) et qu\'est-ce qui ressemble au « film » (ton argent de poche qui entre et qui sort) ?')}`,
      },
      teen: {
        html: `
<p>Une entreprise doit suivre son activité <strong>chiffre par chiffre</strong> : combien elle possède, combien elle doit, combien elle gagne. La comptabilité enregistre chaque opération pour que le patron, la banque, les associés et l'administration fiscale sachent où en est l'entreprise. C'est aussi <strong>obligatoire</strong> pour presque toutes les entreprises.</p>
<p>À la fin de chaque <strong>exercice</strong> (en général 12 mois), on établit deux documents principaux :</p>
<table class="mini">
  <thead><tr><th>Le bilan (une photo à une date)</th><th>Le compte de résultat (un film sur l'année)</th></tr></thead>
  <tbody>
    <tr><td><strong>Actif</strong> : ce que l'entreprise possède (local, machines, stocks, argent en banque, sommes que les clients lui doivent).<br><strong>Passif</strong> : d'où viennent ces moyens (capital des associés, emprunts, dettes envers les fournisseurs).</td>
        <td><strong>Charges</strong> : ce qu'elle dépense (achats, loyers, salaires...).<br><strong>Produits</strong> : ce qu'elle gagne (ventes, services facturés...).</td></tr>
  </tbody>
</table>
<p>Une règle d'or : <strong>Actif = Passif</strong>. Tout ce que l'entreprise possède a bien été financé par quelqu'un (les associés ou des créanciers).</p>
<p>Le <strong>résultat</strong> de l'année est simple : <strong>Produits − Charges</strong>. Positif : bénéfice. Négatif : perte.</p>
${tip('Bilan = ce que je possède et ce que je dois à une date. Compte de résultat = ce que j\'ai gagné et dépensé pendant l\'année.')}`,
      },
      adult: {
        html: `
<p>La comptabilité est un <strong>système d'information</strong> qui enregistre de façon chronologique, exhaustive et justifiée les opérations d'une entité afin d'en donner une <strong>image fidèle</strong> (patrimoine, situation financière, résultat). En France, elle est encadrée par le Code de commerce et le <strong>Plan Comptable Général</strong> (règlement ANC n° 2014-03).</p>
<p><strong>Principes fondamentaux :</strong> prudence, continuité d'exploitation, permanence des méthodes, indépendance des exercices, coût historique, non-compensation.</p>
<table class="mini">
  <thead><tr><th>Bilan (situation à la date de clôture)</th><th>Compte de résultat (flux de l'exercice)</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>Actif</strong> : actif immobilisé (classe 2), stocks (3), créances (4), trésorerie (5).<br><strong>Passif</strong> : capitaux propres (10-13), provisions (15), dettes financières (16), dettes d'exploitation (40, 42-44...).</td>
      <td><strong>Charges</strong> (classe 6) : d'exploitation, financières, exceptionnelles.<br><strong>Produits</strong> (classe 7) : idem.<br><strong>Résultat</strong> = produits − charges, viré aux capitaux propres (compte 12).</td>
    </tr>
  </tbody>
</table>
<p>Les deux documents sont liés : le résultat du compte de résultat est aussi la dernière ligne du passif du bilan. Les exemples ci-dessous montrent comment une même opération se lit tantôt dans le bilan, tantôt dans le compte de résultat.</p>
${tip("Une opération qui échange un actif contre un autre (ou contre une dette) ne change que le bilan. Une opération qui met en jeu une charge ou un produit modifie le résultat.")}`,
        entries: [
          {
            title: 'Apport en capital : opération de bilan uniquement',
            note: 'La banque (actif) et le capital (passif) augmentent : le compte de résultat n\'est pas touché.',
            lines: [['512', 20000, null], ['101', null, 20000]],
          },
          {
            title: 'Vente de marchandises à crédit : le compte de résultat est concerné',
            note: 'Le produit (707) augmente le résultat ; la créance (411) grossit l\'actif ; la TVA collectée est une dette.',
            lines: [['411', 1800, null], ['707', null, 1500], ['44571', null, 300]],
          },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 2
  {
    id: 2,
    icon: '⚖️',
    title: 'Le principe de la partie double',
    practice: 1,
    levels: {
      kid: {
        html: `
<p>Regarde une <strong>balançoire</strong> 🎠 : pour qu'elle reste bien droite, il faut le même poids des deux côtés. La comptabilité fonctionne pareil : <strong>chaque chose qui se passe a deux côtés</strong>.</p>
<p>Exemple : tu achètes un cahier à 2 € avec l'argent de ta tirelire.</p>
<ul>
  <li>Côté 1 : tu as <strong>un cahier de plus</strong> 📓.</li>
  <li>Côté 2 : tu as <strong>2 € de moins</strong> dans ta tirelire 🐷.</li>
</ul>
<p>Dans le grand cahier de comptes, on écrit toujours <strong>les deux côtés</strong>, et le total à gauche est <strong>égal</strong> au total à droite. Si ce n'est pas le cas, c'est qu'on a fait une erreur !</p>
${tip("Une opération = deux écritures : « où est allé l'argent ? » (à gauche) et « d'où venait-il ? » (à droite). Les deux totaux sont toujours égaux.")}
${play("Ta maman te donne 5 € d'argent de poche. Quels sont les deux côtés ? (indice : ta tirelire grossit, et l'argent vient de...)")}`,
      },
      teen: {
        html: `
<p>La comptabilité repose sur la <strong>partie double</strong> : chaque opération est enregistrée <strong>deux fois</strong>, sous deux angles différents.</p>
<ul>
  <li>Le <strong>débit</strong> (à gauche) répond à : « <em>Où est passé l'argent ? Qu'est-ce que j'ai obtenu ?</em> » → l'<strong>emploi</strong>.</li>
  <li>Le <strong>crédit</strong> (à droite) répond à : « <em>D'où venait-il ? Qui l'a fourni ?</em> » → la <strong>ressource</strong>.</li>
</ul>
<p>Exemple : je paie une facture de 3 000 € par virement. L'emploi : ma dette envers le fournisseur disparaît (débit du compte Fournisseurs). La ressource : l'argent est sorti de ma banque (crédit du compte Banque).</p>
<p>Le total des débits est <strong>toujours égal</strong> au total des crédits, même si une opération touche 3 ou 4 comptes (par exemple un achat avec TVA).</p>
${tip('Pour chaque opération, cherche : ce que j\'ai obtenu (débit) et ce qui a financé ou ce que j\'ai donné (crédit). Débit total = Crédit total.')}`,
      },
      adult: {
        html: `
<p>Toute opération comptable affecte <strong>au moins deux comptes</strong> : un ou plusieurs comptes sont <strong>débités</strong>, un ou plusieurs comptes sont <strong>crédités</strong>, et la somme des débits est égale à la somme des crédits (équation fondamentale : <em>Σ débits = Σ crédits</em>). Cette égalité découle de l'identité comptable <em>Actif = Passif</em>.</p>
<p>Une <strong>écriture</strong> comporte : la date, le journal, le numéro de pièce justificative, les numéros et libellés de comptes, le montant au débit ou au crédit, et un libellé explicatif. Une écriture peut être « simple » (1 compte débité, 1 compte crédité) ou « composée » (plusieurs lignes).</p>
<p>Lecture : <strong>débit = emploi</strong> (destination, ce qui entre ou ce qui est consommé), <strong>crédit = ressource</strong> (origine, ce qui sort ou ce qui est fourni).</p>
${warn("On ne « débite » pas un compte pour dire que le compte « diminue » : débiter un compte d'actif l'augmente, débiter un compte de dette la diminue. Le sens dépend de la nature du compte (leçon suivante).")}`,
        entries: [
          {
            title: 'Écriture simple : règlement d\'un fournisseur par virement',
            lines: [['401', 3000, null], ['512', null, 3000]],
          },
          {
            title: 'Écriture composée : achat de marchandises payé immédiatement par carte',
            note: '2 500 € HT + 500 € de TVA = 3 000 € TTC ; deux débits (charge + TVA), un crédit.',
            lines: [['607', 2500, null], ['44566', 500, null], ['512', null, 3000]],
          },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 3
  {
    id: 3,
    icon: '↔️',
    title: 'Débit & crédit (sens selon la nature du compte)',
    practice: 1,
    levels: {
      kid: {
        html: `
<p>Dans le grand cahier, chaque page a <strong>deux colonnes</strong> : celle de <strong>gauche</strong> (le <strong>débit</strong>) et celle de <strong>droite</strong> (le <strong>crédit</strong>). Il n'y a pas de « bon » ou de « mauvais » côté ! Tout dépend de <em>ce qu'on note</em> :</p>
<table class="mini">
  <thead><tr><th>De quoi parle la page ?</th><th>Ça augmente → j'écris à...</th><th>Ça diminue → j'écris à...</th></tr></thead>
  <tbody>
    <tr><td>🐷 Ce que j'<strong>ai</strong> (tirelire, jouets)</td><td><strong>gauche</strong></td><td>droite</td></tr>
    <tr><td>🤝 Ce que je <strong>dois</strong>, ou d'où vient mon argent</td><td><strong>droite</strong></td><td>gauche</td></tr>
    <tr><td>🛒 Ce que je <strong>dépense</strong></td><td><strong>gauche</strong></td><td>droite</td></tr>
    <tr><td>💰 Ce que je <strong>gagne</strong></td><td><strong>droite</strong></td><td>gauche</td></tr>
  </tbody>
</table>
${tip("Ce que j'ai et ce que je dépense : à gauche. Ce que je dois et ce que je gagne : à droite.")}
${play("Tu vends un gâteau 3 € et on te paie tout de suite. Ta tirelire (ce que tu as) grossit : gauche ou droite ? Et ce que tu gagnes ?")}`,
      },
      teen: {
        html: `
<p>Le sens (débit ou crédit) dépend de la <strong>nature du compte</strong> :</p>
<table class="mini">
  <thead><tr><th>Nature du compte</th><th>Exemples</th><th>Augmente au…</th><th>Diminue au…</th></tr></thead>
  <tbody>
    <tr><td><strong>Actif</strong> (ce que je possède)</td><td>Banque, caisse, stocks, clients, matériel</td><td>Débit</td><td>Crédit</td></tr>
    <tr><td><strong>Passif</strong> (ce que je dois / capitaux)</td><td>Capital, emprunts, fournisseurs, TVA à payer</td><td>Crédit</td><td>Débit</td></tr>
    <tr><td><strong>Charge</strong> (ce que je dépense)</td><td>Achats, loyers, salaires</td><td>Débit</td><td>Crédit</td></tr>
    <tr><td><strong>Produit</strong> (ce que je gagne)</td><td>Ventes, intérêts reçus</td><td>Crédit</td><td>Débit</td></tr>
  </tbody>
</table>
<p>Astuce : les <strong>emplois</strong> (ce que je possède et ce que je dépense) sont à <strong>gauche</strong> ; les <strong>ressources</strong> (ce que je dois et ce que je gagne) sont à <strong>droite</strong>.</p>
<p>Un compte normal a un <strong>solde</strong> du même côté que son sens d'augmentation : la banque est normalement débitrice, le compte fournisseurs normalement créditeur.</p>
${tip("Actif et charges : + au débit. Passif et produits : + au crédit. Et quand ça diminue, c'est le côté inverse.")}`,
      },
      adult: {
        html: `
<p>Règle générale du sens des comptes :</p>
<table class="mini">
  <thead><tr><th>Type</th><th>Classes</th><th>Débit</th><th>Crédit</th><th>Solde normal</th></tr></thead>
  <tbody>
    <tr><td>Actif</td><td>2, 3, 5, une partie de la 4 (411, 4456...)</td><td>Augmentation</td><td>Diminution</td><td>Débiteur</td></tr>
    <tr><td>Passif</td><td>1, une partie de la 4 (401, 421, 431, 4457...)</td><td>Diminution</td><td>Augmentation</td><td>Créditeur</td></tr>
    <tr><td>Charges</td><td>6</td><td>Augmentation</td><td>Diminution</td><td>Débiteur</td></tr>
    <tr><td>Produits</td><td>7</td><td>Diminution</td><td>Augmentation</td><td>Créditeur</td></tr>
  </tbody>
</table>
<p><strong>Cas particuliers à connaître :</strong></p>
<ul>
  <li>Les <strong>amortissements</strong> (28), <strong>dépréciations</strong> (29, 39, 49, 59) sont des comptes <em>correcteurs d'actif</em> : ils figurent au passif du plan mais se présentent en <strong>déduction</strong> de l'actif ; leur solde est créditeur.</li>
  <li>Les comptes <strong>609</strong> (RRR obtenus) et <strong>709</strong> (RRR accordés) sont des comptes de charges / produits « à l'envers » : 609 est créditeur, 709 est débiteur.</li>
  <li>Les comptes de tiers peuvent avoir un solde débiteur ou créditeur selon la situation : 401 est normalement créditeur, mais 409 (fournisseurs débiteurs) est débiteur ; 411 débiteur, 419 (clients créditeurs) créditeur.</li>
  <li>Le résultat : 120 (bénéfice, créditeur) ; 129 (perte, débiteur). Le report à nouveau : 110 créditeur, 119 débiteur.</li>
</ul>
${warn("Pour un compte de dette comme 401, « débiter » signifie <em>diminuer</em> la dette (paiement, avoir), alors que pour une charge comme 607, « débiter » signifie <em>augmenter</em> la charge.")}`,
        entries: [
          {
            title: 'Encaissement d\'un client : un actif remplace un autre',
            note: '512 augmente (débit), 411 diminue (crédit).',
            lines: [['512', 1200, null], ['411', null, 1200]],
          },
          {
            title: 'Achat de marchandises à crédit : charge et dette',
            note: '607 (charge) augmente au débit ; 401 (dette) augmente au crédit.',
            lines: [['607', 1000, null], ['44566', 200, null], ['401', null, 1200]],
          },
          {
            title: 'Remboursement d\'un emprunt : une dette et un actif diminuent',
            note: '164 diminue (débit) ; la banque diminue (crédit).',
            lines: [['164', 5000, null], ['512', null, 5000]],
          },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 4
  {
    id: 4,
    icon: '📚',
    title: 'Journal, grand-livre, balance',
    practice: 1,
    levels: {
      kid: {
        html: `
<p>Pour bien tenir ses comptes, on utilise trois outils, comme pour ranger tes cahiers d'école :</p>
<ul>
  <li>📓 <strong>Le journal</strong> : c'est comme ton <strong>journal intime</strong>. On note tout, <strong>jour après jour</strong>, dans l'ordre où ça arrive.</li>
  <li>🗂️ <strong>Le grand-livre</strong> : c'est un <strong>classeur avec une page par sujet</strong> : une page « tirelire », une page « dettes »... On recopie ici tout ce qui concerne chaque sujet, pour tout retrouver au même endroit.</li>
  <li>✅ <strong>La balance</strong> : c'est la <strong>vérification finale</strong>. On additionne les colonnes de gauche et de droite : elles doivent donner le même total !</li>
</ul>
${tip("Journal = tout dans l'ordre des jours. Grand-livre = tout classé par sujet. Balance = on vérifie que gauche = droite.")}`,
      },
      teen: {
        html: `
<p>Trois documents comptables travaillent ensemble :</p>
<ol>
  <li><strong>Le journal</strong> enregistre les écritures <strong>dans l'ordre chronologique</strong> (date, comptes débités et crédités, libellé, n° de pièce). On en a souvent plusieurs : achats (HA), ventes (VE), banque (BQ), caisse (CA), opérations diverses (OD).</li>
  <li><strong>Le grand-livre</strong> reprend les écritures <strong>compte par compte</strong>. Chaque compte est représenté en « T » : débits à gauche, crédits à droite. On en déduit le <strong>solde</strong> (différence entre les deux totaux).</li>
  <li><strong>La balance</strong> liste <strong>tous les comptes</strong> avec leurs totaux (mouvements) et leurs soldes. Elle sert à vérifier que <em>total des débits = total des crédits</em>.</li>
</ol>
<p>Exemple de compte en T (Banque) : à gauche 20 000 (apport), à droite 2 000 (règlement d'un fournisseur) → solde <strong>débiteur de 18 000 €</strong>.</p>
${tip("Journal (par date) → Grand-livre (par compte) → Balance (contrôle de l'égalité des totaux).")}`,
      },
      adult: {
        html: `
<p>Les documents de base sont le <strong>livre-journal</strong> (enregistrement chronologique, sans blanc ni altération), le <strong>grand livre</strong> (regroupement par compte) et le <strong>livre d'inventaire</strong> (relevé annuel des actifs et passifs). Les écritures sont archivées sous forme du <strong>FEC</strong> (fichier des écritures comptables) exigible lors d'un contrôle fiscal.</p>
<p>La <strong>balance</strong> (généralement à quatre colonnes : mouvements débit et crédit, soldes débiteurs et créditeurs) contrôle l'équilibre : Σ mouvements débit = Σ mouvements crédit <em>et</em> Σ soldes débiteurs = Σ soldes créditeurs.</p>
<p>Application avec les trois écritures ci-dessous (journaux BQ, HA, BQ) :</p>
<table class="mini num">
  <thead><tr><th>Compte</th><th>Mvt débit</th><th>Mvt crédit</th><th>Solde débiteur</th><th>Solde créditeur</th></tr></thead>
  <tbody>
    <tr><td>101 Capital</td><td></td><td>20 000,00</td><td></td><td>20 000,00</td></tr>
    <tr><td>401 Fournisseurs</td><td>2 000,00</td><td>6 000,00</td><td></td><td>4 000,00</td></tr>
    <tr><td>44566 TVA déductible sur ABS</td><td>1 000,00</td><td></td><td>1 000,00</td><td></td></tr>
    <tr><td>512 Banques</td><td>20 000,00</td><td>2 000,00</td><td>18 000,00</td><td></td></tr>
    <tr><td>607 Achats de marchandises</td><td>5 000,00</td><td></td><td>5 000,00</td><td></td></tr>
    <tr class="total"><td><strong>Totaux</strong></td><td><strong>28 000,00</strong></td><td><strong>28 000,00</strong></td><td><strong>24 000,00</strong></td><td><strong>24 000,00</strong></td></tr>
  </tbody>
</table>
${tip("Une balance équilibrée ne prouve pas qu'il n'y a aucune erreur (un mauvais compte utilisé, un montant faux des deux côtés...), mais une balance déséquilibrée prouve qu'il y en a une.")}`,
        entries: [
          { title: 'Journal BQ — Apport en capital', lines: [['512', 20000, null], ['101', null, 20000]] },
          { title: 'Journal HA — Achat de marchandises à crédit', lines: [['607', 5000, null], ['44566', 1000, null], ['401', null, 6000]] },
          { title: 'Journal BQ — Règlement partiel du fournisseur', lines: [['401', 2000, null], ['512', null, 2000]] },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 5
  {
    id: 5,
    icon: '🗄️',
    title: 'Le plan de comptes (les 9 classes)',
    practice: 1,
    levels: {
      kid: {
        html: `
<p>Imagine une <strong>grande armoire à 9 tiroirs</strong> 🗄️. Chaque tiroir a un numéro et sert à ranger un type de choses :</p>
<ol>
  <li>🏦 L'argent de départ et les grosses dettes</li>
  <li>🚚 Les grosses choses qui durent longtemps (camion, machines)</li>
  <li>📦 Ce qu'on garde en réserve pour le vendre (le stock)</li>
  <li>👥 Les gens : ceux à qui on doit de l'argent, ceux qui nous en doivent</li>
  <li>💶 L'argent qu'on peut utiliser tout de suite (tirelire, compte en banque)</li>
  <li>🛒 Ce qu'on dépense</li>
  <li>💰 Ce qu'on gagne</li>
  <li>🧩 Des tiroirs spéciaux</li>
  <li>🔍 Un tiroir pour faire des calculs de détective</li>
</ol>
<p>Plus le numéro est long, plus on est précis : <strong>4</strong> = les gens, <strong>44</strong> = l'État, <strong>445</strong> = l'État et la TVA, etc.</p>
${tip('Le premier chiffre du numéro te dit dans quel tiroir (classe) tu es !')}`,
      },
      teen: {
        html: `
<p>Le <strong>plan de comptes</strong> est la liste officielle des comptes, organisée en <strong>9 classes</strong> selon le premier chiffre du numéro :</p>
<table class="mini">
  <thead><tr><th>Classe</th><th>Contenu</th><th>Exemples</th><th>Où ?</th></tr></thead>
  <tbody>
    <tr><td><strong>1</strong></td><td>Capitaux</td><td>101 Capital, 164 Emprunts</td><td rowspan="5">Bilan</td></tr>
    <tr><td><strong>2</strong></td><td>Immobilisations</td><td>2182 Véhicules, 2183 Matériel informatique</td></tr>
    <tr><td><strong>3</strong></td><td>Stocks</td><td>37 Stocks de marchandises</td></tr>
    <tr><td><strong>4</strong></td><td>Tiers</td><td>401 Fournisseurs, 411 Clients, 44571 TVA collectée</td></tr>
    <tr><td><strong>5</strong></td><td>Financiers</td><td>512 Banque, 530 Caisse</td></tr>
    <tr><td><strong>6</strong></td><td>Charges</td><td>607 Achats de marchandises, 641 Salaires</td><td rowspan="2">Compte de résultat</td></tr>
    <tr><td><strong>7</strong></td><td>Produits</td><td>707 Ventes de marchandises, 706 Services</td></tr>
    <tr><td><strong>8</strong></td><td>Comptes spéciaux</td><td>Engagements hors bilan</td><td>Spécial</td></tr>
    <tr><td><strong>9</strong></td><td>Comptabilité analytique</td><td>Calcul des coûts</td><td>Interne</td></tr>
  </tbody>
</table>
<p>Chaque chiffre ajouté précise le compte : <strong>44 → 445 → 4455 → 44551</strong> (État → taxes sur le chiffre d'affaires → à décaisser → TVA à décaisser). Tu peux explorer tous les comptes dans l'onglet <em>Plan de comptes</em>.</p>
${tip('Classes 1 à 5 : bilan. Classes 6 et 7 : compte de résultat. Classes 8 et 9 : usages spéciaux.')}`,
      },
      adult: {
        html: `
<p>Le PCG fixe une <strong>nomenclature décimale</strong> : le premier chiffre désigne la classe, les suivants précisent la nature (compte à 2 chiffres = compte principal, 3 chiffres = sous-compte, etc.). Un compte s'utilise au niveau de détail le plus fin pertinent ; on peut créer ses propres subdivisions (ex. 401ALPHA en comptes auxiliaires fournisseurs, 4111 pour un client spécifique).</p>
<ul>
  <li><strong>Classes 1 à 5</strong> : comptes de <em>bilan</em>. Classe 1 comptes de capitaux ; classe 2 immobilisations ; classe 3 stocks et en-cours ; classe 4 comptes de tiers ; classe 5 comptes financiers.</li>
  <li><strong>Classes 6 et 7</strong> : comptes de <em>gestion</em> (résultat) — charges et produits — soldés à la clôture.</li>
  <li><strong>Classe 8</strong> : comptes spéciaux (engagements hors bilan, résultat en instance d'affectation, bilan d'ouverture et de clôture).</li>
  <li><strong>Classe 9</strong> : comptes de comptabilité analytique, libres, propres à chaque entreprise.</li>
</ul>
<p>Dans la classe 4, retenez la structure : <strong>40</strong> fournisseurs, <strong>41</strong> clients, <strong>42</strong> personnel, <strong>43</strong> organismes sociaux, <strong>44</strong> État (dont 445x = TVA), <strong>45</strong> groupe et associés, <strong>46</strong> débiteurs et créditeurs divers, <strong>47</strong> comptes d'attente, <strong>48</strong> régularisation, <strong>49</strong> dépréciations.</p>
<p>Structure de la TVA : <strong>4455x</strong> à décaisser · <strong>4456x</strong> déductible (44562 immobilisations, 44566 autres biens et services, 44567 crédit à reporter) · <strong>4457x</strong> collectée (44571) · <strong>4458x</strong> à régulariser.</p>
${tip("Astuce : dans l'onglet Plan de comptes, dépliez 44 → 445 → 4455 → 44551 pour voir comment le numéro se précise à chaque niveau.")}`,
        entries: [
          {
            title: 'Lecture des classes dans une vente à crédit',
            note: '411 et 44571 : classe 4 (tiers) ; 707 : classe 7 (produit).',
            lines: [['411', 1200, null], ['707', null, 1000], ['44571', null, 200]],
          },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 6
  {
    id: 6,
    icon: '🧾',
    title: 'La TVA (collectée, déductible, à décaisser)',
    practice: 2,
    levels: {
      kid: {
        html: `
<p>Un jour, le boulanger vend un gâteau <strong>12 €</strong>. Mais sur ces 12 €, il y en a <strong>2 € qui ne sont pas pour lui</strong> : ils appartiennent à l'État. Le boulanger les <strong>garde un moment</strong> pour ensuite les lui remettre. C'est comme s'il était le <strong>facteur</strong> de l'État 📬.</p>
<p>Mais attention : quand le boulanger achète de la farine, il paie aussi un petit supplément d'État (1 €). Ce 1 € a <strong>déjà été donné</strong> à l'État, alors il le <strong>retire</strong> de ce qu'il doit lui rendre.</p>
<ul>
  <li>Ce qu'il a ramassé pour l'État : <strong>2 €</strong> (TVA « collectée »)</li>
  <li>Ce qu'il a déjà donné : <strong>1 €</strong> (TVA « déductible »)</li>
  <li>Ce qu'il doit encore rendre : <strong>2 − 1 = 1 €</strong> (TVA « à payer »)</li>
</ul>
${tip("La TVA n'est pas de l'argent du boulanger : il la ramasse pour l'État, et retire ce qu'il a déjà donné. Il rend seulement la différence.")}`,
      },
      teen: {
        html: `
<p>La <strong>TVA</strong> (taxe sur la valeur ajoutée) est un impôt payé <strong>par le consommateur final</strong> mais <strong>collecté par les entreprises</strong>. Pour une entreprise, elle est <strong>neutre</strong> : ce n'est ni une charge ni un produit.</p>
<ul>
  <li><strong>HT</strong> : prix hors taxes. <strong>TTC</strong> : prix toutes taxes comprises = HT + TVA.</li>
  <li>Taux en France : <strong>20 %</strong> (normal), <strong>10 %</strong> (restauration, travaux...), <strong>5,5 %</strong> (alimentation, livres...), <strong>2,1 %</strong> (médicaments remboursables, presse).</li>
  <li>TVA = HT × taux ; TTC = HT × (1 + taux) ; HT = TTC ÷ (1 + taux).</li>
</ul>
<p>Quand l'entreprise <strong>vend</strong>, elle facture de la TVA : <strong>TVA collectée</strong> (elle la doit à l'État). Quand elle <strong>achète</strong>, elle paie de la TVA à ses fournisseurs : <strong>TVA déductible</strong> (elle peut la récupérer).</p>
<p><strong>TVA à décaisser = TVA collectée − TVA déductible.</strong> Si c'est négatif : c'est un <strong>crédit de TVA</strong>, reporté ou remboursé.</p>
${tip('Vente → TVA collectée (dette envers l\'État). Achat → TVA déductible (créance sur l\'État). On paie la différence.')}
<p>Essaie l'onglet <em>Outils</em> : le calculateur de TVA convertit HT ↔ TTC.</p>`,
      },
      adult: {
        html: `
<p>Régime normal : la TVA est calculée sur la <strong>base hors taxe</strong> (après remises et escomptes figurant sur facture). Elle est <strong>exigible</strong> à la livraison pour les ventes de biens, à l'encaissement pour les prestations de services (sauf option pour les débits) ; elle est <strong>déductible</strong> au moment de l'exigibilité chez le fournisseur.</p>
<table class="mini">
  <thead><tr><th>Compte</th><th>Intitulé</th><th>Nature</th></tr></thead>
  <tbody>
    <tr><td>44562</td><td>TVA déductible sur immobilisations</td><td>Créance (débit)</td></tr>
    <tr><td>44566</td><td>TVA déductible sur autres biens et services (ABS)</td><td>Créance (débit)</td></tr>
    <tr><td>44567</td><td>Crédit de TVA à reporter</td><td>Créance (débit)</td></tr>
    <tr><td>44571</td><td>TVA collectée</td><td>Dette (crédit)</td></tr>
    <tr><td>44551</td><td>TVA à décaisser</td><td>Dette (crédit)</td></tr>
    <tr><td>44583</td><td>Remboursement de TVA demandé</td><td>Créance (débit)</td></tr>
  </tbody>
</table>
<p><strong>Liquidation</strong> (fin de période, déclaration CA3) : on solde 44571 au débit, 44566 / 44562 / 44567 (antérieur) au crédit ; l'écart est porté en 44551 (TVA à décaisser) ou en 44567 (crédit à reporter).</p>
${warn("La TVA n'est pas déductible pour certaines dépenses (ex. véhicules de tourisme, frais de réception...) : elle est alors incluse dans le coût de la charge ou de l'immobilisation. Une entreprise en franchise en base de TVA (art. 293 B du CGI) ne facture ni ne récupère de TVA.")}`,
        entries: [
          { title: 'Facture d\'achat de marchandises (1 000 € HT, TVA 20 %)', lines: [['607', 1000, null], ['44566', 200, null], ['401', null, 1200]] },
          { title: 'Facture de vente de marchandises (2 000 € HT, TVA 20 %)', lines: [['411', 2400, null], ['707', null, 2000], ['44571', null, 400]] },
          {
            title: 'Liquidation : TVA à décaisser',
            note: 'Collectée 5 000 − déductible ABS 2 200 − déductible immobilisations 300 = 2 500 à payer.',
            lines: [['44571', 5000, null], ['44566', null, 2200], ['44562', null, 300], ['44551', null, 2500]],
          },
          { title: 'Paiement de la TVA à décaisser', lines: [['44551', 2500, null], ['512', null, 2500]] },
          {
            title: 'Liquidation : crédit de TVA à reporter',
            note: 'Collectée 1 800 < déductible 2 300 : crédit de 500 €.',
            lines: [['44571', 1800, null], ['44567', 500, null], ['44566', null, 2300]],
          },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 7
  {
    id: 7,
    icon: '🛍️',
    title: 'Les achats et les ventes',
    practice: 1,
    levels: {
      kid: {
        html: `
<p>Quand ton entreprise <strong>achète</strong> quelque chose à un fournisseur, deux choses peuvent arriver :</p>
<ul>
  <li>Tu <strong>paies tout de suite</strong> : tu donnes l'argent, tu prends ton achat. 🛒</li>
  <li>Tu <strong>paies plus tard</strong> : tu prends ton achat maintenant, mais tu <strong>dois</strong> de l'argent au fournisseur. C'est une <strong>dette</strong> ! 📝</li>
</ul>
<p>Pareil quand tu <strong>vends</strong> : soit on te paie tout de suite, soit ton client te <strong>doit</strong> de l'argent (une <strong>créance</strong>, c'est comme un « IOU » : je te dois).</p>
<p>Sur le papier de l'achat (la <strong>facture</strong>), il y a toujours : le prix sans la taxe (<strong>HT</strong>), la petite taxe pour l'État (<strong>TVA</strong>), et le total à payer (<strong>TTC</strong>).</p>
${tip("Acheter à crédit = j'ai une dette envers le fournisseur. Vendre à crédit = mon client a une dette envers moi.")}`,
      },
      teen: {
        html: `
<p>Les <strong>achats</strong> sont des <strong>charges</strong> (classe 6), les <strong>ventes</strong> sont des <strong>produits</strong> (classe 7).</p>
<table class="mini">
  <thead><tr><th>Opération</th><th>Compte principal</th></tr></thead>
  <tbody>
    <tr><td>Achat de marchandises (revente en l'état)</td><td>607</td></tr>
    <tr><td>Achat de matières premières</td><td>601</td></tr>
    <tr><td>Fournitures (bureau, entretien, énergie)</td><td>6064, 6063, 6061</td></tr>
    <tr><td>Vente de marchandises</td><td>707</td></tr>
    <tr><td>Vente de produits fabriqués</td><td>701</td></tr>
    <tr><td>Prestations de services</td><td>706</td></tr>
  </tbody>
</table>
<p>À chaque facture, on enregistre trois montants : le <strong>HT</strong> (achat ou vente), la <strong>TVA</strong> (déductible ou collectée) et le <strong>TTC</strong> (dette envers le fournisseur <strong>401</strong> ou créance sur le client <strong>411</strong>). Si on paie ou si on encaisse immédiatement, le TTC va directement en banque (512) ou en caisse (530).</p>
${tip("Facture d'achat : Charge HT + TVA déductible au débit, Fournisseur TTC au crédit. Facture de vente : Client TTC au débit, Vente HT + TVA collectée au crédit.")}`,
      },
      adult: {
        html: `
<p>Le fait générateur est la <strong>facture</strong> (livraison / transfert de propriété pour les biens, exécution pour les services). Les achats sont comptabilisés au <strong>net commercial</strong> HT, éventuellement augmentés des frais accessoires (transport, droits de douane...). Les frais de transport sur achats peuvent être comptabilisés en 6241 (charges externes), dans le compte d'achat concerné, ou en 608 (frais accessoires).</p>
<p>Pour les <strong>prestations de services</strong>, la TVA devient exigible à l'encaissement (sauf option pour les débits) : on utilise alors un compte d'attente de TVA (compte d'usage 44574 « TVA sur encaissements ») à la facturation, soldé lors du règlement au profit de 44571. Chez le client, de même, 44564 puis 44566.</p>
<p><strong>Ventes avec port :</strong> ventes « franco de port » (le port est inclus dans le prix) ; ports refacturés forfaitairement (compte 7085 « Ports et frais accessoires facturés ») ; ports « débours » (refacturation à l'identique, sans marge).</p>
${warn("Ne confondez pas <em>achat de marchandises</em> (607, destinées à la revente en l'état) et <em>achat de matières premières</em> (601, transformées) : les stocks correspondants sont aussi différents (37 et 31).")}`,
        entries: [
          { title: 'Achat de marchandises à crédit (3 000 € HT)', lines: [['607', 3000, null], ['44566', 600, null], ['401', null, 3600]] },
          {
            title: 'Achat avec frais de transport (2 000 € + 150 € HT)',
            note: 'TVA sur 2 150 € = 430 €.',
            lines: [['607', 2000, null], ['6241', 150, null], ['44566', 430, null], ['401', null, 2580]],
          },
          { title: 'Vente de marchandises à crédit (4 000 € HT)', lines: [['411', 4800, null], ['707', null, 4000], ['44571', null, 800]] },
          {
            title: 'Vente au comptant réglée par carte bancaire',
            lines: [['512', 1200, null], ['707', null, 1000], ['44571', null, 200]],
          },
          {
            title: 'Prestation de services : facturation (TVA sur les encaissements)',
            lines: [['411', 2400, null], ['706', null, 2000], ['44574', null, 400]],
          },
          {
            title: 'Prestation de services : encaissement puis exigibilité de la TVA',
            lines: [['512', 2400, null], ['411', null, 2400]],
          },
          {
            title: '… transfert de la TVA devenue exigible',
            lines: [['44574', 400, null], ['44571', null, 400]],
          },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 8
  {
    id: 8,
    icon: '🏷️',
    title: 'Les réductions (commerciales vs financières / escompte)',
    practice: 2,
    levels: {
      kid: {
        html: `
<p>Au magasin, il y a deux sortes de « cadeaux » sur le prix :</p>
<ul>
  <li>🏷️ <strong>La remise (réduction commerciale)</strong> : le vendeur baisse le prix <strong>avant</strong> que tu paies, par exemple « 10 % de réduction parce que tu achètes beaucoup ». Le prix qui est écrit sur le ticket est déjà le prix baissé.</li>
  <li>⏱️ <strong>L'escompte (réduction financière)</strong> : le vendeur te fait un petit cadeau <strong>parce que tu paies très vite</strong> : « Paie-moi aujourd'hui, et je te retire 2 % ».</li>
</ul>
<p>La remise, c'est comme un prix plus bas. L'escompte, c'est une <strong>récompense</strong> pour être rapide.</p>
${tip('Remise = prix plus bas dès le départ. Escompte = petite récompense si on paie vite.')}`,
      },
      teen: {
        html: `
<p>Les <strong>réductions de prix</strong> se classent en deux familles :</p>
<table class="mini">
  <thead><tr><th></th><th>Réduction commerciale</th><th>Réduction financière</th></tr></thead>
  <tbody>
    <tr><td><strong>Noms</strong></td><td>Rabais, remise, ristourne (RRR)</td><td>Escompte de règlement</td></tr>
    <tr><td><strong>Pourquoi ?</strong></td><td>Défaut, quantité achetée, fidélité</td><td>Paiement rapide</td></tr>
    <tr><td><strong>Comment ?</strong></td><td>Réduit le prix : on enregistre le <strong>net commercial</strong></td><td>Comptabilisée à part, comme un <strong>coût financier</strong></td></tr>
    <tr><td><strong>Comptes</strong></td><td>Si sur la facture : aucun compte. Si après (avoir) : 609 / 709</td><td>Vendeur : 665 (charge). Acheteur : 765 (produit).</td></tr>
  </tbody>
</table>
<p>La facture suit toujours cet ordre : Prix brut − Remises = <strong>Net commercial</strong> − Escompte = <strong>Net financier</strong> + TVA = <strong>Total TTC</strong>.</p>
${tip("La remise réduit le prix (elle disparaît des comptes). L'escompte est une charge financière pour le vendeur (665) et un produit financier pour l'acheteur (765).")}`,
      },
      adult: {
        html: `
<p><strong>Structure de la facture :</strong> Prix brut − remises (%) = <strong>net commercial</strong> − escompte (%) = <strong>net financier</strong> + TVA = total TTC − acomptes = net à payer.</p>
<ul>
  <li><strong>Remises, rabais et ristournes (RRR) figurant sur la facture</strong> : non comptabilisés ; on enregistre le net commercial en 60 / 70.</li>
  <li><strong>RRR accordés / obtenus après la facture</strong> (avoir de fin d'année, par exemple) : comptes <strong>709</strong> (RRR accordés) et <strong>609</strong> (RRR obtenus), avec régularisation de la TVA.</li>
  <li><strong>Escompte de règlement</strong> : la TVA est calculée sur le net financier. Escomptes <strong>accordés</strong> (665, charge financière) et <strong>obtenus</strong> (765, produit financier). Lorsque l'escompte est accordé après la facture, la TVA est régularisée (avoir).</li>
</ul>
${warn("Sur une facture avec escompte, le montant de l'achat (607) est le <em>net commercial</em> : l'escompte n'est pas déduit de la charge d'achat mais comptabilisé séparément en produit financier (765).")}
<p>Sans mention <em>« net de taxe »</em> sur l'avoir, la TVA est régularisée proportionnellement aux réductions.</p>`,
        entries: [
          {
            title: 'Facture d\'achat avec remise de 10 % figurant sur la facture',
            note: 'Brut 10 000 − remise 1 000 = net commercial 9 000 ; TVA 1 800 ; TTC 10 800.',
            lines: [['607', 9000, null], ['44566', 1800, null], ['401', null, 10800]],
          },
          {
            title: 'Facture d\'achat avec escompte de 2 % (côté client)',
            note: 'Net commercial 10 000 ; escompte 200 ; net financier 9 800 ; TVA 1 960 ; TTC 11 760.',
            lines: [['607', 10000, null], ['44566', 1960, null], ['401', null, 11760], ['765', null, 200]],
          },
          {
            title: 'Même facture côté fournisseur',
            lines: [['411', 11760, null], ['665', 200, null], ['707', null, 10000], ['44571', null, 1960]],
          },
          {
            title: 'Avoir de ristourne obtenue (côté client)',
            note: 'Ristourne de 500 € HT après facturation.',
            lines: [['401', 600, null], ['609', null, 500], ['44566', null, 100]],
          },
          {
            title: 'Avoir de ristourne accordée (côté fournisseur)',
            lines: [['709', 500, null], ['44571', 100, null], ['411', null, 600]],
          },
          {
            title: 'Règlement anticipé avec escompte (côté fournisseur)',
            note: 'Facture 12 000 TTC ; escompte 200 HT + 40 TVA ; encaissement 11 760.',
            lines: [['512', 11760, null], ['665', 200, null], ['44571', 40, null], ['411', null, 12000]],
          },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 9
  {
    id: 9,
    icon: '💳',
    title: 'Les règlements et la trésorerie',
    practice: 1,
    levels: {
      kid: {
        html: `
<p>Pour payer, on peut utiliser plusieurs moyens :</p>
<ul>
  <li>🪙 <strong>Les espèces</strong> : les pièces et billets de la <strong>caisse</strong> (comme ta tirelire).</li>
  <li>📝 <strong>Le chèque</strong> ou 💳 <strong>la carte</strong> ou 🔁 <strong>le virement</strong> : l'argent bouge <strong>dans le compte en banque</strong>.</li>
</ul>
<p>Ton argent est donc rangé à deux endroits : la <strong>caisse</strong> (dans le tiroir du magasin) et la <strong>banque</strong> (dans le compte). Quand tu prends de l'argent à la banque pour le mettre dans la caisse, l'argent <strong>change de place</strong>, mais tu n'en as ni plus, ni moins.</p>
${tip("Caisse = l'argent qu'on touche. Banque = l'argent dans le compte. Payer ou encaisser fait augmenter ou diminuer l'un des deux.")}`,
      },
      teen: {
        html: `
<p>Les <strong>moyens de règlement</strong> : espèces, chèque, virement, prélèvement, carte bancaire, effet de commerce (lettre de change).</p>
<table class="mini">
  <thead><tr><th>Où va l'argent ?</th><th>Compte</th></tr></thead>
  <tbody>
    <tr><td>Banque (compte courant)</td><td>512</td></tr>
    <tr><td>Caisse (espèces)</td><td>530</td></tr>
    <tr><td>Chèques reçus mais pas encore remis en banque</td><td>5112 Chèques à encaisser</td></tr>
    <tr><td>Solde bancaire négatif (découvert)</td><td>519 Concours bancaires</td></tr>
    <tr><td>Effets à payer / à recevoir</td><td>403 / 413</td></tr>
  </tbody>
</table>
<ul>
  <li>Je <strong>paie</strong> un fournisseur : sa dette (401) disparaît, ma banque (ou ma caisse) diminue.</li>
  <li>Je suis <strong>payé</strong> par un client : sa dette (411) disparaît, ma banque (ou ma caisse) augmente.</li>
  <li>Je retire de l'argent à la banque pour la caisse : <strong>530</strong> au débit, <strong>512</strong> au crédit.</li>
</ul>
${tip("La trésorerie est un compte d'actif (classe 5) : elle augmente au débit, diminue au crédit.")}`,
      },
      adult: {
        html: `
<p>Les comptes de la <strong>classe 5</strong> enregistrent les mouvements de trésorerie. La <strong>banque (512)</strong> est tenue en parallèle du relevé de la banque : un <strong>état de rapprochement bancaire</strong> permet d'expliquer les écarts (chèques émis non encore débités, chèques remis non encore crédités...).</p>
<p><strong>Chèques reçus</strong> : on peut utiliser le compte <strong>5112</strong> (chèques à encaisser) entre la réception et la remise en banque, puis le solder par le débit du 512. Les <strong>effets de commerce</strong> transitent par 403 (effets à payer, chez le tireur) et 413 (effets à recevoir).</p>
<p>Le <strong>découvert</strong> (solde créditeur bancaire) est présenté en 519 « concours bancaires courants », au passif. Les règlements en espèces sont limités à 1 000 € entre professionnels et particuliers résidents.</p>
${warn("Le compte de banque (512) est toujours le même ; c'est le compte de tiers débité qui change selon la dette payée : 401 fournisseurs d'exploitation, 404 fournisseurs d'immobilisations, 421 personnel, 431 organismes sociaux, 44551 TVA à décaisser.")}`,
        entries: [
          { title: 'Règlement d\'un fournisseur par virement', lines: [['401', 3600, null], ['512', null, 3600]] },
          {
            title: 'Encaissement d\'un chèque client (réception)',
            lines: [['5112', 4800, null], ['411', null, 4800]],
          },
          { title: '… remise du chèque en banque', lines: [['512', 4800, null], ['5112', null, 4800]] },
          { title: 'Alimentation de la caisse (retrait d\'espèces)', lines: [['530', 500, null], ['512', null, 500]] },
          {
            title: 'Règlement d\'un fournisseur par lettre de change : acceptation',
            lines: [['401', 3600, null], ['403', null, 3600]],
          },
          { title: '… paiement à l\'échéance', lines: [['403', 3600, null], ['512', null, 3600]] },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 10
  {
    id: 10,
    icon: '🏭',
    title: 'Immobilisations et amortissements',
    practice: 3,
    levels: {
      kid: {
        html: `
<p>Ton papa achète un <strong>vélo</strong> 🚲 pour 500 €. Il va durer <strong>5 ans</strong>. Est-ce que ton papa a « dépensé » 500 € cette année et rien les années suivantes ? Non ! Le vélo sert chaque année : il s'use <strong>un petit peu à chaque fois</strong>.</p>
<p>Alors on dit que chaque année, le vélo perd <strong>100 €</strong> de sa valeur (500 ÷ 5). Cette perte de valeur, on l'appelle l'<strong>amortissement</strong>. C'est comme mesurer l'<strong>usure</strong> du vélo.</p>
<ul>
  <li>Année 1 : le vélo « vaut » 400 €</li>
  <li>Année 2 : 300 €...</li>
  <li>Année 5 : 0 € (mais il roule peut-être encore !)</li>
</ul>
${tip("Un gros objet qui dure longtemps (immobilisation) ne se compte pas d'un coup : on répartit son coût sur les années où on s'en sert (amortissement).")}`,
      },
      teen: {
        html: `
<p>Une <strong>immobilisation</strong> est un bien que l'entreprise <strong>garde durablement</strong> (plus d'un an) pour l'utiliser, pas pour le revendre : local, machine, véhicule, ordinateur, brevet...</p>
<ul>
  <li>Elle est enregistrée à l'<strong>actif</strong> pour son <strong>coût d'acquisition HT</strong> (la TVA est récupérée).</li>
  <li>Comme elle s'use, on l'<strong>amortit</strong> : on répartit son coût sur sa durée d'utilisation. Chaque année, une <strong>charge</strong> appelée « dotation aux amortissements » est enregistrée.</li>
</ul>
<p><strong>Amortissement linéaire</strong> : chaque année, la même somme = valeur d'origine ÷ durée. Exemple : machine à 12 000 € sur 5 ans → 2 400 € par an.</p>
<p>Si le bien est acheté en cours d'année, la première année est calculée <strong>prorata temporis</strong> : 2 400 × (mois d'utilisation ÷ 12).</p>
<p><strong>Valeur nette comptable (VNC)</strong> = valeur d'origine − amortissements cumulés.</p>
${tip("Immobilisation = bien durable à l'actif. Amortissement = l'usure comptabilisée chaque année (charge), qui fait baisser la valeur nette.")}`,
      },
      adult: {
        html: `
<p><strong>Comptabilisation initiale.</strong> Une immobilisation est comptabilisée à son <strong>coût d'acquisition</strong> : prix d'achat net de remises, augmenté des frais accessoires (transport, installation, droits...) et hors TVA récupérable. La TVA est portée en <strong>44562</strong>, le fournisseur en <strong>404</strong>.</p>
<p><strong>Amortissement.</strong> L'amortissement traduit la consommation des avantages économiques du bien sur sa <strong>durée d'utilisation</strong>. Le plan d'amortissement se calcule sur la <strong>base amortissable</strong> (coût − valeur résiduelle). Mode <em>linéaire</em> : annuité constante ; mode <em>dégressif</em> : annuités décroissantes (coefficient fiscal) pour certains biens ; unités d'œuvre selon le cas.</p>
<p>Exemple : machine acquise le 1<sup>er</sup> avril N, 12 000 € HT, linéaire 5 ans (annuité 2 400 €). Première annuité prorata : 9/12 → 1 800 €.</p>
<table class="mini num">
  <thead><tr><th>Année</th><th>Dotation</th><th>Amortissements cumulés</th><th>VNC en fin d'année</th></tr></thead>
  <tbody>
    <tr><td>N</td><td>1 800,00</td><td>1 800,00</td><td>10 200,00</td></tr>
    <tr><td>N+1</td><td>2 400,00</td><td>4 200,00</td><td>7 800,00</td></tr>
    <tr><td>N+2</td><td>2 400,00</td><td>6 600,00</td><td>5 400,00</td></tr>
    <tr><td>N+3</td><td>2 400,00</td><td>9 000,00</td><td>3 000,00</td></tr>
    <tr><td>N+4</td><td>2 400,00</td><td>11 400,00</td><td>600,00</td></tr>
    <tr><td>N+5</td><td>600,00</td><td>12 000,00</td><td>0,00</td></tr>
  </tbody>
</table>
${warn("La dotation se comptabilise <em>au crédit du compte d'amortissement</em> (28…), jamais au crédit du compte d'immobilisation (2…), qui garde sa valeur d'origine.")}`,
        entries: [
          {
            title: 'Acquisition de la machine (12 000 € HT, TVA 20 %) à crédit',
            lines: [['2154', 12000, null], ['44562', 2400, null], ['404', null, 14400]],
          },
          { title: 'Dotation annuelle pleine (année N+1)', lines: [['6811', 2400, null], ['28154', null, 2400]] },
          { title: 'Dotation de la première année (prorata 9/12)', lines: [['6811', 1800, null], ['28154', null, 1800]] },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 11
  {
    id: 11,
    icon: '🛡️',
    title: 'Dépréciations et provisions',
    practice: 3,
    levels: {
      kid: {
        html: `
<p>Ton copain Léo t'a emprunté <strong>10 €</strong>. Mais il dit qu'il a perdu sa tirelire... 😟 Tu doutes qu'il puisse te rembourser en entier. Tu n'as pas encore perdu tes 10 €, mais tu écris au crayon : <strong>« Attention, je risque d'en perdre 5. »</strong> C'est de la <strong>prudence</strong>.</p>
<ul>
  <li>Si un truc que tu <strong>possèdes</strong> risque de valoir moins (une créance douteuse, un stock abîmé) → tu notes une <strong>dépréciation</strong>.</li>
  <li>Si tu risques de devoir <strong>payer</strong> quelque chose plus tard (un procès, une réparation sous garantie) → tu notes une <strong>provision</strong>.</li>
</ul>
<p>Si finalement Léo te rembourse, tu gommes ton crayon. 🧽</p>
${tip('Dépréciation = « ce que j\'ai vaut peut-être moins ». Provision = « je vais peut-être devoir payer ». On note le risque au crayon, par prudence.')}`,
      },
      teen: {
        html: `
<p>Par <strong>prudence</strong>, l'entreprise doit tenir compte des <strong>pertes probables</strong> dès qu'elle les prévoit, même si elles ne sont pas encore certaines.</p>
<table class="mini">
  <thead><tr><th></th><th>Amortissement</th><th>Dépréciation</th><th>Provision</th></tr></thead>
  <tbody>
    <tr><td><strong>Quoi ?</strong></td><td>Usure certaine d'un bien</td><td>Perte de valeur probable d'un actif (client, stock, titres)</td><td>Charge ou perte probable (litige, garantie), montant incertain</td></tr>
    <tr><td><strong>Exemple</strong></td><td>Camionnette</td><td>Client en difficulté</td><td>Procès en cours</td></tr>
    <tr><td><strong>Compte de dotation</strong></td><td>6811</td><td>6817 (créances, stocks)</td><td>6815</td></tr>
    <tr><td><strong>Compte au bilan</strong></td><td>28…</td><td>491, 397…</td><td>15…</td></tr>
  </tbody>
</table>
<p><strong>Client douteux :</strong> on le transfère en 416, puis on déprécie la <em>perte probable calculée sur le HT</em>. S'il finit par payer, on fait une <strong>reprise</strong> (produit). S'il ne paie jamais, on constate la perte définitive.</p>
${tip("Dotation = on constate le risque (charge). Reprise = le risque disparaît (produit).")}`,
      },
      adult: {
        html: `
<p><strong>Dépréciation</strong> : constatation d'une perte de valeur <em>réversible</em> d'un actif (clients : 491 ; stocks : 39x ; immobilisations : 29x ; titres : 29x, 59x), lorsque la valeur actuelle est inférieure à la valeur comptable. Dotation en charge (6816 immobilisations, 6817 actifs circulants, 686 financière), reprise en produit (7816, 7817, 786).</p>
<p><strong>Provision</strong> (PCG) : passif dont l'échéance ou le montant est incertain, comptabilisé si l'entreprise a une obligation à l'égard d'un tiers, qu'il est probable ou certain qu'elle provoquera une sortie de ressources sans contrepartie équivalente. Dotation en 6815 (exploitation), 6865 (financier), 6875 (exceptionnel) ; reprise en 7815, 7865, 7875.</p>
<p><strong>Créance douteuse :</strong> transfert 411 → 416 (TTC), dépréciation calculée sur le HT (la TVA est récupérable en cas de perte définitive). Perte définitive : 654 (HT) et régularisation de la TVA collectée par 44571 au débit ; reprise simultanée de la dépréciation.</p>
<p>Chaque année, on <strong>ajuste</strong> : si le risque augmente, dotation complémentaire ; s'il diminue, reprise partielle ; s'il disparaît, reprise totale.</p>
${warn("Ne créditez jamais directement le compte de créance pour déprécier : la dépréciation est portée dans un compte séparé (491), la créance conserve sa valeur d'origine à l'actif.")}`,
        entries: [
          {
            title: 'Reclassement d\'un client douteux (6 000 € TTC)',
            lines: [['416', 6000, null], ['411', null, 6000]],
          },
          {
            title: 'Dépréciation (60 % du HT de 5 000 €)',
            lines: [['6817', 3000, null], ['491', null, 3000]],
          },
          {
            title: 'Perte définitive de la créance',
            lines: [['654', 5000, null], ['44571', 1000, null], ['416', null, 6000]],
          },
          { title: '… reprise de la dépréciation devenue sans objet', lines: [['491', 3000, null], ['7817', null, 3000]] },
          { title: 'Provision pour litige prud\'homal', lines: [['6815', 12000, null], ['1511', null, 12000]] },
          { title: 'Reprise de provision (litige clos)', lines: [['1511', 12000, null], ['7815', null, 12000]] },
          { title: 'Dépréciation d\'un stock de marchandises', lines: [['6817', 2500, null], ['397', null, 2500]] },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 12
  {
    id: 12,
    icon: '👥',
    title: 'La paie',
    practice: 3,
    levels: {
      kid: {
        html: `
<p>Papa travaille dans une entreprise. Son patron lui a promis <strong>100 pièces d'or</strong> par mois : c'est son <strong>salaire brut</strong> 🪙.</p>
<p>Mais avant de lui donner, le patron met <strong>22 pièces</strong> dans une <strong>grande tirelire commune</strong> qui sert à payer les hôpitaux, les retraites et les écoles. Ce sont les <strong>cotisations</strong>. Papa reçoit donc <strong>78 pièces</strong> : c'est son <strong>salaire net</strong>.</p>
<p>Et le patron ajoute aussi <strong>42 pièces de sa poche</strong> dans la même tirelire commune : ce sont les <strong>charges du patron</strong>. Pour le patron, un employé coûte donc 100 + 42 = <strong>142 pièces</strong> !</p>
${tip("Brut = ce que le patron promet. Net = ce que Papa reçoit après les cotisations. Le patron paie en plus ses propres cotisations.")}`,
      },
      teen: {
        html: `
<p>Sur une <strong>fiche de paie</strong> on trouve :</p>
<ul>
  <li>le <strong>salaire brut</strong> : la base de calcul ;</li>
  <li>les <strong>cotisations salariales</strong> (~22 % du brut) retenues sur le salaire : retraite, maladie, chômage...</li>
  <li>éventuellement le <strong>prélèvement à la source</strong> (impôt sur le revenu retenu directement) ;</li>
  <li>le <strong>net à payer</strong> = brut − cotisations salariales − prélèvement à la source ;</li>
  <li>les <strong>cotisations patronales</strong> (~40-45 % du brut), payées <em>en plus</em> par l'employeur.</li>
</ul>
<p><strong>Coût total employeur</strong> = brut + cotisations patronales.</p>
<p>Comptabilité : le brut est une charge de personnel (<strong>641</strong>), les cotisations patronales une autre charge (<strong>645</strong>). Les sommes dues sont enregistrées en dettes : au personnel (<strong>421</strong>, le net), aux organismes sociaux (<strong>431</strong>), à l'État pour le prélèvement à la source (<strong>4421</strong>).</p>
${tip('Charges : 641 (brut) + 645 (charges patronales). Dettes : 421 (net à payer), 431 (organismes sociaux), 4421 (prélèvement à la source).')}`,
      },
      adult: {
        html: `
<p>La comptabilisation de la paie se fait par <strong>écritures issues du journal de paie</strong> (OD), généralement en <strong>quatre temps</strong> :</p>
<ol>
  <li>Constatation du salaire brut : charge (641) contre dettes envers le personnel (421 pour le net) et les organismes (431 pour les cotisations salariales) et l'État (4421 pour le PAS).</li>
  <li>Constatation des cotisations patronales : 645 contre 431 (ou 437 pour retraite complémentaire...).</li>
  <li>Paiement du net au salarié : 421 / 512.</li>
  <li>Paiement des cotisations (URSSAF, retraite) et reversement du prélèvement à la source (DSN mensuelle).</li>
</ol>
<p>Exemple : brut 3 000 € ; cotisations salariales 660 € (22 %) ; PAS 180 € ; net à payer 2 160 € ; cotisations patronales 1 260 € (42 %) ; coût total employeur 4 260 €.</p>
${warn("Les avances et acomptes versés aux salariés sont enregistrés en 425 (débit) et viennent en déduction du net à payer. Les congés payés acquis mais non pris donnent lieu à une charge à payer en fin d'exercice (compte 4282 pour la part salariale, 4382 pour les charges sociales).")}`,
        entries: [
          {
            title: '1. Constatation du salaire',
            lines: [['641', 3000, null], ['431', null, 660], ['4421', null, 180], ['421', null, 2160]],
          },
          { title: '2. Cotisations patronales', lines: [['645', 1260, null], ['431', null, 1260]] },
          { title: '3. Paiement du net au salarié', lines: [['421', 2160, null], ['512', null, 2160]] },
          {
            title: '4a. Paiement des cotisations sociales (salariales + patronales)',
            lines: [['431', 1920, null], ['512', null, 1920]],
          },
          { title: '4b. Reversement du prélèvement à la source', lines: [['4421', 180, null], ['512', null, 180]] },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 13
  {
    id: 13,
    icon: '📦',
    title: 'Les stocks (inventaire)',
    practice: 4,
    levels: {
      kid: {
        html: `
<p>Tu tiens une boutique de jouets 🧸. Au 1<sup>er</sup> janvier, sur tes étagères, il y avait des jouets qui valaient <strong>8 000 €</strong>. Au 31 décembre, tu <strong>recomptes tout</strong> : il y en a maintenant pour <strong>11 000 €</strong>.</p>
<p>Ça veut dire que tu as <strong>gardé plus de jouets</strong> à la fin de l'année qu'au début : tu n'as pas tout vendu ! C'est comme si une partie de ce que tu as acheté était <strong>encore dans ta boutique</strong>, donc n'avait pas été « dépensée ».</p>
<p>Ce recomptage s'appelle l'<strong>inventaire</strong>. Il sert à savoir ce qui reste et à corriger ton cahier.</p>
${tip("Inventaire = on recompte ce qui reste. La différence entre le début et la fin de l'année, on la note dans le cahier.")}`,
      },
      teen: {
        html: `
<p>Le <strong>stock</strong> est l'ensemble des marchandises, matières et produits que l'entreprise détient en attente d'être vendus ou utilisés. Il est compté par un <strong>inventaire</strong> à la clôture.</p>
<p>Pendant l'année, les achats de marchandises sont enregistrés en charge (607) <em>sans</em> toucher au stock. À la fin de l'année, on corrige :</p>
<ol>
  <li>On <strong>annule le stock initial</strong> : il a été (en théorie) utilisé ou vendu → <em>6037 au débit, 37 au crédit</em>.</li>
  <li>On <strong>constate le stock final</strong> compté à l'inventaire → <em>37 au débit, 6037 au crédit</em>.</li>
</ol>
<p><strong>Variation de stock = stock initial − stock final</strong>. Si le stock final est plus élevé, la variation est négative (les charges de l'exercice diminuent).</p>
${tip('Stock initial sort (37 au crédit). Stock final entre (37 au débit). Le compte 6037 enregistre la différence.')}`,
      },
      adult: {
        html: `
<p>Deux méthodes de suivi : l'<strong>inventaire intermittent</strong> (stocks constatés uniquement à la clôture, comme ci-dessous) et l'<strong>inventaire permanent</strong> (chaque entrée et sortie est enregistrée en cours d'exercice).</p>
<p><strong>Inventaire intermittent :</strong> à la clôture, on annule le stock initial et on constate le stock final par le compte de variation (6037 marchandises, 6031 matières premières, 6032 autres approvisionnements ; 713 pour les stocks de produits).</p>
<p>Le stock est évalué au <strong>coût d'acquisition</strong> (méthode du coût unitaire moyen pondéré ou premier entré / premier sorti — pas de dernier entré / premier sorti) ou au coût de production. Si sa valeur actuelle est inférieure, on constate une <strong>dépréciation</strong> (39x) par 6817.</p>
<p>Exemple : stock initial de marchandises 8 000 €, stock final 11 000 €. Variation = 8 000 − 11 000 = <strong>−3 000 €</strong> : le compte 6037 se retrouve créditeur de 3 000 € (diminution des charges).</p>
${warn("Les stocks de produits fabriqués (355) ont pour compte de variation <strong>713</strong>, un compte de <em>produit</em> (production stockée), avec un sens inverse de 603 : stock final → 355 au débit et 71355 au crédit.")}`,
        entries: [
          { title: 'Annulation du stock initial de marchandises', lines: [['6037', 8000, null], ['37', null, 8000]] },
          { title: 'Constatation du stock final de marchandises', lines: [['37', 11000, null], ['6037', null, 11000]] },
          {
            title: 'Stocks de produits finis : annulation du stock initial (5 000 €)',
            lines: [['71355', 5000, null], ['355', null, 5000]],
          },
          {
            title: '… constatation du stock final de produits finis (4 000 €)',
            lines: [['355', 4000, null], ['71355', null, 4000]],
          },
          { title: 'Dépréciation de stock', lines: [['6817', 2500, null], ['397', null, 2500]] },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 14
  {
    id: 14,
    icon: '🗓️',
    title: 'Les régularisations de fin d\'exercice (CCA / PCA)',
    practice: 4,
    levels: {
      kid: {
        html: `
<p>Le 1<sup>er</sup> décembre, tu paies ton <strong>abonnement à la piscine</strong> pour toute l'année suivante : 120 €. 🏊 Cette année, tu n'as nagé qu'un mois. Les 11 autres mois, ce sera <strong>l'année prochaine</strong>.</p>
<p>Dans ton cahier de cette année, tu ne dois compter que <strong>10 €</strong> (1 mois). Les 110 € qui restent, tu les notes comme « <strong>payés d'avance</strong> » : ils comptent pour l'année d'après.</p>
<ul>
  <li>Si <strong>tu</strong> as payé en avance → c'est une <strong>charge constatée d'avance</strong>.</li>
  <li>Si <strong>on t'a payé</strong> en avance pour quelque chose que tu feras plus tard → c'est un <strong>produit constaté d'avance</strong>.</li>
</ul>
${tip("Chaque année compte ses propres dépenses et ses propres gains. Ce qui concerne l'année suivante doit être mis de côté.")}`,
      },
      teen: {
        html: `
<p>Le principe d'<strong>indépendance des exercices</strong> impose de rattacher à chaque année <strong>toutes ses charges et tous ses produits</strong>, et rien que ceux-là, même si l'argent a bougé à un autre moment. À la clôture, on fait des <strong>régularisations</strong> :</p>
<table class="mini">
  <thead><tr><th>Situation</th><th>Nom</th><th>Compte</th></tr></thead>
  <tbody>
    <tr><td>J'ai payé une charge d'avance (partie qui concerne l'an prochain)</td><td>Charge constatée d'avance (CCA)</td><td>486 (actif)</td></tr>
    <tr><td>J'ai encaissé un produit d'avance</td><td>Produit constaté d'avance (PCA)</td><td>487 (passif)</td></tr>
    <tr><td>J'ai reçu un service mais pas la facture</td><td>Facture non parvenue (charge à payer)</td><td>408</td></tr>
    <tr><td>J'ai rendu un service mais pas encore facturé</td><td>Facture à établir (produit à recevoir)</td><td>4181</td></tr>
  </tbody>
</table>
<p>Calcul : on répartit le montant au <strong>prorata du temps</strong>. Exemple : assurance de 2 400 € payée le 1<sup>er</sup> octobre pour 12 mois → à la clôture, 9 mois sont pour l'an prochain : 2 400 × 9 ÷ 12 = 1 800 € de CCA.</p>
${tip('CCA (486) et PCA (487) corrigent le fait d\'avoir payé ou encaissé trop tôt ; FNP (408) et FAE (4181) corrigent le fait d\'avoir facturé trop tard.')}`,
      },
      adult: {
        html: `
<p>Les <strong>écritures de régularisation</strong> (inventaire) rattachent les charges et produits à l'exercice concerné. Elles portent sur :</p>
<ul>
  <li>les <strong>charges constatées d'avance</strong> (486) et <strong>produits constatés d'avance</strong> (487) : comptes de régularisation, extournés à l'ouverture de l'exercice suivant ;</li>
  <li>les <strong>charges à payer</strong> : fournisseurs — factures non parvenues (408) avec TVA en 44586 ; personnel et organismes sociaux (428, 438) ; intérêts courus (1688) ;</li>
  <li>les <strong>produits à recevoir</strong> : clients — factures à établir (4181) avec TVA en 44587 ; intérêts à recevoir (4188).</li>
</ul>
<p>La <strong>TVA</strong> est exigible selon les règles générales : sur une facture non parvenue, la TVA est portée en 44586 (TVA déductible en attente) ; sur une facture à établir, en 44587 (TVA collectée en attente).</p>
<p>Elles sont en général <strong>extournées</strong> au 1<sup>er</sup> jour de l'exercice suivant (écriture inverse) pour retrouver l'enregistrement normal des factures.</p>
${warn("Les CCA et PCA ne portent pas de TVA (la TVA a été comptabilisée à la facture). Les FNP et FAE, elles, portent une TVA (44586 / 44587).")}`,
        entries: [
          {
            title: 'CCA : assurance de 2 400 € payée le 01/10 pour 12 mois',
            note: '9/12 concernent N+1 : 1 800 €.',
            lines: [['486', 1800, null], ['616', null, 1800]],
          },
          {
            title: 'PCA : loyer semestriel de 3 600 € encaissé le 01/11',
            note: '4/6 concernent N+1 : 2 400 €.',
            lines: [['7083', 2400, null], ['487', null, 2400]],
          },
          {
            title: 'Facture non parvenue : honoraires de 3 000 € HT',
            lines: [['6226', 3000, null], ['44586', 600, null], ['408', null, 3600]],
          },
          {
            title: 'Facture à établir : prestation de 5 000 € HT',
            lines: [['4181', 6000, null], ['706', null, 5000], ['44587', null, 1000]],
          },
          {
            title: 'Extourne de la CCA au 1er janvier N+1',
            lines: [['616', 1800, null], ['486', null, 1800]],
          },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 15
  {
    id: 15,
    icon: '🤝',
    title: 'La cession d\'immobilisation',
    practice: 4,
    levels: {
      kid: {
        html: `
<p>Tu as acheté un vélo 100 € l'an dernier. À force de l'utiliser, dans ton cahier il « vaut » maintenant <strong>40 €</strong> (100 € moins 60 € d'usure). Tu décides de le <strong>vendre à un ami</strong>.</p>
<ul>
  <li>Si tu le vends <strong>70 €</strong> : tu gagnes <strong>30 €</strong> de plus que la valeur du cahier 🎉 (bonne affaire !).</li>
  <li>Si tu le vends <strong>20 €</strong> : tu perds <strong>20 €</strong> par rapport à la valeur du cahier 😕.</li>
</ul>
<p>Dans le cahier, on doit faire <strong>deux choses</strong> : noter l'argent reçu de la vente, et <strong>rayer le vélo</strong> de la liste de ce que tu possèdes.</p>
${tip("Vendre un gros objet = noter l'argent reçu ET retirer l'objet de ce que l'on possède. On compare le prix de vente à la valeur du cahier.")}`,
      },
      teen: {
        html: `
<p>La <strong>cession</strong> d'une immobilisation est sa vente. Il faut :</p>
<ol>
  <li>Calculer le complément d'amortissement jusqu'à la date de cession (prorata temporis).</li>
  <li>Constater le <strong>prix de cession</strong> (produit, avec sa TVA).</li>
  <li><strong>Sortir le bien</strong> de l'actif : on solde l'immobilisation et ses amortissements ; la <strong>valeur nette comptable (VNC)</strong> restante est une charge.</li>
</ol>
<p><strong>Résultat de cession = prix de cession HT − VNC</strong> : plus-value si positif, moins-value si négatif.</p>
<p>Comptes : <strong>775</strong> Produits des cessions d'éléments d'actif, <strong>675</strong> Valeurs comptables des éléments d'actif cédés, <strong>462</strong> Créances sur cessions d'immobilisations.</p>
${tip('Deux écritures : la vente (775 + TVA) et la sortie du bien (le bien + ses amortissements + 675 pour la VNC).')}`,
      },
      adult: {
        html: `
<p>Exemple : véhicule utilitaire acquis le 1<sup>er</sup> janvier N-2 pour 25 000 € HT, amorti en linéaire sur 5 ans (5 000 € par an), cédé le <strong>30 juin N</strong> pour 8 500 € HT (TVA 20 %).</p>
<ul>
  <li>Amortissements cumulés au 31/12/N-1 : 10 000 €.</li>
  <li><strong>Dotation complémentaire</strong> jusqu'au 30 juin : 5 000 × 6/12 = 2 500 € → cumul = 12 500 €.</li>
  <li>VNC = 25 000 − 12 500 = <strong>12 500 €</strong>.</li>
  <li>Résultat de cession = 8 500 − 12 500 = <strong>moins-value de 4 000 €</strong>.</li>
</ul>
<p>La <strong>TVA</strong> sur la cession est collectée (44571) si la TVA sur l'acquisition avait été déduite. La cession d'un bien dont la TVA n'avait pas été déductible est exonérée.</p>
${warn("Le prix de cession est un produit exceptionnel (775) ; la VNC une charge exceptionnelle (675) : on ne compense pas les deux dans un compte unique. La plus ou moins-value se lit par différence.")}`,
        entries: [
          { title: '1. Dotation complémentaire jusqu\'à la cession', lines: [['6811', 2500, null], ['28182', null, 2500]] },
          {
            title: '2. Constatation de la cession',
            lines: [['462', 10200, null], ['775', null, 8500], ['44571', null, 1700]],
          },
          {
            title: '3. Sortie du bien de l\'actif',
            note: '12 500 (amortissements) + 12 500 (VNC) = 25 000.',
            lines: [['28182', 12500, null], ['675', 12500, null], ['2182', null, 25000]],
          },
          { title: '4. Encaissement du prix', lines: [['512', 10200, null], ['462', null, 10200]] },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 16
  {
    id: 16,
    icon: '🏦',
    title: 'Les emprunts',
    practice: 4,
    levels: {
      kid: {
        html: `
<p>Tu veux acheter une trottinette 🛴 mais tu n'as pas assez d'argent. Ta <strong>grande sœur te prête 100 pièces</strong>. Tu lui promets de les lui rendre petit à petit, en ajoutant un <strong>petit merci</strong> à chaque fois (des pièces en plus).</p>
<ul>
  <li>Les 100 pièces reçues : c'est l'<strong>emprunt</strong> (une grosse dette).</li>
  <li>Chaque mois, tu rends une partie (le <strong>capital</strong>) + un petit merci (les <strong>intérêts</strong>).</li>
</ul>
<p>Le « petit merci » est une <strong>dépense</strong> pour toi. Rendre l'argent prêté, c'est juste <strong>diminuer ta dette</strong>.</p>
${tip('Emprunt = dette. Chaque remboursement = capital (la dette diminue) + intérêts (une dépense).')}`,
      },
      teen: {
        html: `
<p>Un <strong>emprunt</strong> est une somme prêtée par une banque, à rembourser sur plusieurs années. Il apporte de l'argent à l'entreprise (débit de la banque) et crée une dette à long terme (compte <strong>164</strong>).</p>
<p>Chaque <strong>échéance</strong> comprend :</p>
<ul>
  <li>une part de <strong>capital</strong> (amortissement de l'emprunt) : la dette diminue (164 au débit) ;</li>
  <li>des <strong>intérêts</strong> : c'est le prix du crédit, donc une charge financière (<strong>6611</strong> au débit).</li>
</ul>
<p>Les intérêts se calculent sur le <strong>capital restant dû</strong> : intérêts = capital restant dû × taux. À amortissement constant, les échéances baissent ; à annuité constante, l'échéance est fixe mais la part d'intérêts diminue chaque année.</p>
<p>Les <strong>frais de dossier</strong> sont enregistrés en charge (627).</p>
${tip("Obtention : banque (débit) / emprunt 164 (crédit). Échéance : 6611 (intérêts) + 164 (capital) au débit ; banque au crédit.")}`,
      },
      adult: {
        html: `
<p>L'emprunt est enregistré au <strong>nominal</strong> dans le compte <strong>164</strong> ; les frais d'émission (frais de dossier, garanties) sont comptabilisés en charges (627) ou peuvent être étalés (481).</p>
<p><strong>Tableau d'amortissement</strong> (amortissements constants, 100 000 € sur 5 ans à 4 %) :</p>
<table class="mini num">
  <thead><tr><th>Année</th><th>Capital début</th><th>Intérêts (4 %)</th><th>Amortissement</th><th>Échéance</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>100 000</td><td>4 000</td><td>20 000</td><td>24 000</td></tr>
    <tr><td>2</td><td>80 000</td><td>3 200</td><td>20 000</td><td>23 200</td></tr>
    <tr><td>3</td><td>60 000</td><td>2 400</td><td>20 000</td><td>22 400</td></tr>
    <tr><td>4</td><td>40 000</td><td>1 600</td><td>20 000</td><td>21 600</td></tr>
    <tr><td>5</td><td>20 000</td><td>800</td><td>20 000</td><td>20 800</td></tr>
  </tbody>
</table>
<p>À <strong>annuité constante</strong>, A = K × t ÷ (1 − (1 + t)<sup>−n</sup>) : ici 22 462,71 € par an ; la première année : intérêts 4 000 € et capital 18 462,71 €.</p>
<p>À la clôture, les <strong>intérêts courus non échus</strong> (ICNE) sont constatés en charge à payer (compte 16884), puis extournés. La part de l'emprunt remboursable dans l'année est indiquée en annexe (dettes à moins d'un an).</p>
${warn("Ne pas confondre l'échéance (capital + intérêts) avec la charge : seuls les intérêts sont une charge. Le remboursement du capital diminue la dette, sans effet sur le résultat.")}`,
        entries: [
          {
            title: 'Obtention de l\'emprunt de 100 000 € (frais de dossier 1 000 € prélevés)',
            lines: [['512', 99000, null], ['627', 1000, null], ['164', null, 100000]],
          },
          {
            title: 'Première échéance annuelle (amortissements constants)',
            lines: [['6611', 4000, null], ['164', 20000, null], ['512', null, 24000]],
          },
          {
            title: 'ICNE au 31/12 (échéance le 1er juillet ; capital restant dû 80 000 € ; 4 % pendant 6 mois)',
            lines: [['6611', 1600, null], ['16884', null, 1600]],
          },
        ],
      },
    },
  },

  // ------------------------------------------------------------------ 17
  {
    id: 17,
    icon: '🧭',
    title: 'Méthode : passer une écriture pas à pas',
    practice: 1,
    levels: {
      kid: {
        html: `
<p>Pour ne jamais te tromper, joue au <strong>détective</strong> 🕵️ en posant 5 questions :</p>
<ol>
  <li>❓ <strong>Que s'est-il passé ?</strong> (j'ai acheté, vendu, payé...)</li>
  <li>❓ <strong>Quelles « choses » ont changé ?</strong> (la tirelire, une dette, une dépense...)</li>
  <li>❓ <strong>Est-ce que chacune a augmenté ou diminué ?</strong></li>
  <li>❓ <strong>À gauche ou à droite ?</strong> (avec la règle du tableau de la leçon 3)</li>
  <li>❓ <strong>Est-ce que gauche = droite ?</strong> Si non, il manque quelque chose !</li>
</ol>
<p>Exemple : tu achètes un jouet 10 € avec ta tirelire. Ce qui change : le <strong>jouet</strong> (+10 €, ce que tu as → gauche) et la <strong>tirelire</strong> (−10 €, ce que tu as qui diminue → droite). Gauche 10 = droite 10 ✅.</p>
${tip("Cinq questions, un contrôle : gauche = droite. Ça marche pour toutes les écritures !")}`,
      },
      teen: {
        html: `
<p>Voici la méthode en <strong>6 étapes</strong> à appliquer à chaque document (facture, relevé de banque, bulletin de paie...) :</p>
<ol>
  <li><strong>Lire</strong> le document et repérer l'<em>événement</em> (achat, vente, règlement, salaire...).</li>
  <li><strong>Repérer les montants</strong> : HT, TVA, TTC, remises...</li>
  <li><strong>Identifier les comptes</strong> concernés (utiliser le plan de comptes).</li>
  <li>Pour chaque compte : quelle <strong>nature</strong> (actif, passif, charge, produit) ? Il <strong>augmente</strong> ou <strong>diminue</strong> ?</li>
  <li>Déterminer le <strong>sens</strong> (débit ou crédit) grâce à la règle de la leçon 3.</li>
  <li><strong>Contrôler</strong> : total débit = total crédit ? Montants et sens cohérents avec le document ?</li>
</ol>
<p><strong>Exemple.</strong> Facture de vente de 1 800 € HT + TVA 20 % à un client. Événement : vente à crédit. Comptes : client (actif, ↑ → débit 2 160), ventes (produit, ↑ → crédit 1 800), TVA collectée (dette, ↑ → crédit 360). Contrôle : 2 160 = 1 800 + 360 ✅.</p>
${tip("En cas de doute, commence par la trésorerie ou la dette : elles sont faciles à repérer, le reste s'en déduit.")}`,
      },
      adult: {
        html: `
<p><strong>Démarche d'analyse d'une opération</strong> :</p>
<ol>
  <li><strong>Document source et fait générateur</strong> : facture (livraison ou service rendu), avis de débit / crédit, bulletin de paie, notice d'inventaire...</li>
  <li><strong>Montants et TVA</strong> : net commercial, frais accessoires, taux, base de TVA, TTC, acomptes, escompte.</li>
  <li><strong>Comptes</strong> : au niveau de détail utile du plan ; distinguer immobilisation / charge, biens / services, exigibilité de la TVA.</li>
  <li><strong>Sens</strong> : selon la nature de chaque compte et la variation (leçon 3).</li>
  <li><strong>Contrôle d'équilibre</strong> puis de cohérence : le solde des comptes de tiers correspond-il au TTC de la facture ? le résultat est-il affecté comme attendu ?</li>
  <li><strong>Enregistrement</strong> : journal, date, pièce, libellé.</li>
</ol>
<p><strong>Erreurs classiques :</strong></p>
<ul>
  <li>Oublier la TVA, ou la calculer sur le TTC.</li>
  <li>Comptabiliser une remise figurant sur la facture (on enregistre le net commercial).</li>
  <li>Créditer le compte d'immobilisation au lieu du compte d'amortissement.</li>
  <li>Confondre 401 (fournisseurs d'exploitation) et 404 (fournisseurs d'immobilisations).</li>
  <li>Inverser le sens pour les comptes de dettes (401, 421, 431...).</li>
</ul>
${tip('Vérifiez toujours : le compte de tiers (411, 401) reçoit toujours le TTC ; les comptes de charges et produits reçoivent le HT.')}`,
        entries: [
          {
            title: 'Exemple 1 — Facture de vente avec remise et port',
            note: 'Brut 2 000 − remise 10 % = net commercial 1 800 ; port facturé 100 HT ; base de TVA 1 900 → TVA 380 ; TTC 2 280.',
            lines: [['411', 2280, null], ['707', null, 1800], ['7085', null, 100], ['44571', null, 380]],
          },
          {
            title: 'Exemple 2 — Achat d\'un ordinateur (1 200 € HT) payé par carte',
            note: 'Bien durable → immobilisation ; TVA récupérable 240 ; paiement immédiat → 512.',
            lines: [['2183', 1200, null], ['44562', 240, null], ['512', null, 1440]],
          },
        ],
      },
    },
  },
];

// ====================================================================== AIDE-MÉMOIRE
/** Libellés des comptes « génériques » utilisés dans les schémas (absents du plan de comptes). */
export const SYMBOLIC_LABELS = {
  '21…': 'Compte d\'immobilisation concerné',
  '28…': 'Compte d\'amortissement concerné',
  '6…': 'Compte de charge concerné',
  '7…': 'Compte de produit concerné',
};

export const MEMO = {
  rules: [
    {
      nature: 'Actif',
      what: 'Ce que l\'entreprise possède (immobilisations, stocks, créances, trésorerie)',
      d: 'Augmente',
      c: 'Diminue',
      solde: 'Débiteur',
      ex: '2xx, 3xx, 411, 44566, 512, 530',
    },
    {
      nature: 'Passif',
      what: 'Ce que l\'entreprise doit (capitaux propres, provisions, dettes)',
      d: 'Diminue',
      c: 'Augmente',
      solde: 'Créditeur',
      ex: '101, 15x, 164, 401, 421, 431, 44571',
    },
    {
      nature: 'Charges',
      what: 'Ce que l\'entreprise consomme (achats, services, salaires, dotations)',
      d: 'Augmente',
      c: 'Diminue',
      solde: 'Débiteur',
      ex: '60x, 61x-62x, 641, 645, 661, 681',
    },
    {
      nature: 'Produits',
      what: 'Ce que l\'entreprise gagne (ventes, produits financiers, reprises)',
      d: 'Diminue',
      c: 'Augmente',
      solde: 'Créditeur',
      ex: '70x, 76x, 775, 78x',
    },
  ],
  tips: [
    'Emplois (ce que j\'ai / ce que je dépense) → <strong>gauche</strong> = débit. Ressources (ce que je dois / ce que je gagne) → <strong>droite</strong> = crédit.',
    'Amortissements (28), dépréciations (29, 39, 49, 59) : comptes correcteurs d\'actif, solde <strong>créditeur</strong>.',
    'Le compte de tiers (401, 411) reçoit le <strong>TTC</strong> ; les charges et produits reçoivent le <strong>HT</strong>.',
    'Total des débits = total des crédits, <strong>toujours</strong>.',
  ],
  compare: {
    head: ['', 'Réduction commerciale (RRR)', 'Réduction financière (escompte)'],
    rows: [
      ['Motif', 'Défaut, quantité, fidélité', 'Paiement anticipé'],
      ['Sur la facture', 'Comptabilisation du <strong>net commercial</strong> : aucun compte de RRR', 'Comptabilisée séparément'],
      ['Après la facture (avoir)', '609 (obtenu) / 709 (accordé)', '765 (obtenu) / 665 (accordé)'],
      ['Nature', 'Réduction du prix d\'achat / de vente', 'Produit / charge financière'],
      ['TVA', 'Calculée sur le net commercial', 'Régularisée (avoir) ou base = net financier'],
    ],
  },
  schemas: [
    {
      title: 'Achat de marchandises à crédit',
      note: 'HT au débit du 607, TVA déductible au débit, TTC au crédit du fournisseur.',
      lines: [['607', 'HT', null], ['44566', 'TVA', null], ['401', null, 'TTC']],
    },
    {
      title: 'Vente de marchandises à crédit',
      note: 'TTC au débit du client, HT et TVA collectée au crédit.',
      lines: [['411', 'TTC', null], ['707', null, 'HT'], ['44571', null, 'TVA']],
    },
    {
      title: 'Déclaration de TVA — liquidation (TVA à décaisser)',
      note: 'Si collectée > déductible.',
      lines: [['44571', 'TVA collectée', null], ['44566', null, 'TVA déd. ABS'], ['44562', null, 'TVA déd. immo.'], ['44551', null, 'TVA à décaisser']],
    },
    {
      title: 'Déclaration de TVA — crédit de TVA',
      note: 'Si déductible > collectée : le crédit est reporté (44567) ou remboursé (44583).',
      lines: [['44571', 'TVA collectée', null], ['44567', 'Crédit de TVA', null], ['44566', null, 'TVA déd. ABS + immo.']],
    },
    {
      title: 'Paiement de la TVA',
      lines: [['44551', 'TVA à décaisser', null], ['512', null, 'TVA à décaisser']],
    },
    {
      title: 'Dotation aux amortissements',
      note: 'Annuité = valeur d\'origine ÷ durée (× mois ÷ 12 la 1re année).',
      lines: [['6811', 'Annuité', null], ['28…', null, 'Annuité']],
    },
    {
      title: 'Réduction commerciale sur la facture (remise)',
      note: 'Non comptabilisée : on enregistre le net commercial.',
      lines: [['607', 'Net commercial', null], ['44566', 'TVA', null], ['401', null, 'TTC']],
    },
    {
      title: 'Réduction commerciale après la facture (avoir de ristourne)',
      note: 'Chez l\'acheteur : 609 et TVA régularisée.',
      lines: [['401', 'TTC', null], ['609', null, 'HT'], ['44566', null, 'TVA']],
    },
    {
      title: 'Réduction financière : escompte obtenu (acheteur)',
      note: 'Escompte accordé au règlement anticipé. Chez le vendeur : 665 au débit.',
      lines: [['401', 'TTC', null], ['512', null, 'Règlement'], ['765', null, 'Escompte HT'], ['44566', null, 'TVA régularisée']],
    },
    {
      title: 'Facture d\'avoir sur retour de marchandises (acheteur)',
      lines: [['401', 'TTC', null], ['607', null, 'HT'], ['44566', null, 'TVA']],
    },
    {
      title: 'Vente avec port facturé forfaitairement',
      lines: [['411', 'TTC', null], ['707', null, 'HT marchandises'], ['7085', null, 'HT port'], ['44571', null, 'TVA']],
    },
    {
      title: 'Acquisition d\'une immobilisation',
      lines: [['21…', 'HT', null], ['44562', 'TVA', null], ['404', null, 'TTC']],
    },
    {
      title: 'Client douteux et dépréciation (2 écritures)',
      entries: [
        { label: '1. Reclassement', lines: [['416', 'TTC', null], ['411', null, 'TTC']] },
        { label: '2. Dépréciation (perte probable sur le HT)', lines: [['6817', 'Perte probable', null], ['491', null, 'Perte probable']] },
      ],
    },
    {
      title: 'Paie : constatation du salaire',
      lines: [['641', 'Brut', null], ['431', null, 'Cotisations salariales'], ['4421', null, 'Prélèvement à la source'], ['421', null, 'Net à payer']],
    },
    {
      title: 'Cession d\'immobilisation (sortie du bien)',
      lines: [['28…', 'Amortissements cumulés', null], ['675', 'VNC', null], ['21…', null, 'Valeur d\'origine']],
    },
    {
      title: 'Régularisations : CCA et PCA',
      note: 'CCA : charge payée d\'avance. PCA : produit encaissé d\'avance.',
      entries: [
        { label: 'Charge constatée d\'avance', lines: [['486', 'CCA', null], ['6…', null, 'CCA']] },
        { label: 'Produit constaté d\'avance', lines: [['7…', 'PCA', null], ['487', null, 'PCA']] },
      ],
    },
    {
      title: 'Variation des stocks (inventaire intermittent)',
      entries: [
        { label: '1. Annulation du stock initial', lines: [['6037', 'Stock initial', null], ['37', null, 'Stock initial']] },
        { label: '2. Constatation du stock final', lines: [['37', 'Stock final', null], ['6037', null, 'Stock final']] },
      ],
    },
    {
      title: 'Emprunt : échéance',
      lines: [['6611', 'Intérêts', null], ['164', 'Capital', null], ['512', null, 'Échéance']],
    },
  ],
};
