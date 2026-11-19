// Couleurs (avec des objets de cette couleur), formes et mélanges de peinture.

export const COLOURS = [
  { en: 'red', fr: 'rouge', hex: '#E63946', group: 'basic', things: [['🍓', 'strawberry', 'la fraise'], ['🍅', 'tomato', 'la tomate'], ['🚒', 'fire engine', 'le camion de pompiers'], ['🐞', 'ladybird', 'la coccinelle']] },
  { en: 'blue', fr: 'bleu', hex: '#2F80ED', group: 'basic', things: [['🐳', 'whale', 'la baleine'], ['🌊', 'sea', 'la mer'], ['👖', 'jeans', 'le jean', 'are'], ['🦋', 'butterfly', 'le papillon']] },
  { en: 'green', fr: 'vert', hex: '#27AE60', group: 'basic', things: [['🐸', 'frog', 'la grenouille'], ['🥦', 'broccoli', 'le brocoli'], ['🐢', 'tortoise', 'la tortue'], ['🥒', 'cucumber', 'le concombre']] },
  { en: 'yellow', fr: 'jaune', hex: '#FFD43B', group: 'basic', things: [['🍌', 'banana', 'la banane'], ['🐥', 'chick', 'le poussin'], ['🌻', 'sunflower', 'le tournesol'], ['🍋', 'lemon', 'le citron']] },
  { en: 'orange', fr: 'orange', hex: '#FF8C1A', group: 'more', things: [['🍊', 'orange', 'l’orange'], ['🥕', 'carrot', 'la carotte'], ['🎃', 'pumpkin', 'la citrouille'], ['🦊', 'fox', 'le renard']] },
  { en: 'pink', fr: 'rose', hex: '#FF77B7', group: 'more', things: [['🐷', 'pig', 'le cochon'], ['🦩', 'flamingo', 'le flamant rose'], ['🌸', 'flower', 'la fleur']] },
  { en: 'purple', fr: 'violet', hex: '#8E44AD', group: 'more', things: [['🍇', 'grapes', 'le raisin', 'are'], ['🍆', 'aubergine', 'l’aubergine'], ['🔮', 'magic ball', 'la boule magique']] },
  { en: 'brown', fr: 'marron', hex: '#8B5A2B', group: 'more', things: [['🐻', 'bear', 'l’ours'], ['🍫', 'chocolate', 'le chocolat'], ['🐴', 'horse', 'le cheval'], ['🍪', 'cookie', 'le biscuit']] },
  { en: 'black', fr: 'noir', hex: '#222222', group: 'bw', things: [['🕷️', 'spider', 'l’araignée'], ['🦍', 'gorilla', 'le gorille'], ['🎩', 'top hat', 'le chapeau haut-de-forme']] },
  { en: 'white', fr: 'blanc', hex: '#FFFFFF', group: 'bw', things: [['⛄', 'snowman', 'le bonhomme de neige'], ['🥛', 'milk', 'le lait'], ['👻', 'ghost', 'le fantôme'], ['☁️', 'cloud', 'le nuage']] },
  { en: 'grey', fr: 'gris', hex: '#9AA0A6', group: 'bw', things: [['🐘', 'elephant', 'l’éléphant'], ['🐨', 'koala', 'le koala'], ['🐺', 'wolf', 'le loup'], ['🦏', 'rhino', 'le rhinocéros']] },
];

export const COLOUR_GROUPS = [
  { id: 'basic', label: 'Les 4 premières', short: 'Rouge, bleu…', emoji: '🔴' },
  { id: 'more', label: 'Encore plus de couleurs', short: 'Orange, rose…', emoji: '🟣' },
  { id: 'bw', label: 'Noir, blanc, gris', short: 'Noir, blanc…', emoji: '⚫' },
];

export const COLOUR_BY = Object.fromEntries(COLOURS.map((c) => [c.en, c]));

export const SHAPES = [
  { en: 'circle', fr: 'un rond', emoji: '🔵' },
  { en: 'square', fr: 'un carré', emoji: '🟥' },
  { en: 'triangle', fr: 'un triangle', emoji: '🔺', twin: true },
  { en: 'heart', fr: 'un cœur', emoji: '💚' },
  { en: 'star', fr: 'une étoile', emoji: '⭐' },
  { en: 'diamond', fr: 'un losange', emoji: '🔶' },
];

/** Mélanges de peinture : [couleur 1, couleur 2, résultat]. */
export const MIXES = [
  ['red', 'yellow', 'orange'],
  ['blue', 'yellow', 'green'],
  ['red', 'blue', 'purple'],
  ['red', 'white', 'pink'],
  ['black', 'white', 'grey'],
  ['red', 'green', 'brown'],
];

/** Couleur obtenue en mélangeant deux couleurs (labo des couleurs). */
export function mixOf(a, b) {
  if (a === b) return a;
  const m = MIXES.find(([x, y]) => (x === a && y === b) || (x === b && y === a));
  return m ? m[2] : 'brown';
}
