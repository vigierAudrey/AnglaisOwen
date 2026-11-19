// Univers « Couleurs et formes ».

import { COLOURS, COLOUR_GROUPS, COLOUR_BY, SHAPES, MIXES } from '../data/colours.js';
import { det } from '../lang/en.js';

const U = 'colours';

const colourSkills = COLOUR_GROUPS.map((g) => ({
  id: g.id,
  label: g.label,
  short: g.short,
  emoji: g.emoji,
  family: 'colours',
  items: COLOURS.filter((c) => c.group === g.id).map((c) => ({
    id: `col:${c.en}`, unitId: U, skillId: g.id, kind: 'swatch', en: c.en, fr: c.fr, hex: c.hex, things: c.things, np: c.en, pl: false,
  })),
  exercises: ['listen', 'colourOf', 'read', 'picture', 'isIt', 'spell'],
}));

const shapes = {
  id: 'shapes',
  label: 'Les formes',
  short: 'Formes',
  emoji: '🔺',
  family: 'shapes',
  items: SHAPES.map((s) => ({ id: `shape:${s.en}`, unitId: U, skillId: 'shapes', kind: 'emoji', en: s.en, fr: s.fr, emoji: s.emoji, twin: s.twin, ...det(s.en) })),
  exercises: ['listen', 'read', 'picture', 'isIt'],
};

const mixes = {
  id: 'mix',
  label: 'Les mélanges de couleurs',
  short: 'Mélanges',
  emoji: '🧪',
  family: 'shapes',
  parentInfo: 'Red and yellow make orange… (avec le labo des couleurs)',
  items: MIXES.map(([a, b, c]) => ({
    id: `mix:${a}+${b}`, unitId: U, skillId: 'mix', a: COLOUR_BY[a], b: COLOUR_BY[b], c: COLOUR_BY[c],
    en: `${a} and ${b} make ${c}`, fr: `${COLOUR_BY[a].fr} + ${COLOUR_BY[b].fr} = ${COLOUR_BY[c].fr}`,
  })),
  exercises: ['mixColours'],
};

export default {
  id: U,
  name: 'Les couleurs',
  emoji: '🎨',
  mascotLine: 'Red, blue, green… et les formes',
  families: [
    { id: 'colours', label: 'Les couleurs', emoji: '🌈' },
    { id: 'shapes', label: 'Formes et mélanges', emoji: '🔺' },
  ],
  skills: [...colourSkills, shapes, mixes],
  defaultSkills: ['basic', 'more', 'bw', 'shapes', 'mix'],
  modes: ['learn', 'listen', 'colourOf', 'mixColours', 'lab', 'picture', 'read', 'isIt', 'spell', 'bubbles', 'memory'],
  reviewModes: ['listen', 'colourOf', 'read', 'isIt'],
};
