// Jacques a dit (« Simon says ») : si Simon le dit, on touche l'image (et on le fait pour de vrai !).
// S'il ne dit pas « Simon says », on ne bouge pas : on touche 🙅.

import { h } from '../ui/dom.js';
import { getState, addStars } from '../core/store.js';
import { go } from '../core/router.js';
import { getUnit, itemsFor } from '../units/index.js';
import { recordAnswer } from '../core/srs.js';
import { header, mascot, endSheet } from '../ui/components.js';
import { pick, shuffle } from '../core/util.js';
import { speak, stopSpeaking } from '../ui/speech.js';
import { plain, cap } from '../lang/en.js';
import { sound } from '../ui/sound.js';
import { confetti } from '../ui/confetti.js';

const ROUNDS = 10;

export default function simon({ unitId = 'actions', skillIds = [] }) {
  const st = getState();
  const unit = getUnit(unitId);
  let items = itemsFor(unit, skillIds.filter((s) => ['commands', 'moves'].includes(s)));
  if (items.length < 4) items = itemsFor(unit, ['commands', 'moves']);
  items = items.filter((i, k) => items.findIndex((j) => j.emoji === i.emoji) === k);

  const el = h('div', { class: 'screen simon theme-actions' }, header('Jacques a dit'));
  let round = 0;
  let score = 0;
  let pending = null;
  let cur = null;
  let lastId = null;
  const topEl = h('div', { class: 'memory-top' });
  const body = h('div', { class: 'col' });
  const updateTop = () => topEl.replaceChildren(h('span', {}, `Ordre ${round} / ${ROUNDS}`), h('span', { class: 'score-pill' }, `✅ ${score}`));

  const line = () => (cur.says ? `Simon says: ${cur.item.en}!` : `${cap(cur.item.en)}!`);

  function newRound() {
    if (round >= ROUNDS) return end();
    round++;
    const pool = items.filter((i) => i.id !== lastId);
    const item = pick(pool);
    lastId = item.id;
    cur = { item, says: round === 1 || Math.random() < 0.65, done: false };
    const choices = shuffle([item, ...shuffle(items.filter((i) => i.id !== item.id)).slice(0, 2)]);
    const grid = h(
      'div',
      { class: 'choices emoji three' },
      choices.map((c) => h('button', { class: 'btn choice emoji', onclick: (e) => answer(c.id, e.currentTarget) }, h('span', { class: 'emoji-vis choice-vis' }, c.emoji)))
    );
    const freeze = h('button', { class: 'btn big freeze-btn', onclick: (e) => answer('freeze', e.currentTarget) }, '🙅 Simon n’a pas dit !');
    body.replaceChildren(
      h('div', { class: 'simon-card' }, h('div', { class: 'simon-face' }, '🧑‍🏫'), h('button', { class: 'btn ghost', onclick: () => speak(plain(line()), { force: true }) }, '🔊 Réécouter')),
      grid,
      freeze,
      h('div', { class: 'simon-msg' })
    );
    updateTop();
    pending = setTimeout(() => speak(plain(line()), { force: true }), 400);
  }

  function answer(v, btn) {
    if (cur.done) return;
    cur.done = true;
    const ok = cur.says ? v === cur.item.id : v === 'freeze';
    recordAnswer(st, cur.item.id, ok);
    btn.classList.add(ok ? 'right' : 'wrong');
    const msg = body.querySelector('.simon-msg');
    const said = h('div', { class: 'reveal-en', lang: 'en' }, cur.says ? `« Simon says: ${cur.item.en}! »` : `« ${cap(cur.item.en)}! »`);
    if (ok) {
      score++;
      sound.ok();
      msg.replaceChildren(said, h('div', {}, cur.says ? `Bravo ! ${cur.item.en} = ${cur.item.fr}. Fais-le pour de vrai ! 🕺` : 'Bien vu ! Simon n’avait rien dit : on ne bouge pas ! 🧊'));
    } else {
      sound.ko();
      msg.replaceChildren(said, h('div', {}, cur.says ? `Simon l’a dit ! ${cur.item.en} = ${cur.item.fr} ${cur.item.emoji}` : 'Piège ! Simon n’a pas dit « Simon says » : il ne fallait pas bouger !'));
    }
    updateTop();
    pending = setTimeout(newRound, 2600);
  }

  function end() {
    const stars = score + (score === ROUNDS ? 3 : 0);
    addStars(stars);
    sound.win();
    if (score >= 8) confetti();
    endSheet(el, {
      text: `${score} ordres réussis sur ${ROUNDS} ! ${score >= 8 ? 'Simon is impressed! 🤩' : 'Good job!'}`,
      mood: score >= 7 ? 'wow' : 'happy',
      stars,
      replay: () => go('simon', { unitId, skillIds }, { replace: true }),
    });
  }

  el.append(
    topEl,
    body,
  );
  body.append(
    mascot(h('span', {}, 'En anglais, « Jacques a dit » se dit ', h('b', { lang: 'en' }, '« Simon says »'), '. Si tu entends « Simon says », touche l’image et fais-le ! Sinon, touche 🙅.'), { mood: 'happy' }),
    h('button', { class: 'btn big', onclick: () => newRound() }, '▶ C’est parti !')
  );
  updateTop();
  return { el, destroy: () => { clearTimeout(pending); stopSpeaking(); } };
}
