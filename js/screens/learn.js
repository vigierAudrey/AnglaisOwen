// « J'apprends » : on regarde, on touche, on écoute. Aucune pression, aucune erreur possible.

import { h } from '../ui/dom.js';
import { getState, personal, personalFr } from '../core/store.js';
import { getUnit, getSkill } from '../units/index.js';
import { header, mascot, visual } from '../ui/components.js';
import { visOf } from '../exercises/common.js';
import { say, speak } from '../ui/speech.js';
import { sound } from '../ui/sound.js';
import { LIKE_EMOJI, COLOUR_SHAPES } from '../data/phrases.js';
import { article, plain } from '../lang/en.js';

/** Ce qu'on montre sur la carte d'un élément : { visual, en, sub?, fr, say, note? }. */
function cardOf(item) {
  const s = item.skillId;
  if (item.q) return { visual: { emoji: item.emoji }, en: item.q, sub: personal(item.a), fr: `${personalFr(item.qfr)} → ${personalFr(item.afr)}`, say: [['en', plain(item.q)], ['en', plain(personal(item.a))]] };
  if (s === 'situations') return { visual: { emoji: item.emoji }, en: item.en, fr: item.sit, say: [['fr', item.sit], ['en', plain(item.en)]] };
  if (item.animal) return { visual: { emojis: `${item.ae} ${item.yes ? '✅' : '❌'} ${item.ve}` }, en: item.en, fr: item.fr, note: item.note, say: plain(item.en) };
  if (item.c) return { visual: { mix: [item.a.hex, item.b.hex, item.c.hex] }, en: `${item.a.en} + ${item.b.en} = ${item.c.en}`, fr: item.fr, say: `${item.a.en} and ${item.b.en} make ${item.c.en}` };
  if (s === 'like') return { visual: { emojis: `${LIKE_EMOJI.yes}${item.emoji}` }, en: `I like ${item.en}.`, sub: `I don’t like ${item.en}.`, fr: `J’aime ${item.fr}.`, say: [['en', `I like ${item.en}.`], ['en', `I don't like ${item.en}.`]] };
  if (s === 'have') return { visual: { emojis: `${item.emoji} ${item.emoji}${item.emoji}` }, en: `one ${item.one}, two ${item.many}`, fr: `un ${item.fr}, deux…`, note: item.note, say: `one ${item.one}… two ${item.many}` };
  if (s === 'colourShape') return { visual: { emoji: COLOUR_SHAPES.heart.e[item.en] }, en: `${article(item.en)} ${item.en} heart`, fr: `un cœur ${item.fr}`, say: `${article(item.en)} ${item.en} heart` };
  if (s === 'where') return { visual: { scene: { obj: '🐱', pos: item.en } }, en: `The cat is ${item.en} the box.`, fr: `Le chat est ${item.fr} la boîte.`, say: `The cat is ${item.en} the box.` };
  if (s === 'riddles') return { visual: { emoji: item.emoji }, en: item.text, sub: `→ ${item.answer}`, fr: item.fr, say: [['en', plain(item.text)], ['en', item.answer]] };
  if (s === 'order') return { visual: { emoji: item.emoji }, en: personal(item.text), fr: personalFr(item.fr), say: plain(personal(item.text)) };
  return { visual: visOf(item), en: item.en, fr: item.fr, say: plain(item.en), twin: item.twin };
}

function learnCard(item, showFr) {
  const c = cardOf(item);
  const long = c.en.length > 22;
  return h(
    'button',
    {
      class: 'learn-card word-card' + (long ? ' long' : ''),
      onclick: (e) => {
        sound.tap();
        say(c.say, { force: true });
        e.currentTarget.classList.remove('bump');
        void e.currentTarget.offsetWidth;
        e.currentTarget.classList.add('bump');
      },
    },
    c.twin ? h('span', { class: 'twin-tag', title: 'Mot transparent' }, '👯') : null,
    h('span', { class: 'wc-vis' }, visual(c.visual)),
    h('span', { class: 'wc-en', lang: 'en' }, c.en),
    c.sub ? h('span', { class: 'wc-sub', lang: 'en' }, c.sub) : null,
    showFr && c.fr ? h('span', { class: 'wc-fr' }, c.fr) : null,
    c.note ? h('span', { class: 'wc-note' }, c.note) : null
  );
}

function lessonPanel(skill) {
  return h(
    'div',
    { class: 'lesson' },
    h('ul', { class: 'rule-list' }, skill.lesson.map((l) => h('li', {}, l))),
    h('button', { class: 'btn small ghost', onclick: () => speak(skill.lesson.join(' '), { force: true, lang: 'fr' }) }, '🔈 Écouter la leçon')
  );
}

export default function learn({ unitId, skillIds }) {
  const unit = getUnit(unitId);
  const st = getState();
  const skills = skillIds.map((id) => getSkill(unit, id)).filter(Boolean);
  let showFr = st.settings.showFrench;
  const el = h('div', { class: `screen learn theme-${unitId}` }, header('J’apprends'));
  const body = h('div', { class: 'col' });

  const render = () =>
    body.replaceChildren(
      ...skills.map((s) =>
        h(
          'section',
          { class: 'panel learn-panel' },
          h('div', { class: 'learn-title' }, `${s.emoji || ''} ${s.label}`),
          s.lesson ? lessonPanel(s) : null,
          h('div', { class: 'learn-grid' + (['questions', 'situations', 'riddles', 'order', 'can'].includes(s.id) ? ' wide' : '') }, s.items.map((i) => learnCard(i, showFr)))
        )
      )
    );

  const frToggle = h('button', { class: 'chip' + (showFr ? ' on' : ''), onclick: () => { showFr = !showFr; frToggle.classList.toggle('on', showFr); render(); } }, '🇫🇷 Traduction');
  el.append(mascot('Touche une carte pour entendre l’anglais. Répète à voix haute, comme un perroquet ! 🦜', { mood: 'happy' }), h('div', { class: 'row left' }, frToggle), body);
  render();
  return el;
}
