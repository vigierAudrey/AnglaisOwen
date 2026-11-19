// L'arène du gardien, affichée au-dessus des questions dans l'écran de séance (session.js).
// Chaque bonne réponse lance un éclair ⚡ (3 d'affilée = coup spécial 🌟, −2 ❤️) ;
// chaque erreur coûte un bouclier 🛡️. Le gardien parle anglais (avec la traduction).

import { h } from '../ui/dom.js';
import { sound } from '../ui/sound.js';
import { pick } from '../core/util.js';
import { STEP_BY, WORLD_BY, BOSS_SHIELDS } from './worlds.js';

const TAUNTS = [
  ['You shall not pass!', 'Tu ne passeras pas !'],
  ['Ha ha! Try again!', 'Ha ha ! Essaie encore !'],
  ['I am too strong!', 'Je suis trop fort !'],
  ['I’m not scared!', 'Même pas peur !'],
  ['Come on, little dog!', 'Approche, petit chien !'],
];
const HURT = [['Ouch!', 'Aïe !'], ['Oh no!', 'Oh non !'], ['Ow, ow, ow!', 'Ouille, ouille !'], ['Not fair!', 'Pas juste !'], ['Help!', 'Au secours !']];
const LAUGH = [['Ha ha ha!', 'Ha ha ha !'], ['Missed!', 'Raté !'], ['Hee hee hee!', 'Hi hi hi !']];

const anim = (node, cls) => {
  node.classList.remove(cls);
  void node.offsetWidth;
  node.classList.add(cls);
};

/** Renvoie l'arène si l'étape `questId` est un gardien, sinon null. */
export function bossArena(questId) {
  const step = STEP_BY[questId];
  if (!step?.boss) return null;
  const world = WORLD_BY[step.world];
  const foe = world.guardian;
  let hp = foe.hp;
  let shields = BOSS_SHIELDS;

  const hearts = h('div', { class: 'boss-hp', 'aria-label': 'Cœurs du gardien' });
  const shieldsEl = h('div', { class: 'adv-shields', 'aria-label': 'Tes boucliers' });
  const say = h('div', { class: 'bubble boss-say' });
  const face = h('div', { class: 'boss-face' }, foe.emoji);
  const bolt = h('div', { class: 'bolt', 'aria-hidden': 'true' }, '⚡');
  const cage = h('div', { class: 'adv-cage', title: `${world.friend.name} est prisonnier` }, world.friend.emoji);
  const talk = ([en, fr]) => say.replaceChildren(h('b', { lang: 'en' }, en), h('small', {}, fr));

  function render() {
    hearts.replaceChildren(...Array.from({ length: foe.hp }, (_, i) => h('span', { class: 'heart' + (i < hp ? '' : ' lost') }, i < hp ? '❤️' : '🤍')));
    shieldsEl.replaceChildren(
      h('span', { class: 'adv-shields-label' }, 'Tes boucliers :'),
      ...Array.from({ length: BOSS_SHIELDS }, (_, i) => h('span', { class: 'shield' + (i < shields ? '' : ' lost') }, '🛡️'))
    );
  }

  const el = h(
    'div',
    { class: 'adv-arena-wrap' },
    h(
      'div',
      { class: 'boss-arena adv-arena' },
      h('div', { class: 'boss-name' }, foe.name[0].toUpperCase() + foe.name.slice(1)),
      hearts,
      h('div', { class: 'boss-stage' }, face, say, cage),
      bolt
    ),
    shieldsEl
  );
  talk(pick(TAUNTS));
  render();

  return {
    el,
    title: `${world.emoji} ${world.name}`,
    /** Bonne réponse : renvoie le texte de félicitation. */
    hit(streak) {
      const special = streak > 0 && streak % 3 === 0;
      hp = Math.max(0, hp - (special ? 2 : 1));
      bolt.textContent = special ? '🌟' : '⚡';
      anim(bolt, 'fire');
      special ? sound.combo() : sound.zap();
      setTimeout(() => {
        anim(face, 'hit');
        talk(hp <= 0 ? ['I give up!', 'Je me rends !'] : pick(HURT));
        render();
        if (hp <= 0) face.classList.add('ko-out');
      }, 380);
      return special ? 'Coup spécial ! −2 ❤️ +1 ⭐' : 'Touché ! +1 ⭐';
    },
    /** Erreur : un bouclier de moins. */
    miss() {
      shields = Math.max(0, shields - 1);
      sound.laugh();
      anim(face, 'laugh');
      talk(pick(LAUGH));
      render();
      return shields > 0 ? `Oups, un bouclier de moins ! Encore ${shields} 🛡️` : 'Plus de bouclier…';
    },
    taunt: () => hp > 0 && talk(pick(TAUNTS)),
    over: () => hp <= 0 || shields <= 0,
    result: () => ({ won: hp <= 0, hp, max: foe.hp, shields, stars: hp > 0 ? 0 : shields >= BOSS_SHIELDS - 1 ? 3 : shields >= 2 ? 2 : 1 }),
  };
}
