import { h } from '../ui/dom.js';
import { getState, dayStreak } from '../core/store.js';
import { STICKERS, STARS_PER_STICKER, unlockedCount } from '../core/rewards.js';
import { units, enabledSkills, getUnit } from '../units/index.js';
import { masteryOf, medal, factStat } from '../core/srs.js';
import { header, levelBadge } from '../ui/components.js';

const GAME_NAMES = { bubbles: '🫧 Les bulles', chrono: '⏱️ Défi chrono' };

export default function rewards() {
  const st = getState();
  const unlocked = unlockedCount(st.stars);
  const toNext = STARS_PER_STICKER - (st.stars % STARS_PER_STICKER);
  const known = Object.values(st.progress).filter((p) => p.box >= 4).length;

  const medals = units.map((u) => {
    const skills = u.skills.filter((s) => enabledSkills(u, st).includes(s) || s.items.some((i) => factStat(st, i.id).seen));
    return h(
      'div',
      { class: `panel theme-${u.id}` },
      h('h2', {}, `${u.emoji} ${u.name}`),
      h(
        'div',
        { class: 'medal-grid' },
        skills.map((s) => {
          const md = medal(masteryOf(st, s.items));
          return h('div', { class: 'medal' + (md ? '' : ' none') }, h('span', { class: 'medal-icon' }, md || '⚪'), h('span', {}, s.short || s.label));
        })
      )
    );
  });

  const rec = [];
  for (const [k, v] of Object.entries(st.records)) {
    const [game, unitId, n] = k.split(':');
    const u = getUnit(unitId);
    if (GAME_NAMES[game]) rec.push([`${GAME_NAMES[game]} (${u?.name || unitId})`, `${v}`]);
    if (game === 'memory') rec.push([`🃏 Memory (${u?.name || unitId}, ${n} paires)`, `${v} coups`]);
  }
  if (st.records.lab?.length) rec.push(['🧪 Couleurs découvertes au labo', `${st.records.lab.length} / 6`]);

  return h(
    'div',
    { class: 'screen rewards' },
    header('Mes trophées'),
    levelBadge(),
    h(
      'div',
      { class: 'stat-row' },
      h('div', { class: 'stat' }, h('b', {}, String(st.stars)), h('small', {}, '⭐ étoiles')),
      h('div', { class: 'stat' }, h('b', {}, String(known)), h('small', {}, '🧠 mots bien sus')),
      h('div', { class: 'stat' }, h('b', {}, String(dayStreak())), h('small', {}, '🔥 jours de suite'))
    ),
    h(
      'div',
      { class: 'panel' },
      h('h2', {}, `🎁 Mes autocollants du tour du monde (${unlocked}/${STICKERS.length})`),
      unlocked < STICKERS.length ? h('p', { class: 'muted' }, `Encore ${toNext} ⭐ pour le prochain !`) : h('p', {}, 'Tu les as tous ! 🎉'),
      h('div', { class: 'sticker-grid' }, STICKERS.map((s, i) => h('div', { class: 'sticker' + (i < unlocked ? '' : ' locked') }, i < unlocked ? s : '?')))
    ),
    h('h2', { class: 'section-title' }, '🏅 Mes médailles'),
    medals,
    rec.length ? h('div', { class: 'panel' }, h('h2', {}, '🚀 Mes records'), rec.map(([a, b]) => h('div', { class: 'record-row' }, h('span', {}, a), h('b', {}, b)))) : null
  );
}
