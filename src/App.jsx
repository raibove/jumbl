import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GenerateCrossword from './component/generate';
import UsernamePage from './component/username';
import PlayCrossword from './component/play';
import PlayCrossword2 from './component/play/play2';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/crossword/generate" element={<GenerateCrossword />} />
        <Route path="/crossword/play/:id" element={<PlayCrossword />} />
        <Route path="/crossword/play2/:id" element={<PlayCrossword2 />} />
        <Route path="/" element={<UsernamePage />} />
      </Routes>
    </Router>
  );
};

export default App;
