// Les nombres en anglais.

export const NUMBER_WORDS = {
  0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
  10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 16: 'sixteen',
  17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty',
  60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety', 100: 'one hundred',
};

export const NUMBER_FR = {
  0: 'zéro', 1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq', 6: 'six', 7: 'sept', 8: 'huit', 9: 'neuf',
  10: 'dix', 11: 'onze', 12: 'douze', 13: 'treize', 14: 'quatorze', 15: 'quinze', 16: 'seize', 17: 'dix-sept',
  18: 'dix-huit', 19: 'dix-neuf', 20: 'vingt', 30: 'trente', 40: 'quarante', 50: 'cinquante', 60: 'soixante',
  70: 'soixante-dix', 80: 'quatre-vingts', 90: 'quatre-vingt-dix', 100: 'cent',
};

export const NUMBER_GROUPS = [
  { id: 'n0_10', label: 'De 0 à 10', short: '0 → 10', emoji: '🖐️', nums: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: 'n11_20', label: 'De 11 à 20', short: '11 → 20', emoji: '🔟', nums: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
  { id: 'tens', label: 'Les dizaines', short: '20, 30… 100', emoji: '💯', nums: [20, 30, 40, 50, 60, 70, 80, 90, 100] },
];

/** Emojis à compter (« How many apples? »). */
export const COUNTABLES = [
  ['🍎', 'apples'], ['🐟', 'fish'], ['⭐', 'stars'], ['🐞', 'ladybirds'], ['🎈', 'balloons'], ['🚗', 'cars'],
  ['🐥', 'chicks'], ['🍓', 'strawberries'], ['⚽', 'balls'], ['🌸', 'flowers'], ['🦆', 'ducks'], ['🍪', 'cookies'],
];
