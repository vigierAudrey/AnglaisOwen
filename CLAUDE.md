# Anglais Owen — instructions projet

Application pour découvrir **l'anglais** pour **Owen, 7 ans (CE1)** : les nombres, les couleurs,
les mots du quotidien, les actions (verbes), les formules de politesse, puis de petites phrases
pour aller plus loin. Projet jumeau de `../MathsOwen` et `../FrançaisOwen` (même socle technique,
même esprit). Elle doit être **amusante avant tout**, nourrir la **curiosité** (petits « Le
savais-tu ? », animaux qui savent ou non nager / voler, mélanges de couleurs…) et faire
réellement progresser.

## Principes pédagogiques (non négociables)

- **L'oral d'abord.** À 7 ans on apprend une langue en écoutant et en associant à une image.
  Tout élément anglais a une voix (synthèse anglaise, en-GB par défaut). La plupart des
  exercices se font **sans savoir lire l'anglais** (écoute → image / couleur / nombre).
  Les exercices où il faut lire l'anglais (« Lis et trouve », « Écris le mot », « Phrase en
  ordre ») sont présentés comme des défis pour aller plus loin.
- **Le français comme appui (et comme entraînement).** L'interface et les consignes sont en
  français ; chaque correction montre le mot anglais **et** sa traduction (« cat = un chat 🐱 »).
  Le bouton 🇫🇷 d'une question affiche (et lit) la traduction : l'enfant lit du français pour se
  débrouiller. Les situations (« Tu arrives à l'école le matin… ») sont écrites en français.
- **Le choix.** L'enfant choisit les notions (puces) et le jeu ; le parent ne fait que limiter
  ce qui est proposé (espace parents).
- **Comprendre puis mémoriser** : correction bienveillante (image + mot + traduction, écoute),
  l'élément raté revient 2 questions plus tard, répétition espacée (boîtes de Leitner) et
  « révisions du jour ».
- **Amusant** : étoiles, Biscuit le chien 🐶, confettis, autocollants « voyage », séries 🔥,
  jeux (bulles, Jacques a dit, café, labo des couleurs, memory, chrono, perroquet).
- **Ton** : tutoiement, phrases courtes, jamais « Faux ! » (« Presque ! », « On le retient
  ensemble »). Typographie française dans l'interface (’, espace avant ! ? :) ; anglais
  correct et naturel dans les contenus (« Yes, it is! », « No, it can't. »).
  Anglais britannique par défaut (orthographe *colour*, *mum*), comme à l'école en France.

## Principes techniques (non négociables)

- **Gros éléments tactiles**, mobile d'abord (360 px), beau sur PC (max-width 760 px), jouable au clavier.
- **Aucune dépendance, aucun build** : HTML/CSS/JS (modules ES). Pas de framework.
- **Données locales uniquement** (localStorage). Pas de compte, pas de serveur, pas de pistage.
- Ne jamais insérer de texte via `innerHTML` : utiliser `h()` (js/ui/dom.js).
- Les ids des éléments (`w:cat`, `num:7`, `col:red`…) sont les clés de progression :
  **ne jamais les changer sans migration**.

## Architecture

```
index.html, manifest.webmanifest, sw.js   PWA (installable, hors-ligne)
css/style.css         tout le style ; couleur par univers via .theme-<id>
js/app.js             démarrage + déclaration des écrans
js/data/
  vocab.js            BANQUE DE MOTS illustrés par thème (« en|fr|emoji|* » ; * = mot transparent)
  numbers.js          nombres 0-20 et dizaines
  colours.js          couleurs (code couleur, objets de cette couleur), formes, mélanges
  actions.js          verbes d'action, ordres de « Jacques a dit », « Can a fish fly? »
  hello.js            politesse, émotions, petites questions/réponses, situations
  phrases.js          contraires, I like, I have (pluriels), couleur+forme, in/on/under,
                      devinettes, phrases à remettre en ordre
  facts.js            « Le savais-tu ? » (petites curiosités, en français)
js/lang/en.js         petite grammaire anglaise (a / an, pluriels, « Is it…? / Yes, it is! »)
js/units/             univers (bonjour, nombres, couleurs, mots, actions, phrases) + registre index.js
js/exercises/         exercices question par question + registre index.js
js/core/              store (sauvegarde), srs (Leitner + isDue), session, router, rewards, util
js/ui/                dom (h), speech (voix anglaise + française), sound, confetti, components (visuels, mascotte…), record (micro)
js/screens/           home, unitMenu, session, results, learn, games, memory, chrono, bubbles,
                      simon, cafe, lab, parrot, rewards, parent
tools/check.mjs       vérification des données et de tous les exercices (node) — non livré
```

### Concepts

- **Élément** (`item`) : `{ id, unitId, skillId, en, fr, emoji?, … }` + champs propres
  (`n` pour un nombre, `hex` pour une couleur, `q`/`a` pour une question…). C'est ce que
  l'enfant apprend ; sa progression est stockée sous son `id`.
- **Notion** (`skill`) : `{ id, label, short, emoji, family, items, exercises? }`.
  `exercises` : exercices propres à la notion (sinon `unit.reviewModes`), utilisés par
  « Un peu de tout », les révisions et « Je m'entraîne ».
- **Univers** (`unit`) : `{ id, name, emoji, mascotLine, learnKind, families, skills,
  defaultSkills, modes, reviewModes }`.
- **Exercice** : `{ id, label, emoji, desc, build(item, ctx) → question | null }`. Format de la
  question documenté en tête de `js/exercises/index.js`. `session.js` sait afficher :
  `choices` (styles `emoji`, `emojis`, `text`, `number`, `swatches`, `scenes`), `truefalse`, `tiles`.
- **Voix** : `speak(text)` lit en anglais, `speak(text, { lang: 'fr' })` en français,
  `speakSeq([['en', 'cat'], ['fr', 'un chat']])` enchaîne les deux.

### Ajouter du contenu

- Mots : une ligne dans `data/vocab.js` (bon thème). Chaque emoji doit être unique dans
  l'univers (sinon deux images identiques dans les choix) : `node tools/check.mjs` le vérifie.
- Phrases, devinettes, curiosités : `data/phrases.js`, `data/facts.js`.
- Puis `node tools/check.mjs` (construit tous les exercices pour tous les éléments, vérifie
  les doublons, les textes incomplets et que chaque fichier JS est bien dans `sw.js`).
- Attention aux noms de classes CSS : un style de choix ne doit pas porter le nom d'une classe
  de visuel (d'où `swatches` / `scenes`), et la bulle de la mascotte s'appelle `.bubble`
  (les bulles du jeu : `.bub`). Un id d'exercice ne doit pas reprendre `mix`, `play`, `review`.

### Ajouter un exercice / un jeu / un univers

- Exercice : objet exporté dans `js/exercises/<fichier>.js`, id ajouté aux `modes` de
  l'univers (et `reviewModes` / `exercises` d'une notion s'il convient).
- Jeu avec son propre écran : entrée dans `SCREENS` (exercises/index.js), `js/screens/<nom>.js`,
  enregistré dans `app.js`, listé dans `screens/games.js`.
- Univers : `js/units/<id>.js`, ajouté à `units` (units/index.js), `.theme-<id>` dans le CSS.
- **Toujours** ajouter les nouveaux fichiers à `ASSETS` dans `sw.js` et **incrémenter `VERSION`**.
  Les réglages par défaut sont fusionnés automatiquement avec les anciennes sauvegardes.

## Lancer / tester

```bash
python3 -m http.server 8000      # puis http://localhost:8000
node tools/check.mjs
```
- Le service worker sert le cache d'abord : recharger **deux fois** après une modification.
- Vérifier sur un viewport de téléphone (390×844) et sur PC, et regarder la console.

## Git et déploiement

- Dépôt : https://github.com/vigierAudrey/AnglaisOwen (branche `main`).
- Hébergement : **GitHub Pages** depuis `main` (racine) → https://vigieraudrey.github.io/AnglaisOwen/
  Chaque `git push` sur `main` met le site à jour (1 à 2 min). Penser à incrémenter `VERSION` dans `sw.js`.
- Messages de commit en français. E-mail de commit : l'adresse noreply GitHub
  (`193433370+vigierAudrey@users.noreply.github.com`), jamais une adresse personnelle (dépôt public).

## Feuille de route

- **Étape 1 (faite)** : socle PWA ; univers Hello (politesse, émotions, questions, situations),
  Nombres (0-20, dizaines, compter, calcul en anglais), Couleurs & formes (+ mélanges),
  Mots (14 thèmes illustrés, mots transparents), Actions (verbes, Jacques a dit, « Can a fish
  fly? »), Phrases (contraires, I like, I have + pluriels, couleur + forme, in/on/under,
  devinettes, phrases en ordre) ; jeux Bulles, Jacques a dit, Le petit café, Labo des
  couleurs, Memory, Chrono, Perroquet (s'enregistrer et se réécouter) ; révisions du jour,
  « Le savais-tu ? », espace parents.
- **Ensuite** : jours de la semaine / mois / l'heure, l'alphabet chanté, petites histoires
  illustrées à écouter, comptines, carte du monde anglophone, chiffres jusqu'à 100 en
  détail, « Where is…? » dans une scène, plusieurs profils enfants, export Play Store.
