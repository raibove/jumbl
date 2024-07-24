import React, { useState } from 'react';
import { RxCrosshair1, RxGrid, RxAvatar, RxLapTimer, RxPencil2, RxArrowRight } from "react-icons/rx";
import './style.css';
import Header from '../header';

const Generate = () => {
  const [username, setUsername] = useState('');
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLimit, setTimeLimit] = useState(15);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission,
    // such as sending the data to an API to generate the crossword
    console.log({ username, topic, wordCount, difficulty, timeLimit });
  };

  return (
    <>
    <Header />
    <div className="landing-page">
      <div className="form-container">
        <p className="subtitle">Create your custom crossword puzzle in seconds!</p>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <RxAvatar size={18} className="icon" />
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="topic" className="form-label">
              <RxPencil2 size={18} className="icon" />
              Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="wordCount" className="form-label">
              <RxGrid size={18} className="icon" />
              Number of Words
            </label>
            <input
              type="number"
              id="wordCount"
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              min="5"
              max="30"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty" className="form-label">
              <RxCrosshair1 size={18} className="icon" />
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="form-input"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="timeLimit" className="form-label">
              <RxLapTimer size={18} className="icon" />
              Time Limit (minutes)
            </label>
            <input
              type="number"
              id="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              min="5"
              max="60"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="submit-button"
          >
            Generate Crossword <RxArrowRight size={18} className="icon-inline" />
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Generate;
