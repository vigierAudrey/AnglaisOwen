import { h } from '../ui/dom.js';
import { getState } from '../core/store.js';
import { go, back } from '../core/router.js';
import { STICKERS, unlockedCount } from '../core/rewards.js';
import { mascot, factCard } from '../ui/components.js';
import { speakSeq } from '../ui/speech.js';
import { plain } from '../lang/en.js';
import { confetti } from '../ui/confetti.js';
import { sound } from '../ui/sound.js';
import { questOutcome } from '../adventure/progress.js';

export default function results(p) {
  const st = getState();
  const name = st.settings.childName;
  const pct = p.asked ? p.correct / p.asked : 0;
  const rating = p.boss ? Math.max(1, p.boss.stars) : pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1;
  const titles = { 3: `Fantastic, ${name}! 🏆`, 2: 'Well done! Très bien joué ! 👏', 1: 'Good try! Continue ! 💪' };
  const newStickers = STICKERS.slice(p.stickersBefore, unlockedCount(st.stars));
  const theme = p.unitId ? `theme-${p.unitId}` : 'theme-review';

  const replay = () => go('session', { unitId: p.unitId, skillIds: p.skillIds, mode: p.mode, itemIds: p.itemIds, quest: p.quest }, { replace: true });
  // Étape de l'aventure : objectif atteint (70 %, ou gardien battu) ?
  const quest = p.quest ? questOutcome(p.quest, p.boss ? { ok: p.boss.won, stars: p.boss.stars, retry: replay, boss: p.boss } : { ok: pct >= 0.7, stars: rating, retry: replay }) : null;
  const replayMistakes = () =>
    go('session', { unitId: p.unitId, skillIds: p.skillIds, mode: p.mode, itemIds: p.mistakes.map((m) => m.id) }, { replace: true });

  const el = h(
    'div',
    { class: `screen results ${theme}` },
    quest ? null : h('div', { class: 'big-stars' }, [1, 2, 3].map((i) => h('span', { class: 'big-star' + (i <= rating ? ' on' : ''), style: { animationDelay: `${i * 180}ms` } }, '⭐'))),
    quest ? null : h('h1', { class: 'results-title' }, titles[rating]),
    quest ? null : h('div', { class: 'score-big' }, `${p.correct} / ${p.asked}`),
    quest,
    h('div', { class: 'earned' }, `+${p.earned} ⭐ gagnée${p.earned > 1 ? 's' : ''}`, p.bestStreak >= 3 ? `  ·  🔥 meilleure série : ${p.bestStreak}` : ''),
    newStickers.length
      ? h('div', { class: 'new-stickers' }, h('div', {}, 'Nouvel autocollant !'), h('div', { class: 'sticker-row' }, newStickers.map((s) => h('span', { class: 'sticker pop-in' }, s))))
      : null,
    p.mistakes.length
      ? h(
          'div',
          { class: 'panel mistakes' },
          h('h2', {}, '🧠 À retenir ', h('small', { class: 'muted' }, '(touche pour écouter)')),
          h(
            'div',
            { class: 'mistake-list' },
            p.mistakes.map((m) =>
              h('button', { class: 'mistake', onclick: () => speakSeq([['en', plain(m.en)], ['fr', m.fr]], { force: true }) }, m.emoji ? `${m.emoji} ` : '', h('span', { lang: 'en' }, m.en), m.fr ? h('small', {}, ` = ${m.fr}`) : null)
            )
          )
        )
      : mascot('Zéro erreur ! You’re a star! 🌟', { mood: 'wow' }),
    h(
      'div',
      { class: 'col' },
      p.mistakes.length ? h('button', { class: 'btn big', onclick: replayMistakes }, '🎯 Rejouer mes erreurs') : null,
      quest ? null : h('button', { class: 'btn big' + (p.mistakes.length ? ' secondary' : ''), onclick: replay }, '🔁 Rejouer'),
      quest ? null : h('button', { class: 'btn ghost', onclick: () => back() }, '← Retour')
    ),
    factCard()
  );

  setTimeout(() => {
    if (!quest && (rating === 3 || newStickers.length)) {
      sound.win();
      confetti();
    }
  }, 400);

  return el;
}
