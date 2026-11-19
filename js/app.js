// Point d'entrée : initialise les données, déclare les écrans, démarre.

import { units } from './units/index.js';
import { initStore } from './core/store.js';
import { pickVoices } from './ui/speech.js';
import { register, start } from './core/router.js';
import home from './screens/home.js';
import unitMenu from './screens/unitMenu.js';
import sessionScreen from './screens/session.js';
import results from './screens/results.js';
import learn from './screens/learn.js';
import games from './screens/games.js';
import memory from './screens/memory.js';
import chrono from './screens/chrono.js';
import bubbles from './screens/bubbles.js';
import simon from './screens/simon.js';
import cafe from './screens/cafe.js';
import lab from './screens/lab.js';
import parrot from './screens/parrot.js';
import rewards from './screens/rewards.js';
import parent from './screens/parent.js';
// Le tour du monde (zone à part : js/adventure/)
import adventureMap from './adventure/map.js';
import treasures from './adventure/treasures.js';
import { questBanner } from './adventure/progress.js';

initStore(units);
pickVoices(); // l'accent choisi par le parent est connu maintenant

/** Jeu ou séance lancés depuis la carte du tour du monde : l'étape et son objectif sous l'en-tête. */
const withQuest = (fn) => (params) => {
  const r = fn(params);
  const banner = params.quest && questBanner(params.quest);
  if (banner) {
    const el = r instanceof Node ? r : r.el;
    const head = el.querySelector('.header, .session-top');
    if (head) head.after(banner);
    else el.prepend(banner);
  }
  return r;
};

register('home', home);
register('unit', unitMenu);
register('session', withQuest(sessionScreen));
register('results', results);
register('learn', learn);
register('games', games);
register('memory', withQuest(memory));
register('chrono', withQuest(chrono));
register('bubbles', withQuest(bubbles));
register('simon', withQuest(simon));
register('cafe', withQuest(cafe));
register('lab', lab);
register('parrot', withQuest(parrot));
register('rewards', rewards);
register('parent', parent);
register('adventure', adventureMap);
register('treasures', treasures);

start();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
