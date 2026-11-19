// Petite grammaire anglaise : articles (a / an), pluriels, questions « Is it…? ».

const PLURALS = new Set(['grapes', 'shoes', 'socks', 'trousers', 'scissors', 'gloves', 'boots', 'glasses', 'chips', 'sweets', 'shorts', 'jeans']);
const MASS = new Set(['bread', 'cheese', 'milk', 'water', 'juice', 'chocolate', 'honey', 'soup', 'pasta', 'paper', 'paint', 'rain', 'snow', 'wind', 'fire', 'light', 'corn', 'broccoli']);
const THE = new Set(['sun', 'moon', 'sea', 'Earth']);
const NAMES = new Set(['mum', 'dad', 'grandma', 'grandpa']);

export const isPlural = (en) => PLURALS.has(en);

/** a / an selon le son du début du mot. */
export const article = (en) => (/^(uni|use|eu)/i.test(en) ? 'a' : /^[aeiou]/i.test(en) ? 'an' : 'a');

export const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** « a cat », « an owl », « shoes », « bread », « the sun », « Mum ». */
export function nounPhrase(en) {
  if (PLURALS.has(en) || MASS.has(en)) return en;
  if (THE.has(en)) return `the ${en}`;
  if (NAMES.has(en)) return cap(en);
  return `${article(en)} ${en}`;
}

/** Pour une question « Is it…? » : renseigne np (groupe nominal) et pl (pluriel). */
export const det = (en) => ({ np: nounPhrase(en), pl: isPlural(en) });

export const isItQ = (it) => (it.pl ? `Are they ${it.np}?` : `Is it ${it.np}?`);
export const itIs = (it) => (it.pl ? `They’re ${it.np}.` : `It’s ${it.np}.`);
export const yesAns = (it) => (it.pl ? 'Yes, they are!' : 'Yes, it is!');
export const noAns = (it) => (it.pl ? 'No, they aren’t.' : 'No, it isn’t.');

/** Pour la synthèse vocale : apostrophes typographiques → droites. */
export const plain = (s) => s.replaceAll('’', "'");

export const slug = (s) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
