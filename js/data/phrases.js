// Pour aller plus loin : de petites phrases.

// Les contraires : [[anglais, français, emoji], [anglais, français, emoji]]
export const OPPOSITES = [
  [['big', 'grand, gros', '🐘'], ['small', 'petit', '🐭']],
  [['happy', 'content', '😀'], ['sad', 'triste', '😢']],
  [['hot', 'chaud', '🔥'], ['cold', 'froid', '🧊']],
  [['fast', 'rapide', '🐆'], ['slow', 'lent', '🐢']],
  [['old', 'vieux', '👴'], ['young', 'jeune', '👶']],
  [['long', 'long', '🐍'], ['short', 'court', '🐛']],
  [['loud', 'bruyant', '📢'], ['quiet', 'silencieux', '🤫']],
  [['heavy', 'lourd', '🏋️'], ['light', 'léger', '🪶']],
];

// J'aime / je n'aime pas : [anglais (comme on le dit dans la phrase), français, emoji]
export const LIKES = [
  ['apples', 'les pommes', '🍎'], ['bananas', 'les bananes', '🍌'], ['carrots', 'les carottes', '🥕'],
  ['strawberries', 'les fraises', '🍓'], ['tomatoes', 'les tomates', '🍅'], ['grapes', 'le raisin', '🍇'],
  ['mushrooms', 'les champignons', '🍄'], ['cheese', 'le fromage', '🧀'], ['pizza', 'la pizza', '🍕'],
  ['chocolate', 'le chocolat', '🍫'], ['ice cream', 'la glace', '🍦'], ['milk', 'le lait', '🥛'],
  ['cake', 'le gâteau', '🎂'], ['broccoli', 'le brocoli', '🥦'], ['eggs', 'les œufs', '🥚'], ['chips', 'les frites', '🍟'],
];
export const LIKE_EMOJI = { yes: '😋', no: '🤢' };

// J'ai… : [un, plusieurs, français, emoji, remarque sur le pluriel]
export const PETS = [
  ['cat', 'cats', 'chat', '🐱'],
  ['dog', 'dogs', 'chien', '🐶'],
  ['rabbit', 'rabbits', 'lapin', '🐰'],
  ['duck', 'ducks', 'canard', '🦆'],
  ['frog', 'frogs', 'grenouille', '🐸'],
  ['bird', 'birds', 'oiseau', '🐦'],
  ['mouse', 'mice', 'souris', '🐭', 'Attention : one mouse, two mice ! Le pluriel de mouse est mice.'],
  ['fish', 'fish', 'poisson', '🐟', 'Attention : one fish, two fish ! Fish ne change pas au pluriel.'],
  ['sheep', 'sheep', 'mouton', '🐑', 'Attention : one sheep, two sheep ! Sheep ne change pas au pluriel.'],
];

// Couleur + forme : emoji pour chaque couleur
export const COLOUR_SHAPES = {
  heart: { pl: 'hearts', fr: 'cœur', e: { red: '❤️', orange: '🧡', yellow: '💛', green: '💚', blue: '💙', purple: '💜', black: '🖤', white: '🤍', brown: '🤎' } },
  circle: { pl: 'circles', fr: 'rond', e: { red: '🔴', orange: '🟠', yellow: '🟡', green: '🟢', blue: '🔵', purple: '🟣', black: '⚫', white: '⚪', brown: '🟤' } },
  square: { pl: 'squares', fr: 'carré', e: { red: '🟥', orange: '🟧', yellow: '🟨', green: '🟩', blue: '🟦', purple: '🟪', black: '⬛', white: '⬜', brown: '🟫' } },
};

// Où est-il ? in / on / under / next to (avec une boîte)
export const PREPOSITIONS = [
  ['in', 'dans'],
  ['on', 'sur'],
  ['under', 'sous'],
  ['next to', 'à côté de'],
];
export const PREP_THINGS = [
  ['cat', 'le chat', '🐱'], ['dog', 'le chien', '🐶'], ['mouse', 'la souris', '🐭'], ['ball', 'le ballon', '⚽'],
  ['teddy bear', 'le nounours', '🧸'], ['frog', 'la grenouille', '🐸'], ['duck', 'le canard', '🦆'],
];

