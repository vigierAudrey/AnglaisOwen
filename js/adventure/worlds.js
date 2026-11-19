// Le tour du monde de Biscuit : 8 pays où l'on parle anglais, 6 étapes chacun, dans l'ordre de
// l'appli (Hello → nombres → couleurs → mots → actions → phrases).
// Histoire : le Capitaine Embrouille 🐙 a capturé les amis de Biscuit et les a cachés aux quatre
// coins du monde. Au bout de chaque pays, un gardien retient un ami : le battre libère l'ami et
// ouvre le pays suivant.
//
// Une étape : { id, emoji, label, unitId, skillIds, mode | screen | boss, goal? }
//   mode    exercice « question par question » (listen, picture, count…) → écran « session »
//   screen  jeu (bubbles, memory, chrono, simon, cafe, parrot) ; goal = objectif chiffré
//   boss    le gardien du pays : écran « session » en mode « mix » avec l'arène (arena.js)
// ⚠️ L'id d'une étape est la clé de progression : ne jamais le changer.

export const BOSS_SHIELDS = 5; // erreurs permises contre un gardien
export const CHEST_STARS = 10; // bonus quand on libère un ami

/** Jeux utilisables comme étape : score maximal (pour 3 étoiles) et objectif affiché. */
export const GAME_GOALS = {
  bubbles: { max: 10, text: (g) => `Éclate au moins ${g} bulles du premier coup (sur 10)` },
  simon: { max: 10, text: (g) => `Réussis au moins ${g} ordres sur 10` },
  cafe: { max: 6, text: (g) => `Sers au moins ${g} clients sur 6` },
  parrot: { max: 8, text: (g) => `Répète au moins ${g} mots` },
  chrono: { extra: 6, text: (g) => `Au moins ${g} bonnes réponses en 60 secondes` },
  memory: { text: () => 'Retrouve toutes les paires' },
};

