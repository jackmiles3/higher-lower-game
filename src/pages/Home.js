import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Higher/Lower Card Game!</h1>
      <p>Select a game mode to start:</p>
      <div>
        <Link to="/streak">
          <button>Streak Mode</button>
        </Link>
        <Link to="/timed">
          <button>Timed Mode</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
