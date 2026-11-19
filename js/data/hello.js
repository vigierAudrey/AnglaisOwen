// Se dire bonjour, être poli, dire comment on va, petites questions.
// « {name} » et « {age} » sont remplacés par le prénom et l'âge de l'enfant.

// [anglais, français, emoji, situation (en français) où on le dit]
export const POLITE = [
  ['Hello!', 'Bonjour ! Salut !', '👋', 'Tu rencontres un nouvel ami au parc.'],
  ['Goodbye!', 'Au revoir !', '🚪', 'Ton copain rentre chez lui.'],
  ['Good morning!', 'Bonjour ! (le matin)', '🌅', 'Tu arrives à l’école le matin.'],
  ['Good afternoon!', 'Bonjour ! (l’après-midi)', '🌞', 'Tu croises ta voisine l’après-midi.'],
  ['Good night!', 'Bonne nuit !', '🌙', 'Tu vas te coucher.'],
  ['Please!', 'S’il te plaît !', '🥺', 'Tu veux un bonbon. Tu demandes gentiment…'],
  ['Thank you!', 'Merci !', '🙏', 'Mamie te donne un cadeau.'],
  ['You’re welcome!', 'De rien !', '😊', 'Ton ami te dit « Thank you ! ».'],
  ['Sorry!', 'Pardon ! Désolé !', '😔', 'Tu as marché sur le pied de quelqu’un.'],
  ['Excuse me!', 'Excusez-moi !', '🙋', 'Tu veux passer, mais quelqu’un bloque le chemin.'],
  ['Yes!', 'Oui !', '👍', null],
  ['No!', 'Non !', '👎', null],
  ['Well done!', 'Bravo !', '👏', 'Ta copine a gagné la course.'],
  ['Happy birthday!', 'Joyeux anniversaire !', '🎂', 'C’est l’anniversaire de ton papa.'],
  ['Merry Christmas!', 'Joyeux Noël !', '🎄', 'C’est le 25 décembre au matin.'],
  ['I love you!', 'Je t’aime !', '🥰', 'Tu fais un gros câlin à maman avant de dormir.'],
];

// Comment ça va ? [anglais, français, emoji]
export const FEELINGS = [
  ['I’m fine.', 'Ça va bien.', '🙂'],
  ['I’m happy.', 'Je suis content.', '😀'],
  ['I’m sad.', 'Je suis triste.', '😢'],
  ['I’m tired.', 'Je suis fatigué.', '🥱'],
  ['I’m hungry.', 'J’ai faim.', '😋'],
  ['I’m thirsty.', 'J’ai soif.', '🥤'],
  ['I’m angry.', 'Je suis en colère.', '😠'],
  ['I’m scared.', 'J’ai peur.', '😱'],
  ['I’m hot.', 'J’ai chaud.', '🥵'],
  ['I’m cold.', 'J’ai froid.', '🥶'],
  ['I’m ill.', 'Je suis malade.', '🤒'],
  ['I’m surprised.', 'Je suis surpris.', '😮'],
];

// Questions et réponses : [question, sa traduction, réponse, sa traduction, emoji]
export const QUESTIONS = [
  ['What’s your name?', 'Comment tu t’appelles ?', 'My name is {name}.', 'Je m’appelle {name}.', '🏷️'],
  ['How old are you?', 'Quel âge as-tu ?', 'I’m {age}.', 'J’ai {age} ans.', '🎈'],
  ['How are you?', 'Comment ça va ?', 'I’m fine, thank you!', 'Ça va bien, merci !', '💬'],
  ['Where do you live?', 'Où habites-tu ?', 'I live in France.', 'J’habite en France.', '🏡'],
  ['Do you like pizza?', 'Tu aimes la pizza ?', 'Yes, I do!', 'Oui !', '🍕'],
  ['Can you swim?', 'Sais-tu nager ?', 'Yes, I can!', 'Oui, je sais !', '🏊'],
  ['Is it sunny today?', 'Il fait soleil aujourd’hui ?', 'Yes, it is!', 'Oui !', '☀️'],
  ['What’s this?', 'Qu’est-ce que c’est ? (montre un chien)', 'It’s a dog.', 'C’est un chien.', '🐶'],
  ['What colour is the sky?', 'De quelle couleur est le ciel ?', 'It’s blue.', 'Il est bleu.', '🌤️'],
  ['How many legs has a spider got?', 'Combien de pattes a une araignée ?', 'Eight!', 'Huit !', '🕷️'],
  ['Have you got a pet?', 'As-tu un animal ?', 'Yes, I’ve got a cat.', 'Oui, j’ai un chat.', '🐈'],
  ['Do you want an apple?', 'Tu veux une pomme ?', 'Yes, please!', 'Oui, s’il te plaît !', '🍏'],
];
