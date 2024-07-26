import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as clg from 'crossword-layout-generator';
import {
  PageContainer,
  Form,
  ContentContainer,
  FormGroup,
  Title,
  Subtitle,
  Label,
  Input,
  Select,
  Button,
} from './styled';
import { v4 as uuidv4 } from 'uuid';
import { BACKEND_URL, convertToRequiedFormat } from '../../utils';
// import Crossword from '@jaredreisinger/react-crossword'

const cleanAndParseInputString = (cluesString) => {
  try {
    let fixedInput = cluesString
      .replace(/,\s*([\]}])/g, '$1')
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
      .replace(/'/g, '"');
    let result = JSON.parse(fixedInput);
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const GenerateCrossword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(10);
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const inputData = {
        type: 'words',
        topic,
        numOfWords: wordCount,
        difficultyLevel: difficulty
      }
      const resp = await fetch(BACKEND_URL,
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
      console.log(extractedData)
      if (Object.keys(extractedData).length === 0) {
        console.log('<< Failed to generate crossword, please try with another word.')
        throw new Error('Failed to generate crossword.')
      } else {
        const layout = clg.generateLayout(extractedData);
        console.log(layout.result);
        // convert data to required format and send data to backend
        const convertedFormat = convertToRequiedFormat(layout.result);

        // check if any word is preset in clue/conversion.
        if (Object.keys(convertedFormat.across).length === 0 && Object.keys(convertedFormat.down).length === 0) {
          throw new Error('Failed to get desired layout.')
        }
        console.log(convertedFormat)
        const crossswordId = uuidv4();
        const inputCrosswordData = {
          type: 'crossword-save',
          id: crossswordId,
          crossword: convertedFormat,
          users: [{
            score: 0,
            name: username
          }],
          generatedBy: username
        }
        await fetch(BACKEND_URL,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputCrosswordData)
          }
        );

        navigate(`/crossword/play/${crossswordId}`)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <div style={{ width: '50vw', display: 'flex' }}>
        {/* <Crossword data={pp} useStorage={false}  theme={{ allowNonSquare: true, gridBackground: 'transparent' }}/> */}
      </div>
      <PageContainer>
        <ContentContainer>
          <Title>Jumbl</Title>
          <Subtitle>Create your crossword puzzle in seconds!</Subtitle>

          <Form onSubmit={handleSubmit}>
            <FormGroup $rotate>
              <Label htmlFor="topic">
                Topic
              </Label>
              <Input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                $ringColor="#4ade80"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="wordCount">
                Max Number of Words
              </Label>
              <Input
                type="number"
                id="wordCount"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                min="5"
                max="30"
                $ringColor="#f87171"
                required
              />
            </FormGroup>

            <FormGroup $rotate>
              <Label htmlFor="difficulty">
                Difficulty
              </Label>
              <Select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                $ringColor="#c084fc"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Difficult</option>
              </Select>
            </FormGroup>

            <Button type="submit" disabled={loading}>
              {loading ? <span>Loading...</span> : <span>Generate Crossword</span>}
            </Button>
          </Form>
        </ContentContainer>
      </PageContainer>
    </>
  );
};

export default GenerateCrossword;
