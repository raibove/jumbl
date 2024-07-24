import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GeneratePage from './component/generate';
import UsernamePage from './component/username';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/" element={<UsernamePage />} />
      </Routes>
    </Router>
  );
};

export default App;
