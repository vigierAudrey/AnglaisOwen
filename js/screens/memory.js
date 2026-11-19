// Memory : associer chaque image à son mot anglais (on entend le mot quand la paire est trouvée).

import { h } from '../ui/dom.js';
import { getState, addStars } from '../core/store.js';
import { go } from '../core/router.js';
import { getUnit, itemsFor } from '../units/index.js';
import { header, mascot, visual, endSheet, MASCOT } from '../ui/components.js';
import { visOf } from '../exercises/common.js';
import { shuffle } from '../core/util.js';
import { speak } from '../ui/speech.js';
import { plain } from '../lang/en.js';
import { sound } from '../ui/sound.js';
import { confetti } from '../ui/confetti.js';

const PAIRS = 6;

export default function memory({ unitId = 'words', skillIds }) {
  const st = getState();
  const unit = getUnit(unitId);
  const el = h('div', { class: `screen memory theme-${unitId}` }, header('Memory'));

  const chosen = [];
  for (const it of shuffle(itemsFor(unit, skillIds).filter((i) => i.kind && i.en.length <= 14))) {
    if (!chosen.some((c) => c.en === it.en || JSON.stringify(visOf(c)) === JSON.stringify(visOf(it)))) chosen.push(it);
    if (chosen.length === PAIRS) break;
  }
  if (chosen.length < 3) {
    el.append(mascot('Choisis des notions avec des images pour jouer au Memory !', { mood: 'think' }));
    return el;
  }

  const cards = shuffle(chosen.flatMap((it) => [{ it, kind: 'img' }, { it, kind: 'txt' }]));
  let first = null;
  let busy = false;
  let moves = 0;
  let found = 0;
  let pending = null;
  const movesEl = h('div', { class: 'score-pill' }, '👣 0 coup');

  const board = h(
    'div',
    { class: 'memory-board' },
    cards.map((c) => {
      const btn = h(
        'button',
        { class: `mem-card ${c.kind}`, 'aria-label': 'Carte cachée', onclick: () => flip(c, btn) },
        h('span', { class: 'mem-back' }, MASCOT),
        h('span', { class: 'mem-front' }, c.kind === 'img' ? visual(visOf(c.it), 'mem-vis') : h('span', { class: 'mem-word', lang: 'en' }, c.it.en))
      );
      return btn;
    })
  );

  function flip(c, btn) {
    if (busy || btn.classList.contains('flipped')) return;
    sound.flip();
    btn.classList.add('flipped');
    if (c.kind === 'txt') speak(plain(c.it.en), { force: true });
    if (!first) {
      first = { c, btn };
      return;
    }
    moves++;
    movesEl.textContent = `👣 ${moves} coup${moves > 1 ? 's' : ''}`;
    if (first.c.it.id === c.it.id) {
      sound.ok();
      speak(plain(c.it.en), { force: true });
      first.btn.classList.add('matched');
      btn.classList.add('matched');
      first = null;
      found++;
      if (found === chosen.length) pending = setTimeout(win, 800);
    } else {
      busy = true;
      const prev = first;
      first = null;
      pending = setTimeout(() => {
        prev.btn.classList.remove('flipped');
        btn.classList.remove('flipped');
        busy = false;
      }, 1200);
    }
  }

  function win() {
    const key = `memory:${unitId}:${chosen.length}`;
    const prev = st.records[key];
    const isRecord = prev === undefined || moves < prev;
    if (isRecord) st.records[key] = moves;
    const bonus = moves <= chosen.length + 3 ? 5 : 3;
    addStars(bonus);
    sound.win();
    confetti();
    endSheet(el, {
      text: isRecord && prev !== undefined ? `Nouveau record : ${moves} coups ! 🎉` : `Well done! Toutes les paires en ${moves} coups !`,
      stars: bonus,
      replay: () => go('memory', { unitId, skillIds }, { replace: true }),
    });
  }

  el.append(h('div', { class: 'memory-top' }, h('div', {}, 'Trouve l’image et son mot anglais !'), movesEl), board);
  return { el, destroy: () => clearTimeout(pending) };
}
