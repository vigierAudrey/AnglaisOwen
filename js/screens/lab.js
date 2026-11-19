// Le labo des couleurs : on verse deux peintures et on découvre la couleur obtenue (en anglais !).
// Mode libre (découvrir les 6 mélanges) et défis (« Make green! »).

import { h } from '../ui/dom.js';
import { getState, addStars, save } from '../core/store.js';
import { recordAnswer } from '../core/srs.js';
import { COLOUR_BY, MIXES, mixOf } from '../data/colours.js';
import { header, mascot } from '../ui/components.js';
import { pick } from '../core/util.js';
import { speak, speakSeq, stopSpeaking } from '../ui/speech.js';
import { cap } from '../lang/en.js';
import { sound } from '../ui/sound.js';
import { confetti } from '../ui/confetti.js';

const PAINTS = ['red', 'yellow', 'blue', 'white', 'black', 'green'];
const GOALS = [...new Set(MIXES.map((m) => m[2]))];

export default function lab() {
  const st = getState();
  const found = new Set(st.records.lab || []);
  const pots = [null, null];
  let challenge = null;
  let pending = null;

  const el = h('div', { class: 'screen lab theme-colours' }, header('Le labo des couleurs'));
  const potEls = [h('div', { class: 'pot' }), h('div', { class: 'pot' })];
  const bowl = h('div', { class: 'bowl' });
  const msg = h('div', { class: 'lab-msg', 'aria-live': 'polite' });
  const foundEl = h('div', { class: 'found-row' });
  const challengeEl = h('div', { class: 'challenge' });

  const renderFound = () =>
    foundEl.replaceChildren(
      h('span', {}, `Couleurs découvertes : ${found.size} / ${GOALS.length}`),
      h('span', { class: 'found-dots' }, GOALS.map((g) => h('span', { class: 'swatch tiny' + (found.has(g) ? '' : ' unknown'), style: found.has(g) ? { background: COLOUR_BY[g].hex } : {}, title: found.has(g) ? g : '?' }, found.has(g) ? '' : '?')))
    );

  function renderPots() {
    pots.forEach((p, i) => {
      potEls[i].style.background = p ? COLOUR_BY[p].hex : '';
      potEls[i].classList.toggle('full', !!p);
      potEls[i].replaceChildren(h('span', { lang: 'en' }, p || '?'));
    });
  }

  function pour(c) {
    sound.splash();
    speak(c, { force: true });
    if (pots[0] && pots[1]) reset(false);
    pots[pots[0] ? 1 : 0] = c;
    renderPots();
    if (pots[0] && pots[1]) pending = setTimeout(mixNow, 600);
  }

  function mixNow() {
    const [a, b] = pots;
    const r = mixOf(a, b);
    const C = COLOUR_BY[r];
    bowl.style.background = C.hex;
    bowl.classList.remove('stir');
    void bowl.offsetWidth;
    bowl.classList.add('stir');
    bowl.replaceChildren(h('span', { lang: 'en' }, r));
    const line = a === b ? `${cap(a)} and ${b} make ${r}!` : `${cap(a)} and ${b} make ${r}!`;
    const fr = `${COLOUR_BY[a].fr} + ${COLOUR_BY[b].fr} = ${C.fr}`;
    const kids = [h('div', { class: 'reveal-en', lang: 'en' }, line), h('div', {}, `🇫🇷 ${fr}`)];
    const isNew = GOALS.includes(r) && !found.has(r) && a !== b;
    if (isNew) {
      found.add(r);
      st.records.lab = [...found];
      addStars(2);
      sound.combo();
      kids.push(h('div', { class: 'earned' }, 'Nouvelle couleur découverte ! +2 ⭐'));
      if (found.size === GOALS.length) {
        confetti();
        kids.push(h('div', {}, '🏆 Tu as trouvé tous les mélanges ! Essaie les défis !'));
      }
    }
    if (challenge) {
      const ok = r === challenge && a !== b;
      const mixItem = MIXES.find(([x, y, z]) => z === challenge && ((x === a && y === b) || (x === b && y === a)));
      if (mixItem) recordAnswer(st, `mix:${mixItem[0]}+${mixItem[1]}`, true);
      if (ok) {
        addStars(2);
        sound.win();
        kids.push(h('div', { class: 'earned' }, `Défi réussi : ${challenge} ! +2 ⭐`));
        challenge = null;
        renderChallenge();
      } else {
        kids.push(h('div', {}, `Ce n’est pas encore ${challenge}… essaie un autre mélange !`));
      }
    }
    save();
    msg.replaceChildren(...kids);
    renderFound();
    speakSeq([['en', line], ['fr', fr]], { force: true });
  }

  function reset(clear = true) {
    pots[0] = pots[1] = null;
    bowl.style.background = '';
    bowl.replaceChildren(h('span', {}, '🥣'));
    if (clear) msg.replaceChildren();
    renderPots();
  }

  function renderChallenge() {
    challengeEl.replaceChildren(
      challenge
        ? h('div', { class: 'panel challenge-on' }, h('b', { lang: 'en' }, `🎯 Make ${challenge}!`), h('span', {}, ` Fabrique du ${COLOUR_BY[challenge].fr} !`), h('button', { class: 'btn small ghost', onclick: () => speak(`Make ${challenge}!`, { force: true }) }, '🔊'))
        : h('button', { class: 'btn secondary', onclick: () => { challenge = pick(GOALS); reset(); renderChallenge(); speak(`Make ${challenge}!`, { force: true }); } }, '🎯 Un défi !')
    );
  }

  el.append(
    mascot('Touche deux peintures pour les mélanger. Quelle couleur va apparaître ? 🧪', { mood: 'happy' }),
    h('div', { class: 'paints' }, PAINTS.map((c) => h('button', { class: 'paint' + (['white', 'yellow'].includes(c) ? ' light' : ''), style: { background: COLOUR_BY[c].hex }, 'aria-label': c, onclick: () => pour(c) }, h('span', { lang: 'en' }, c)))),
    h('div', { class: 'mix-row' }, potEls[0], h('b', {}, '+'), potEls[1], h('b', {}, '='), bowl),
    msg,
    h('button', { class: 'btn ghost', onclick: () => reset() }, '🧽 Tout vider'),
    challengeEl,
    foundEl
  );
  reset();
  renderFound();
  renderChallenge();
  return { el, destroy: () => { clearTimeout(pending); stopSpeaking(); } };
}
