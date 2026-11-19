// Voix (synthèse vocale du navigateur) : une voix anglaise pour l'anglais,
// une voix française pour les consignes et les traductions.

import { getState } from '../core/store.js';

export const speechAvailable = () => 'speechSynthesis' in window;

const voices = { en: null, fr: null };
const NICE = /google|natural|neural|enhanced|premium|samantha|daniel|serena|kate|libby|sonia|ryan|aria|jenny|guy|martha|arthur|amélie|audrey|thomas|denise|marie/i;

function best(all, lang, exact) {
  const norm = (v) => v.lang?.replace('_', '-') || '';
  const list = all.filter((v) => norm(v).toLowerCase().startsWith(lang));
  const score = (v) => (norm(v).toLowerCase() === exact.toLowerCase() ? 4 : 0) + (NICE.test(v.name) ? 2 : 0) + (v.localService ? 1 : 0);
  return list.sort((a, b) => score(b) - score(a))[0] || null;
}

export function pickVoices() {
  if (!speechAvailable()) return;
  const all = speechSynthesis.getVoices();
  const accent = getState()?.settings.accent || 'GB';
  voices.en = best(all, 'en', `en-${accent}`);
  voices.fr = best(all, 'fr', 'fr-FR');
}
if (speechAvailable()) {
  pickVoices();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoices);
}

export const hasVoice = (lang) => !!voices[lang];
export const voiceName = (lang) => voices[lang]?.name || '';

function utter(text, lang, rate) {
  const u = new SpeechSynthesisUtterance(text);
  const accent = getState()?.settings.accent || 'GB';
  u.lang = lang === 'fr' ? 'fr-FR' : `en-${accent}`;
  if (voices[lang]) u.voice = voices[lang];
  const base = getState()?.settings.voiceRate ?? 0.85;
  u.rate = rate ?? (lang === 'fr' ? Math.min(1, base + 0.1) : base);
  u.pitch = 1.05;
  return u;
}

const allowed = (force) => speechAvailable() && (force || getState().settings.voice);

/** Lit un texte, en anglais par défaut ({ lang: 'fr' } pour le français). */
export function speak(text, { force = false, rate, lang = 'en' } = {}) {
  if (!text || !allowed(force)) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter(text, lang, rate));
}

/** Enchaîne plusieurs morceaux : [['en', 'cat'], ['fr', 'un chat']]. */
export function speakSeq(parts, { force = false } = {}) {
  if (!parts?.length || !allowed(force)) return;
  speechSynthesis.cancel();
  for (const [lang, text] of parts) if (text) speechSynthesis.speak(utter(text, lang));
}

/** Lit une « voix » de question : texte anglais ou liste de morceaux. */
export function say(what, opts) {
  if (Array.isArray(what)) speakSeq(what, opts);
  else speak(what, opts);
}

export function stopSpeaking() {
  if (speechAvailable()) speechSynthesis.cancel();
}
