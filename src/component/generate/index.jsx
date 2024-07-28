import React, { useEffect, useState } from 'react';
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
  SubLabel,
  Blink
} from './styled';
import { v4 as uuidv4 } from 'uuid';
import { BACKEND_URL, convertToRequiedFormat, cleanAndParseInputString, backupCrosswordIds, crosswordTopics } from '../../utils';
import Modal from '../modal';
import useSound from 'use-sound';
import buttonPress from '../../assets/waiting.mp3'
import suggestSelect from '../../assets/suggest-select.wav'

const GenerateCrossword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(10);
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [randomTopic, setRandomTopic] = useState('Famous landmarks');


  const [playBtn, {stop: stopBtn}] = useSound(buttonPress);
  const [playSuggest] = useSound(suggestSelect);

  const handleSubmit = async (e) => {
    try {
      playBtn()
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
      if (Object.keys(extractedData).length === 0) {
        console.log('<< Failed to generate crossword, please try with another word.')
        throw new Error('Failed to generate crossword.')
      } else {
        const layout = clg.generateLayout(extractedData);
        // convert data to required format and send data to backend
        const convertedFormat = convertToRequiedFormat(layout.result);

        // check if any word is preset in clue/conversion.
        if (Object.keys(convertedFormat.across).length === 0 && Object.keys(convertedFormat.down).length === 0) {
          throw new Error('Failed to get desired layout.')
        }
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
        stopBtn();
        navigate(`/crossword/play/${crossswordId}`)
      }
    } catch (err) {
      console.log(err)
      stopBtn();
      setShowErrorModal(true);
    } finally {
      setLoading(false)
    }
  };

  const selectRandomTopic = () => {
    playSuggest()
    setTopic(randomTopic);
    updateRandomTopic();
  }

  const updateRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * crosswordTopics.length);
    setRandomTopic(crosswordTopics[randomIndex])
  }

  useEffect(() => {
    updateRandomTopic();
  }, [])

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
              <SubLabel>how about: <span onClick={selectRandomTopic}>{randomTopic}</span></SubLabel>
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
            {loading && <Blink>Your crossword is being generated, till then please enjoy the music.</Blink>}
          </Form>
        </ContentContainer>
      </PageContainer>
      <Modal
        isOpen={showErrorModal}
        btn2Click={() => {
          // get random url
          // navigate to next url
          const randomIndex = Math.floor(Math.random() * backupCrosswordIds.length);
          navigate(`/crossword/play/${backupCrosswordIds[randomIndex]}`)
        }}
        btn1Click={() => {
          setShowErrorModal(false);
          setTopic('');
        }}
        title="Failed to generate crossword"
        text="We faced some issue and failed to generate crossword, click okay to play with random word or please try generating again."
        btnText1="Try Again"
        btnText2="Okay"
      />
    </>
  );
};

export default GenerateCrossword;
