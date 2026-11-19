// Persistance locale (localStorage) : réglages, progrès, étoiles, records, jours joués.
// Les valeurs par défaut sont fusionnées avec la sauvegarde, ce qui permet
// d'ajouter de nouveaux réglages / univers sans casser les anciennes données.

const KEY = 'anglaisowen';
const VERSION = 1;
let state = null;
let unitsRef = [];

function defaults(units) {
  return {
    version: VERSION,
    settings: {
      childName: 'Owen',
      childAge: 7,
      sound: true,
      voice: true,
      accent: 'GB', // GB (britannique) ou US (américain)
      voiceRate: 0.85,
      showFrench: true, // traductions visibles dans « J'apprends »
      questionsPerSession: 10,
      units: Object.fromEntries(units.map((u) => [u.id, { skills: [...u.defaultSkills] }])),
    },
    progress: {}, // itemId -> { box, seen, ok, ko, last }
    stars: 0,
    records: {}, // clé -> meilleur score
    history: [], // dernières séances
    days: [], // jours où l'enfant a joué (AAAA-MM-JJ)
    factIndex: 0, // prochain « Le savais-tu ? »
    adventure: { done: {}, seen: 0 }, // tour du monde : étape -> étoiles (1 à 3)
  };
}

function merge(base, saved) {
  if (saved === undefined) return base;
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  if (isObj(base) && isObj(saved)) {
    const out = { ...base };
    for (const k in saved) out[k] = merge(base[k], saved[k]);
    return out;
  }
  return saved;
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || undefined;
  } catch {
    return undefined;
  }
}

export function initStore(units) {
  unitsRef = units;
  state = merge(defaults(units), load());
  save();
  return state;
}

export const getState = () => state;

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* stockage indisponible (navigation privée) : on continue en mémoire */
  }
}

export function update(fn) {
  fn(state);
  save();
}

const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const today = () => dayKey(new Date());

/** Note que l'enfant a joué aujourd'hui (pour la série de jours 🔥). */
export function markDay() {
  const t = today();
  if (state.days[0] !== t) state.days = [t, ...state.days].slice(0, 400);
}

/** Nombre de jours d'affilée (aujourd'hui ou hier compris). */
export function dayStreak() {
  const set = new Set(state.days);
  const d = new Date();
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** Ajoute des étoiles et note la journée. */
export function addStars(n) {
  state.stars += n;
  markDay();
  save();
}

export function resetProgress() {
  Object.assign(state, { progress: {}, stars: 0, records: {}, history: [], days: [], adventure: { done: {}, seen: 0 } });
  save();
}

export const exportData = () => JSON.stringify(state, null, 2);

export function importData(json) {
  const data = JSON.parse(json);
  if (!data || typeof data !== 'object' || !data.settings) throw new Error('Fichier invalide');
  state = merge(defaults(unitsRef), data);
  save();
}

/** Remplace {name} et {age} par le prénom et l'âge de l'enfant. */
export function personal(text) {
  if (!text || !state) return text;
  const S = state.settings;
  return text.replaceAll('{name}', S.childName || 'Owen').replaceAll('{age}', ageWord(S.childAge));
}

const AGES = { 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve' };
const ageWord = (n) => AGES[n] || String(n);
export const personalFr = (text) => (text && state ? text.replaceAll('{name}', state.settings.childName || 'Owen').replaceAll('{age}', String(state.settings.childAge)) : text);
