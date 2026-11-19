// Univers « Les nombres ».

import { NUMBER_WORDS, NUMBER_FR, NUMBER_GROUPS } from '../data/numbers.js';

const U = 'numbers';
// Les nombres qui se ressemblent : thirteen / thirty…
const CONFUSE = { 13: 30, 14: 40, 15: 50, 16: 60, 17: 70, 18: 80, 19: 90, 30: 13, 40: 14, 50: 15, 60: 16, 70: 17, 80: 18, 90: 19, 12: 20, 20: 12 };

// Un seul élément par nombre (20 est à la fois dans « 11 à 20 » et dans « les dizaines »).
const byN = new Map();
const numItem = (n, skillId) => {
  if (!byN.has(n)) {
    byN.set(n, {
      id: `num:${n}`, unitId: U, skillId, kind: 'number', n, en: NUMBER_WORDS[n], fr: NUMBER_FR[n],
      np: NUMBER_WORDS[n], confuse: CONFUSE[n] !== undefined ? `num:${CONFUSE[n]}` : null,
    });
  }
  return byN.get(n);
};

const skills = NUMBER_GROUPS.map((g) => ({
  id: g.id,
  label: g.label,
  short: g.short,
  emoji: g.emoji,
  family: 'nums',
  items: g.nums.map((n) => numItem(n, g.id)),
}));

export default {
  id: U,
  name: 'Les nombres',
  emoji: '🔢',
  mascotLine: 'One, two, three… je compte !',
  families: [{ id: 'nums', label: 'Les nombres', emoji: '🔢' }],
  skills,
  defaultSkills: ['n0_10', 'n11_20', 'tens'],
  modes: ['learn', 'listen', 'count', 'maths', 'read', 'picture', 'isIt', 'spell', 'bubbles', 'chrono', 'memory'],
  reviewModes: ['listen', 'count', 'maths', 'read', 'isIt'],
};
