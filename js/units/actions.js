// Univers « Les actions » : les verbes, Jacques a dit, ce que savent faire les animaux.

import { MOVES, DAILY, COMMANDS, CAN, parseLine, ANIMAL_FR, VERB_FR } from '../data/actions.js';
import { article, slug } from '../lang/en.js';

const U = 'actions';
const verbItems = (lines, skillId, prefix) => lines.map(parseLine).map((v) => ({ id: `${prefix}:${slug(v.en)}`, unitId: U, skillId, kind: 'emoji', ...v }));

const can = CAN.map(([animal, ae, verb, ve, yes, note]) => ({
  id: `can:${animal}:${verb}`, unitId: U, skillId: 'can', animal, ae, verb, ve, yes, note,
  en: `${article(animal) === 'an' ? 'An' : 'A'} ${animal} ${yes ? 'can' : 'can’t'} ${verb}.`,
  fr: `${ANIMAL_FR[animal][0].toUpperCase() + ANIMAL_FR[animal].slice(1)} ${yes ? 'sait' : 'ne sait pas'} ${VERB_FR[verb]}.`,
}));

export default {
  id: U,
  name: 'Les actions',
  emoji: '🏃',
  mascotLine: 'Run, jump, swim… je bouge !',
  families: [
    { id: 'verbs', label: 'Les verbes', emoji: '🏃' },
    { id: 'fun', label: 'Pour jouer', emoji: '🎉' },
  ],
  skills: [
    { id: 'moves', label: 'Je bouge', short: 'Je bouge', emoji: '🤸', family: 'verbs', items: verbItems(MOVES, 'moves', 'v'), parentInfo: 'run, jump, swim, climb…' },
    { id: 'daily', label: 'Tous les jours', short: 'Tous les jours', emoji: '🪥', family: 'verbs', items: verbItems(DAILY, 'daily', 'v'), parentInfo: 'eat, drink, sleep, read…' },
    { id: 'commands', label: 'Jacques a dit (Simon says)', short: 'Simon says', emoji: '🙋', family: 'fun', items: verbItems(COMMANDS, 'commands', 'cmd'), parentInfo: 'Les ordres à mimer : sit down, clap your hands…' },
    { id: 'can', label: 'Can a fish fly?', short: 'Can it…?', emoji: '🐧', family: 'fun', items: can, exercises: ['canDo'], parentInfo: 'Ce que les animaux savent (ou pas !) faire : Yes, it can / No, it can’t.' },
  ],
  defaultSkills: ['moves', 'daily', 'commands', 'can'],
  modes: ['learn', 'listen', 'simon', 'canDo', 'picture', 'translate', 'read', 'memory', 'bubbles', 'parrot'],
  reviewModes: ['listen', 'picture', 'translate'],
};
