// Univers « Les mots » : le vocabulaire illustré, par thème.

import { THEMES, VOCAB } from '../data/vocab.js';
import { det } from '../lang/en.js';

const U = 'words';

const toItem = (w) => ({ id: `w:${w.en}`, unitId: U, skillId: w.theme, kind: 'emoji', en: w.en, fr: w.fr, emoji: w.emoji, twin: w.twin, ...det(w.en) });
const ITEMS = VOCAB.map(toItem);

const themeSkills = THEMES.map((t) => ({
  id: t.id,
  label: t.label,
  short: t.label.replace(/^(Les |La |Le |L’)/, ''),
  emoji: t.emoji,
  family: 'themes',
  items: ITEMS.filter((i) => i.skillId === t.id),
}));

const twins = {
  id: 'twins',
  label: 'Les mots transparents',
  short: 'Mots jumeaux',
  emoji: '👯',
  family: 'twins',
  parentInfo: 'Les mots qui ressemblent au français (lion, pizza, robot…) : très rassurant pour commencer.',
  items: ITEMS.filter((i) => i.twin),
};

export default {
  id: U,
  name: 'Les mots',
  emoji: '📚',
  mascotLine: 'Les animaux, à manger, la maison…',
  families: [
    { id: 'themes', label: 'Les thèmes', emoji: '🗂️' },
    { id: 'twins', label: 'Les mots jumeaux', emoji: '👯' },
  ],
  skills: [...themeSkills, twins],
  defaultSkills: [...THEMES.map((t) => t.id), 'twins'],
  modes: ['learn', 'listen', 'picture', 'isIt', 'translate', 'read', 'spell', 'memory', 'bubbles', 'chrono', 'parrot'],
  reviewModes: ['listen', 'picture', 'isIt', 'translate'],
};
