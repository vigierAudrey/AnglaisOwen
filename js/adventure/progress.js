// Progression du tour du monde, rangée à part dans st.adventure (n'interfère avec rien d'autre) :
//   done : étape -> étoiles (1 à 3)      seen : dernière étape « en cours » déjà montrée sur la carte
// Une étape se lance avec le paramètre `quest` (id de l'étape) ; en fin de partie, la séance
// (results.js) et chaque jeu appellent questOutcome() : l'étape est validée et la suivante s'ouvre.

import { h } from '../ui/dom.js';
import { getState, save } from '../core/store.js';
import { go, back } from '../core/router.js';
import { mascot } from '../ui/components.js';
import { confetti } from '../ui/confetti.js';
import { sound } from '../ui/sound.js';
import { WORLDS, STEPS, STEP_BY, WORLD_BY, GAME_GOALS, BOSS_SHIELDS, CHEST_STARS } from './worlds.js';

export const adv = (st = getState()) => (st.adventure ||= { done: {}, seen: 0 });

export const stepStars = (st, id) => adv(st).done[id] || 0;

/** Index de l'étape en cours (la première non réussie) ; STEPS.length si tout est fini. */
export function currentIndex(st) {
  const i = STEPS.findIndex((s) => !stepStars(st, s.id));
  return i < 0 ? STEPS.length : i;
}

export const indexOf = (id) => STEPS.findIndex((s) => s.id === id);
export const isUnlocked = (st, id) => indexOf(id) >= 0 && indexOf(id) <= currentIndex(st);
export const nextStep = (id) => STEPS[indexOf(id) + 1] || null;

/** Pays dont le gardien est vaincu ⇒ ami libéré. */
export const worldFreed = (st, w) => stepStars(st, w.steps[w.steps.length - 1].id) > 0;
/** Couronne d'or : 3 étoiles sur toutes les étapes du pays. */
export const worldCrown = (st, w) => w.steps.every((s) => stepStars(st, s.id) === 3);
export const freedFriends = (st) => WORLDS.filter((w) => worldFreed(st, w)).map((w) => w.friend);
export const totalStars = (st) => STEPS.reduce((n, s) => n + stepStars(st, s.id), 0);
export const worldOfIndex = (i) => WORLD_BY[STEPS[Math.min(i, STEPS.length - 1)].world];

export const passMark = (n) => Math.ceil(n * 0.7);

/** Texte sans emojis, pour la voix (sinon elle lit « cloche », « arc-en-ciel »…). */
export const noEmoji = (t) => t.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim();

/** Ce qu'il faut faire pour réussir l'étape. */
export function goalText(step) {
  if (step.boss) return `Bats ${WORLD_BY[step.world].guardian.name} avant de perdre tes ${BOSS_SHIELDS} boucliers`;
  if (step.screen) return GAME_GOALS[step.screen].text(step.goal);
  const n = getState().settings.questionsPerSession;
  return `Au moins ${passMark(n)} bonnes réponses sur ${n}`;
}

/** Lance une étape (exercice, gardien ou jeu). */
export function launchStep(step, opts) {
  const params = { unitId: step.unitId, skillIds: step.skillIds, quest: step.id };
  if (step.screen) go(step.screen, params, opts);
  else go('session', { ...params, mode: step.boss ? 'mix' : step.mode }, opts);
}

/** Bandeau affiché en haut d'un jeu ou d'une séance lancés depuis la carte. */
export function questBanner(questId) {
  const step = STEP_BY[questId];
  if (!step) return null;
  return h(
    'div',
    { class: 'adv-banner' },
    h('span', { class: 'adv-banner-emoji' }, step.emoji),
    h('span', { class: 'adv-banner-txt' }, h('b', {}, step.label), h('small', {}, `🎯 ${goalText(step)}`))
  );
}

/** Résultat d'un jeu à score : objectif atteint ? combien d'étoiles ? */
export function questScore(questId, score) {
  const step = STEP_BY[questId];
  if (!step) return { ok: false, stars: 0 };
  const g = step.goal;
  const rule = GAME_GOALS[step.screen] || {};
  const max = rule.max ?? g + (rule.extra || 4);
  const two = Math.ceil((g + max) / 2);
  return { ok: score >= g, stars: score >= max ? 3 : score >= two ? 2 : 1 };
}

