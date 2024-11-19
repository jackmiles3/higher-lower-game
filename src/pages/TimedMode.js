import React, { useState, useEffect } from 'react';
import { createDeck } from '../utils/deck';
import { FaHome, FaArrowUp, FaArrowDown, FaCog, FaChartBar } from 'react-icons/fa';

import '../styles.css'

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

const TimedMode = () => {
  const [currentCard, setCurrentCard] = useState(null);
  const [nextCard, setNextCard] = useState(null);
  const [deck, setDeck] = useState([]);
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeLimit, setTimeLimit] = useState(null);
  const timePenalty = 5;
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [hardMode, setHardMode] = useState(false);
  const [suitGuessing, setSuitGuessing] = useState(false);
  const [hiddenSuitCard, setHiddenSuitCard] = useState(null);
  const [showPenalty, setShowPenalty] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showNextCard, setShowNextCard] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);


  useEffect(() => {
    initializeDeck();
    
    const timedStats = localStorage.getItem('timedGameStats');
    if (!timedStats) {
      const initialTimedStats = {
       '30': {
          easyMode: { highestScore: 0, totalGames: 0, scoreSum: 0 },
          hardMode: { highestScore: 0, totalGames: 0, scoreSum: 0 }
        },
        '60': {
          easyMode: { highestScore: 0, totalGames: 0, scoreSum: 0 },
          hardMode: { highestScore: 0, totalGames: 0, scoreSum: 0 }
        },
        '120': {
          easyMode: { highestScore: 0, totalGames: 0, scoreSum: 0 },
          hardMode: { highestScore: 0, totalGames: 0, scoreSum: 0 }
        }
      };
      localStorage.setItem('timedGameStats', JSON.stringify(initialTimedStats));
    }
  }, []);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && gameActive) {
      endGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setTimeLimit(timeLimit);    
    setScore(0);
    setGameActive(true);
    setSuitGuessing(false);
    setHiddenSuitCard(null);
    setShowPenalty(false);
    setShowTimeUp(false);
  };

  const updateStatistics = (finalScore) => {
    const mode = hardMode ? 'hardMode' : 'easyMode';
    const stats = JSON.parse(localStorage.getItem('timedGameStats'));

    const currentStats = stats[timeLimit][mode];
    currentStats.totalGames += 1;
    currentStats.scoreSum += finalScore;

    if (finalScore > currentStats.highestScore) {
      currentStats.highestScore = finalScore;
    }

    stats[timeLimit][mode] = currentStats;
    localStorage.setItem('timedGameStats', JSON.stringify(stats));
  };

  const getStatistics = (timeLimit, isHardMode = hardMode) => {
    const stats = JSON.parse(localStorage.getItem('timedGameStats'));
    const modeStats = isHardMode ? stats[timeLimit].hardMode : stats[timeLimit].easyMode;

    const averageScore =
      modeStats.totalGames > 0
        ? (modeStats.scoreSum / modeStats.totalGames).toFixed(2)
        : 0;

    return {
      highestScore: modeStats.highestScore,
      totalGames: modeStats.totalGames,
      averageScore
    };
  };


  const handleGuess = (guess) => {
    if (!gameActive || suitGuessing) return;

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
          setScore((prevScore) => prevScore + 1);
          advanceGame();
          setShowPenalty(false);
        }
  
        setIsFlipping(false);
        setShowNextCard(false); 
      }, 1200);
    } else {
      applyTimePenalty();
    }
  };

  const handleSuitGuess = (suit) => {
    if (suit === nextCard.suit) {
      setScore((prevScore) => prevScore + 1);
      setSuitGuessing(false);
      advanceGame(); // Correct suit guess continues the game
    } else {
      applyTimePenalty(); // Wrong guess applies time penalty
    }
  };

  const applyTimePenalty = () => {
    setTimeLeft((prev) => Math.max(prev - timePenalty, 0));
    setShowPenalty(true);
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

  const advanceGame = () => {
    setHistory([...history, currentCard]);
    setCurrentCard(nextCard);
    setNextCard(deck.pop());
  };

  const endGame = () => {
    setGameActive(false);
    setShowPenalty(false);
    setShowTimeUp(true);

    updateStatistics(score);
  
    setTimeout(() => {
      setShowTimeUp(false);
      // Game remains inactive, but user can start a new game or continue
    }, 3000); // "Time's Up!" displayed for 3 seconds
  };
  

  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center text-white relative">
      <h2 className="text-3xl font-bold mt-8">Timed Mode</h2>

       {/* Time's Up Message */}
       {showTimeUp && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-red-500 text-8xl font-bold opacity-80 animate-slideFromTop">
            Time's Up!
          </p>
        </div>
      )}

      {!gameActive && !showTimeUp && (
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

      {gameActive && (
        <div className="text-center mt-4">
          <div className="text-xl flex items-center justify-center space-x-2">
            <p>Time Left: {timeLeft} seconds</p>
            {showPenalty && <p className="text-red-500">-5 seconds</p>}
          </div>
          <p className="text-xl mt-2">Score: {score}</p>
        </div>
      )}

      {suitGuessing ? (
        <div className="text-center">
          <p className="text-xl mt-4">Guess the suit of the next card!</p>
          <p className="text-xl mt-2">{hiddenSuitCard.value} of ?</p>
          <div className="flex justify-center space-x-4 mt-4">
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
        <>
          <div className="flex justify-center items-center space-x-8 mt-6">
            {currentCard && (
              <img
                src={`https://deckofcardsapi.com/static/img/${currentCard.value === '10' ? '0' : currentCard.value}${currentCard.suit[0].toUpperCase()}.png`}
                alt={`${currentCard.value} of ${currentCard.suit}`}
                className="w-32 h-48"
              />
            )}

            {/* Flipping Card for Next */}
            <div className={`relative w-32 h-48 ${isFlipping ? 'flip' : ''}`}>
              {showNextCard ? (
                <img
                  src={`https://deckofcardsapi.com/static/img/${nextCard.value === '10' ? '0' : nextCard.value}${nextCard.suit[0].toUpperCase()}.png`}
                  alt={`${nextCard.value} of ${nextCard.suit}`}
                  className="absolute w-32 h-48 front-face"
                />
              ) : (
                <img
                  src="https://deckofcardsapi.com/static/img/back.png"
                  alt="Next Card (Back)"
                  className="absolute w-32 h-48 back-face"
                />
              )}
            </div>
          </div>

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
        </>
      )}

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

      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={() => setShowOptions(!showOptions)}
      >
        <FaCog />
      </button>

      {showOptions && (
        <div className="absolute top-16 right-4 bg-green-700 p-4 rounded shadow-lg">
          <h3 className="text-lg font-bold mb-2">Options</h3>
          <label className="flex items-center space-x-2">
            <span>Hard Mode</span>
            <div
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                hardMode ? 'bg-yellow-500' : 'bg-gray-300'
              }`}
              onClick={() => setHardMode(!hardMode)}
            >
              <span
                className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${
                  hardMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </label>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded mt-4 w-full flex items-center justify-center space-x-2"
            onClick={() => setShowStatistics(true)}
          >
            <span>
              <FaChartBar />
            </span>
            <span>Statistics</span>
          </button>
        </div>
      )}

      {/* Statistics Overlay */}
      {showStatistics && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-green-700 p-6 rounded shadow-lg text-white w-96 relative">
            <h2 className="text-2xl font-bold text-center mb-4">Statistics</h2>

            {[30, 60, 120].map((timeLimit) => {
              const easyStats = getStatistics(timeLimit, false);
              const hardStats = getStatistics(timeLimit, true);

              return (
                <div key={timeLimit} className="mb-6">
                  <h3 className="text-xl font-semibold mt-4">{timeLimit}-Second Mode</h3>

                  <h4 className="text-lg font-semibold mt-4">Easy Mode</h4>
                  <p>Highest Score: <span className="text-yellow-400">{easyStats.highestScore}</span></p>
                  <p>Average Score: <span className="text-yellow-400">{easyStats.averageScore}</span></p>
                  <p>Total Games Played: <span className="text-yellow-400">{easyStats.totalGames}</span></p>

                  <h4 className="text-lg font-semibold mt-4">Hard Mode</h4>
                  <p>Highest Score: <span className="text-yellow-400">{hardStats.highestScore}</span></p>
                  <p>Average Score: <span className="text-yellow-400">{hardStats.averageScore}</span></p>
                  <p>Total Games Played: <span className="text-yellow-400">{hardStats.totalGames}</span></p>
                </div>
              );
            })}

            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-6 w-full"
              onClick={() => setShowStatistics(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

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
