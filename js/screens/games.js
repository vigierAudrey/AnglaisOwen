// Salle de jeux : accès direct aux jeux, avec ce que le parent a choisi.

import { h } from '../ui/dom.js';
import { getState } from '../core/store.js';
import { go } from '../core/router.js';
import { getUnit, enabledSkills } from '../units/index.js';
import { header, mascot } from '../ui/components.js';

const GAMES = [
  { screen: 'bubbles', unitId: 'words', emoji: '🫧', label: 'Les bulles', desc: 'Écoute et éclate la bonne bulle' },
  { screen: 'simon', unitId: 'actions', emoji: '🙋', label: 'Jacques a dit', desc: '« Simon says… » : bouge comme il dit !' },
  { screen: 'cafe', unitId: 'words', emoji: '☕', label: 'Le petit café', desc: 'Sers les clients qui commandent en anglais' },
  { screen: 'lab', unitId: 'colours', emoji: '🧪', label: 'Le labo des couleurs', desc: 'Mélange la peinture et découvre' },
  { screen: 'memory', unitId: 'words', emoji: '🃏', label: 'Memory', desc: 'Retrouve l’image et son mot anglais' },
  { screen: 'chrono', unitId: 'words', emoji: '⏱️', label: 'Défi chrono', desc: 'Le plus de mots en 60 secondes' },
  { screen: 'parrot', unitId: 'words', emoji: '🦜', label: 'Le perroquet', desc: 'Répète, enregistre-toi et écoute-toi' },
  { mode: 'play', unitId: 'phrases', skill: 'riddles', emoji: '🕵️', label: 'Devinettes', desc: 'I am yellow. I am a fruit… Qui suis-je ?' },
  { mode: 'canDo', unitId: 'actions', emoji: '🐧', label: 'Can a fish fly?', desc: 'Ce que les animaux savent faire… ou pas !' },
  { screen: 'bubbles', unitId: 'numbers', emoji: '🔢', label: 'Bulles des nombres', desc: 'One, two, three… pop !' },
  { mode: 'mix', unitId: 'hello', emoji: '👋', label: 'Méli-mélo Hello!', desc: 'Bonjour, merci, ça va ?' },
  { mode: 'mix', unitId: 'colours', emoji: '🌈', label: 'Méli-mélo des couleurs', desc: 'Toutes les couleurs mélangées' },
];

const SOON = [
  { emoji: '🎵', label: 'Les comptines' },
  { emoji: '🗺️', label: 'Le tour du monde' },
];

export default function games() {
  const st = getState();
  const launch = (g) => {
    let skillIds = enabledSkills(getUnit(g.unitId), st).map((s) => s.id);
    if (g.skill) skillIds = skillIds.includes(g.skill) ? [g.skill] : [];
    if (g.screen) go(g.screen, { unitId: g.unitId, skillIds });
    else go('session', { unitId: g.unitId, skillIds, mode: g.mode });
  };
  return h(
    'div',
    { class: 'screen games' },
    header('Les jeux'),
    mascot('Let’s play! À quoi on joue ?', { mood: 'happy' }),
    h(
      'div',
      { class: 'game-list' },
      GAMES.map((g) =>
        h('button', { class: `game-card theme-${g.unitId}`, onclick: () => launch(g) }, h('span', { class: 'game-emoji' }, g.emoji), h('span', { class: 'game-txt' }, h('b', {}, g.label), h('small', {}, g.desc)))
      ),
      SOON.map((g) => h('div', { class: 'game-card soon' }, h('span', { class: 'game-emoji' }, g.emoji), h('span', { class: 'game-txt' }, h('b', {}, g.label), h('small', {}, '🔒 Bientôt !'))))
    )
  );
}
