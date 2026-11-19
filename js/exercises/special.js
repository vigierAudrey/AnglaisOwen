// Exercices propres à une notion (nombres, couleurs, politesse, animaux, phrases).

import { unitItems } from '../units/index.js';
import { pick, shuffle, randInt } from '../core/util.js';
import { personal, personalFr } from '../core/store.js';
import { NUMBER_WORDS, COUNTABLES } from '../data/numbers.js';
import { LIKE_EMOJI, COLOUR_SHAPES } from '../data/phrases.js';
import { article, cap, plain } from '../lang/en.js';
import { visOf, distractors, choiceVis, correctionOf } from './common.js';

const word = (n) => NUMBER_WORDS[n];
const fromSkill = (ctx, item) => ctx.unit.skills.find((s) => s.id === item.skillId)?.items || [];
const others = (ctx, item, n) => shuffle(fromSkill(ctx, item).filter((i) => i.id !== item.id)).slice(0, n);
const rep = (e, n) => Array(n).fill(e).join('');

// ---------------------------------------------------------------- Nombres

export const count = {
  id: 'count',
  label: 'How many?',
  emoji: '🍎',
  desc: 'Compte et dis-le en anglais',
  build(item) {
    const n = item.n;
    if (item.kind !== 'number' || n < 2 || n > 12) return null;
    const [emoji, noun] = pick(COUNTABLES);
    const near = shuffle([n - 2, n - 1, n + 1, n + 2].filter((x) => x >= 1 && x <= 12 && x !== n)).slice(0, 2);
    return {
      item,
      instruction: 'Compte, puis choisis le nombre en anglais !',
      say: `How many ${noun}?`,
      visual: { emojis: rep(emoji, n), count: n },
      input: 'choices',
      choiceStyle: 'text',
      choices: shuffle([n, ...near].map((x) => ({ value: `num:${x}`, text: word(x), say: word(x) }))),
      answer: item.id,
      afterOk: `${cap(word(n))} ${noun}!`,
      correction: { visual: { emojis: rep(emoji, n), count: n }, en: `${word(n)} ${noun}`, fr: `${item.fr}`, say: [['en', `${word(n)} ${noun}`], ['fr', item.fr]] },
    };
  },
};

export const maths = {
  id: 'maths',
  label: 'Maths in English',
  emoji: '➕',
  desc: 'Écoute le calcul en anglais',
  build(item, ctx) {
    const n = item.n;
    if (item.kind !== 'number' || n < 1) return null;
    let a;
    let b;
    let op = 'plus';
    if (n <= 10) {
      if (Math.random() < 0.3 && n <= 8) {
        op = 'minus';
        b = randInt(1, 10 - n);
        a = n + b;
      } else {
        a = randInt(0, n);
        b = n - a;
      }
    } else if (n % 10 === 0 && n >= 20) {
      a = 10 * randInt(1, n / 10 - 1);
      b = n - a;
    } else if (n <= 20) {
      a = 10;
      b = n - 10;
    } else return null;
    const sym = op === 'plus' ? '+' : '−';
    const line = `${word(a)} ${op} ${word(b)}`;
    const all = unitItems(ctx.unit).filter((i) => i.kind === 'number' && i.n !== n);
    const others = shuffle(all.sort((x, y) => Math.abs(x.n - n) - Math.abs(y.n - n)).slice(0, 5)).slice(0, 3);
    if (!others.length) return null;
    return {
      item,
      instruction: 'Écoute le calcul en anglais et trouve le résultat !',
      say: line,
      text: `? ${sym} ? = ?`,
      textOpts: { big: true },
      input: 'choices',
      choiceStyle: 'number',
      choices: shuffle([item, ...others].map(choiceVis)),
      answer: item.id,
      afterOk: `${line} equals ${word(n)}!`,
      reveal: { en: `${a} ${sym} ${b} = ${n}`, fr: `${line} equals ${word(n)}` },
      correction: { visual: { num: n }, en: `${line} = ${word(n)}`, fr: `${a} ${sym} ${b} = ${n}`, say: [['en', `${line} equals ${word(n)}`], ['fr', `${a} ${op === 'plus' ? 'plus' : 'moins'} ${b} égale ${n}`]] },
    };
  },
};

