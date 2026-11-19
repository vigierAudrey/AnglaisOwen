// Registre des façons de jouer (modes).
//
// Un exercice « question par question » est un objet { id, label, emoji, desc, build(item, ctx) }.
// ctx = { unit, skill, skills, pool } (pool : les éléments choisis, pour les mauvaises réponses).
// build renvoie une question, ou null si l'élément ne s'y prête pas. Format d'une question :
//   item          l'élément travaillé (sa progression est enregistrée)
//   instruction   consigne courte, en français (touchée → lue en français)
//   say           ce qui est lu automatiquement en anglais (texte, ou [['en', …], ['fr', …]]) + bouton 🔊
//   bigListen     pas d'image : un gros bouton 🔊 au centre de la carte
//   visual        grande image : { emoji } | { color } | { num } | { emojis } | { mix: [hex, hex] } | { scene }
//   text, textLang ('en' | 'fr'), textOpts { big }   texte à lire
//   help          traduction française affichée par le bouton 🇫🇷
//   input         'choices' | 'truefalse' | 'tiles'
//   choices       [{ value, visual?, text?, say? }] + choiceStyle 'emoji' | 'emojis' | 'swatches' | 'number' | 'scenes' | 'text'
//   tfLabels      libellés Oui / Non        tiles, tileStyle, tileEnd   étiquettes à remettre dans l'ordre
//   answer        la bonne réponse          afterOk  lu après une bonne réponse
//   reveal        { en, fr } montré après la réponse      note  curiosité (français) montrée après la réponse
//   correction    { visual, en, fr, text?, say } affiché en cas d'erreur
//
// Un mode avec `screen` a son propre écran (apprendre, jeux).

import * as common from './common.js';
import * as special from './special.js';

export const EXERCISES = Object.fromEntries(
  [common, special].flatMap((m) => Object.values(m)).filter((x) => x && x.build).map((x) => [x.id, x])
);

const SCREENS = {
  learn: { id: 'learn', label: 'J’apprends', emoji: '📖', desc: 'Regarde et écoute', screen: 'learn' },
  bubbles: { id: 'bubbles', label: 'Les bulles', emoji: '🫧', desc: 'Éclate la bonne bulle', screen: 'bubbles', game: true },
  memory: { id: 'memory', label: 'Memory', emoji: '🃏', desc: 'L’image et son mot anglais', screen: 'memory', game: true },
  chrono: { id: 'chrono', label: 'Défi chrono', emoji: '⏱️', desc: 'Le plus possible en 60 secondes', screen: 'chrono', game: true },
  simon: { id: 'simon', label: 'Jacques a dit', emoji: '🙋', desc: 'Simon says… jump!', screen: 'simon', game: true },
  lab: { id: 'lab', label: 'Le labo des couleurs', emoji: '🧪', desc: 'Mélange la peinture', screen: 'lab', game: true },
  parrot: { id: 'parrot', label: 'Le perroquet', emoji: '🦜', desc: 'Répète et écoute-toi', screen: 'parrot', game: true },
  cafe: { id: 'cafe', label: 'Le petit café', emoji: '☕', desc: 'Sers les clients', screen: 'cafe', game: true },
};

export const MODES = {
  ...SCREENS,
  ...EXERCISES,
  review: { id: 'review', label: 'Révisions', emoji: '🔁', desc: 'Pour ne pas oublier' },
  mix: { id: 'mix', label: 'Un peu de tout', emoji: '🎲', desc: 'Tous les jeux mélangés' },
  play: { id: 'play', label: 'Je m’entraîne', emoji: '🎯', desc: 'Les exercices des notions choisies' },
};
