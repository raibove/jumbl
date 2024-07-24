import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Generate from './component/generate';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Generate />} />
      </Routes>
    </Router>
  );
};

export default App;
