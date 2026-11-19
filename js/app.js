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

initStore(units);
pickVoices(); // l'accent choisi par le parent est connu maintenant

register('home', home);
register('unit', unitMenu);
register('session', sessionScreen);
register('results', results);
register('learn', learn);
register('games', games);
register('memory', memory);
register('chrono', chrono);
register('bubbles', bubbles);
register('simon', simon);
register('cafe', cafe);
register('lab', lab);
register('parrot', parrot);
register('rewards', rewards);
register('parent', parent);

start();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
