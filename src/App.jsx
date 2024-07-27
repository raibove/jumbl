import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GenerateCrossword from './component/generate';
import PlayCrossword from './component/play';
import PlayCrossword2 from './component/play/play2';
import Home from './component/home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/crossword/generate" element={<GenerateCrossword />} />
        <Route path="/crossword/play/:id" element={<PlayCrossword />} />
        <Route path="/crossword/play2/:id" element={<PlayCrossword2 />} />
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
  );
};

export default App;
