import React, { useState, useEffect } from 'react';
import { createDeck } from '../utils/deck';
import { FaHome, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const TimedMode = () => {
  const [currentCard, setCurrentCard] = useState(null);
  const [nextCard, setNextCard] = useState(null);
  const [deck, setDeck] = useState([]);
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const timePenalty = 5;
  const [gameActive, setGameActive] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false);


  useEffect(() => {
    initializeDeck();
  }, []);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && gameActive) {
      endGame(); // Handle when time runs out
    }
  }, [timeLeft, gameActive]);

  const initializeDeck = () => {
    const newDeck = createDeck();
    setDeck(newDeck);
    setCurrentCard(newDeck.pop());
    setNextCard(newDeck.pop());
  };

  const startGame = (timeLimit) => {
    setHistory([]);
    setTimeLeft(timeLimit);
    setGameActive(true);
    setShowPenalty(false);
  };

  const handleGuess = (guess) => {
    if (!gameActive) return;

    if (isGuessCorrect(guess)) {
      advanceGame();
      setShowPenalty(false);
    } else {
      setTimeLeft((prev) => Math.max(prev - timePenalty, 0));
      setShowPenalty(true);
    }
  };

  const isGuessCorrect = (guess) => {
    const cardOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const currentIndex = cardOrder.indexOf(currentCard.value);
    const nextIndex = cardOrder.indexOf(nextCard.value);
  
    return guess === 'higher' ? nextIndex > currentIndex : nextIndex < currentIndex;
  };

  const advanceGame = () => {
    setHistory([...history, currentCard]);
    setCurrentCard(nextCard);
    setNextCard(deck.pop());
  };

  const endGame = () => {
    setGameActive(false);
    setShowPenalty(false);
    alert('Time’s up!');
  };

  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center text-white relative">
      <h2 className="text-3xl font-bold mt-8">Timed Mode</h2>

      {!gameActive && (
        <div className="text-center">
          <p className="text-lg mb-4">Select your time limit:</p>
          <div className="flex justify-center space-x-4">
            {[30, 60, 120].map((time) => (
              <button
                key={time}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                onClick={() => startGame(time)}
              >
                {time} Seconds
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-xl mt-4 flex items-center space-x-2">
        <p>Time Left: {timeLeft} seconds</p>
        {showPenalty && <p className="text-red-500">-5 seconds</p>}
      </div>

      <div className="flex justify-center items-center space-x-8 mt-6">
        {/* Current Card */}
        {currentCard && (
          <img
            src={`https://deckofcardsapi.com/static/img/${currentCard.value === '10' ? '0' : currentCard.value}${currentCard.suit[0].toUpperCase()}.png`}
            alt={`${currentCard.value} of ${currentCard.suit}`}
            className="w-32 h-48"
          />
        )}

        {/* Back-facing next card */}
        <img
          src="https://deckofcardsapi.com/static/img/back.png"
          alt="Next Card (Back)"
          className="w-32 h-48"
        />
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

      {/* Home Button */}
      <button
        className="absolute top-4 left-4 flex items-center bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded space-x-2"
        onClick={() => window.location.href = '/'}
      >
        <span className="text-xl">
          <FaHome />
        </span>
        <span>Home</span>
      </button>
    </div>
  );
};

export default TimedMode;
