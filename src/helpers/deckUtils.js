export const suits = ['spades', 'clubs', 'hearts', 'diamonds'];

export const cardValues = ['A', '2', '3', '4', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const getCardBJValue = (cardNumber) => {
  switch (cardNumber) {
    case '2': return 2;
    case '3': return 3;
    case '4': return 4;
    case '5': return 5;
    case '6': return 6;
    case '7': return 7;
    case '8': return 8;
    case '9': return 9;
    case '10':
    case 'JACK':
    case 'QUEEN':
    case 'KING': return 10;
    case 'ACE':
    default: return 11;
  }
}

export const getDeck = () => {
  const deck = [];

  suits.forEach((suit) => {
    cardValues.forEach((number) => {
      deck.push({ suit, number, value: getCardBJValue(number), visible: false })
    })
  })

  return deck;
}

export const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
}