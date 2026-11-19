// Exercices génériques : ils marchent pour tout élément qui a un visuel
// (kind 'emoji' : une image, 'swatch' : une couleur, 'number' : un nombre).

import { itemById, unitItems } from '../units/index.js';
import { shuffle } from '../core/util.js';
import { isItQ, itIs, yesAns, noAns, plain } from '../lang/en.js';

export function visOf(item) {
  if (item.kind === 'swatch') return { color: item.hex };
  if (item.kind === 'number') return { num: item.n };
  if (item.kind === 'emoji' || item.emoji) return { emoji: item.emoji };
  return null;
}
const visKey = (i) => `${i.kind}:${i.hex ?? i.n ?? i.emoji}`;

/** Jusqu'à n autres éléments du même genre, bien différents de celui-ci. */
export function distractors(item, ctx, n) {
  const out = [];
  const ok = (i) => i && i.kind === item.kind && i.id !== item.id && visKey(i) !== visKey(item) && i.en !== item.en && !out.some((o) => visKey(o) === visKey(i) || o.en === i.en);
  const add = (i) => ok(i) && out.length < n && out.push(i);
  if (item.confuse) add(itemById(item.confuse));
  shuffle(ctx.pool).forEach(add);
  shuffle(unitItems(ctx.unit)).forEach(add);
  return out;
}

export const choiceVis = (i) => ({ value: i.id, visual: visOf(i) });
export const choiceText = (i) => ({ value: i.id, text: i.en, say: plain(i.en) });

export const styleOf = (item) => ({ swatch: 'swatches', number: 'number' })[item.kind] || 'emoji';
const what = (item) => ({ swatch: 'la couleur', number: 'le nombre' })[item.kind] || 'l’image';

export function correctionOf(item, text) {
  return { visual: visOf(item), en: item.en, fr: item.fr, text, say: [['en', plain(item.en)], ['fr', item.fr]] };
}

export const reveal = (item) => ({ en: item.en, fr: item.fr });

export const listen = {
  id: 'listen',
  label: 'Écoute et trouve',
  emoji: '🎧',
  desc: 'Écoute et touche la bonne image',
  build(item, ctx) {
    if (!item.kind) return null;
    const others = distractors(item, ctx, 3);
    if (others.length < 1) return null;
    return {
      item,
      instruction: `Écoute et trouve ${what(item)} !`,
      say: plain(item.en),
      bigListen: true,
      input: 'choices',
      choiceStyle: styleOf(item),
      choices: shuffle([item, ...others].map(choiceVis)),
      answer: item.id,
      reveal: reveal(item),
      correction: correctionOf(item),
    };
  },
};

export const read = {
  id: 'read',
  label: 'Lis et trouve',
  emoji: '👀',
  desc: 'Défi : lis le mot anglais',
  build(item, ctx) {
    if (!item.kind) return null;
    const others = distractors(item, ctx, 3);
    if (others.length < 1) return null;
    return {
      item,
      instruction: `Lis le mot anglais et trouve ${what(item)} !`,
      text: item.en,
      textLang: 'en',
      textOpts: { big: true },
      input: 'choices',
      choiceStyle: styleOf(item),
      choices: shuffle([item, ...others].map(choiceVis)),
      answer: item.id,
      afterOk: plain(item.en),
      correction: correctionOf(item, `« ${item.en} » veut dire « ${item.fr} ». Écoute bien comment ça se dit !`),
    };
  },
};

export const picture = {
  id: 'picture',
  label: 'Comment dit-on ?',
  emoji: '🖼️',
  desc: 'Trouve le mot anglais',
  build(item, ctx) {
    if (!item.kind) return null;
    const others = distractors(item, ctx, 2);
    if (others.length < 1) return null;
    const ask = { swatch: 'What colour is it?', number: 'What number is it?' }[item.kind] || (item.np ? 'What is it?' : null);
    return {
      item,
      instruction: 'Comment dit-on en anglais ? Touche 🔊 pour écouter.',
      say: ask,
      visual: visOf(item),
      input: 'choices',
      choiceStyle: 'text',
      choices: shuffle([item, ...others].map(choiceText)),
      answer: item.id,
      afterOk: plain(item.en),
      correction: correctionOf(item),
    };
  },
};

export const translate = {
  id: 'translate',
  label: 'Du français à l’anglais',
  emoji: '🇫🇷',
  desc: 'Lis le mot français, trouve l’anglais',
  build(item, ctx) {
    if (!item.kind || !item.fr) return null;
    const others = distractors(item, ctx, 2);
    if (others.length < 1) return null;
    return {
      item,
      instruction: 'Lis en français. Comment dit-on en anglais ?',
      text: item.fr,
      textLang: 'fr',
      textOpts: { big: true },
      input: 'choices',
      choiceStyle: 'text',
      choices: shuffle([item, ...others].map(choiceText)),
      answer: item.id,
      afterOk: plain(item.en),
      correction: correctionOf(item),
    };
  },
};

export const isIt = {
  id: 'isIt',
  label: 'Yes or no?',
  emoji: '🤔',
  desc: '« Is it a cat? » Oui ou non ?',
  build(item, ctx) {
    if (!item.kind || !item.np) return null;
    const truth = Math.random() < 0.5;
    const other = truth ? null : distractors(item, ctx, 1)[0];
    if (!truth && !other) return null;
    const asked = truth ? item : other;
    const answerLine = truth ? yesAns(item) : `${noAns(asked)} ${itIs(item)}`;
    return {
      item,
      instruction: 'Écoute la question. Oui ou non ?',
      say: plain(isItQ(asked)),
      visual: visOf(item),
      text: isItQ(asked),
      textLang: 'en',
      input: 'truefalse',
      tfLabels: ['✅ Yes!', '❌ No!'],
      answer: truth,
      afterOk: plain(answerLine),
      reveal: { en: answerLine, fr: truth ? 'Oui !' : `Non. C’est ${item.fr}.` },
      correction: {
        visual: visOf(item),
        en: answerLine,
        fr: truth ? `Oui ! C’est ${item.fr}.` : `Non ! Ce n’est pas ${asked.fr}, c’est ${item.fr}.`,
        say: [['en', plain(answerLine)], ['fr', truth ? `Oui ! ${item.en}, c’est ${item.fr}.` : `Non, c’est ${item.fr}.`]],
      },
    };
  },
};

export const spell = {
  id: 'spell',
  label: 'J’écris le mot',
  emoji: '⌨️',
  desc: 'Défi : lettre par lettre',
  build(item) {
    if (!item.kind || !/^[a-z]{3,6}$/i.test(item.en)) return null;
    const letters = Array.from(item.en.toLowerCase());
    const decoys = shuffle(Array.from('aeiourstlnmpdbg').filter((l) => !letters.includes(l))).slice(0, 2);
    return {
      item,
      instruction: 'Écoute et écris le mot anglais !',
      say: item.en,
      visual: visOf(item),
      input: 'tiles',
      tileStyle: 'letter',
      tiles: shuffle([...letters, ...decoys]),
      answer: letters,
      correction: correctionOf(item, `On écrit « ${item.en} ». En anglais, on n’écrit pas toujours comme on entend !`),
    };
  },
};
