# 👋 Anglais Owen

Application pour **découvrir l'anglais en s'amusant** (conçue pour un enfant de 7 ans, CE1).
Elle fonctionne sur smartphone, tablette et PC, s'installe comme une vraie application et
marche **hors connexion**. Projet jumeau de Maths Owen et Français Owen.

👉 **Jouer / installer : https://vigieraudrey.github.io/AnglaisOwen/**

## Ce qu'il y a dedans

**👋 Hello!** : bonjour, merci, s'il te plaît, pardon… (16 formules), « Comment ça va ? »
(12 émotions), 12 petites questions/réponses (*What's your name? → My name is Owen.*),
et « Que dis-tu ? » : une situation écrite en français → la bonne formule en anglais.

**🔢 Les nombres** : de 0 à 20 et les dizaines jusqu'à 100. Jeux : écouter et trouver,
🍎 *How many?* (compter), ➕ *Maths in English* (« three plus four »), lire, *Yes or no?*,
écrire, bulles, chrono, memory. Les pièges *thirteen / thirty* sont travaillés exprès.

**🎨 Les couleurs** : 11 couleurs, 6 formes, et les mélanges (*red and yellow make orange*).
Jeux : *What colour is the banana?*, 🧪 le labo des couleurs (on mélange la peinture !)…

**📚 Les mots** : 245 mots illustrés en 13 thèmes (animaux, ferme, fruits et légumes, à table,
corps, vêtements, famille, personnages, école, maison, jouets, nature et météo, transports)
+ les « mots jumeaux » qui ressemblent au français (*lion, pizza, robot*…).

**🏃 Les actions** : 30 verbes (*run, jump, swim, eat, sleep*…), 12 ordres de 🙋 « Jacques a dit »
(*Simon says: clap your hands!*) et 🐧 *Can a fish fly?* : ce que savent faire les animaux,
avec une petite curiosité à chaque fois (un éléphant ne peut pas sauter !).

**💬 Les phrases** (pour aller plus loin) : les contraires (*big / small*), *I like / I don't like*,
*I have two cats* (et les pluriels bizarres : *mice, fish, sheep*), *a red heart* (la couleur
avant le mot), *in / on / under / next to*, 🕵️ 24 devinettes « Qui suis-je ? »,
🚂 phrases à remettre en ordre.

**🎮 Les jeux** : 🫧 les bulles, 🙋 Jacques a dit, ☕ le petit café (« *Can I have two apples,
please?* »), 🧪 le labo des couleurs, 🃏 memory, ⏱️ défi chrono, 🦜 le perroquet (on s'enregistre
et on compare sa voix au modèle), devinettes, méli-mélos.

**Le français comme appui** : consignes en français (touche-les pour les entendre), bouton 🇫🇷
pour voir la traduction, chaque correction montre le mot anglais **et** sa traduction.
Des situations et des curiosités à lire : on travaille aussi la lecture en français.

**💡 Le savais-tu ?** : 32 petites curiosités (pourquoi *Sunday* veut dire « jour du soleil »,
les faux amis comme *pain*, ce que dit un coq anglais…).

**Pour mémoriser** : répétition espacée, 🔁 révisions du jour, « Rejouer mes erreurs ».

**Pour s'amuser** : étoiles ⭐, niveaux (de 🐣 *Petit curieux* à 👑 *King of English*),
50 autocollants « tour du monde », médailles, séries 🔥, records, et Biscuit le chien 🐶.

**Espace parents** (protégé par un petit calcul) : notions proposées, prénom et âge (utilisés
dans *My name is…*), accent britannique ou américain, vitesse de la voix, traductions,
suivi des progrès mot par mot, export / import de la sauvegarde.

## Essayer sur l'ordinateur

```bash
cd AnglaisOwen
python3 -m http.server 8000
```
Puis ouvrir http://localhost:8000

## La voix

Tout repose sur la voix de l'appareil (synthèse vocale). Il faut une **voix anglaise** (et
française pour les consignes) : sur Android, « Synthèse vocale Google » avec les langues
anglais et français ; sur iPhone, iPad et Mac, elles sont fournies. Les boutons « Tester la voix »
de l'espace parents permettent de vérifier. Le jeu du perroquet utilise le micro
(adresse https ou localhost) ; rien n'est enregistré ni envoyé.

## Mettre en ligne pour l'installer

Fichiers statiques : n'importe quel hébergement gratuit en **https** convient (GitHub Pages,
Netlify…). Puis sur le téléphone : Android (Chrome) menu ⋮ → « Installer l'application » ;
iPhone (Safari) Partager → « Sur l'écran d'accueil ».

## Structure

Voir [CLAUDE.md](CLAUDE.md) (architecture, ajouter des mots, un exercice, un jeu ; feuille de route).
