// Récompenses : autocollants « tour du monde » à collectionner, et niveaux.

export const STICKERS = [
  '🐶', '🫖', '💂', '🚌', '☂️', '🏰', '👑', '🦁', '🐨', '🦘',
  '🗽', '🍔', '🏈', '🎡', '🚂', '🦄', '🐉', '🍩', '🧁', '🎸',
  '🚀', '🛸', '⚽', '🏀', '🎨', '🍕', '🍦', '🌈', '🦖', '🐳',
  '💎', '🎩', '🧙', '🧚', '🦸', '🏴‍☠️', '🪄', '🐙', '🦋', '🐧',
  '🎃', '🎄', '🎁', '🏆', '🌋', '🏝️', '🗺️', '✈️', '🌟', '🎉',
];
export const STARS_PER_STICKER = 12;

export const unlockedCount = (stars) => Math.min(STICKERS.length, Math.floor(stars / STARS_PER_STICKER));

export const LEVELS = [
  { stars: 0, name: 'Petit curieux', emoji: '🐣' },
  { stars: 30, name: 'Hello Kid', emoji: '👋' },
  { stars: 80, name: 'Apprenti voyageur', emoji: '🎒' },
  { stars: 160, name: 'Explorateur', emoji: '🧭' },
  { stars: 300, name: 'Capitaine', emoji: '⛵' },
  { stars: 500, name: 'Super Star', emoji: '🌟' },
  { stars: 800, name: 'Champion de l’anglais', emoji: '🏆' },
  { stars: 1200, name: 'King of English', emoji: '👑' },
];

export function levelOf(stars) {
  let i = 0;
  while (i + 1 < LEVELS.length && stars >= LEVELS[i + 1].stars) i++;
  const lvl = LEVELS[i];
  const next = LEVELS[i + 1];
  const progress = next ? (stars - lvl.stars) / (next.stars - lvl.stars) : 1;
  return { ...lvl, index: i + 1, next, progress };
}
