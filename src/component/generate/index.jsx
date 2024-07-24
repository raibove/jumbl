import React, { useState } from 'react';
import { RxCrosshair1, RxGrid, RxLapTimer, RxPencil2, RxArrowRight } from "react-icons/rx";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../header';
import { Container, FormContainer, Subtitle, Form, FormGroup, FormLabel, FormInput, SubmitButton, IconInline } from '../../common-styled';
import * as clg from 'crossword-layout-generator';

const cleanAndParseInputString = (cluesString) => {
  try {
    // Remove unnecessary whitespace and newlines
    const cleanedString = cluesString.replace(/\s+/g, ' ').trim();
    
    // Check if the string starts with '[' and ends with ']'
    if (!cleanedString.startsWith('[') || !cleanedString.endsWith(']')) {
      throw new Error('Invalid format: String should start with "[" and end with "]"');
    }

    let parsed;
    try {
      // Try parsing as JSON first
      parsed = JSON.parse(cleanedString);
    } catch (jsonError) {
      // If JSON parsing fails, try parsing with a custom method
      console.log('<<< uyt')
      parsed = parseCustomFormat(cleanedString);
    }

    // Flatten the array if necessary and extract answer and clue
    const clues = parsed.flatMap(item => {
      if (Array.isArray(item) && item.length === 1) {
        return item[0];
      } else {
        return item;
      }
    });
    
    // Validate and return the clues
    return clues.map(clue => {
      if (typeof clue !== 'object' || !clue.answer || !clue.clue) {
        throw new Error('Invalid format: Each item should have "answer" and "clue" properties');
      }
      return { answer: clue.answer, clue: clue.clue };
    });

  } catch (error) {
    console.error('Error parsing clues:', error.message);
    return []; // Return an empty array in case of any error
  }
};

// Helper function to parse custom format (non-JSON)
const parseCustomFormat = (str) => {
  // Remove outer brackets
    const clueRegex = /{answer:\s*"([^"]+)",\s*clue:\s*"([^"]+)"}/g;
    const matches = [...str.matchAll(clueRegex)];

    if (matches.length === 0) {
      throw new Error('No valid clues found in the input string');
    }

    return matches.map(match => ({
      answer: match[1],
      clue: match[2]
    }));
};


const GeneratePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(10);
  const [difficulty, setDifficulty] = useState('easy');
  const [cluesAndWords, setCluesAndWords] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    setLoading(true);
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

    const extractedData = cleanAndParseInputString(txt)
    //extractCluesAndAnswers(txt);
    if(Object.keys(extractedData).length===0){
      console.log('<< zer0')
    }else{
      console.log(extractedData)
      setCluesAndWords(extractedData);
      const layout = clg.generateLayout(extractedData);
      console.log(layout);
      console.log(extractedData.map((d)=> d.answer))
    }
    setLoading(false)

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

            <SubmitButton type="submit" disabled={loading}>
              Generate Crossword <IconInline><RxArrowRight size={18} /></IconInline>
            </SubmitButton>
          </Form>
        </FormContainer>
        {cluesAndWords.map((item, index) => (
          <li key={index}>
            <strong>Word:</strong> {item.answer} <br />
            <strong>Clue:</strong> {item.clue}
          </li>
        ))}
      </Container>
    </>
  );
};

export default GeneratePage;
