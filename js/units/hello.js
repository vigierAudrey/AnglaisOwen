// Univers « Hello! » : se dire bonjour, la politesse, les émotions, petites questions.

import { POLITE, FEELINGS, QUESTIONS } from '../data/hello.js';
import { slug } from '../lang/en.js';

const U = 'hello';

const polite = POLITE.map(([en, fr, emoji, sit]) => ({ id: `hi:${slug(en)}`, unitId: U, skillId: 'polite', kind: 'emoji', en, fr, emoji, sit }));
const feelings = FEELINGS.map(([en, fr, emoji]) => ({ id: `feel:${slug(en)}`, unitId: U, skillId: 'feelings', kind: 'emoji', en, fr, emoji }));
const questions = QUESTIONS.map(([q, qfr, a, afr, emoji]) => ({ id: `qa:${slug(q)}`, unitId: U, skillId: 'questions', en: q, fr: qfr, q, qfr, a, afr, emoji }));
const situations = polite.filter((p) => p.sit).map((p) => ({ ...p, id: `sit:${slug(p.en)}`, skillId: 'situations', kind: undefined }));

export default {
  id: U,
  name: 'Hello!',
  emoji: '👋',
  mascotLine: 'Bonjour, merci, ça va ?',
  families: [{ id: 'main', label: 'Pour parler', emoji: '💬' }],
  skills: [
    { id: 'polite', label: 'Bonjour et merci', short: 'Bonjour, merci', emoji: '👋', family: 'main', items: polite, exercises: ['listen', 'picture', 'translate'],
      parentInfo: 'Hello, goodbye, please, thank you, sorry…' },
    { id: 'feelings', label: 'Comment ça va ?', short: 'Ça va ?', emoji: '😀', family: 'main', items: feelings, exercises: ['listen', 'picture', 'translate'],
      parentInfo: 'I’m happy, sad, tired, hungry…' },
    { id: 'questions', label: 'Questions et réponses', short: 'Questions', emoji: '❓', family: 'main', items: questions, exercises: ['reply'],
      parentInfo: 'What’s your name? How old are you? Do you like…?' },
    { id: 'situations', label: 'Que dis-tu ?', short: 'Que dis-tu ?', emoji: '🎭', family: 'main', items: situations, exercises: ['situation'],
      parentInfo: 'Une situation écrite en français → la bonne formule anglaise.' },
  ],
  defaultSkills: ['polite', 'feelings', 'questions', 'situations'],
  modes: ['learn', 'listen', 'picture', 'situation', 'reply', 'translate', 'parrot', 'memory'],
  reviewModes: ['listen', 'picture'],
};
