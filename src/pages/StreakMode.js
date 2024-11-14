import React, { useState, useEffect } from 'react';
import { createDeck } from '../utils/deck';

const StreakMode = () => {
  const [currentCard, setCurrentCard] = useState(null);
  const [nextCard, setNextCard] = useState(null);
  const [deck, setDeck] = useState([]);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lastCard, setLastCard] = useState(null);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const newDeck = createDeck();
    const firstCard = newDeck.pop();
    const secondCard = newDeck.pop();
    setDeck(newDeck);
    setCurrentCard(firstCard);
    setNextCard(secondCard);
    setHistory([]);
    setStreak(0);
    setGameOver(false);
    setLastCard(null);
  };

  const isGuessCorrect = (guess) => {
    const cardOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const currentIndex = cardOrder.indexOf(currentCard.value);
    const nextIndex = cardOrder.indexOf(nextCard.value);

    return guess === 'higher' ? nextIndex > currentIndex : nextIndex < currentIndex;
  };

  const handleGuess = (guess) => {
    if (isGuessCorrect(guess)) {
      setStreak(streak + 1);
      setHistory([...history, currentCard]);
      setCurrentCard(nextCard);

      if (deck.length < 2) {
        const reshuffledDeck = createDeck();
        setNextCard(reshuffledDeck.pop());
        setDeck(reshuffledDeck);
      } else {
        setNextCard(deck.pop());
        setDeck([...deck]);
      }
    } else {
      setLastCard(nextCard);
      setGameOver(true);
    }
  };

  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center text-white">
      <h2 className="text-3xl font-bold mt-8">Streak Mode</h2>
      <p className="text-lg mt-2">Current Streak: {streak}</p>
      {currentCard && nextCard ? (
        <div className="mt-6">
          {gameOver ? (
            <div className="text-center">
              <p className="text-xl mb-4">
                Wrong! The next card was: {lastCard.value} of {lastCard.suit}
              </p>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                onClick={startGame}
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl mb-4">
                Current Card: {currentCard.value} of {currentCard.suit}
              </p>
              <div className="space-x-4">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                  onClick={() => handleGuess('higher')}
                >
                  Higher
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                  onClick={() => handleGuess('lower')}
                >
                  Lower
                </button>
              </div>
            </div>
          )}
          <div className="mt-8">
            <h3 className="text-xl font-semibold">History</h3>
            <ul className="mt-4 max-h-40 overflow-y-auto bg-green-700 p-4 rounded w-80">
              {history.map((card, index) => (
                <li key={index} className="text-sm">
                  {card.value} of {card.suit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="mt-4">Loading...</p>
      )}
    </div>
  );
};

export default StreakMode;
