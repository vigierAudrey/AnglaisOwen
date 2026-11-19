// Le petit café : un client commande en anglais (« Can I have two apples, please? »),
// on remplit son plateau puis on le sert.

import { h } from '../ui/dom.js';
import { getState, addStars } from '../core/store.js';
import { go } from '../core/router.js';
import { recordAnswer } from '../core/srs.js';
import { VOCAB_BY } from '../data/vocab.js';
import { NUMBER_WORDS } from '../data/numbers.js';
import { header, endSheet } from '../ui/components.js';
import { pick, shuffle, randInt } from '../core/util.js';
import { speak, speakSeq, stopSpeaking } from '../ui/speech.js';
import { article } from '../lang/en.js';
import { sound } from '../ui/sound.js';
import { confetti } from '../ui/confetti.js';

const CUSTOMERS = 6;
// [mot, pluriel]
const MENU = [
  ['apple', 'apples'], ['banana', 'bananas'], ['orange', 'oranges'], ['pear', 'pears'], ['strawberry', 'strawberries'],
  ['cherry', 'cherries'], ['cake', 'cakes'], ['cookie', 'cookies'], ['sandwich', 'sandwiches'], ['egg', 'eggs'],
  ['ice cream', 'ice creams'], ['pizza', 'pizzas'], ['carrot', 'carrots'], ['lemon', 'lemons'], ['pancake', 'pancakes'],
].map(([en, pl]) => ({ ...VOCAB_BY[en], pl }));
const PEOPLE = ['👧', '👦', '👩', '👨', '👵', '👴', '🧑', '👸', '🤴', '🧙', '🦸', '🤖', '👽', '🧛'];

const part = (it, n) => (n === 1 ? `${article(it.en)} ${it.en}` : `${NUMBER_WORDS[n]} ${it.pl}`);

export default function cafe() {
  const st = getState();
  const el = h('div', { class: 'screen cafe theme-words' }, header('Le petit café'));
  let num = 0;
  let served = 0;
  let pending = null;
  const topEl = h('div', { class: 'memory-top' });
  const body = h('div', { class: 'col' });
  const updateTop = () => topEl.replaceChildren(h('span', {}, `Client ${num} / ${CUSTOMERS}`), h('span', { class: 'score-pill' }, `☕ ${served}`));

  function newCustomer() {
    if (num >= CUSTOMERS) return end();
    num++;
    const who = pick(PEOPLE);
    const picks = shuffle(MENU);
    const order = num <= 2 ? [[picks[0], 1]] : num <= 4 ? [[picks[0], randInt(2, 3)]] : [[picks[0], 1], [picks[1], randInt(2, 3)]];
    const orderText = order.map(([it, n]) => part(it, n)).join(' and ');
    const request = `Can I have ${orderText}, please?`;
    const counter = shuffle([...order.map(([it]) => it), ...picks.slice(order.length, 8)]).slice(0, 8);
    const tray = [];
    let finished = false;

    const trayEl = h('div', { class: 'tray' });
    const renderTray = () =>
      trayEl.replaceChildren(
        ...(tray.length
          ? tray.map((it, i) => h('button', { class: 'tray-item', 'aria-label': `Enlever ${it.en}`, onclick: () => { if (finished) return; tray.splice(i, 1); sound.tap(); renderTray(); } }, it.emoji))
          : [h('span', { class: 'muted' }, 'Le plateau est vide. Touche ce que le client veut !')])
      );

    const msg = h('div', { class: 'cafe-msg' });
    const serveBtn = h('button', { class: 'btn big', onclick: serve }, '🛎️ Servir');
    const sayOrder = () => speakSeq([['en', 'Hello!'], ['en', request]], { force: true });

    function serve() {
      if (finished) return;
      if (!tray.length) return sayOrder();
      finished = true;
      const want = new Map(order.map(([it, n]) => [it.en, n]));
      const got = new Map();
      tray.forEach((it) => got.set(it.en, (got.get(it.en) || 0) + 1));
      const ok = want.size === got.size && [...want].every(([k, n]) => got.get(k) === n);
      order.forEach(([it, n]) => recordAnswer(st, `w:${it.en}`, got.get(it.en) === n));
      if (ok) {
        served++;
        addStars(2);
        sound.bell();
        msg.replaceChildren(h('div', { class: 'reveal-en', lang: 'en' }, `${who} « Thank you! Goodbye! »`), h('div', {}, 'Bravo, client content ! +2 ⭐'));
        speak('Thank you! Goodbye!', { force: true });
      } else {
        sound.ko();
        msg.replaceChildren(
          h('div', {}, 'Oups ! Le client voulait :'),
          h('div', { class: 'cafe-want' }, order.map(([it, n]) => h('span', {}, it.emoji.repeat(n)))),
          h('div', { class: 'reveal-en', lang: 'en' }, orderText),
          h('div', {}, order.map(([it, n]) => (n === 1 ? it.fr : `${['', '', 'deux', 'trois'][n]} ${it.fr.replace(/^(un|une) /, '').replace(/eau$/, 'eaux').replace(/([^x])$/, '$1s')}`)).join(' et '))
        );
        speakSeq([['en', `I wanted ${orderText}.`]], { force: true });
      }
      updateTop();
      serveBtn.replaceWith(h('button', { class: 'btn big', onclick: newCustomer }, num >= CUSTOMERS ? 'Fermer le café 🏁' : 'Client suivant →'));
    }

    body.replaceChildren(
      h('div', { class: 'customer' }, h('span', { class: 'cust-face' }, who), h('div', { class: 'bubble' }, h('span', { lang: 'en' }, 'Hello! '), h('button', { class: 'btn small', onclick: sayOrder }, '🔊 Écouter la commande'))),
      h('div', { class: 'counter' }, counter.map((it) => h('button', { class: 'counter-item', onclick: () => { if (finished || tray.length >= 6) return; sound.tap(); speak(it.en, { force: true }); tray.push(it); renderTray(); } }, h('span', {}, it.emoji)))),
      h('div', { class: 'tray-wrap' }, h('div', { class: 'tray-title' }, '🍽️ Le plateau'), trayEl),
      msg,
      serveBtn
    );
    renderTray();
    updateTop();
    pending = setTimeout(sayOrder, 400);
  }

  function end() {
    sound.win();
    if (served >= 5) confetti();
    const bonus = served === CUSTOMERS ? 3 : 0;
    if (bonus) addStars(bonus);
    endSheet(el, {
      text: `${served} client${served > 1 ? 's' : ''} servi${served > 1 ? 's' : ''} sur ${CUSTOMERS} ! ${served === CUSTOMERS ? 'Best café in town! ☕' : ''}`,
      mood: served >= 4 ? 'wow' : 'happy',
      stars: served * 2 + bonus,
      replay: () => go('cafe', {}, { replace: true }),
    });
  }

  el.append(topEl, h('div', { class: 'instr big' }, 'Écoute la commande et remplis le plateau !'), body);
  newCustomer();
  return { el, destroy: () => { clearTimeout(pending); stopSpeaking(); } };
}
