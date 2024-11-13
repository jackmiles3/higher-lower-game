import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StreakMode from './pages/StreakMode';
import TimedMode from './pages/TimedMode';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/streak" element={<StreakMode />} />
        <Route path="/timed" element={<TimedMode />} />
      </Routes>
    </Router>
  );
}

export default App;
