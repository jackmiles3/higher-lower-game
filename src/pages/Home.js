import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaClock, FaChartLine } from 'react-icons/fa'; 

import '../styles.css'

const Home = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="min-h-screen bg-green-800 flex items-center justify-center text-white relative">
      <div className="text-center">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">Higher/Lower Card Game</h1>
        <h2 className="text-xl font-semibold mb-8">by Jack Miles</h2>
        <p className="mb-6">Choose a game mode to start playing:</p>
        <div className="flex justify-center space-x-4">
          <Link to="/streak">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded flex items-center space-x-2">
              <FaChartLine /> 
              <span>Streak Mode</span>
            </button>
          </Link>
          <Link to="/timed">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded flex items-center space-x-2">
              <FaClock /> 
              <span>Timed Mode</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Instructions Button */}
      <button
        className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded flex items-center space-x-2"
        onClick={() => setShowInstructions(true)}
      >
        <FaQuestionCircle /> 
        <span>Instructions</span>
      </button>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-green-700 p-6 rounded shadow-lg text-white w-96 relative">
            <h2 className="text-2xl font-bold text-center mb-4">How to Play</h2>
            <p className="text-lg mb-4">
              <strong>Streak Mode:</strong> Try to accumulate the highest streak possible without getting one wrong.
            </p>
            <p className="text-lg mb-4">
              <strong>Timed Mode:</strong> Select a time limit, then aim for the highest score within that time. An incorrect answer incurs a penalty.
            </p>
            <p className="text-lg mb-4">
              <strong>Game Modes:</strong>
              <ul className="list-disc list-inside">
                <li><strong>Normal Mode:</strong> If the next card is the same as the current card, you will automatically progress regardless of your guess.</li>
                <li><strong>Hard Mode:</strong> If the next card is the same as the current card, you must guess its suit correctly to progress.</li>
              </ul>
            </p>
            <p className="text-lg">
              Access Hard Mode and your statistics by clicking the gear icon in the top-right corner during a game.
            </p>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-6 w-full"
              onClick={() => setShowInstructions(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
