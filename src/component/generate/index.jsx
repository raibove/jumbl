import React, { useState } from 'react';
import { RxCrosshair1, RxGrid, RxLapTimer, RxPencil2, RxArrowRight } from "react-icons/rx";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../header';
import { Container, FormContainer, Subtitle, Form, FormGroup, FormLabel, FormInput, SubmitButton, IconInline } from '../../common-styled';

function extractCluesAndAnswers(inputString) {
  const lines = inputString.trim().split('\n');
  const cluesAndWords = [];
  const regex = /\[{answer:\s*"(.*?)",\s*clue:\s*"(.*?)"}\]/;

  lines.forEach(line => {
    const match = line.trim().match(regex);
    if (match) {
      const word = match[1];
      const clue = match[2];
      cluesAndWords.push({ word, clue });
    }
  });

  return cluesAndWords;
}

const GeneratePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(10);
  const [difficulty, setDifficulty] = useState('easy');
  const [cluesAndWords, setCluesAndWords] = useState([]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ username, topic, wordCount, difficulty });
    const inputData = {
      type:'words',
      topic,
      numOfWords:wordCount,
      difficultyLevel: difficulty
    }
    const resp = await fetch('http://127.0.0.1:8787/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputData)
      }
    );
    const txt = await resp.text();

    const extractedData = extractCluesAndAnswers(txt);
    setCluesAndWords(extractedData);
    console.log(txt)
  };

  return (
    <>
      <Header />
      <Container>
        <FormContainer>
          <Subtitle>Create your custom crossword puzzle in seconds!</Subtitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="topic">
                <RxPencil2 size={18} className="icon" />
                Topic
              </FormLabel>
              <FormInput
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="wordCount">
                <RxGrid size={18} className="icon" />
                Number of Words
              </FormLabel>
              <FormInput
                type="number"
                id="wordCount"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                min="5"
                max="30"
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="difficulty">
                <RxCrosshair1 size={18} className="icon" />
                Difficulty
              </FormLabel>
              <FormInput
                as="select"
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </FormInput>
            </FormGroup>

            <SubmitButton type="submit">
              Generate Crossword <IconInline><RxArrowRight size={18} /></IconInline>
            </SubmitButton>
          </Form>
        </FormContainer>
        {cluesAndWords.map((item, index) => (
          <li key={index}>
            <strong>Word:</strong> {item.word} <br />
            <strong>Clue:</strong> {item.clue}
          </li>
        ))}
      </Container>
    </>
  );
};

export default GeneratePage;
