import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-green-800 flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Higher/Lower Card Game</h1>
        <p className="mb-6">Choose a game mode to start playing:</p>
        <div className="space-x-4">
          <Link to="/streak">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
              Streak Mode
            </button>
          </Link>
          <Link to="/timed">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
              Timed Mode
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