// ---------------------------------------------------------------- Couleurs

export const colourOf = {
  id: 'colourOf',
  label: 'What colour is it?',
  emoji: '🍌',
  desc: 'De quelle couleur est la banane ?',
  build(item, ctx) {
    if (item.kind !== 'swatch' || !item.things?.length) return null;
    const [emoji, thing, thingFr, are] = pick(item.things);
    const verb = are ? 'are' : 'is';
    const others = distractors(item, ctx, 3);
    if (!others.length) return null;
    const line = `The ${thing} ${verb} ${item.en}.`;
    return {
      item,
      instruction: 'Écoute la question et touche la bonne couleur !',
      say: `What colour ${verb} the ${thing}?`,
      visual: { emoji },
      input: 'choices',
      choiceStyle: 'swatches',
      choices: shuffle([item, ...others].map(choiceVis)),
      answer: item.id,
      afterOk: `Yes! ${line}`,
      reveal: { en: line, fr: `${cap(thingFr)} : ${item.fr}` },
      correction: { visual: { emoji }, en: line, fr: `${cap(thingFr)} est ${item.fr}. (${item.en} = ${item.fr})`, say: [['en', line], ['fr', `${item.en}, c’est ${item.fr}`]] },
    };
  },
};

export const mixColours = {
  id: 'mixColours',
  label: 'Les mélanges',
  emoji: '🧪',
  desc: 'Red and yellow make…?',
  build(item, ctx) {
    if (!item.c) return null;
    const colours = unitItems(ctx.unit).filter((i) => i.kind === 'swatch');
    const right = colours.find((i) => i.en === item.c.en);
    const wrong = shuffle(colours.filter((i) => ![item.a.en, item.b.en, item.c.en].includes(i.en))).slice(0, 3);
    const line = `${cap(item.a.en)} and ${item.b.en} make ${item.c.en}!`;
    return {
      item,
      instruction: 'Quelle couleur on obtient en mélangeant ?',
      say: `${cap(item.a.en)} and ${item.b.en} make…`,
      visual: { mix: [item.a.hex, item.b.hex] },
      input: 'choices',
      choiceStyle: 'swatches',
      choices: shuffle([right, ...wrong].map((i) => ({ value: i.id === right.id ? item.id : i.id, visual: visOf(i) }))),
      answer: item.id,
      afterOk: line,
      reveal: { en: line, fr: item.fr },
      correction: { visual: { color: item.c.hex }, en: line, fr: item.fr, say: [['en', line], ['fr', item.fr]] },
    };
  },
};

// ---------------------------------------------------------------- Hello!

const textChoice = (i) => ({ value: i.id, text: i.en, say: plain(i.en) });

export const situation = {
  id: 'situation',
  label: 'Que dis-tu ?',
  emoji: '🎭',
  desc: 'Une situation : la bonne formule',
  build(item, ctx) {
    if (!item.sit) return null;
    const wrong = others(ctx, item, 2);
    return {
      item,
      instruction: 'Lis l’histoire. Que dis-tu en anglais ?',
      text: item.sit,
      textLang: 'fr',
      input: 'choices',
      choiceStyle: 'text',
      choices: shuffle([item, ...wrong].map(textChoice)),
      answer: item.id,
      afterOk: plain(item.en),
      correction: { visual: { emoji: item.emoji }, en: item.en, fr: item.fr, say: [['en', plain(item.en)], ['fr', item.fr]] },
    };
  },
};

