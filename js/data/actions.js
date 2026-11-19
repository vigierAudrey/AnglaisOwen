// Les actions (verbes), les ordres de « Jacques a dit » et « Can a fish fly? ».
// Une ligne = « anglais | français | emoji ».

export const MOVES = [
  'run|courir|🏃', 'jump|sauter|🦘', 'swim|nager|🏊', 'walk|marcher|🚶', 'fly|voler|🕊️', 'climb|grimper|🧗',
  'dance|danser|💃', 'ride a bike|faire du vélo|🚴', 'skate|patiner|⛸️', 'ski|skier|⛷️', 'surf|surfer|🏄',
  'play football|jouer au foot|⚽',
];

export const DAILY = [
  'eat|manger|🍴', 'drink|boire|🥤', 'sleep|dormir|😴', 'wash|se laver|🧼', 'read|lire|📖', 'write|écrire|✍️',
  'draw|dessiner|✏️', 'paint|peindre|🎨', 'sing|chanter|🎤', 'cook|cuisiner|🍳', 'play|jouer|🎮', 'cry|pleurer|😢',
  'laugh|rire|😂', 'listen|écouter|🎧', 'talk|parler|🗣️', 'think|réfléchir|🤔', 'brush your teeth|se brosser les dents|🪥',
  'wake up|se réveiller|⏰',
];

// Ordres à mimer (Jacques a dit = « Simon says » en anglais).
export const COMMANDS = [
  'clap your hands|tape dans tes mains|👏', 'touch your nose|touche ton nez|👃', 'sit down|assieds-toi|🪑',
  'stand up|lève-toi|🧍', 'turn around|tourne sur toi-même|🔄', 'wave|fais coucou|👋', 'hands up|lève les mains|🙌',
  'stamp your feet|tape des pieds|🦶', 'be quiet|chut, silence|🤫', 'smile|souris|😁', 'close your eyes|ferme les yeux|🙈',
  'touch your head|touche ta tête|🙆',
];

export const parseLine = (line) => {
  const [en, fr, emoji] = line.split('|');
  return { en, fr, emoji };
};

// « Can a fish swim? » : [animal, emoji, action, emoji de l'action, oui/non, explication]
export const CAN = [
  ['fish', '🐟', 'swim', '🏊', true, 'Les poissons nagent toute leur vie, même en dormant !'],
  ['fish', '🐟', 'walk', '🚶', false, 'Un poisson n’a pas de pattes pour marcher.'],
  ['bird', '🐦', 'fly', '🕊️', true, 'Les oiseaux volent grâce à leurs ailes et leurs plumes.'],
  ['penguin', '🐧', 'fly', '🕊️', false, 'Le manchot est un oiseau… qui ne vole pas ! Mais il nage très vite.'],
  ['penguin', '🐧', 'swim', '🏊', true, 'Le manchot nage très vite pour attraper des poissons.'],
  ['elephant', '🐘', 'jump', '🤸', false, 'L’éléphant est bien trop lourd : il ne peut pas sauter !'],
  ['kangaroo', '🦘', 'jump', '🤸', true, 'Le kangourou fait des bonds immenses avec ses grandes pattes.'],
  ['dog', '🐶', 'fly', '🕊️', false, 'Un chien n’a pas d’ailes !'],
  ['dog', '🐶', 'swim', '🏊', true, 'Beaucoup de chiens adorent nager.'],
  ['cat', '🐱', 'climb', '🧗', true, 'Le chat grimpe aux arbres avec ses griffes.'],
  ['monkey', '🐵', 'climb', '🧗', true, 'Le singe grimpe partout avec ses mains, ses pieds… et parfois sa queue !'],
  ['snake', '🐍', 'walk', '🚶', false, 'Le serpent n’a pas de pattes : il rampe.'],
  ['duck', '🦆', 'swim', '🏊', true, 'Le canard nage avec ses pattes palmées.'],
  ['duck', '🦆', 'fly', '🕊️', true, 'Le canard sait nager, marcher ET voler !'],
  ['frog', '🐸', 'jump', '🤸', true, 'La grenouille saute très loin avec ses longues pattes.'],
  ['horse', '🐴', 'run', '🏃', true, 'Le cheval court très vite.'],
  ['snail', '🐌', 'run', '🏃', false, 'L’escargot avance tout doucement, avec sa maison sur le dos.'],
  ['cow', '🐮', 'fly', '🕊️', false, 'Une vache qui vole ? Seulement dans les dessins animés !'],
  ['owl', '🦉', 'fly', '🕊️', true, 'La chouette vole la nuit, sans faire de bruit.'],
  ['crocodile', '🐊', 'swim', '🏊', true, 'Le crocodile nage très bien, en remuant sa grande queue.'],
  ['whale', '🐳', 'walk', '🚶', false, 'La baleine vit dans la mer : elle n’a pas de pattes.'],
  ['bear', '🐻', 'climb', '🧗', true, 'Les ours savent grimper aux arbres.'],
  ['fish', '🐟', 'sing', '🎤', false, 'Les poissons ne chantent pas… mais les baleines, oui !'],
  ['bird', '🐦', 'sing', '🎤', true, 'Beaucoup d’oiseaux chantent le matin.'],
  ['spider', '🕷️', 'climb', '🧗', true, 'L’araignée grimpe sur les murs et même au plafond !'],
  ['tortoise', '🐢', 'run', '🏃', false, 'La tortue est très lente sur terre.'],
];

export const ANIMAL_FR = {
  fish: 'un poisson', bird: 'un oiseau', penguin: 'un manchot', elephant: 'un éléphant', kangaroo: 'un kangourou',
  dog: 'un chien', cat: 'un chat', monkey: 'un singe', snake: 'un serpent', duck: 'un canard', frog: 'une grenouille',
  horse: 'un cheval', snail: 'un escargot', cow: 'une vache', owl: 'une chouette', crocodile: 'un crocodile',
  whale: 'une baleine', bear: 'un ours', spider: 'une araignée', tortoise: 'une tortue',
};

export const VERB_FR = { swim: 'nager', walk: 'marcher', fly: 'voler', jump: 'sauter', climb: 'grimper', run: 'courir', sing: 'chanter' };
