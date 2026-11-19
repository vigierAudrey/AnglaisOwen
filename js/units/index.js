// Registre des univers. Pour en ajouter un : créer un fichier sur le modèle de words.js
// et l'ajouter au tableau `units` (voir CLAUDE.md).

import hello from './hello.js';
import numbers from './numbers.js';
import colours from './colours.js';
import words from './words.js';
import actions from './actions.js';
import phrases from './phrases.js';
import { uniqBy } from '../core/util.js';
import { factStat, isDue } from '../core/srs.js';

export const units = [hello, numbers, colours, words, actions, phrases];

export const comingSoon = [{ emoji: '📅', name: 'Les jours', line: 'Monday, Tuesday… et l’heure' }];

export const getUnit = (id) => units.find((u) => u.id === id);
export const getSkill = (unit, id) => unit.skills.find((s) => s.id === id);

export const itemsFor = (unit, skillIds) =>
  uniqBy(unit.skills.filter((s) => skillIds.includes(s.id)).flatMap((s) => s.items), (i) => i.id);

export function enabledSkills(unit, state) {
  const ids = state.settings.units[unit.id]?.skills || [];
  return unit.skills.filter((s) => ids.includes(s.id) && s.items.length);
}

const allItemsById = new Map(units.flatMap((u) => u.skills.flatMap((s) => s.items)).map((i) => [i.id, i]));
export const itemById = (id) => allItemsById.get(id);

/** Tous les éléments d'un univers (pour compléter les choix de réponses). */
const unitItemsCache = new Map();
export function unitItems(unit) {
  if (!unitItemsCache.has(unit.id)) unitItemsCache.set(unit.id, uniqBy(unit.skills.flatMap((s) => s.items), (i) => i.id));
  return unitItemsCache.get(unit.id);
}

/** Éléments à réviser aujourd'hui (déjà vus, intervalle écoulé), les plus fragiles d'abord. */
export function dueItems(state, max = Infinity) {
  const enabled = units.flatMap((u) => itemsFor(u, enabledSkills(u, state).map((s) => s.id)));
  return enabled
    .map((i) => ({ i, s: factStat(state, i.id) }))
    .filter((x) => isDue(x.s))
    .sort((a, b) => a.s.box - b.s.box || a.s.last - b.s.last)
    .slice(0, max)
    .map((x) => x.i);
}

/** Exercices possibles pour un élément : ceux de sa notion, sinon ceux de l'univers. */
export function exercisesFor(unit, skill, modeId) {
  if (modeId === 'review' || modeId === 'mix' || modeId === 'play') return skill.exercises || unit.reviewModes;
  return [modeId];
}
