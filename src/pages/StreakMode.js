import React, { useState, useEffect } from 'react';
import { createDeck } from '../utils/deck';
import { FaCog, FaHome, FaArrowUp, FaArrowDown } from 'react-icons/fa';

import '../styles.css'

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
  const [suitGuessing, setSuitGuessing] = useState(false); 
  const [hiddenSuitCard, setHiddenSuitCard] = useState(null); 
  const [showHomeConfirmation, setShowHomeConfirmation] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false); 
  const [showNextCard, setShowNextCard] = useState(false);


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
    setIsFlipping(false);
    setShowNextCard(false);
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
      setIsFlipping(true);
  
      setTimeout(() => {
        setShowNextCard(true); // Flip to reveal next card
      }, 300);
  
      setTimeout(() => {
        setHistory([...history, currentCard]);
  
        if (currentCard.value === nextCard.value && hardMode) {
          setSuitGuessing(true);
          setHiddenSuitCard({ value: nextCard.value, suit: '?' });
        } else {
          incrementStreakAndAdvance();
        }
  
        setIsFlipping(false);
        setShowNextCard(false); // Reset for the next round
      }, 1200);
    } else {
      setIsFlipping(true);
  
      setTimeout(() => {
        setShowNextCard(true); // Flip to reveal the wrong answer
      }, 300);
  
      setTimeout(() => {
        endGame(); // Handle the game-over scenario
      }, 1200);
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
  
  const handleHomeClick = () => {
    if (streak > 0) {
      setShowHomeConfirmation(true); 
    } else {
      navigateHome(); 
    }
  };
  
  const navigateHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center text-white relative">
      <h2 className="text-3xl font-bold mt-8">Streak Mode</h2>
      <p className="text-lg mt-2">Current Streak: {streak}</p>
  
      {/* Home Button */}
      <button
        className="absolute top-4 left-4 flex items-center bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded space-x-2"
        onClick={handleHomeClick}>
        <span className="text-xl">
          <FaHome />
        </span>
        <span>Home</span>
      </button>
  
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
              <p className="text-xl mb-4">Wrong! The next card was:</p>
              <div className="flex justify-center items-center">
                <img
                  src={`https://deckofcardsapi.com/static/img/${lastCard.value === '10' ? '0' : lastCard.value}${lastCard.suit[0].toUpperCase()}.png`}
                  alt={`${lastCard.value} of ${lastCard.suit}`}
                  className="w-32 h-48"
                />
              </div>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded mt-4"
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
              <p className="text-xl mb-4">Current Card:</p>
              <div className="flex justify-center items-center space-x-8">
                {/* Current Card */}
                {currentCard ? (
                  <img
                    src={`https://deckofcardsapi.com/static/img/${currentCard.value === '10' ? '0' : currentCard.value}${currentCard.suit[0].toUpperCase()}.png`}
                    alt={`${currentCard.value} of ${currentCard.suit}`}
                    className="w-32 h-48"
                  />
                ) : (
                  <p>Loading card...</p>
                )}

                {/* Flipping Next Card */}
                <div className={`relative w-32 h-48 ${isFlipping ? 'flip' : ''}`}>
                  {/* Front Face (Revealed Next Card) */}
                  {showNextCard ? (
                    <img
                      src={`https://deckofcardsapi.com/static/img/${nextCard.value === '10' ? '0' : nextCard.value}${nextCard.suit[0].toUpperCase()}.png`}
                      alt={`${nextCard.value} of ${nextCard.suit}`}
                      className="absolute w-32 h-48 front-face"
                    />
                  ) : (
                    /* Back Face (Face-Down Card) */
                    <img
                      src="https://deckofcardsapi.com/static/img/back.png"
                      alt="Next Card (Back)"
                      className="absolute w-32 h-48 back-face"
                    />
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded flex items-center justify-center transform active:scale-90 transition-transform duration-100"
                  onClick={() => handleGuess('higher')}
                >
                  Higher <FaArrowUp className="ml-2" />
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded flex items-center justify-center transform active:scale-90 transition-transform duration-100"
                  onClick={() => handleGuess('lower')}
                >
                  Lower <FaArrowDown className="ml-2" />
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
        <ul className="mt-4 bg-green-700 p-4 rounded w-80 flex flex-wrap gap-2">
          {history.length > 0 ? (
            history.map((card, index) => (
              <li key={index} className="flex">
                <img
                  src={`https://deckofcardsapi.com/static/img/${card.value === '10' ? '0' : card.value}${card.suit[0].toUpperCase()}.png`}
                  alt={`${card.value} of ${card.suit}`}
                  className="w-16 h-24"
                />
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-300">No history yet!</p>
          )}
        </ul>
      </div>

      {/* Confirmation Modal */}
      {showHomeConfirmation && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-700 p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold text-white mb-4">Are you sure?</h2>
            <p className="text-white mb-4">
              You have a game in progress with a streak of {streak}. Are you sure you want to leave?
            </p>
            <div className="space-x-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowHomeConfirmation(false)} // Close modal
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={navigateHome} // Confirm navigation
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
};

export default StreakMode;