import React, { useState, useEffect } from 'react';
import { createDeck } from '../utils/deck';

const StreakMode = () => {
  const [currentCard, setCurrentCard] = useState(null);
  const [nextCard, setNextCard] = useState(null);
  const [deck, setDeck] = useState([]);
  const [history, setHistory] = useState([]); 

  useEffect(() => {
    // Initialize the deck and pick the first two cards
    startGame();
  }, []);

  const startGame = () => {
    const newDeck = createDeck();
    const firstCard = newDeck.pop();
    const secondCard = newDeck.pop();
    setDeck(newDeck);
    setCurrentCard(firstCard);
    setNextCard(secondCard);
    setHistory([]); // Ensure history starts empty
  };

  const handleGuess = () => {
    // Add current card to history before updating to next
    setHistory([...history, currentCard]);
    setCurrentCard(nextCard);

    // If the deck is low, reshuffle to keep the game going
    if (deck.length < 2) {
      const reshuffledDeck = createDeck();
      setNextCard(reshuffledDeck.pop());
      setDeck(reshuffledDeck);
    } else {
      setNextCard(deck.pop());
      setDeck([...deck]);
    }
  };

  return (
    <div>
      <h2>Streak Mode</h2>
      {currentCard && nextCard ? (
        <div>
          <p>Current Card: {currentCard.value} of {currentCard.suit}</p>
          <button onClick={handleGuess}>Higher</button>
          <button onClick={handleGuess}>Lower</button>
          <div>
            <h3>History</h3>
            <ul>
              {history.map((card, index) => (
                <li key={index}>
                  {card.value} of {card.suit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StreakMode;