// Qui suis-je ? [devinette, traduction, emoji de la réponse, réponse]
export const RIDDLES = [
  ['I am yellow. I am a fruit. Monkeys love me!', 'Je suis jaune. Je suis un fruit. Les singes m’adorent !', '🍌', 'a banana'],
  ['I am big and grey. I have got a very long nose.', 'Je suis gros et gris. J’ai un très long nez.', '🐘', 'an elephant'],
  ['I am green. I can jump. I live near the water.', 'Je suis verte. Je sais sauter. J’habite près de l’eau.', '🐸', 'a frog'],
  ['I am white and cold. I fall from the sky in winter.', 'Je suis blanche et froide. Je tombe du ciel en hiver.', '❄️', 'snow'],
  ['I am orange. Rabbits love me!', 'Je suis orange. Les lapins m’adorent !', '🥕', 'a carrot'],
  ['I am in the sky at night. I am white.', 'Je suis dans le ciel la nuit. Je suis blanche.', '🌙', 'the moon'],
  ['I have got four legs. I say “woof woof”!', 'J’ai quatre pattes. Je fais « ouaf ouaf » !', '🐶', 'a dog'],
  ['I have got four legs. I say “meow”!', 'J’ai quatre pattes. Je fais « miaou » !', '🐱', 'a cat'],
  ['I am black and white. I can swim, but I can’t fly.', 'Je suis noir et blanc. Je sais nager, mais je ne sais pas voler.', '🐧', 'a penguin'],
  ['I am yellow and black. I can fly. I make honey.', 'Je suis jaune et noire. Je sais voler. Je fabrique du miel.', '🐝', 'a bee'],
  ['I am red and hot. Don’t touch me!', 'Je suis rouge et chaud. Ne me touche pas !', '🔥', 'fire'],
  ['You read me. I have got lots of pages.', 'Tu me lis. J’ai plein de pages.', '📕', 'a book'],
  ['I am long. I have got no legs. I say “sssss”.', 'Je suis long. Je n’ai pas de pattes. Je fais « sssss ».', '🐍', 'a snake'],
  ['I am cold and sweet. Children love me in summer.', 'Je suis froide et sucrée. Les enfants m’adorent en été.', '🍦', 'an ice cream'],
  ['I am very tall. I have got a very long neck.', 'Je suis très grande. J’ai un très long cou.', '🦒', 'a giraffe'],
  ['I fly in the sky. I take people far away.', 'Je vole dans le ciel. J’emmène les gens très loin.', '✈️', 'a plane'],
  ['I am yellow and hot. I am in the sky in the day.', 'Je suis jaune et chaud. Je suis dans le ciel le jour.', '☀️', 'the sun'],
  ['I have got eight legs. I make webs.', 'J’ai huit pattes. Je fabrique des toiles.', '🕷️', 'a spider'],
  ['You wear me on your feet.', 'Tu me portes à tes pieds.', '👟', 'shoes'],
  ['I live in the sea. I am very, very big.', 'Je vis dans la mer. Je suis très, très grande.', '🐳', 'a whale'],
  ['I go “tick tock”. I tell you the time.', 'Je fais « tic tac ». Je te donne l’heure.', '🕰️', 'a clock'],
  ['I am a fruit. I am red. I am small and I have got a stone.', 'Je suis un fruit. Je suis rouge, petite, et j’ai un noyau.', '🍒', 'a cherry'],
  ['I have got seven colours. I come after the rain.', 'J’ai sept couleurs. J’arrive après la pluie.', '🌈', 'a rainbow'],
  ['I am a big cat. I am orange and black.', 'Je suis un gros chat. Je suis orange et noir.', '🐯', 'a tiger'],
];

// Phrases à remettre en ordre : [phrase, traduction, emoji]
export const ORDER = [
  ['I like cats.', 'J’aime les chats.', '🐱'],
  ['My name is {name}.', 'Je m’appelle {name}.', '🏷️'],
  ['I am {age}.', 'J’ai {age} ans.', '🎈'],
  ['The dog is big.', 'Le chien est gros.', '🐶'],
  ['I can swim.', 'Je sais nager.', '🏊'],
  ['I have a red ball.', 'J’ai un ballon rouge.', '🔴'],
  ['The sun is yellow.', 'Le soleil est jaune.', '☀️'],
  ['I don’t like carrots.', 'Je n’aime pas les carottes.', '🥕'],
  ['It is a frog.', 'C’est une grenouille.', '🐸'],
  ['Good morning, Mum!', 'Bonjour, maman !', '🌅'],
  ['The cat is in the box.', 'Le chat est dans la boîte.', '📦'],
  ['I am happy.', 'Je suis content.', '😀'],
  ['I have two dogs.', 'J’ai deux chiens.', '🐕'],
  ['Can you jump?', 'Sais-tu sauter ?', '🦘'],
  ['I love my family.', 'J’aime ma famille.', '👪'],
  ['The frog is green.', 'La grenouille est verte.', '💚'],
  ['Elephants are grey.', 'Les éléphants sont gris.', '🐘'],
  ['I want an ice cream, please.', 'Je voudrais une glace, s’il te plaît.', '🍦'],
];
