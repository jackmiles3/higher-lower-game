import React, { useState, useEffect } from 'react';
import { createDeck } from '../utils/deck';
import { FaCog } from 'react-icons/fa';

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

const StreakMode = () => {
  const [currentCard, setCurrentCard] = useState(null);
  const [nextCard, setNextCard] = useState(null);
  const [deck, setDeck] = useState([]);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lastCard, setLastCard] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [suitGuessing, setSuitGuessing] = useState(false); // For suit guessing phase
  const [hiddenSuitCard, setHiddenSuitCard] = useState(null); // To hold the next card without suit during suit guessing


  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    const newDeck = createDeck();
    setDeck(newDeck);
    setCurrentCard(newDeck.pop());
    setNextCard(newDeck.pop());
    setHistory([]);
    setStreak(0);
    setGameOver(false);
    setSuitGuessing(false);
    setHiddenSuitCard(null);
  };

  const isGuessCorrect = (guess) => {
    const cardOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const currentIndex = cardOrder.indexOf(currentCard.value);
    const nextIndex = cardOrder.indexOf(nextCard.value);

    if (currentIndex === nextIndex) {
      if (hardMode) {
        setSuitGuessing(true); // Trigger suit guessing phase
        setHiddenSuitCard({ value: nextCard.value, suit: '?' }); // Display rank without suit
      }
      return true; // Progress to suit guessing or continue in Easy Mode
    }

    return guess === 'higher' ? nextIndex > currentIndex : nextIndex < currentIndex;
  };

  const handleGuess = (guess) => {
    if (isGuessCorrect(guess)) {
      setHistory([...history, currentCard]); // Add current card to history
  
      if (currentCard.value === nextCard.value && hardMode) {
        // Trigger suit guessing if the ranks match in Hard Mode
        setSuitGuessing(true);
        setHiddenSuitCard({ value: nextCard.value, suit: '?' }); // Show rank without suit
        return;
      }
  
      incrementStreakAndAdvance(); // Normal flow for non-matching ranks
    } else {
      endGame();
    }
  };

  const handleSuitGuess = (suit) => {
    if (suit === nextCard.suit) {
      setSuitGuessing(false); // Exit suit guessing phase
      incrementStreakAndAdvance();
    } else {
      endGame();
    }
  };

  const incrementStreakAndAdvance = () => {
    setStreak(streak + 1);
    setCurrentCard(nextCard);

    if (deck.length < 2) {
      const reshuffledDeck = createDeck();
      setNextCard(reshuffledDeck.pop());
      setDeck(reshuffledDeck);
    } else {
      setNextCard(deck.pop());
      setDeck([...deck]);
    }
  };

  const endGame = () => {
    setLastCard(nextCard);
    setGameOver(true);
  };

  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center text-white relative">
      <h2 className="text-3xl font-bold mt-8">Streak Mode</h2>
      <p className="text-lg mt-2">Current Streak: {streak}</p>

      {/* Options Gear Icon */}
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={() => setShowOptions(!showOptions)}
      >
        <FaCog />
      </button>

      {/* Options Panel */}
      {showOptions && (
        <div className="absolute top-16 right-4 bg-green-700 p-4 rounded shadow-lg">
          <h3 className="text-lg font-bold mb-2">Options</h3>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={hardMode}
              onChange={() => setHardMode(!hardMode)}
              className="form-checkbox h-5 w-5 text-yellow-500"
            />
            <span>Hard Mode</span>
          </label>
        </div>
      )}

      {currentCard && (suitGuessing ? hiddenSuitCard : nextCard) ? (
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
          ) : suitGuessing ? (
            <div className="text-center">
              <p className="text-xl mb-4">Guess the suit of the next card!</p>
              <p className="text-xl">{hiddenSuitCard.value} of ?</p>
              <div className="space-x-4 mt-4">
                {suits.map((suit) => (
                  <button
                    key={suit}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                    onClick={() => handleSuitGuess(suit)}
                  >
                    {suit.charAt(0).toUpperCase() + suit.slice(1)}
                  </button>
                ))}
              </div>
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
        </div>
      ) : (
        <p className="mt-4">Loading...</p>
      )}

      {/* History */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">History</h3>
        <ul className="mt-4 max-h-40 overflow-y-auto bg-green-700 p-4 rounded w-80">
          {history.length > 0 ? (
            history.map((card, index) => (
              <li key={index} className="text-sm">
                {card.value} of {card.suit}
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-300">No history yet!</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StreakMode;