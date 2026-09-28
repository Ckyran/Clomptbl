# CptblT — apprendre et réviser les écritures comptables

**CptblT** est une application web pédagogique, en français, pour apprendre et réviser les
**écritures comptables** selon le **Plan Comptable Général (PCG)** français : du niveau débutant
jusqu'aux cas complets (immobilisations, provisions, paie, régularisations, cessions, emprunts).

Le site est **100 % statique** : `index.html` + `styles.css` + JavaScript en **modules ES**, sans
framework ni étape de build. Tous les chemins sont relatifs, il se déploie tel quel sur
**GitHub Pages**.

## Fonctionnalités

| Onglet | Contenu |
| --- | --- |
| **Cours** (onglet par défaut) | 17 leçons, chacune expliquée de 3 façons : 🧒 *Enfant* (analogies, aucun jargon), 🧑 *Jeune* (vocabulaire courant), 👩‍💼 *Adulte* (rigueur comptable + exemples d'écritures avec les vrais numéros de comptes). Sommaire latéral, sélecteur de niveau, tableaux d'écritures d'exemple. |
| **Exercices** | Tableau de bord (réussis, barre de progression, compteur d'exercices générés réussis) ; **25 exercices fixes** en 4 niveaux ; grille de saisie de type journal (n° de compte, libellé auto-rempli, débit, crédit, ajout/suppression de lignes) ; contrôle d'équilibre en temps réel ; **Vérifier** (correction ligne par ligne), **Voir la correction**, **Exercice suivant** ; statut *à faire / en cours / réussi* mémorisé ; par niveau : **🎲 Exercice infini** et **↻ Reprendre**. |
| **Plan de comptes** | ≈ 500 comptes et sous-comptes (classes 1 à 9), en **arborescence repliable** (44 → 445 → 4455 → 44551), boutons *Tout déplier / Tout replier*, **recherche** par numéro ou libellé (liste plate pendant la recherche). |
| **Outils** | Calculateur de TVA (HT ↔ TTC ; 20 / 10 / 5,5 / 2,1 %) et vérificateur d'équilibre débit/crédit. |
| **Aide-mémoire** | Règle débit/crédit par nature de compte (actif, passif, charges, produits), réductions commerciales vs financières, schémas d'écritures types. |
| 🌙 / ☀️ | Thème **jour / nuit** complet, mémorisé ; au premier chargement, la préférence système (`prefers-color-scheme`) est respectée. |

### Les 4 niveaux d'exercices

1. **Les bases** — apport en capital, achat/vente de marchandises à crédit (avec TVA), règlement fournisseur, encaissement client, alimentation de la caisse.
2. **TVA & opérations courantes** — facture avec remise, escompte de règlement, facture d'avoir, vente avec port facturé, liquidation et paiement de la TVA.
3. **Immobilisations, provisions, paie** — acquisition, dotation aux amortissements, client douteux + dépréciation, salaire, charges patronales, paiement du net, provision pour risque.
4. **Cas complets & régularisations** — cession d'immobilisation (2 écritures), charges/produits constatés d'avance, variation des stocks, obtention et échéance d'emprunt.

### Correction automatique

Une ligne saisie est **juste** si le compte, le sens (débit/crédit) et le montant correspondent à une ligne du corrigé.
La comparaison est **indépendante de l'ordre** des lignes, tolère **1 centime** d'arrondi et accepte des
**comptes équivalents** (ex. caisse : `53`, `530` ou `531` ; `401`/`4011` ; `512`/`5121`...).
Les lignes justes passent en **vert**, les lignes fausses ou en trop en **rouge** avec un message précis (montant
incorrect, sens inversé, compte non attendu, doublon...). Un exercice n'est « **réussi** » que lorsque *toutes* les
lignes correspondent au corrigé et qu'il n'en manque aucune. L'explication détaillée s'affiche après une réussite ou via
**Voir la correction**.

### Exercices infinis

Pour chaque niveau, des **modèles paramétrés** (`js/data/generators.js`) tirent au hasard montants, taux de TVA,
tiers, comptes et scénarios. Tous les calculs sont faits en **centimes entiers** : les corrigés sont équilibrés par
construction, puis **revalidés** avant affichage (comptes existants, montants positifs, débit = crédit). Après un
exercice généré réussi, **🎲 Nouvel exercice aléatoire** relance la boucle et le compteur du tableau de bord augmente.

## Lancer l'application

```bash
python3 serve.py            # http://localhost:8000
python3 serve.py 8080       # autre port (ou variable d'environnement PORT)
```

`serve.py` est un petit serveur statique (bibliothèque standard uniquement) lié sur `0.0.0.0`, qui envoie
`Cache-Control: no-store` pour que le navigateur recharge toujours la dernière version des fichiers.

> Les modules ES nécessitent un serveur HTTP : ouvrir `index.html` directement (`file://`) ne fonctionne pas.

Le site peut aussi être publié sans modification sur GitHub Pages (*Settings → Pages → Deploy from a branch*).

## Structure des fichiers

```
index.html               page unique (en-tête, onglets, bascule jour/nuit)
styles.css               styles (thème clair/sombre, responsive, police Inter)
serve.py                 serveur statique anti-cache
package.json             scripts npm (start, check) et "type": "module"
js/app.js                logique : navigation, cours, saisie, correction, plan, outils, thème
js/grading.js            correction automatique (logique pure, testable sous Node)
js/util.js               formatage, lecture des montants, aléatoire, constructeurs D()/C()
js/data/accounts.js      plan de comptes (classes 1 à 9), arborescence, comptes équivalents
js/data/exercises.js     les 25 exercices fixes (énoncés + corrigés)
js/data/generators.js    générateurs d'exercices aléatoires + validateExercise()
js/data/course.js        les 17 leçons × 3 niveaux + contenu de l'aide-mémoire
tools/check.mjs          contrôles qualité automatiques (voir ci-dessous)
```

La progression et le thème sont stockés dans le `localStorage` du navigateur (clés `cptblt.progress.v1` et
`cptblt.theme`) ; l'application fonctionne aussi si le stockage est indisponible.

## Contrôles qualité

```bash
node tools/check.mjs            # ou : npm run check
node tools/check.mjs --runs=1000   # davantage de tirages par modèle
```

Le script vérifie, sans aucune dépendance :

- la **syntaxe** de tous les modules JavaScript ;
- le plan de comptes (numéros uniques, classes 1 à 9, arborescence cohérente) ;
- que **tous les corrigés fixes et générés** (300 tirages par modèle par défaut) sont **équilibrés**, n'emploient que
  des **comptes présents dans le plan** et n'ont aucun **montant négatif** ;
- les 17 leçons × 3 niveaux (et que chaque écriture d'exemple est équilibrée) et les schémas de l'aide-mémoire ;
- des tests unitaires de la correction automatique (ordre libre, tolérance, sens inversé, comptes équivalents...) ;
- que les chemins de `index.html` et les imports sont relatifs.

Il retourne un code de sortie non nul en cas d'anomalie (utilisable en intégration continue).

## Ajouter un exercice

### Un exercice fixe

Ajoutez un objet à la liste `EXERCISES` de `js/data/exercises.js`, dans le bloc du niveau voulu (l'ordre de la liste
est l'ordre d'affichage et de l'enchaînement « Exercice suivant ») :

```js
{
  id: 'n2-07',                 // unique et STABLE : la progression est mémorisée avec cet identifiant
  level: 2,                    // 1 à 4
  title: 'Achat avec escompte',
  statement: "Le 3 mars, … <strong>1 000 € HT</strong> … Enregistrez la facture.",   // HTML simple autorisé
  hint: "Indice repliable affiché à l'élève.",
  parts: [                     // une « partie » = une écriture ; plusieurs parties = plusieurs écritures
    {
      title: 'Écriture 1 — …', // facultatif s'il n'y a qu'une écriture
      lines: [
        D('607', 1000),        // débit
        D('44566', 200),
        C('401', 1200),        // crédit
        // comptes équivalents acceptés : C('530', 500, ['53', '531'])
      ],
    },
  ],
  explanation: '<p>Explication affichée après réussite ou via « Voir la correction ».</p>',
}
```

Puis lancez `node tools/check.mjs` : il refuse un corrigé déséquilibré, un compte absent du plan ou un identifiant en
double. Si l'exercice utilise un compte qui n'est pas dans le plan, ajoutez-le d'abord dans `js/data/accounts.js`
(une ligne `numéro libellé`).

### Un modèle d'exercice aléatoire

Ajoutez un objet `{ key, make(r) }` à la liste du niveau (`N1` à `N4`) dans `js/data/generators.js`. `make` reçoit une
boîte à outils aléatoire `r` (`r.int(min, max)`, `r.step(min, max, pas)`, `r.pick(liste)`, `r.chance(p)`) et retourne
`{ title, statement, hint, parts, explanation }`. Calculez les montants en **centimes entiers** (aides : `vat()`,
`m()` pour l'affichage, `e()` pour convertir en euros dans les lignes du corrigé) ; le contrôle qualité tire chaque
modèle des centaines de fois.

### Un compte ou une leçon

- **Compte** : une ligne `numéro libellé` dans `js/data/accounts.js` (la classe et l'arborescence sont déduites du numéro).
- **Leçon** : un objet dans `LESSONS` (`js/data/course.js`) avec `levels: { kid, teen, adult }` ; le niveau `adult` peut
  fournir des `entries` (écritures d'exemple contrôlées automatiquement).

## Références

Les numéros de comptes, les schémas d'écritures (TVA, remises et escomptes, avoirs, frais de port, acomptes,
emballages consignés, etc.) et les cas de la section « Achats et ventes » s'appuient sur les deux documents fournis
en référence : *300 écritures comptables expliquées* (complément numérique, Vuibert) et *Les 250 écritures
comptables les plus fréquentes* (P. Recroix, Gualino, 2020). Le contenu est fourni à titre pédagogique.
