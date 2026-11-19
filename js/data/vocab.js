// Banque de mots illustrés, par thème.
// Une ligne = « anglais | français | emoji » ; « | * » à la fin = mot transparent
// (il ressemble au français : ça rassure et ça montre que l'anglais n'est pas si loin !).
// L'id d'un mot est `w:<anglais>` : ne pas renommer un mot sans raison (progression perdue).
// Chaque emoji doit être unique dans tout le fichier (vérifié par tools/check.mjs).

export const THEMES = [
  {
    id: 'animals', label: 'Les animaux', emoji: '🐾',
    words: [
      'cat|un chat|🐱', 'dog|un chien|🐶', 'bird|un oiseau|🐦', 'fish|un poisson|🐟', 'rabbit|un lapin|🐰',
      'mouse|une souris|🐭', 'bear|un ours|🐻', 'monkey|un singe|🐵', 'snake|un serpent|🐍', 'frog|une grenouille|🐸',
      'lion|un lion|🦁|*', 'tiger|un tigre|🐯|*', 'elephant|un éléphant|🐘|*', 'giraffe|une girafe|🦒|*',
      'zebra|un zèbre|🦓|*', 'crocodile|un crocodile|🐊|*', 'kangaroo|un kangourou|🦘|*', 'penguin|un manchot|🐧',
      'owl|une chouette|🦉', 'shark|un requin|🦈', 'whale|une baleine|🐳', 'octopus|une pieuvre|🐙',
      'dinosaur|un dinosaure|🦖|*', 'unicorn|une licorne|🦄', 'dragon|un dragon|🐉|*',
    ],
  },
  {
    id: 'farm', label: 'La ferme et les petites bêtes', emoji: '🐄',
    words: [
      'cow|une vache|🐮', 'pig|un cochon|🐷', 'horse|un cheval|🐴', 'sheep|un mouton|🐑', 'goat|une chèvre|🐐',
      'duck|un canard|🦆', 'chicken|une poule|🐔', 'chick|un poussin|🐥', 'donkey|un âne|🫏',
      'bee|une abeille|🐝', 'butterfly|un papillon|🦋', 'spider|une araignée|🕷️', 'snail|un escargot|🐌',
      'ladybird|une coccinelle|🐞', 'ant|une fourmi|🐜', 'worm|un ver|🪱',
    ],
  },
  {
    id: 'fruit', label: 'Les fruits et légumes', emoji: '🍎',
    words: [
      'apple|une pomme|🍎', 'banana|une banane|🍌|*', 'orange|une orange|🍊|*', 'pear|une poire|🍐',
      'strawberry|une fraise|🍓', 'grapes|du raisin|🍇', 'cherry|une cerise|🍒', 'lemon|un citron|🍋',
      'watermelon|une pastèque|🍉', 'pineapple|un ananas|🍍', 'peach|une pêche|🍑', 'coconut|une noix de coco|🥥',
      'carrot|une carotte|🥕|*', 'tomato|une tomate|🍅|*', 'potato|une pomme de terre|🥔', 'corn|du maïs|🌽',
      'mushroom|un champignon|🍄', 'broccoli|un brocoli|🥦|*',
    ],
  },
  {
    id: 'food', label: 'À table', emoji: '🍽️',
    words: [
      'bread|du pain|🍞', 'cheese|du fromage|🧀', 'egg|un œuf|🥚', 'milk|du lait|🥛', 'water|de l’eau|💧',
      'juice|du jus|🧃', 'cake|un gâteau|🎂', 'pizza|une pizza|🍕|*', 'chocolate|du chocolat|🍫|*',
      'ice cream|une glace|🍦', 'sandwich|un sandwich|🥪|*', 'chips|des frites|🍟', 'cookie|un biscuit|🍪',
      'honey|du miel|🍯', 'soup|de la soupe|🍲|*', 'pasta|des pâtes|🍝', 'sweets|des bonbons|🍬', 'pancake|une crêpe|🥞',
    ],
  },
  {
    id: 'body', label: 'Le corps', emoji: '🖐️',
    words: [
      'eye|un œil|👁️', 'ear|une oreille|👂', 'nose|un nez|👃', 'mouth|une bouche|👄', 'tongue|une langue|👅',
      'tooth|une dent|🦷', 'hand|une main|✋', 'foot|un pied|🦶', 'leg|une jambe|🦵', 'arm|un bras|💪',
      'finger|un doigt|👆', 'brain|un cerveau|🧠', 'bone|un os|🦴', 'face|un visage|🙂',
    ],
  },
  {
    id: 'clothes', label: 'Les vêtements', emoji: '👕',
    words: [
      'T-shirt|un tee-shirt|👕|*', 'trousers|un pantalon|👖', 'dress|une robe|👗', 'shoes|des chaussures|👟',
      'socks|des chaussettes|🧦', 'hat|un chapeau|👒', 'cap|une casquette|🧢', 'coat|un manteau|🧥',
      'scarf|une écharpe|🧣', 'gloves|des gants|🧤', 'boots|des bottes|🥾', 'glasses|des lunettes|👓',
      'shorts|un short|🩳|*', 'crown|une couronne|👑',
    ],
  },
  {
    id: 'family', label: 'La famille', emoji: '👪',
    words: [
      'mum|maman|👩', 'dad|papa|👨', 'baby|un bébé|👶|*', 'boy|un garçon|👦', 'girl|une fille|👧',
      'grandma|mamie|👵', 'grandpa|papi|👴', 'friend|un copain, une copine|🧑‍🤝‍🧑', 'family|la famille|👪|*',
    ],
  },
  {
    id: 'people', label: 'Les personnages', emoji: '🦸',
    words: [
      'teacher|la maîtresse, le maître|🧑‍🏫', 'doctor|le docteur|🧑‍⚕️|*', 'police officer|un policier|👮',
      'firefighter|un pompier|🧑‍🚒', 'cook|un cuisinier|🧑‍🍳', 'king|un roi|🤴', 'queen|une reine|👸',
      'pirate|un pirate|🏴‍☠️|*', 'astronaut|un astronaute|🧑‍🚀|*', 'robot|un robot|🤖|*', 'ghost|un fantôme|👻',
      'witch|une sorcière|🧙‍♀️', 'superhero|un super-héros|🦸|*', 'clown|un clown|🤡|*',
    ],
  },
  {
    id: 'school', label: 'L’école', emoji: '🎒',
    words: [
      'book|un livre|📕', 'pencil|un crayon|✏️', 'pen|un stylo|🖊️', 'scissors|des ciseaux|✂️',
      'schoolbag|un cartable|🎒', 'ruler|une règle|📏', 'crayon|un crayon de cire|🖍️', 'paper|du papier|📄',
      'notebook|un cahier|📓', 'computer|un ordinateur|💻', 'paint|de la peinture|🎨', 'school|l’école|🏫',
      'clock|une horloge|🕰️', 'bell|une cloche|🔔',
    ],
  },
  {
    id: 'home', label: 'La maison', emoji: '🏠',
    words: [
      'house|une maison|🏠', 'door|une porte|🚪', 'window|une fenêtre|🪟', 'bed|un lit|🛏️', 'chair|une chaise|🪑',
      'bath|une baignoire|🛁', 'toilet|les toilettes|🚽', 'key|une clé|🔑', 'light|la lumière|💡',
      'phone|un téléphone|📱', 'TV|la télé|📺', 'sofa|un canapé|🛋️', 'cup|une tasse|☕', 'spoon|une cuillère|🥄',
      'plate|une assiette|🍽️',
    ],
  },
  {
    id: 'toys', label: 'Les jouets et la musique', emoji: '🧸',
    words: [
      'ball|un ballon|⚽', 'teddy bear|un nounours|🧸', 'kite|un cerf-volant|🪁', 'balloon|un ballon de baudruche|🎈',
      'puzzle|un puzzle|🧩|*', 'dice|un dé|🎲', 'yo-yo|un yoyo|🪀|*', 'video game|un jeu vidéo|🎮',
      'drum|un tambour|🥁', 'guitar|une guitare|🎸|*', 'piano|un piano|🎹|*', 'trumpet|une trompette|🎺|*',
      'present|un cadeau|🎁', 'skateboard|un skateboard|🛹|*',
    ],
  },
  {
    id: 'nature', label: 'La nature et la météo', emoji: '🌳',
    words: [
      'sun|le soleil|☀️', 'moon|la lune|🌙', 'star|une étoile|⭐', 'cloud|un nuage|☁️', 'rain|la pluie|🌧️',
      'snow|la neige|❄️', 'rainbow|un arc-en-ciel|🌈', 'wind|le vent|🌬️', 'tree|un arbre|🌳', 'flower|une fleur|🌷',
      'leaf|une feuille|🍃', 'sea|la mer|🌊', 'mountain|une montagne|⛰️', 'fire|le feu|🔥', 'volcano|un volcan|🌋|*',
      'planet|une planète|🪐|*', 'Earth|la Terre|🌍',
    ],
  },
  {
    id: 'transport', label: 'Les transports', emoji: '🚗',
    words: [
      'car|une voiture|🚗', 'bus|un bus|🚌|*', 'train|un train|🚆|*', 'plane|un avion|✈️', 'boat|un bateau|⛵',
      'bike|un vélo|🚲', 'rocket|une fusée|🚀', 'helicopter|un hélicoptère|🚁|*', 'tractor|un tracteur|🚜|*',
      'taxi|un taxi|🚕|*', 'motorbike|une moto|🏍️', 'lorry|un camion|🚚', 'ambulance|une ambulance|🚑|*',
      'fire engine|un camion de pompiers|🚒', 'scooter|une trottinette|🛴',
    ],
  },
];

/** Mots prêts à l'emploi : { en, fr, emoji, twin, theme }. */
export const VOCAB = THEMES.flatMap((t) =>
  t.words.map((line) => {
    const [en, fr, emoji, star] = line.split('|');
    return { en, fr, emoji, twin: star === '*', theme: t.id };
  })
);

export const VOCAB_BY = Object.fromEntries(VOCAB.map((w) => [w.en, w]));