export const starsRow = (n, cls = 'adv-stars') => h('div', { class: cls }, [1, 2, 3].map((i) => h('span', { class: i <= n ? 'on' : '' }, '⭐')));

/**
 * Fin d'une partie lancée depuis la carte : enregistre l'étape et renvoie le bloc à afficher
 * (null hors aventure). ok : objectif atteint ; stars : 1 à 3 ; retry : relancer l'étape.
 */
export function questOutcome(questId, { ok, stars = 1, retry, boss }) {
  const step = STEP_BY[questId];
  const st = getState();
  if (!step || !isUnlocked(st, questId)) return null;
  const world = WORLD_BY[step.world];
  const before = stepStars(st, step.id);
  const crownBefore = worldCrown(st, world);
  stars = Math.min(3, Math.max(1, stars));
  let freed = false;
  if (ok) {
    adv(st).done[step.id] = Math.max(before, stars);
    if (!before && step.boss) {
      freed = true;
      st.stars += CHEST_STARS;
    }
    save();
  }
  const crownNew = ok && !crownBefore && worldCrown(st, world);
  const nxt = nextStep(step.id);
  const name = st.settings.childName;
  const foe = world.guardian;

  let text;
  if (freed) {
    const nw = nxt && WORLD_BY[nxt.world];
    text = `Tu as battu ${foe.name} ! ${world.friend.emoji} ${world.friend.name} est libre ! +${CHEST_STARS} ⭐` + (nw ? ` Prochain voyage : ${nw.emoji} ${nw.name} !` : ' Tu as libéré tous mes amis, merci !');
  } else if (crownNew) text = `Incroyable, ${name} ! 3 étoiles partout dans ce pays : tu gagnes la couronne d’or 👑 !`;
  else if (ok) text = before ? (stars > before ? 'Encore mieux que la dernière fois !' : 'Bravo, bien rejoué !') : nxt ? 'Bravo ! L’étape suivante est ouverte !' : 'Tu as fini tout le tour du monde ! 🏆';
  else if (boss) text = boss.hp <= boss.max / 2 ? `${foe.name} s’est sauvé… Tu étais tout près ! On réessaie ?` : `${foe.name} s’est sauvé… Pas grave, on s’entraîne et on y retourne !`;
  else text = `Pour réussir l’étape : ${goalText(step).toLowerCase()}. Tu peux le faire !`;

  if (ok) {
    setTimeout(() => {
      sound.win();
      if (freed || crownNew || stars === 3) confetti();
    }, 500);
  }

  // Après un gardien, on retourne sur la carte pour voir le nouveau pays s'ouvrir.
  const showNext = ok && nxt && !step.boss && !before;
  return h(
    'div',
    { class: 'panel adv-result' + (ok ? ' ok' : '') },
    h('h2', {}, ok ? (step.boss ? '🎉 Victoire !' : '🗺️ Étape réussie !') : '🗺️ Pas encore…'),
    ok ? starsRow(adv(st).done[step.id], 'adv-stars big') : null,
    freed ? h('div', { class: 'adv-freed' }, h('span', { class: 'adv-freed-friend' }, world.friend.emoji)) : null,
    crownNew ? h('div', { class: 'adv-freed' }, h('span', { class: 'adv-freed-friend' }, '👑')) : null,
    mascot(text, { mood: ok ? 'wow' : 'think' }),
    h(
      'div',
      { class: 'row wrap' },
      h('button', { class: 'btn' + (showNext || !ok ? ' ghost' : ''), onclick: () => back() }, '🗺️ La carte'),
      !ok && retry ? h('button', { class: 'btn', onclick: retry }, '🔁 Réessayer') : null,
      showNext ? h('button', { class: 'btn adv-go', onclick: () => launchStep(nxt, { replace: true }) }, 'Étape suivante ▶') : null
    )
  );
}
