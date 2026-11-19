// Le perroquet : j'écoute, je répète, je m'enregistre et je compare ma voix au modèle.
// L'enfant juge lui-même (pas de « reconnaissance vocale » qui se tromperait sur les petites voix).

import { h } from '../ui/dom.js';
import { getState, addStars } from '../core/store.js';
import { go } from '../core/router.js';
import { getUnit, itemsFor } from '../units/index.js';
import { recordAnswer } from '../core/srs.js';
import { visOf } from '../exercises/common.js';
import { header, mascot, visual, endSheet } from '../ui/components.js';
import { shuffle } from '../core/util.js';
import { speak, stopSpeaking } from '../ui/speech.js';
import { plain } from '../lang/en.js';
import { recordingAvailable, startRecording, playBlob } from '../ui/record.js';
import { sound } from '../ui/sound.js';
import { confetti } from '../ui/confetti.js';

const WORDS = 8;
const MAX_MS = 3500;

export default function parrot({ unitId = 'words', skillIds }) {
  const st = getState();
  const unit = getUnit(unitId);
  const items = shuffle(itemsFor(unit, skillIds).filter((i) => i.kind)).slice(0, WORDS);
  const el = h('div', { class: `screen parrot theme-${unitId}` }, header('Le perroquet'));
  if (!items.length) {
    el.append(mascot('Choisis des notions avec des images pour jouer !', { mood: 'think' }));
    return el;
  }
  const canRecord = recordingAvailable();
  let i = 0;
  let said = 0;
  let stopFn = null;
  let autoStop = null;
  let myVoice = null;
  let alive = true;
  let mineRef = null;
  const body = h('div', { class: 'col center' });
  const topEl = h('div', { class: 'memory-top' });

  function show() {
    if (i >= items.length) return end();
    const it = items[i];
    myVoice = null;
    topEl.replaceChildren(h('span', {}, `Mot ${i + 1} / ${items.length}`), h('span', { class: 'score-pill' }, `🦜 ${said}`));
    const recBtn = h('button', { class: 'btn big rec-btn', onclick: () => toggleRec(recBtn, it) }, '🎙️ À toi ! Enregistre-toi');
    const mineBtn = h('button', { class: 'btn ghost', disabled: true, onclick: () => compare(it) }, '👂 Ma voix / le modèle');
    mineRef = mineBtn;
    body.replaceChildren(
      h('div', { class: 'parrot-card' }, h('div', { class: 'q-vis' }, visual(visOf(it))), h('div', { class: 'parrot-en', lang: 'en' }, it.en), h('div', { class: 'parrot-fr' }, `🇫🇷 ${it.fr}`)),
      h('button', { class: 'btn big secondary', onclick: () => speak(plain(it.en), { force: true }) }, '🔊 J’écoute'),
      canRecord ? recBtn : h('p', { class: 'muted center' }, 'Répète le mot à voix haute, comme un perroquet ! 🦜'),
      canRecord ? mineBtn : null,
      h('button', { class: 'btn big ok-btn', onclick: () => good(it) }, '⭐ Je l’ai bien dit !'),
      h('button', { class: 'btn ghost small', onclick: () => { i++; show(); } }, 'Passer →')
    );
    setTimeout(() => alive && speak(plain(it.en), { force: true }), 300);
  }

  async function toggleRec(btn, it) {
    if (stopFn) return finishRec(btn, it);
    try {
      stopSpeaking();
      stopFn = await startRecording();
      btn.classList.add('recording');
      btn.textContent = '⏹ J’ai fini';
      autoStop = setTimeout(() => finishRec(btn, it), MAX_MS);
    } catch {
      btn.replaceWith(h('p', { class: 'muted center' }, 'Le micro n’est pas disponible. Répète simplement à voix haute ! 🦜'));
    }
  }

  async function finishRec(btn, it) {
    clearTimeout(autoStop);
    if (!stopFn) return;
    const fn = stopFn;
    stopFn = null;
    myVoice = await fn();
    if (!alive) return;
    btn.classList.remove('recording');
    btn.textContent = '🎙️ Recommencer';
    if (mineRef) mineRef.disabled = false;
    compare(it);
  }

  async function compare(it) {
    if (!myVoice) return;
    await playBlob(myVoice);
    if (alive) setTimeout(() => speak(plain(it.en), { force: true }), 250);
  }

  function good(it) {
    sound.ok();
    said++;
    recordAnswer(st, it.id, true);
    addStars(1);
    i++;
    show();
  }

  function end() {
    sound.win();
    if (said >= 6) confetti();
    endSheet(el, {
      text: `Tu as répété ${said} mot${said > 1 ? 's' : ''} ! Ton accent anglais s’améliore ! 🦜`,
      stars: said,
      replay: () => go('parrot', { unitId, skillIds }, { replace: true }),
    });
  }

  el.append(mascot('Écoute, répète, puis enregistre-toi pour comparer ta voix au modèle !', { mood: 'happy' }), topEl, body);
  show();
  return {
    el,
    destroy() {
      alive = false;
      clearTimeout(autoStop);
      stopFn?.();
      stopSpeaking();
    },
  };
}
