// Les bulles : on entend un mot, il faut éclater la bonne bulle avant qu'elle s'envole.

import { h } from '../ui/dom.js';
import { getState, addStars } from '../core/store.js';
import { go } from '../core/router.js';
import { getUnit, getSkill, itemsFor } from '../units/index.js';
import { recordAnswer } from '../core/srs.js';
import { distractors, visOf } from '../exercises/common.js';
import { header, mascot, visual, endSheet } from '../ui/components.js';
import { pick, shuffle } from '../core/util.js';
import { speak, stopSpeaking } from '../ui/speech.js';
import { plain } from '../lang/en.js';
import { sound } from '../ui/sound.js';
import { confetti } from '../ui/confetti.js';
import { questOutcome, questScore } from '../adventure/progress.js';

const ROUNDS = 10;

export default function bubbles({ unitId = 'words', skillIds, quest }) {
  const st = getState();
  const unit = getUnit(unitId);
  const items = itemsFor(unit, skillIds).filter((i) => i.kind);
  const el = h('div', { class: `screen bubbles theme-${unitId}` }, header('Les bulles'));
  if (items.length < 3) {
    el.append(mascot('Choisis des notions avec des images pour jouer aux bulles !', { mood: 'think' }));
    return el;
  }

  let round = 0;
  let score = 0;
  let pending = null;
  let target = null;
  let missed = false;
  let lastId = null;
  const topEl = h('div', { class: 'memory-top' });
  const sky = h('div', { class: 'bubble-sky' });
  const listen = h('button', { class: 'btn big', onclick: () => speak(plain(target.en), { force: true }) }, '🔊 Réécouter');
  const msg = h('div', { class: 'bubble-msg', 'aria-live': 'polite' });

  const updateTop = () => topEl.replaceChildren(h('span', {}, `Bulle ${Math.min(round, ROUNDS)} / ${ROUNDS}`), h('span', { class: 'score-pill' }, `🫧 ${score}`));

  function newRound() {
    if (round >= ROUNDS) return end();
    round++;
    missed = false;
    const pool = items.filter((i) => i.id !== lastId);
    target = pick(pool.length ? pool : items);
    lastId = target.id;
    const others = distractors(target, { unit, skill: getSkill(unit, target.skillId), pool: items }, 4);
    const list = shuffle([target, ...others]);
    const lanes = shuffle(list.map((_, i) => i));
    msg.textContent = '';
    sky.replaceChildren(
      ...list.map((it, i) => {
        const dur = 9 + Math.random() * 4;
        const b = h(
          'button',
          {
            class: 'bub',
            style: { left: `${2 + lanes[i] * (96 / list.length)}%`, width: `${Math.min(92 / list.length, 22)}%`, animationDuration: `${dur}s`, animationDelay: `${-Math.random() * dur * 0.6}s` },
            'aria-label': `Bulle ${i + 1}`,
            onclick: () => tap(it, b),
          },
          visual(visOf(it), 'bubble-vis')
        );
        return b;
      })
    );
    updateTop();
    pending = setTimeout(() => speak(plain(target.en), { force: true }), 300);
  }

  function tap(it, b) {
    if (b.classList.contains('popped') || sky.classList.contains('done')) return;
    if (it.id === target.id) {
      b.classList.add('popped');
      sound.pop();
      recordAnswer(st, target.id, !missed);
      if (!missed) score++;
      sky.classList.add('done');
      msg.replaceChildren(h('b', { lang: 'en' }, target.en), ` = ${target.fr}`);
      speak(plain(target.en), { force: true });
      updateTop();
      pending = setTimeout(() => {
        sky.classList.remove('done');
        newRound();
      }, 1500);
    } else {
      missed = true;
      sound.ko();
      b.classList.remove('wobble');
      void b.offsetWidth;
      b.classList.add('wobble');
      msg.textContent = `Non, ça c’est « ${it.en} ». Écoute encore !`;
      speak(plain(target.en), { force: true });
    }
  }

  function end() {
    const stars = score + (score === ROUNDS ? 3 : 0);
    addStars(stars);
    const key = `bubbles:${unitId}`;
    const isNew = score > (st.records[key] || 0);
    if (isNew) st.records[key] = score;
    sound.win();
    if (score >= 8) confetti();
    endSheet(el, {
      text: score === ROUNDS ? 'Toutes les bulles du premier coup ! Amazing! 🎉' : `${score} bulles éclatées du premier coup sur ${ROUNDS} !`,
      mood: score >= 7 ? 'wow' : 'happy',
      stars,
      replay: () => go('bubbles', { unitId, skillIds, quest }, { replace: true }),
      quest: quest && questOutcome(quest, { ...questScore(quest, score), retry: () => go('bubbles', { unitId, skillIds, quest }, { replace: true }) }),
    });
  }

  el.append(topEl, h('div', { class: 'instr big' }, 'Écoute le mot et éclate la bonne bulle ! 🫧'), sky, msg, listen);
  newRound();
  return { el, destroy: () => { clearTimeout(pending); stopSpeaking(); } };
}