export const reply = {
  id: 'reply',
  label: 'Que répondre ?',
  emoji: '💬',
  desc: 'Écoute la question, choisis la réponse',
  build(item, ctx) {
    if (!item.q) return null;
    const ans = (i) => personal(i.a);
    const wrong = others(ctx, item, 2);
    return {
      item,
      instruction: 'Écoute la question. Que réponds-tu ?',
      say: plain(item.q),
      visual: { emoji: item.emoji },
      text: item.q,
      textLang: 'en',
      help: personalFr(item.qfr),
      input: 'choices',
      choiceStyle: 'text',
      choices: shuffle([item, ...wrong].map((i) => ({ value: i.id, text: ans(i), say: plain(ans(i)) }))),
      answer: item.id,
      afterOk: plain(ans(item)),
      correction: { visual: { emoji: item.emoji }, en: `${item.q} → ${ans(item)}`, fr: `${personalFr(item.qfr)} → ${personalFr(item.afr)}`, say: [['en', plain(`${item.q} ${ans(item)}`)], ['fr', personalFr(item.afr)]] },
    };
  },
};

// ---------------------------------------------------------------- Actions

export const canDo = {
  id: 'canDo',
  label: 'Can a fish fly?',
  emoji: '🐧',
  desc: 'Ce que savent faire les animaux',
  build(item) {
    if (!item.animal) return null;
    const art = article(item.animal);
    const q = `Can ${art} ${item.animal} ${item.verb}?`;
    const a = item.yes ? 'Yes, it can!' : 'No, it can’t!';
    return {
      item,
      instruction: 'Écoute bien. Oui ou non ?',
      say: q,
      visual: { emojis: `${item.ae} ❓ ${item.ve}` },
      text: q,
      textLang: 'en',
      help: item.fr.replace(/ (sait|ne sait pas) /, item.fr.startsWith('Une') ? ' sait-elle ' : ' sait-il ').replace(/\.$/, ' ?'),
      input: 'truefalse',
      tfLabels: ['✅ Yes, it can!', '❌ No, it can’t!'],
      answer: item.yes,
      afterOk: plain(a),
      note: item.note,
      correction: { visual: { emojis: `${item.ae} ${item.yes ? '✅' : '❌'} ${item.ve}` }, en: `${a} ${item.en}`, fr: item.note, say: [['en', plain(`${a} ${item.en}`)], ['fr', item.note]] },
    };
  },
};

// ---------------------------------------------------------------- Phrases

export const opposite = {
  id: 'opposite',
  label: 'Les contraires',
  emoji: '🐘',
  desc: 'big ou small ?',
  build(item) {
    if (!item.other) return null;
    return {
      item,
      instruction: 'Écoute et trouve la bonne image !',
      say: `Find: ${item.en}!`,
      bigListen: true,
      input: 'choices',
      choiceStyle: 'emoji',
      choices: shuffle([{ value: item.id, visual: { emoji: item.emoji } }, { value: `other:${item.other.en}`, visual: { emoji: item.other.emoji } }]),
      answer: item.id,
      afterOk: `${cap(item.en)}!`,
      reveal: { en: `${item.en} ↔ ${item.other.en}`, fr: `${item.fr} ↔ ${item.other.fr}` },
      correction: { visual: { emojis: `${item.emoji}  ↔  ${item.other.emoji}` }, en: `${item.en} ↔ ${item.other.en}`, fr: `${item.en} = ${item.fr} ; ${item.other.en} = ${item.other.fr}`, say: [['en', `${item.en}… ${item.other.en}`], ['fr', `${item.fr}, ${item.other.fr}`]] },
    };
  },
};

