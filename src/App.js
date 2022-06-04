import { useEffect, useState } from 'react';
import { getCardBJValue } from './helpers/deckUtils';
import './App.css';

const cardBackurl = '/playing card back.png';
const PLAYER = 'player'
const DEALER = 'dealer';
const DRAW = 'draw';

function App() {
  const [deckID, setDeckID] = useState();
  const [userHand, setUserHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [userHandValue, setUserHandValue] = useState(0)
  const [dealerHandValue, setDealerHandValue] = useState(0)
  const [userStands, setUserStands] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [winner, setWinner] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    getDeck();
  }, [])

  const getDeck = async () => {
    const deck = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
      .then((res) => res.json())
    setDeckID(deck.deck_id);
  }

  useEffect(() => {
    // update user's hand value
    const sum = calculateHandValue(userHand, setUserHand)
    
    if (sum !== null) {
      setUserHandValue(sum)
    }
  }, [userHand])

  useEffect(() => {
    // if user goes bust, end game
    if (userHandValue > 21) {
      setWinner(DEALER);
      setGameInProgress(false);
    }
  }, [userHandValue])

  useEffect(() => {
    // update dealer's hand value
    const sum = calculateHandValue(dealerHand, setDealerHand)

    if (sum !== null) {
      setDealerHandValue(sum)
    }

    if (userStands) {
      // dealers turn to draw cards
      if (sum >= 17) {
        // dealer stands, calculate winner
        calculateWinner(sum)
      } else {
        drawDealerCard()
      }
    }
  }, [dealerHand, userStands])

  const calculateWinner = (dealerValue) => {
    if (dealerValue > 21) {
      setWinner(PLAYER)
    } else if (dealerValue === userHandValue) {
      setWinner(DRAW);
    } else { 
      dealerValue > userHandValue
      ? setWinner(DEALER)
      : setWinner(PLAYER)
    }
    setGameInProgress(false);
  }

  const calculateHandValue = (hand, setHand) => {
    // calculate value of visible cards using blackjack values
    let sum = hand.reduce(((total, card) => {
      if (!card.visible) return total;
      return total += card.bjValue
    }), 0)
    if (sum > 21) {
      // if more than 21, check for aces
      const containsHighAces = hand.some(card => card.value === 'ACE' && card.bjValue === 11)
      if (!containsHighAces) {
        // bust, game over
        return sum
      }

      // change ace value from 11 to 1 and trigger recalculate
      const newHand = [...hand]
      const ace = newHand.find((card) => card.value === 'ACE' && card.bjValue === 11)
      ace.bjValue = 1;
      setHand(newHand);
      return null;
    }
    return sum;
  }

  const drawCards = async (count) => {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${count}`)
      .then((res) => res.json());
    if (!response.success) {
      setErrorMessage(response.error)
      return
    }
    return response.cards;
  }

  const deal = async () => {
    resetTable();

    const cards = await drawCards(4);

    const newUserHand = []
    const newDealerHand = []
    cards.forEach((card, index) => {
      index % 2 === 0
        ? newUserHand.push({...card, ...{visible: true, bjValue: getCardBJValue(card.value)}})
        : newDealerHand.push({...card, ...{visible: index === 3 ? false : true, bjValue: getCardBJValue(card.value)}})
    })
    setUserHand(newUserHand)
    setDealerHand(newDealerHand)
    setGameInProgress(true)
  }

  const resetTable = () => {
    setUserHandValue()
    setDealerHandValue()
    setUserStands(false)
    setWinner('')
  }

  const drawUserCard = async () => {
    const cards = await drawCards(1);
    const newCard = cards[0]
    const newHand = [...userHand, {...newCard, ...{visible: true, bjValue: getCardBJValue(newCard.value)}}]
    setUserHand(newHand);
  }

  const drawDealerCard = async () => {
    const cards = await drawCards(1);
    const newCard = cards[0];
    const newHand = [...dealerHand, {...newCard, ...{visible: true, bjValue: getCardBJValue(newCard.value)}}]
    setDealerHand(newHand);
  }

  const endTurn = () => {
    const newDealerHand = [...dealerHand];
    const faceDownCard = newDealerHand.find(card => card.visible === false);
    faceDownCard.visible = true;
    setDealerHand(newDealerHand);
    setUserStands(true);
  }

  const renderWinnerStatement = () => {
    if (!gameInProgress && winner) {
      switch (winner) {
        case 'player': return 'YOU WIN!';
        case 'dealer': return 'YOU LOSE!';
        default: return 'NO WINNER'
      }
    }
  }

  return (
    <div className="App">
      <div>
        Blackjack!
      </div>
      <div className='dealer-section'>
        <div className='player-title'>
          Dealer - {dealerHandValue}
        </div>
        <div className='dealer-hand'>
          {dealerHand.map(card => (
            <div className='card-container'>
              <img src={card.visible ? card.image : cardBackurl} className='card' key={card.code} alt={card.value + card.suit} />
            </div>
            ))}
        </div>
      </div>

      <div className='user-section'>
        <div className='player-title'>
          You - {userHandValue}
        </div>
        <div className='user-hand'>
          {userHand.map(card => (
            <div className='card-container'>
              <img src={card.visible ? card.image : cardBackurl} className='card' key={card.code} alt={card.value + card.suit} />
            </div>
          ))}
        </div>
      </div>
    
      {errorMessage ? (
        <div className='error'>
          {errorMessage}
        </div>
      ) : (
        <>
          {!gameInProgress ? (
            <button onClick={deal} className='deal-btn'>Deal</button>
          ) : (
            <div className='buttons-container'>
              <div>
                <button onClick={drawUserCard} className='hit-me-btn'>Hit Me</button>
              </div>
              <div>
                <button onClick={endTurn} className='end-turn-btn'>End Turn</button>
              </div>
            </div>
          )}
        </>
      )}

      <div className='winner-statement'>
        {renderWinnerStatement()}
      </div>

    </div>
  );
}

export default App;
