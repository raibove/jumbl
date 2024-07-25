import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GenerateCrossword from './component/generate';
import UsernamePage from './component/username';
import PlayCrossword from './component/play';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/crossword/generate" element={<GenerateCrossword />} />
        <Route path="/crossword/play" element={<PlayCrossword />} />
        <Route path="/" element={<UsernamePage />} />
      </Routes>
    </Router>
  );
};

export default App;
