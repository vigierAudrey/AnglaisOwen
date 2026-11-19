// Défi chrono : écoute et trouve, le plus vite possible en 60 secondes.

import { h } from '../ui/dom.js';
import { getState, addStars } from '../core/store.js';
import { go } from '../core/router.js';
import { getUnit, getSkill, itemsFor } from '../units/index.js';
import { recordAnswer } from '../core/srs.js';
import { EXERCISES } from '../exercises/index.js';
import { header, mascot, listenBtn, visual, endSheet } from '../ui/components.js';
import { pick } from '../core/util.js';
import { speak, stopSpeaking } from '../ui/speech.js';
import { sound } from '../ui/sound.js';
import { confetti } from '../ui/confetti.js';
import { questOutcome, questScore } from '../adventure/progress.js';

const SECONDS = 60;

export default function chrono({ unitId = 'words', skillIds, quest }) {
  const st = getState();
  const unit = getUnit(unitId);
  const items = itemsFor(unit, skillIds).filter((i) => i.kind);
  const el = h('div', { class: `screen session theme-${unitId}` }, header('Défi chrono'));
  if (items.length < 4) {
    el.append(mascot('Choisis des notions avec des images pour jouer !', { mood: 'think' }));
    return el;
  }

  let left = SECONDS;
  let score = 0;
  let timer = null;
  let pending = null;
  let done = false;
  let q = null;
  const top = h('div', { class: 'memory-top' });
  const card = h('div', { class: 'q-card' });
  const zone = h('div', { class: 'answer-zone' });
  const updateTop = () => top.replaceChildren(h('div', { class: 'timer' + (left <= 10 ? ' hurry' : '') }, `⏱️ ${left}`), h('div', { class: 'score-pill' }, `✅ ${score}`));

  function next() {
    if (done) return;
    const item = pick(items);
    q = EXERCISES.listen.build(item, { unit, skill: getSkill(unit, item.skillId), skills: [], pool: items });
    if (!q) return next();
    card.className = 'q-card';
    card.replaceChildren(listenBtn(q.say), h('button', { class: 'big-listen', onclick: () => speak(q.say, { force: true }) }, '🔊'));
    zone.replaceChildren(h('div', { class: `choices ${q.choiceStyle}` }, q.choices.map((c) => h('button', { class: `btn choice ${q.choiceStyle}`, onclick: (e) => answer(c.value, e.currentTarget) }, visual(c.visual, 'choice-vis')))));
    speak(q.say, { force: true });
  }

  function answer(v, btn) {
    if (done || card.classList.contains('ok') || card.classList.contains('ko')) return;
    const ok = v === q.answer;
    recordAnswer(st, q.item.id, ok);
    if (ok) {
      score++;
      sound.ok();
    } else sound.ko();
    btn.classList.add(ok ? 'right' : 'wrong');
    card.classList.add(ok ? 'ok' : 'ko');
    if (!ok) card.append(h('div', { class: 'reveal' }, h('div', { class: 'reveal-en', lang: 'en' }, q.item.en), h('div', { class: 'q-vis small' }, visual(q.correction.visual))));
    updateTop();
    pending = setTimeout(next, ok ? 400 : 1300);
  }

  function finish() {
    done = true;
    clearInterval(timer);
    clearTimeout(pending);
    stopSpeaking();
    const key = `chrono:${unitId}`;
    const prev = st.records[key] || 0;
    const isNew = score > prev;
    if (isNew) st.records[key] = score;
    const stars = Math.ceil(score / 2) + (isNew ? 5 : 0);
    addStars(stars);
    if (isNew) {
      sound.win();
      confetti();
    }
    endSheet(el, {
      text: isNew ? `🎉 NOUVEAU RECORD : ${score} bonnes réponses !` : `${score} bonnes réponses ! Ton record : ${prev}.`,
      mood: isNew ? 'wow' : 'happy',
      stars,
      replay: () => go('chrono', { unitId, skillIds, quest }, { replace: true }),
      quest: quest && questOutcome(quest, { ...questScore(quest, score), retry: () => go('chrono', { unitId, skillIds, quest }, { replace: true }) }),
    });
  }

  const cd = h('div', { class: 'countdown' });
  el.append(top, card, zone, cd);
  updateTop();
  let n = 3;
  (function step() {
    if (done) return;
    if (n > 0) {
      cd.replaceChildren(h('span', { class: 'cd-num' }, String(n)));
      speak(['', 'one', 'two', 'three'][n], { force: true });
      n--;
      pending = setTimeout(step, 900);
    } else {
      cd.remove();
      sound.go();
      next();
      timer = setInterval(() => {
        left--;
        if (left <= 5 && left > 0) sound.tick();
        updateTop();
        if (left <= 0) finish();
      }, 1000);
    }
  })();

  return { el, destroy: () => { done = true; clearInterval(timer); clearTimeout(pending); stopSpeaking(); } };
}
