// Composants partagés entre les écrans.

import { h } from './dom.js';
import { back } from '../core/router.js';
import { getState, dayStreak, save } from '../core/store.js';
import { levelOf } from '../core/rewards.js';
import { randInt } from '../core/util.js';
import { FACTS } from '../data/facts.js';
import { say, speak } from './speech.js';
import { sound } from './sound.js';

export const MASCOT = '🐶';
export const MASCOT_NAME = 'Biscuit';

export const starPill = () => h('div', { class: 'stars-pill' }, '⭐ ', String(getState().stars));

export function streakPill() {
  const n = dayStreak();
  return n ? h('div', { class: 'stars-pill streak-pill', title: 'Jours d’affilée' }, '🔥 ', String(n)) : null;
}

export function header(title, { onBack = back, right } = {}) {
  return h(
    'header',
    { class: 'header' },
    h('button', { class: 'icon-btn', onclick: onBack, 'aria-label': 'Retour' }, '←'),
    h('h1', {}, title),
    right === undefined ? starPill() : right
  );
}

/** Biscuit le chien, la mascotte. mood : 'happy' | 'wow' | 'oops' | 'think' */
export function mascot(text, { mood = 'happy', size = '' } = {}) {
  return h(
    'div',
    { class: `mascot-row ${size}` },
    h('div', { class: `mascot mood-${mood}`, 'aria-hidden': 'true' }, MASCOT),
    text ? h('div', { class: 'bubble' }, text) : null
  );
}

/** Gros bouton « réécouter » (texte anglais ou liste de morceaux). */
export const listenBtn = (what, label = '🔊', cls = '') =>
  h('button', { class: `listen-btn ${cls}`, type: 'button', 'aria-label': 'Écouter', onclick: (e) => { e.stopPropagation(); say(what, { force: true }); } }, label);

/** Petit bouton qui lit un texte français. */
export const frListen = (text) =>
  h('button', { class: 'fr-listen', type: 'button', 'aria-label': 'Écouter en français', onclick: (e) => { e.stopPropagation(); speak(text, { force: true, lang: 'fr' }); } }, '🔈');

/**
 * Visuel d'un élément : { emoji } | { color } | { num } | { emojis } | { mix: [hex, hex] } | { scene }.
 */
export function visual(v, cls = '') {
  if (!v) return null;
  if (v.color) return h('span', { class: `swatch ${cls}`, style: { background: v.color }, 'aria-hidden': 'true' });
  if (v.num !== undefined) return h('span', { class: `num-vis ${cls}` }, String(v.num));
  if (v.mix) {
    const [a, b, c] = v.mix;
    return h(
      'span',
      { class: `mix-vis ${cls}` },
      h('span', { class: 'swatch', style: { background: a } }),
      h('b', {}, '+'),
      h('span', { class: 'swatch', style: { background: b } }),
      h('b', {}, '='),
      c ? h('span', { class: 'swatch', style: { background: c } }) : h('span', { class: 'swatch unknown' }, '?')
    );
  }
  if (v.scene) return sceneView(v.scene, cls);
  if (v.count) return h('span', { class: `count-vis ${cls}`, 'aria-hidden': 'true', style: { gridTemplateColumns: `repeat(${Math.min(v.count, 5)}, auto)` } }, Array.from(v.emojis).length === v.count ? Array.from(v.emojis).map((e) => h('span', {}, e)) : Array.from({ length: v.count }, () => h('span', {}, Array.from(v.emojis)[0])));
  if (v.emojis) return h('span', { class: `emojis-vis ${cls}` }, v.emojis);
  if (v.emoji) return h('span', { class: `emoji-vis ${cls}`, 'aria-hidden': 'true' }, v.emoji);
  return null;
}

/** Petite scène « in / on / under / next to » : un objet et une boîte. */
export function sceneView({ obj, pos }, cls = '') {
  return h('span', { class: `scene pos-${pos.replace(' ', '-')} ${cls}`, 'aria-hidden': 'true' }, h('span', { class: 'sc-ref' }, '📦'), h('span', { class: 'sc-obj' }, obj));
}

export function levelBadge() {
  const lvl = levelOf(getState().stars);
  return h(
    'div',
    { class: 'level' },
    h('span', { class: 'level-emoji' }, lvl.emoji),
    h(
      'div',
      { class: 'level-info' },
      h('div', { class: 'level-name' }, `Niveau ${lvl.index} · ${lvl.name}`),
      h('div', { class: 'bar small' }, h('div', { class: 'bar-fill star', style: { width: `${Math.round(lvl.progress * 100)}%` } })),
      lvl.next ? h('div', { class: 'level-next' }, `Encore ${lvl.next.stars - getState().stars} ⭐ pour devenir ${lvl.next.name}`) : null
    )
  );
}

/** Carte « Le savais-tu ? » : une curiosité différente à chaque fois. */
export function factCard() {
  const st = getState();
  const i = st.factIndex % FACTS.length;
  st.factIndex = i + 1;
  save();
  const [emoji, text] = FACTS[i];
  return h(
    'button',
    { class: 'fact-card', onclick: () => { sound.tap(); speak(text, { force: true, lang: 'fr' }); } },
    h('span', { class: 'fact-emoji' }, emoji),
    h('span', { class: 'fact-txt' }, h('b', {}, '💡 Le savais-tu ?'), h('span', {}, text))
  );
}

/** Fenêtre de fin de jeu, commune à tous les jeux. */
export function endSheet(el, { text, mood = 'wow', stars, replay, extra }) {
  el.append(
    h(
      'div',
      { class: 'sheet' },
      h(
        'div',
        { class: 'sheet-inner center' },
        mascot(text, { mood }),
        stars ? h('div', { class: 'earned' }, `+${stars} ⭐`) : null,
        extra || null,
        h('div', { class: 'row' }, h('button', { class: 'btn ghost', onclick: () => back() }, '← Retour'), h('button', { class: 'btn', onclick: replay }, '🔁 Rejouer'))
      )
    )
  );
}

/** Petite question pour que seuls les adultes entrent dans l'espace parents. */
export function parentGate(onSuccess) {
  const a = randInt(12, 19);
  const b = randInt(3, 9);
  const input = h('input', { type: 'number', inputmode: 'numeric', class: 'gate-input', 'aria-label': 'Réponse' });
  const err = h('div', { class: 'gate-err' });
  const close = () => overlay.remove();
  const overlay = h(
    'div',
    { class: 'modal-bg', onclick: (e) => e.target === overlay && close() },
    h(
      'form',
      {
        class: 'modal',
        onsubmit: (e) => {
          e.preventDefault();
          if (Number(input.value) === a * b) {
            close();
            onSuccess();
          } else {
            err.textContent = 'Ce n’est pas ça…';
            input.value = '';
          }
        },
      },
      h('h2', {}, '👤 Espace parents'),
      h('p', {}, 'Pour entrer, calculez :'),
      h('div', { class: 'gate-q' }, `${a} × ${b} = ?`),
      input,
      err,
      h(
        'div',
        { class: 'row' },
        h('button', { type: 'button', class: 'btn ghost', onclick: close }, 'Annuler'),
        h('button', { type: 'submit', class: 'btn' }, 'Entrer')
      )
    )
  );
  document.body.append(overlay);
  setTimeout(() => input.focus(), 50);
}

