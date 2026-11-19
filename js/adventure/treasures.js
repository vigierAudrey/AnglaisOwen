// Ma valise de voyage : les amis libérés (un par pays), les couronnes d'or (3 étoiles partout dans
// un pays) et le carnet de voyage (les curiosités des pays visités, à réécouter).

import { h } from '../ui/dom.js';
import { getState } from '../core/store.js';
import { header, mascot, MASCOT } from '../ui/components.js';
import { speak, speakSeq } from '../ui/speech.js';
import { sound } from '../ui/sound.js';
import { WORLDS, STEPS } from './worlds.js';
import { worldFreed, worldCrown, freedFriends, totalStars, currentIndex, stepStars, noEmoji } from './progress.js';

export default function treasures() {
  const st = getState();
  const friends = freedFriends(st);
  const crowns = WORLDS.filter((w) => worldCrown(st, w)).length;
  const cur = currentIndex(st);
  const reachedW = (w) => cur >= STEPS.findIndex((s) => s.world === w.id);

  const friendCard = (w) => {
    const freed = worldFreed(st, w);
    return h(
      'button',
      {
        class: 'adv-friend-card' + (freed ? ' freed' : ''),
        onclick: () => {
          sound.tap();
          if (freed) speakSeq([['en', `Hello! I’m ${w.friend.name}. Thank you!`], ['fr', `${w.friend.name}, libéré : ${w.name}.`]], { force: true });
          else speak(`Bats ${w.guardian.name} pour libérer cet ami.`, { force: true, lang: 'fr' });
        },
      },
      h('span', { class: 'adv-friend-emoji' }, freed ? w.friend.emoji : '❔'),
      h('b', {}, freed ? w.friend.name : '???'),
      h('small', {}, freed ? `${w.emoji} ${w.name}` : reachedW(w) ? `Gardé par ${w.guardian.emoji} ${w.guardian.name}` : `🔒 ${w.emoji} Pays ${WORLDS.indexOf(w) + 1}`)
    );
  };

  const crownRow = (w) => {
    const got = w.steps.reduce((n, s) => n + stepStars(st, s.id), 0);
    const max = w.steps.length * 3;
    return h(
      'div',
      { class: 'adv-crown-row' },
      h('span', { class: 'adv-crown' + (worldCrown(st, w) ? ' on' : '') }, '👑'),
      h('span', { class: 'adv-crown-name' }, `${w.emoji} ${w.name}`),
      h('span', { class: 'bar small' }, h('span', { class: 'bar-fill star', style: { width: `${Math.round((got / max) * 100)}%` } })),
      h('b', {}, `${got}/${max} ⭐`)
    );
  };

  const visited = WORLDS.filter(reachedW);
  const line =
    friends.length === WORLDS.length
      ? 'Tous mes amis sont libres ! You’re a hero! 🦸'
      : friends.length
        ? `Thank you! Déjà ${friends.length} ami${friends.length > 1 ? 's' : ''} sauvé${friends.length > 1 ? 's' : ''}. On continue le voyage ?`
        : 'Mes amis sont prisonniers… Bats les gardiens pour les ramener !';

  return h(
    'div',
    { class: 'screen adv-treasures' },
    header('Ma valise de voyage'),
    mascot(line, { mood: friends.length ? 'wow' : 'think' }),
    h(
      'div',
      { class: 'adv-team' },
      h('span', { class: 'adv-team-dog' }, MASCOT),
      friends.map((f, i) => h('span', { class: 'adv-team-friend', style: { animationDelay: `${i * 0.2}s` } }, f.emoji))
    ),
    h('div', { class: 'panel' }, h('h2', {}, `🐾 Les amis de Biscuit (${friends.length}/${WORLDS.length})`), h('div', { class: 'adv-friend-grid' }, WORLDS.map(friendCard))),
    h(
      'div',
      { class: 'panel' },
      h('h2', {}, `📔 Mon carnet de voyage (${visited.length}/${WORLDS.length})`),
      h('p', { class: 'muted' }, 'Ce que tu as découvert dans chaque pays. Touche pour écouter !'),
      visited.map((w) =>
        h(
          'button',
          { class: 'adv-note', onclick: () => { sound.tap(); speakSeq([['en', w.en], ['fr', noEmoji(w.fact)]], { force: true }); } },
          h('span', { class: 'adv-note-emoji' }, w.emoji),
          h('span', { class: 'adv-note-txt' }, h('b', {}, w.name), h('small', {}, w.fact))
        )
      )
    ),
    h('div', { class: 'panel' }, h('h2', {}, `👑 Les couronnes d’or (${crowns}/${WORLDS.length})`), h('p', { class: 'muted' }, 'Gagne 3 étoiles à toutes les étapes d’un pays.'), WORLDS.map(crownRow)),
    h('div', { class: 'panel center-txt' }, h('h2', {}, `⭐ Étoiles du voyage : ${totalStars(st)} / ${STEPS.length * 3}`))
  );
}
