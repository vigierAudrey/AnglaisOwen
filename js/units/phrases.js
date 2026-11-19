// Univers « Les phrases » : pour aller plus loin.
// Chaque notion a son propre exercice : le menu affiche directement les notions comme des jeux.

import { OPPOSITES, LIKES, PETS, COLOUR_SHAPES, PREPOSITIONS, PREP_THINGS, RIDDLES, ORDER } from '../data/phrases.js';
import { COLOURS } from '../data/colours.js';
import { slug } from '../lang/en.js';

const U = 'phrases';
const it = (skillId, id, fields) => ({ id, unitId: U, skillId, ...fields });

const opposites = OPPOSITES.flatMap((pair, p) =>
  pair.map(([en, fr, emoji], k) => {
    const [oen, ofr, oemoji] = pair[1 - k];
    return it('opposites', `adj:${en}`, { en, fr, emoji, other: { en: oen, fr: ofr, emoji: oemoji }, pair: p });
  })
);
const likes = LIKES.map(([en, fr, emoji]) => it('like', `like:${slug(en)}`, { en, fr, emoji }));
const pets = PETS.map(([one, many, fr, emoji, note]) => it('have', `have:${one}`, { en: one, one, many, fr, frArt: ['grenouille', 'souris'].includes(fr) ? 'une' : 'un', emoji, note }));
const colourShapes = COLOURS.filter((c) => COLOUR_SHAPES.heart.e[c.en] && c.en !== 'white').map((c) => it('colourShape', `cs:${c.en}`, { en: c.en, fr: c.fr, colour: c }));
const preps = PREPOSITIONS.map(([en, fr]) => it('where', `prep:${slug(en)}`, { en, fr, things: PREP_THINGS }));
const riddles = RIDDLES.map(([text, fr, emoji, answer]) => it('riddles', `riddle:${slug(answer)}`, { en: answer, text, fr, emoji, answer }));
const order = ORDER.map(([text, fr, emoji]) => it('order', `order:${slug(text)}`, { en: text, text, fr, emoji }));

export default {
  id: U,
  name: 'Les phrases',
  emoji: '💬',
  mascotLine: 'Pour aller plus loin !',
  menu: 'skills',
  families: [
    { id: 'easy', label: 'Pour commencer', emoji: '🌱' },
    { id: 'more', label: 'Pour les aventuriers', emoji: '🚀' },
  ],
  skills: [
    { id: 'opposites', label: 'Les contraires', short: 'Contraires', emoji: '🐘', desc: 'big / small, hot / cold…', family: 'easy', items: opposites, exercises: ['opposite'],
      lesson: ['Un mot et son contraire vont ensemble : big ↔ small (grand ↔ petit).'] },
    { id: 'like', label: 'I like… / I don’t like…', short: 'J’aime', emoji: '😋', desc: 'J’aime, je n’aime pas', family: 'easy', items: likes, exercises: ['like'],
      lesson: ['I like = j’aime.', 'I don’t like = je n’aime pas.', 'Écoute bien le petit « don’t » : il change tout !'] },
    { id: 'have', label: 'I have… (compter)', short: 'J’ai…', emoji: '🐱', desc: 'I have two cats', family: 'easy', items: pets, exercises: ['have'],
      lesson: ['I have = j’ai.', 'Pour dire plusieurs, on ajoute souvent un s : one cat, two cats.', 'Mais attention : one mouse, two mice ; one fish, two fish ; one sheep, two sheep !'] },
    { id: 'colourShape', label: 'Couleur + forme', short: 'a red heart', emoji: '❤️', desc: 'a red heart, two blue circles', family: 'easy', items: colourShapes, exercises: ['colourShape'],
      lesson: ['En anglais, la couleur se met AVANT le mot.', 'a red heart = un cœur rouge', 'two blue circles = deux ronds bleus', 'La couleur ne prend jamais de s : blue reste blue.'] },
    { id: 'where', label: 'Où est le chat ?', short: 'in, on, under', emoji: '📦', desc: 'in, on, under, next to', family: 'more', items: preps, exercises: ['where'],
      lesson: ['in = dans', 'on = sur', 'under = sous', 'next to = à côté de', 'The cat is in the box = le chat est dans la boîte.'] },
    { id: 'riddles', label: 'Devinettes : qui suis-je ?', short: 'Devinettes', emoji: '🕵️', desc: 'I am yellow. I am a fruit…', family: 'more', items: riddles, exercises: ['riddle'],
      lesson: ['I am = je suis.', 'I have got = j’ai.', 'I can = je sais (faire).', 'Écoute chaque indice et devine !'] },
    { id: 'order', label: 'La phrase en ordre', short: 'Phrase en ordre', emoji: '🚂', desc: 'Remets les mots dans l’ordre', family: 'more', items: order, exercises: ['order'],
      lesson: ['Une phrase commence par une majuscule et finit par un point.', 'En anglais, « I » (je) a toujours une majuscule.'] },
  ],
  defaultSkills: ['opposites', 'like', 'have', 'colourShape', 'where', 'riddles', 'order'],
  modes: ['learn'],
  reviewModes: [],
};