export const WORLDS = [
  {
    id: 'london',
    name: 'Londres',
    en: 'Welcome to London!',
    emoji: '💂',
    intro: 'Bonjour, merci, ça va ? On commence par être poli !',
    fact: 'Big Ben, ce n’est pas le nom de la grande horloge de Londres : c’est le nom de sa grosse cloche ! 🔔',
    guardian: { emoji: '👻', name: 'le Fantôme de la Tour', hp: 6 },
    friend: { emoji: '🐱', name: 'Kitty' },
    steps: [
      { id: 'w1-1', emoji: '👋', label: 'Hello! Goodbye!', unitId: 'hello', skillIds: ['polite'], mode: 'listen' },
      { id: 'w1-2', emoji: '😀', label: 'Comment ça va ?', unitId: 'hello', skillIds: ['feelings'], mode: 'listen' },
      { id: 'w1-3', emoji: '🫧', label: 'Les bulles de Big Ben', unitId: 'hello', skillIds: ['polite', 'feelings'], screen: 'bubbles', goal: 7 },
      { id: 'w1-4', emoji: '🎭', label: 'Que dis-tu ?', unitId: 'hello', skillIds: ['situations'], mode: 'situation' },
      { id: 'w1-5', emoji: '🦜', label: 'Le perroquet de la reine', unitId: 'hello', skillIds: ['polite', 'feelings'], screen: 'parrot', goal: 5 },
      { id: 'w1-6', emoji: '👻', label: 'Le Fantôme de la Tour', unitId: 'hello', skillIds: ['polite', 'feelings', 'situations'], boss: true },
    ],
  },
  {
    id: 'scotland',
    name: 'L’Écosse',
    en: 'Welcome to Scotland!',
    emoji: '🏞️',
    intro: 'Des lacs, des châteaux… et des nombres à compter !',
    fact: 'L’animal symbole de l’Écosse, c’est… la licorne ! 🦄 Et dans le lac du Loch Ness vivrait un monstre, Nessie.',
    guardian: { emoji: '🦕', name: 'Nessie du Loch Ness', hp: 7 },
    friend: { emoji: '🐑', name: 'Woolly' },
    steps: [
      { id: 'w2-1', emoji: '🎧', label: 'One, two, three…', unitId: 'numbers', skillIds: ['n0_10'], mode: 'listen' },
      { id: 'w2-2', emoji: '🍎', label: 'Compte en anglais', unitId: 'numbers', skillIds: ['n0_10'], mode: 'count' },
      { id: 'w2-3', emoji: '🫧', label: 'Les bulles du loch', unitId: 'numbers', skillIds: ['n0_10'], screen: 'bubbles', goal: 7 },
      { id: 'w2-4', emoji: '🔟', label: 'De 11 à 20', unitId: 'numbers', skillIds: ['n11_20'], mode: 'listen' },
      { id: 'w2-5', emoji: '⏱️', label: 'La course des Highlands', unitId: 'numbers', skillIds: ['n0_10', 'n11_20'], screen: 'chrono', goal: 8 },
      { id: 'w2-6', emoji: '🦕', label: 'Nessie du Loch Ness', unitId: 'numbers', skillIds: ['n0_10', 'n11_20'], boss: true },
    ],
  },
  {
    id: 'ireland',
    name: 'L’Irlande',
    en: 'Welcome to Ireland!',
    emoji: '🍀',
    intro: 'L’île verte… et toutes les couleurs de l’arc-en-ciel !',
    fact: 'En Irlande, la légende dit qu’un petit lutin, le leprechaun, cache un chaudron d’or au pied de l’arc-en-ciel ! 🌈',
    guardian: { emoji: '🌧️', name: 'Nuage Grisou', hp: 7 },
    friend: { emoji: '🐞', name: 'Ladybird' },
    steps: [
      { id: 'w3-1', emoji: '🔴', label: 'Red, blue, green…', unitId: 'colours', skillIds: ['basic'], mode: 'listen' },
      { id: 'w3-2', emoji: '🍓', label: 'De quelle couleur ?', unitId: 'colours', skillIds: ['basic', 'more'], mode: 'colourOf' },
      { id: 'w3-3', emoji: '🃏', label: 'Le memory arc-en-ciel', unitId: 'colours', skillIds: ['basic', 'more', 'bw'], screen: 'memory' },
      { id: 'w3-4', emoji: '🔺', label: 'Les formes', unitId: 'colours', skillIds: ['shapes'], mode: 'listen' },
      { id: 'w3-5', emoji: '🧪', label: 'Les mélanges magiques', unitId: 'colours', skillIds: ['mix'], mode: 'mixColours' },
      { id: 'w3-6', emoji: '🌧️', label: 'Nuage Grisou', unitId: 'colours', skillIds: ['basic', 'more', 'bw', 'shapes'], boss: true },
    ],
  },
  {
    id: 'newyork',
    name: 'New York',
    en: 'Welcome to New York!',
    emoji: '🗽',
    intro: 'La grande ville ! On mange, on prend le taxi…',
    fact: 'À New York, les taxis sont tous jaunes : on les appelle les « yellow cabs » ! 🚕',
    guardian: { emoji: '🦝', name: 'Raton Chapardeur', hp: 8 },
    friend: { emoji: '🐿️', name: 'Nutty' },
    steps: [
      { id: 'w4-1', emoji: '🍎', label: 'Les fruits', unitId: 'words', skillIds: ['fruit'], mode: 'listen' },
      { id: 'w4-2', emoji: '🍕', label: 'À table !', unitId: 'words', skillIds: ['food'], mode: 'picture' },
      { id: 'w4-3', emoji: '☕', label: 'Le café de Times Square', unitId: 'words', skillIds: ['fruit', 'food'], screen: 'cafe', goal: 4 },
      { id: 'w4-4', emoji: '🚕', label: 'Les transports', unitId: 'words', skillIds: ['transport'], mode: 'listen' },
      { id: 'w4-5', emoji: '❓', label: 'Yes or no?', unitId: 'words', skillIds: ['fruit', 'food', 'transport'], mode: 'isIt' },
      { id: 'w4-6', emoji: '🦝', label: 'Raton Chapardeur', unitId: 'words', skillIds: ['fruit', 'food', 'transport'], boss: true },
    ],
  },
  {
    id: 'canada',
    name: 'Le Canada',
    en: 'Welcome to Canada!',
    emoji: '🍁',
    intro: 'Les forêts, les animaux… et il fait froid, couvre-toi !',
    fact: 'Au Canada, on parle anglais ET français ! Sur le drapeau, il y a une feuille d’érable. 🍁',
    guardian: { emoji: '🐻', name: 'Grizzly Grognon', hp: 8 },
    friend: { emoji: '🦫', name: 'Woody' },
    steps: [
      { id: 'w5-1', emoji: '🐾', label: 'Les animaux', unitId: 'words', skillIds: ['animals'], mode: 'listen' },
      { id: 'w5-2', emoji: '🌳', label: 'La nature et la météo', unitId: 'words', skillIds: ['nature'], mode: 'picture' },
      { id: 'w5-3', emoji: '🧣', label: 'Les vêtements', unitId: 'words', skillIds: ['clothes'], mode: 'listen' },
      { id: 'w5-4', emoji: '🫧', label: 'Les bulles de la forêt', unitId: 'words', skillIds: ['animals', 'farm'], screen: 'bubbles', goal: 7 },
      { id: 'w5-5', emoji: '📖', label: 'Défi : lis et trouve', unitId: 'words', skillIds: ['animals', 'clothes'], mode: 'read' },
      { id: 'w5-6', emoji: '🐻', label: 'Grizzly Grognon', unitId: 'words', skillIds: ['animals', 'nature', 'clothes'], boss: true },
    ],
  },
  {
    id: 'australia',
    name: 'L’Australie',
    en: 'Welcome to Australia!',
    emoji: '🦘',
    intro: 'Saute comme un kangourou, nage comme un dauphin !',
    fact: 'Le kangourou ne sait pas marcher à reculons ! 🦘 En Australie, Noël tombe en plein été : on le fête à la plage.',
    guardian: { emoji: '🐊', name: 'Croco Croqueur', hp: 9 },
    friend: { emoji: '🐨', name: 'Snuggles' },
    steps: [
      { id: 'w6-1', emoji: '🤸', label: 'Run, jump, swim!', unitId: 'actions', skillIds: ['moves'], mode: 'listen' },
      { id: 'w6-2', emoji: '🙋', label: 'Simon says…', unitId: 'actions', skillIds: ['commands', 'moves'], screen: 'simon', goal: 7 },
      { id: 'w6-3', emoji: '🪥', label: 'Tous les jours', unitId: 'actions', skillIds: ['daily'], mode: 'picture' },
      { id: 'w6-4', emoji: '🐧', label: 'Can a fish fly?', unitId: 'actions', skillIds: ['can'], mode: 'canDo' },
      { id: 'w6-5', emoji: '⏱️', label: 'La course du désert', unitId: 'actions', skillIds: ['moves', 'daily'], screen: 'chrono', goal: 8 },
      { id: 'w6-6', emoji: '🐊', label: 'Croco Croqueur', unitId: 'actions', skillIds: ['moves', 'daily', 'can'], boss: true },
    ],
  },
  {
    id: 'safari',
    name: 'Le safari d’Afrique du Sud',
    en: 'Welcome to South Africa!',
    emoji: '🦁',
    intro: 'Les premières phrases : big, small, I like, I have…',
    fact: 'L’Afrique du Sud a 12 langues officielles, dont l’anglais ! 🗣️ Et c’est là que vivent les plus grands animaux terrestres.',
    guardian: { emoji: '🦏', name: 'Rhino Ronchon', hp: 9 },
    friend: { emoji: '🦒', name: 'Sunny' },
    steps: [
      { id: 'w7-1', emoji: '🐘', label: 'Big or small?', unitId: 'phrases', skillIds: ['opposites'], mode: 'opposite' },
      { id: 'w7-2', emoji: '😋', label: 'I like… / I don’t like…', unitId: 'phrases', skillIds: ['like'], mode: 'like' },
      { id: 'w7-3', emoji: '🃏', label: 'Le memory du safari', unitId: 'words', skillIds: ['animals', 'body'], screen: 'memory' },
      { id: 'w7-4', emoji: '🐱', label: 'I have two cats', unitId: 'phrases', skillIds: ['have'], mode: 'have' },
      { id: 'w7-5', emoji: '❤️', label: 'a red heart', unitId: 'phrases', skillIds: ['colourShape'], mode: 'colourShape' },
      { id: 'w7-6', emoji: '🦏', label: 'Rhino Ronchon', unitId: 'phrases', skillIds: ['opposites', 'like', 'have', 'colourShape'], boss: true },
    ],
  },
  {
    id: 'island',
    name: 'L’île du Capitaine Embrouille',
    en: 'Ahoy! Welcome to Muddle Island!',
    emoji: '🏝️',
    intro: 'Le repaire du Capitaine Embrouille ! Libère la licorne !',
    fact: 'Les pirates anglais disaient « Ahoy! » pour dire bonjour. Et « Arrr! » quand ils étaient contents ! 🏴‍☠️',
    guardian: { emoji: '🐙', name: 'le Capitaine Embrouille', hp: 12 },
    friend: { emoji: '🦄', name: 'Sparkle' },
    steps: [
      { id: 'w8-1', emoji: '📦', label: 'Où est le chat ?', unitId: 'phrases', skillIds: ['where'], mode: 'where' },
      { id: 'w8-2', emoji: '❓', label: 'What’s your name?', unitId: 'hello', skillIds: ['questions'], mode: 'reply' },
      { id: 'w8-3', emoji: '🕵️', label: 'Devinettes : qui suis-je ?', unitId: 'phrases', skillIds: ['riddles'], mode: 'riddle' },
      { id: 'w8-4', emoji: '✏️', label: 'Défi : écris le mot', unitId: 'words', skillIds: ['animals', 'fruit'], mode: 'spell' },
      { id: 'w8-5', emoji: '🚂', label: 'La phrase en ordre', unitId: 'phrases', skillIds: ['order'], mode: 'order' },
      { id: 'w8-6', emoji: '🐙', label: 'Le Capitaine Embrouille', unitId: 'phrases', skillIds: ['where', 'riddles', 'opposites', 'have', 'colourShape'], boss: true },
    ],
  },
];

for (const w of WORLDS) for (const s of w.steps) s.world = w.id;
export const STEPS = WORLDS.flatMap((w) => w.steps);
export const STEP_BY = Object.fromEntries(STEPS.map((s) => [s.id, s]));
export const WORLD_BY = Object.fromEntries(WORLDS.map((w) => [w.id, w]));
