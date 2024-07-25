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
} from './styled'

const cleanAndParseInputString = (cluesString) => {
  try {
    const regex = /\{"([^"]+)",\s*"([^"]+)"\}/g;
    const result = [];
    let match;
    while (match = regex.exec(cluesString)) {
      result.push({
        answer: match[1],
        clue: match[2]
      });
    }
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const GeneratePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(10);
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const inputData = {
      type: 'words',
      topic,
      numOfWords: wordCount,
      difficultyLevel: difficulty
    }
    const resp = await fetch('https://jumbl-api.yikew40375.workers.dev',
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
    if (Object.keys(extractedData).length === 0) {
      console.log('<< Failed to generate crossword, please try with another word.')
    } else {
      const layout = clg.generateLayout(extractedData);
      console.log(layout.result);
      console.log(extractedData.map((d) => d.answer))
    }
    setLoading(false)

  };

  return (
    <>
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
                Number of Words
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

export default GeneratePage;
