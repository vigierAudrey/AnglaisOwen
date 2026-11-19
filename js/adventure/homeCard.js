// Carte « Le tour du monde » affichée sur l'accueil : où en est-on ?

import { h } from '../ui/dom.js';
import { getState } from '../core/store.js';
import { go } from '../core/router.js';
import { STEPS } from './worlds.js';
import { currentIndex, freedFriends, worldOfIndex } from './progress.js';

export function adventureCard() {
  const st = getState();
  const cur = currentIndex(st);
  const world = worldOfIndex(cur);
  const friends = freedFriends(st);
  const sub =
    cur >= STEPS.length
      ? 'Tous les amis sont libres ! Vise les couronnes d’or 👑'
      : cur
        ? `${world.emoji} ${world.name} · étape ${cur + 1} / ${STEPS.length}`
        : 'Aide Biscuit à libérer ses amis !';
  return h(
    'button',
    { class: 'adv-home-card', onclick: () => go('adventure') },
    h('span', { class: 'adv-home-emoji' }, '🗺️'),
    h(
      'span',
      { class: 'adv-home-txt' },
      h('b', {}, 'Le tour du monde', friends.length ? ` ${friends.map((f) => f.emoji).join('')}` : ''),
      h('small', {}, sub),
      h('span', { class: 'bar small light' }, h('span', { class: 'bar-fill', style: { width: `${Math.round((cur / STEPS.length) * 100)}%` } }))
    ),
    h('span', { class: 'adv-home-go' }, '▶')
  );
}