export const like = {
  id: 'like',
  label: 'I like…',
  emoji: '😋',
  desc: 'J’aime ou je n’aime pas ?',
  build(item, ctx) {
    if (item.skillId !== 'like') return null;
    const yes = Math.random() < 0.5;
    const other = others(ctx, item, 1)[0];
    const opt = (food, y) => ({ value: `${y ? 'yes' : 'no'}:${food.id}`, visual: { emojis: `${y ? LIKE_EMOJI.yes : LIKE_EMOJI.no}${food.emoji}` } });
    const line = `I ${yes ? 'like' : 'don’t like'} ${item.en}.`;
    const fr = `${yes ? 'J’aime' : 'Je n’aime pas'} ${item.fr}.`;
    return {
      item,
      instruction: 'Écoute bien : il aime ou il n’aime pas ?',
      say: plain(line),
      bigListen: true,
      input: 'choices',
      choiceStyle: 'emojis',
      choices: shuffle([opt(item, true), opt(item, false), opt(other, true), opt(other, false)]),
      answer: `${yes ? 'yes' : 'no'}:${item.id}`,
      reveal: { en: line, fr },
      correction: { visual: { emojis: `${yes ? LIKE_EMOJI.yes : LIKE_EMOJI.no}${item.emoji}` }, en: line, fr, text: yes ? null : 'Le petit mot « don’t » veut dire « ne… pas ».', say: [['en', plain(line)], ['fr', fr]] },
    };
  },
};

export const have = {
  id: 'have',
  label: 'I have…',
  emoji: '🐱',
  desc: 'I have two cats',
  build(item, ctx) {
    if (!item.many) return null;
    const n = randInt(1, 5);
    const other = others(ctx, item, 1)[0];
    const m = n === 1 ? 2 : n === 5 ? 4 : pick([n - 1, n + 1]);
    const k = pick([1, 2, 3, 4, 5].filter((x) => x !== n));
    const group = (pet, x) => ({ value: `${pet.id}:${x}`, visual: { emojis: rep(pet.emoji, x) } });
    const line = n === 1 ? `I have ${article(item.one)} ${item.one}.` : `I have ${word(n)} ${item.many}.`;
    const frPl = n === 1 || /s$/.test(item.fr) ? item.fr : /eau$/.test(item.fr) ? `${item.fr}x` : `${item.fr}s`;
    const frLine = `J’ai ${n === 1 ? item.frArt : ['', '', 'deux', 'trois', 'quatre', 'cinq'][n]} ${frPl}.`;
    const choices = [group(item, n), group(item, m), group(other, n), group(other, k)];
    return {
      item,
      instruction: 'Écoute : qu’est-ce qu’il a ?',
      say: line,
      bigListen: true,
      input: 'choices',
      choiceStyle: 'emojis',
      choices: shuffle(choices),
      answer: `${item.id}:${n}`,
      reveal: { en: line, fr: frLine },
      note: n > 1 ? item.note : null,
      correction: { visual: { emojis: rep(item.emoji, n) }, en: line, fr: frLine, text: item.note || null, say: [['en', line], ['fr', frLine]] },
    };
  },
};

export const colourShape = {
  id: 'colourShape',
  label: 'Couleur + forme',
  emoji: '❤️',
  desc: 'a red heart',
  build(item, ctx) {
    if (!item.colour) return null;
    const shapes = Object.keys(COLOUR_SHAPES);
    const shape = pick(shapes);
    const n = randInt(1, 3);
    const other = others(ctx, item, 1)[0].colour.en;
    const otherShape = pick(shapes.filter((s) => s !== shape));
    const S = (s) => COLOUR_SHAPES[s];
    const group = (s, c, x) => ({ value: `${s}:${c}:${x}`, visual: { emojis: rep(S(s).e[c], x) } });
    const say = n === 1 ? `${article(item.en)} ${item.en} ${shape}` : `${word(n)} ${item.en} ${S(shape).pl}`;
    const frLine = `${['', 'un', 'deux', 'trois'][n]} ${S(shape).fr}${n > 1 ? 's' : ''} ${item.fr}${n > 1 && !/s$/.test(item.fr) && item.fr !== 'orange' && item.fr !== 'marron' ? 's' : ''}`;
    const nn = n === 3 ? 2 : n + 1;
    return {
      item,
      instruction: 'Écoute et trouve la bonne image !',
      say,
      bigListen: true,
      input: 'choices',
      choiceStyle: 'emojis',
      choices: shuffle([group(shape, item.en, n), group(shape, other, n), group(otherShape, item.en, n), group(shape, item.en, nn)]),
      answer: `${shape}:${item.en}:${n}`,
      reveal: { en: say, fr: frLine },
      correction: { visual: { emojis: rep(S(shape).e[item.en], n) }, en: say, fr: frLine, text: 'En anglais, la couleur se met avant le mot !', say: [['en', say], ['fr', frLine]] },
    };
  },
};

