// Séance de questions : fonctionne pour tous les exercices « question par question »
// (format des questions décrit dans exercises/index.js) et pour les révisions mélangées.

import { h } from '../ui/dom.js';
import { getState, save, markDay } from '../core/store.js';
import { go, back } from '../core/router.js';
import { getUnit, getSkill, itemsFor, itemById, exercisesFor } from '../units/index.js';
import { EXERCISES, MODES } from '../exercises/index.js';
import { createSession } from '../core/session.js';
import { sound } from '../ui/sound.js';
import { say, speak, stopSpeaking } from '../ui/speech.js';
import { mascot, listenBtn, frListen, visual, MASCOT } from '../ui/components.js';
import { pick, shuffle } from '../core/util.js';
import { unlockedCount } from '../core/rewards.js';

const PRAISE = ['Bravo !', 'Super !', 'Great!', 'Well done!', 'Excellent!', 'Génial !', 'Yes!', 'Awesome!', 'Bien joué !', 'Perfect!'];
const OOPS = ['Presque !', 'Pas grave, on apprend !', 'Oups ! Regarde bien :', 'On le retient ensemble :'];

export default function sessionScreen(params) {
  const { unitId, skillIds = [], mode: modeId, itemIds } = params;
  const st = getState();
  const review = modeId === 'review';
  const unit = unitId ? getUnit(unitId) : null;
  const selected = unit ? skillIds.map((id) => getSkill(unit, id)).filter(Boolean) : [];

  function buildFor(item) {
    const u = getUnit(item.unitId);
    const skill = getSkill(u, item.skillId);
    if (!skill) return null;
    const ctx = { unit: u, skill, skills: review ? [skill] : selected, pool: review || !items ? skill.items : items };
    for (const id of shuffle(exercisesFor(u, skill, modeId))) {
      const q = EXERCISES[id]?.build(item, ctx);
      if (q) return { ...q, mode: id };
    }
    return null;
  }

  let items = null;
  items = (itemIds ? itemIds.map(itemById).filter(Boolean) : itemsFor(unit, skillIds)).filter((i) => buildFor(i));
  const total = review ? Math.max(5, Math.min(items.length + 2, 15)) : itemIds ? Math.min(st.settings.questionsPerSession, Math.max(4, items.length * 3)) : st.settings.questionsPerSession;
  const session = createSession({ facts: items, state: st, count: total });
  const stickersBefore = unlockedCount(st.stars);
  const theme = unit ? `theme-${unit.id}` : 'theme-review';

  let q = null;
  let locked = true;
  let finished = false;
  let answered = false;
  let helpOpen = false;
  let chosen = []; // étiquettes choisies (phrases / lettres)
  let correct = 0;
  let asked = 0;
  let streak = 0;
  let bestStreak = 0;
  let earned = 0;
  let pending = null;
  let sayTimer = null;
  const mistakes = new Map();

  const progressEl = h('div', { class: 'progress' });
  const streakEl = h('div', { class: 'streak' });
  const instr = h('button', { class: 'instr', type: 'button', title: 'Écouter la consigne', onclick: () => speak(q?.instruction?.replace(/🔊/g, ''), { force: true, lang: 'fr' }) });
  const card = h('div', { class: 'q-card' });
  const praiseEl = h('div', { class: 'praise', 'aria-live': 'polite' });
  const dog = h('div', { class: 'mini-owl', 'aria-hidden': 'true' }, MASCOT);
  const answerZone = h('div', { class: 'answer-zone' });
  const sheet = h('div', { class: 'sheet hidden' });

  const el = h(
    'div',
    { class: `screen session ${theme}` },
    h('div', { class: 'session-top' }, h('button', { class: 'icon-btn', onclick: () => back(), 'aria-label': 'Quitter' }, '✕'), progressEl, streakEl),
    h('div', { class: 'q-area' }, h('div', { class: 'q-head' }, dog, instr), card, praiseEl),
    answerZone,
    sheet
  );

  if (!items.length) {
    el.replaceChildren(
      h('div', { class: 'session-top' }, h('button', { class: 'icon-btn', onclick: () => back(), 'aria-label': 'Retour' }, '←')),
      mascot(review ? 'Rien à réviser pour l’instant. Reviens demain ! 🌙' : 'Ce jeu ne marche pas avec ce que tu as choisi. Essaie un autre jeu ou d’autres notions !', { mood: 'think' })
    );
    return el;
  }

  const dogMood = (m) => {
    dog.className = `mini-owl mood-${m}`;
    void dog.offsetWidth;
    dog.classList.add('react');
  };

  function updateTop() {
    const pct = Math.min(100, (asked / total) * 100);
    progressEl.replaceChildren(
      h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: `${pct}%` } })),
      h('span', { class: 'count' }, `${Math.min(asked + 1, total)}/${total}`)
    );
    streakEl.textContent = streak >= 2 ? `🔥 ${streak}` : '';
    streakEl.classList.toggle('hot', streak >= 5);
  }

  function renderCard(stateCls = '') {
    card.className = 'q-card' + (stateCls ? ` ${stateCls}` : '');
    const kids = [];
    if (q.say) kids.push(listenBtn(q.say));
    if (q.help) {
      kids.push(
        h('button', { class: 'help-btn' + (helpOpen ? ' on' : ''), type: 'button', 'aria-label': 'Aide en français', onclick: () => { helpOpen = !helpOpen; renderCard(stateCls); if (helpOpen) speak(q.help, { force: true, lang: 'fr' }); } }, '🇫🇷')
      );
    }
    if (q.bigListen && !answered) kids.push(h('button', { class: 'big-listen', type: 'button', 'aria-label': 'Écouter', onclick: () => say(q.say, { force: true }) }, '🔊'));
    if (q.visual) kids.push(h('div', { class: 'q-vis' }, visual(q.visual)));
    if (q.text) {
      kids.push(
        h(
          'div',
          { class: 'q-text' + (q.textOpts?.big ? ' big' : '') + (q.textLang === 'fr' ? ' fr' : ' en'), lang: q.textLang || 'en' },
          q.text,
          q.textLang === 'fr' ? frListen(q.text) : null
        )
      );
    }
    if (q.help && helpOpen) kids.push(h('div', { class: 'help-text', lang: 'fr' }, '🇫🇷 ', q.help));
    if (q.input === 'tiles') {
      kids.push(
        h(
          'div',
          { class: `tile-slots ${q.tileStyle}` },
          q.answer.map((_, i) => h('span', { class: 'tile-slot' + (chosen[i] ? ' filled' : '') }, chosen[i] ? q.tiles[chosen[i].idx] : '')),
          q.tileEnd ? h('span', { class: 'tile-end' }, q.tileEnd) : null
        )
      );
    }
    if (answered && q.reveal) {
      kids.push(h('div', { class: 'reveal' }, h('div', { class: 'reveal-en', lang: 'en' }, q.reveal.en), q.reveal.fr ? h('div', { class: 'reveal-fr' }, `🇫🇷 ${q.reveal.fr}`) : null));
    }
    if (answered && q.note) kids.push(h('div', { class: 'note' }, '💡 ', q.note));
    card.replaceChildren(...kids);
  }

  function renderInstr() {
    instr.replaceChildren(h('span', {}, q.instruction), h('span', { class: 'instr-ear', 'aria-hidden': 'true' }, '🔈'));
  }

  function renderAnswer() {
    if (q.input === 'choices') {
      const n = q.choices.length;
      answerZone.replaceChildren(
        h(
          'div',
          { class: `choices ${q.choiceStyle}` + (n === 3 ? ' three' : '') + (n === 2 ? ' two' : '') },
          q.choices.map((c, i) => {
            const btn = h(
              'button',
              { class: `btn choice ${q.choiceStyle}`, 'data-v': i, onclick: (e) => submit(c.value, e.currentTarget) },
              c.visual ? visual(c.visual, 'choice-vis') : h('span', { class: 'choice-text', lang: 'en' }, c.text)
            );
            if (!c.say) return btn;
            return h(
              'div',
              { class: 'choice-wrap' },
              btn,
              h('button', { class: 'mini-listen', type: 'button', 'aria-label': `Écouter ${c.text}`, onclick: () => { sound.tap(); speak(c.say, { force: true }); } }, '🔊')
            );
          })
        )
      );
    } else if (q.input === 'truefalse') {
      const [yes, no] = q.tfLabels || ['✅ Yes!', '❌ No!'];
      answerZone.replaceChildren(
        h(
          'div',
          { class: 'tf' },
          h('button', { class: 'btn tf-yes', lang: 'en', onclick: (e) => submit(true, e.currentTarget) }, yes),
          h('button', { class: 'btn tf-no', lang: 'en', onclick: (e) => submit(false, e.currentTarget) }, no)
        )
      );
    } else if (q.input === 'tiles') {
      renderTiles();
    }
  }

  function renderTiles() {
    const used = new Set(chosen.map((c) => c.idx));
    answerZone.replaceChildren(
      h(
        'div',
        { class: `tiles ${q.tileStyle}` },
        q.tiles.map((t, idx) => h('button', { class: 'tile' + (used.has(idx) ? ' used' : ''), lang: 'en', disabled: used.has(idx), onclick: () => pickTile(idx) }, t))
      ),
      h('div', { class: 'row' }, h('button', { class: 'btn ghost small', onclick: undoTile, disabled: !chosen.length }, '⌫ Effacer'))
    );
  }

  function pickTile(idx) {
    if (locked || chosen.some((c) => c.idx === idx)) return;
    sound.tap();
    if (q.tileStyle === 'wordtile') speak(q.tiles[idx].replace(/[,]/g, ''), { force: true });
    chosen.push({ idx });
    renderCard('typing');
    renderTiles();
    if (chosen.length === q.answer.length) {
      locked = true;
      pending = setTimeout(() => {
        locked = false;
        submit(chosen.map((c) => q.tiles[c.idx]));
      }, 300);
    }
  }
  function undoTile() {
    if (locked || !chosen.length) return;
    chosen.pop();
    renderCard();
    renderTiles();
  }

  function next() {
    if (finished) return;
    if (session.done()) return finish();
    q = session.next(buildFor);
    if (!q) return finish();
    locked = false;
    answered = false;
    helpOpen = false;
    chosen = [];
    praiseEl.textContent = '';
    renderInstr();
    renderCard();
    renderAnswer();
    updateTop();
    clearTimeout(sayTimer);
    if (q.say) sayTimer = setTimeout(() => say(q.say), 300);
  }

  function submit(value, btn) {
    if (locked || finished) return;
    locked = true;
    answered = true;
    const ok = Array.isArray(q.answer) ? value.join(' ') === q.answer.join(' ') : value === q.answer;
    asked++;
    session.answer(q.item, ok);
    markDay();
    if (ok) {
      correct++;
      streak++;
      bestStreak = Math.max(bestStreak, streak);
      earned++;
      st.stars++;
      btn?.classList.add('right');
      renderCard('ok');
      if (streak % 5 === 0) {
        sound.combo();
        praiseEl.textContent = `🔥 ${streak} d’affilée ! +1 ⭐`;
        dogMood('wow');
      } else {
        sound.ok();
        praiseEl.textContent = `${pick(PRAISE)} +1 ⭐`;
        dogMood('happy');
      }
      if (q.afterOk) sayTimer = setTimeout(() => say(q.afterOk), 350);
      save();
      updateTop();
      const wait = q.note ? 3200 : q.afterOk && q.afterOk.length > 18 ? 2400 : q.reveal || q.afterOk ? 1700 : 1100;
      pending = setTimeout(next, wait);
    } else {
      streak = 0;
      sound.ko();
      btn?.classList.add('wrong');
      mistakes.set(q.item.id, q.item);
      dogMood('oops');
      renderCard('ko');
      save();
      updateTop();
      pending = setTimeout(showCorrection, 650);
    }
  }

  function showCorrection() {
    const c = q.correction || {};
    const ok = h('button', { class: 'btn ok-btn', onclick: closeSheet }, 'J’ai compris ✓');
    sheet.replaceChildren(
      h(
        'div',
        { class: 'sheet-inner center' },
        mascot(pick(OOPS), { mood: 'think' }),
        c.visual ? h('div', { class: 'fix-vis' }, visual(c.visual)) : null,
        c.en ? h('div', { class: 'fix-en', lang: 'en' }, c.en) : null,
        c.fr ? h('div', { class: 'fix-fr' }, '🇫🇷 ', c.fr) : null,
        c.text ? h('p', { class: 'fix-text' }, '💡 ', c.text) : null,
        h('div', { class: 'row' }, c.say ? h('button', { class: 'btn ghost', onclick: () => say(c.say, { force: true }) }, '🔊 Écouter') : null, ok)
      )
    );
    sheet.classList.remove('hidden');
    if (c.say) say(c.say);
    ok.focus();
  }

  function closeSheet() {
    if (sheet.classList.contains('hidden')) return;
    sheet.classList.add('hidden');
    stopSpeaking();
    next();
  }

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(pending);
    st.history.unshift({ t: Date.now(), unit: unitId || 'review', mode: modeId, correct, asked });
    st.history = st.history.slice(0, 100);
    save();
    go(
      'results',
      {
        unitId,
        skillIds,
        mode: modeId,
        itemIds,
        correct,
        asked,
        earned,
        bestStreak,
        stickersBefore,
        mistakes: [...mistakes.values()].map((i) => ({ id: i.id, en: i.answer || i.en, fr: i.fr, emoji: i.emoji || '' })),
      },
      { replace: true }
    );
  }

  function onKey(e) {
    if (!sheet.classList.contains('hidden')) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeSheet();
      }
      return;
    }
    if (!q || locked) return;
    if (q.input === 'choices' && /^[1-4]$/.test(e.key)) answerZone.querySelectorAll('.choice')[Number(e.key) - 1]?.click();
    else if (q.input === 'truefalse') {
      if (['y', 'o'].includes(e.key.toLowerCase())) answerZone.querySelector('.tf-yes')?.click();
      if (['n'].includes(e.key.toLowerCase())) answerZone.querySelector('.tf-no')?.click();
    } else if (q.input === 'tiles') {
      if (e.key === 'Backspace') undoTile();
      else if (e.key.length === 1 && e.key !== ' ') {
        const used = new Set(chosen.map((c) => c.idx));
        const idx = q.tiles.findIndex((t, i) => !used.has(i) && t.toLowerCase().startsWith(e.key.toLowerCase()));
        if (idx >= 0) pickTile(idx);
      }
    }
    if (e.key === ' ' && q.say) {
      e.preventDefault();
      say(q.say, { force: true });
    }
  }
  document.addEventListener('keydown', onKey);

  next();

  return {
    el,
    destroy() {
      finished = true;
      clearTimeout(pending);
      clearTimeout(sayTimer);
      stopSpeaking();
      document.removeEventListener('keydown', onKey);
    },
  };
}

export const modeLabel = (id) => MODES[id]?.label || id;
