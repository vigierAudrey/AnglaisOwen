// La carte du tour du monde : un chemin de pays en pays. Chaque étape réussie ouvre la suivante ;
// Biscuit 🐶 attend sur l'étape en cours, suivi des amis déjà libérés. Un gardien au bout de chaque pays.

import { h, svgBlock } from '../ui/dom.js';
import { getState, save } from '../core/store.js';
import { go } from '../core/router.js';
import { header, mascot, MASCOT } from '../ui/components.js';
import { sound } from '../ui/sound.js';
import { speak, speakSeq } from '../ui/speech.js';
import { confetti } from '../ui/confetti.js';
import { WORLDS, STEPS } from './worlds.js';
import { adv, stepStars, currentIndex, goalText, launchStep, worldFreed, worldCrown, freedFriends, totalStars, starsRow, noEmoji } from './progress.js';

const XS = [24, 68, 36, 76, 30, 62]; // positions horizontales (%) des étapes, en zigzag
const GAP = 112; // espace vertical entre deux étapes (px)
const TOP = 84;

export default function adventureMap() {
  const st = getState();
  const a = adv(st);
  const cur = currentIndex(st);
  const justUnlocked = cur > (a.seen || 0) && cur > 0;
  const friends = freedFriends(st);
  const el = h('div', { class: 'screen adventure' }, header('Le tour du monde'));
  let curNode = null;

  const sheet = h('div', { class: 'sheet hidden', onclick: (e) => e.target === sheet && sheet.classList.add('hidden') });

  function openStep(step, idx, world) {
    if (idx > cur) {
      sound.ko();
      speak('Cette étape est encore fermée. Réussis d’abord celle où Biscuit t’attend !', { force: true, lang: 'fr' });
      return;
    }
    sound.tap();
    const stars = stepStars(st, step.id);
    sheet.replaceChildren(
      h(
        'div',
        { class: 'sheet-inner center' },
        h('div', { class: 'adv-sheet-emoji' }, step.emoji),
        h('h2', {}, step.label),
        step.boss ? h('p', { class: 'adv-goal' }, `${world.guardian.name} retient ${world.friend.emoji} ${world.friend.name} prisonnier ! Viens à son secours !`) : null,
        h('p', { class: 'adv-goal' }, `🎯 ${goalText(step)}`),
        stars ? starsRow(stars) : null,
        h(
          'div',
          { class: 'row' },
          h('button', { class: 'btn ghost', onclick: () => sheet.classList.add('hidden') }, 'Plus tard'),
          h('button', { class: 'btn adv-go', onclick: () => launchStep(step) }, stars ? '🔁 Rejouer' : 'C’est parti ! ▶')
        )
      )
    );
    sheet.classList.remove('hidden');
    speak(noEmoji(`${step.label}. ${goalText(step)}.`), { force: true, lang: 'fr' });
  }

  let offset = 0;
  const worlds = WORLDS.map((w, wi) => {
    const first = offset;
    offset += w.steps.length;
    const reached = cur >= first;
    const freed = worldFreed(st, w);
    const crown = worldCrown(st, w);
    const doneCount = w.steps.filter((s) => stepStars(st, s.id)).length;
    const height = TOP + (w.steps.length - 1) * GAP + 76;
    const pts = w.steps.map((_, i) => `${XS[i % XS.length]},${TOP + i * GAP}`).join(' ');
    const path = svgBlock(
      `<svg viewBox="0 0 100 ${height}" preserveAspectRatio="none" width="100%" height="${height}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 14" vector-effect="non-scaling-stroke"/></svg>`,
      'adv-path'
    );
    const nodes = w.steps.map((step, i) => {
      const idx = first + i;
      const stars = stepStars(st, step.id);
      const state = stars ? 'done' : idx === cur ? 'current' : 'locked';
      const icon = state === 'locked' ? (step.boss ? w.guardian.emoji : '🔒') : step.boss && stars ? w.friend.emoji : step.emoji;
      const node = h(
        'button',
        {
          class: `adv-node ${state}${step.boss ? ' boss' : ''}${state === 'current' && justUnlocked ? ' fresh' : ''}`,
          style: { left: `${XS[i % XS.length]}%`, top: `${TOP + i * GAP}px` },
          'aria-label': `${step.label}${state === 'locked' ? ' (fermé)' : ''}`,
          onclick: () => openStep(step, idx, w),
        },
        state === 'current'
          ? h('span', { class: 'adv-buddy' }, h('span', { class: 'adv-dog' }, MASCOT), friends.slice(-3).map((f) => h('span', { class: 'adv-friend' }, f.emoji)))
          : null,
        h('span', { class: 'adv-circle' }, icon),
        h('span', { class: 'adv-label' }, step.label),
        stars ? h('span', { class: 'adv-node-stars' }, '⭐'.repeat(stars)) : null
      );
      if (state === 'current') curNode = node;
      return node;
    });
    const hello = () => {
      sound.tap();
      if (reached) speakSeq([['en', w.en], ['fr', noEmoji(w.fact)]], { force: true });
    };
    return h(
      'section',
      { class: `adv-world world-${w.id}${reached ? '' : ' far'}` },
      h(
        'button',
        { class: 'adv-head', onclick: hello, 'aria-label': reached ? `${w.name} : écouter` : `${w.name} (fermé)` },
        h('span', { class: 'adv-world-emoji' }, w.emoji),
        h('span', { class: 'adv-title' }, h('b', {}, `${wi + 1}. ${w.name}`), h('small', {}, reached ? w.intro : '🔒 Libère l’ami du pays d’avant pour venir ici !')),
        h('span', { class: 'adv-count' }, crown ? '👑' : freed ? w.friend.emoji : `${doneCount}/${w.steps.length}`)
      ),
      reached ? h('button', { class: 'adv-fact', onclick: hello }, h('span', { lang: 'en' }, `✈️ ${w.en}`), h('small', {}, `💡 ${w.fact}`)) : null,
      h('div', { class: 'adv-map', style: { height: `${height}px` } }, path, nodes)
    );
  });

  const finished = cur >= STEPS.length;
  const total = totalStars(st);
  const line = finished
    ? 'Tu as libéré tous mes amis ! Thank you! Rejoue les étapes pour gagner les couronnes d’or 👑.'
    : cur === 0
      ? 'Oh no! Le Capitaine Embrouille a caché mes amis partout dans le monde. Tu m’aides à les libérer ? Touche l’étape où je t’attends !'
      : justUnlocked
        ? 'Bravo ! Une nouvelle étape est ouverte ! Let’s go!'
        : 'On continue le voyage ? Je t’attends sur la prochaine étape !';

  el.append(
    mascot(line, { mood: justUnlocked || finished ? 'wow' : 'happy' }),
    h(
      'div',
      { class: 'adv-progress' },
      h('span', {}, `🗺️ ${Math.min(cur + 1, STEPS.length)} / ${STEPS.length}`),
      h('span', { class: 'bar small' }, h('span', { class: 'bar-fill adv-fill', style: { width: `${Math.round((cur / STEPS.length) * 100)}%` } })),
      h('span', {}, `⭐ ${total} / ${STEPS.length * 3}`)
    ),
    h(
      'button',
      { class: 'adv-bag-btn', onclick: () => go('treasures') },
      h('span', { class: 'adv-bag-emoji' }, '🧳'),
      h(
        'span',
        { class: 'adv-bag-txt' },
        h('b', {}, 'Ma valise de voyage'),
        h('small', {}, friends.length ? `${friends.length} ami${friends.length > 1 ? 's' : ''} libéré${friends.length > 1 ? 's' : ''} sur ${WORLDS.length}` : 'Libère les amis de Biscuit !')
      ),
      h('span', { class: 'adv-bag-friends' }, WORLDS.map((w) => h('span', { class: worldFreed(st, w) ? '' : 'off' }, worldFreed(st, w) ? w.friend.emoji : '❔')))
    ),
    ...worlds,
    sheet
  );

  if ((a.seen || 0) < cur) {
    a.seen = cur;
    save();
  }
  if (justUnlocked) setTimeout(() => sound.combo(), 350);
  // On amène l'étape en cours à l'écran.
  if (curNode) requestAnimationFrame(() => setTimeout(() => curNode.scrollIntoView({ block: 'center', behavior: 'smooth' }), 150));
  if (justUnlocked && cur % 6 === 0 && cur < STEPS.length) setTimeout(confetti, 600); // nouveau pays
  return el;
}