export const where = {
  id: 'where',
  label: 'Où est-il ?',
  emoji: '📦',
  desc: 'in, on, under, next to',
  build(item, ctx) {
    if (!item.things) return null;
    const [thing, thingFr, emoji] = pick(item.things);
    const all = fromSkill(ctx, item);
    const line = `The ${thing} is ${item.en} the box.`;
    const frLine = `${cap(thingFr)} est ${item.fr} la boîte.`;
    return {
      item,
      instruction: 'Écoute : où est-il ?',
      say: line,
      bigListen: true,
      input: 'choices',
      choiceStyle: 'scenes',
      choices: shuffle(all.map((p) => ({ value: p.id, visual: { scene: { obj: emoji, pos: p.en } } }))),
      answer: item.id,
      reveal: { en: line, fr: frLine },
      correction: { visual: { scene: { obj: emoji, pos: item.en } }, en: line, fr: `${item.en} = ${item.fr}. ${frLine}`, say: [['en', line], ['fr', frLine]] },
    };
  },
};

export const riddle = {
  id: 'riddle',
  label: 'Qui suis-je ?',
  emoji: '🕵️',
  desc: 'Écoute les indices et devine',
  build(item, ctx) {
    if (!item.answer) return null;
    const wrong = others(ctx, item, 3);
    const line = /^(shoes)$/.test(item.answer) ? `They’re ${item.answer}!` : `It’s ${item.answer}!`;
    return {
      item,
      instruction: 'Qui suis-je ? Écoute les indices !',
      say: plain(item.text),
      text: item.text,
      textLang: 'en',
      help: item.fr,
      input: 'choices',
      choiceStyle: 'emoji',
      choices: shuffle([item, ...wrong].map((i) => ({ value: i.id, visual: { emoji: i.emoji } }))),
      answer: item.id,
      afterOk: plain(line),
      reveal: { en: line, fr: item.fr },
      correction: { visual: { emoji: item.emoji }, en: line, fr: item.fr, say: [['en', plain(`${item.text} ${line}`)], ['fr', item.fr]] },
    };
  },
};

export const order = {
  id: 'order',
  label: 'La phrase en ordre',
  emoji: '🚂',
  desc: 'Remets les mots dans l’ordre',
  build(item) {
    if (!item.id.startsWith('order:')) return null;
    const sentence = personal(item.text);
    const end = sentence.match(/[.!?]$/)?.[0] || '';
    const words = sentence.replace(/[.!?]$/, '').split(' ');
    if (words.length < 2 || words.length > 7) return null;
    let tiles = shuffle(words);
    for (let t = 0; t < 5 && tiles.join(' ') === words.join(' '); t++) tiles = shuffle(words);
    return {
      item,
      instruction: 'Écoute et remets les mots dans l’ordre !',
      say: plain(sentence),
      visual: { emoji: item.emoji },
      help: personalFr(item.fr),
      input: 'tiles',
      tileStyle: 'wordtile',
      tiles,
      tileEnd: end,
      answer: words,
      correction: { visual: { emoji: item.emoji }, en: sentence, fr: personalFr(item.fr), text: 'La phrase commence par une majuscule.', say: [['en', plain(sentence)], ['fr', personalFr(item.fr)]] },
    };
  },
};

export { correctionOf };
