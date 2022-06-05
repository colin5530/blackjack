export const suits = ['spades', 'clubs', 'hearts', 'diamonds'];

export const cardValues = ['ACE', '2', '3', '4', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'];

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

export const fetchDeck = async () => {
  return await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
  .then((res) => res.json())
}

export const fetchCards = async (deckID, count) => {
  return await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${count}`)
  .then((res) => res.json());
}