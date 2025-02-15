import React, { useState, useEffect, useRef } from 'react';
import { RxArrowLeft, RxTarget, RxTimer, RxPaperPlane } from 'react-icons/rx';
import styled from 'styled-components';
import { BACKEND_URL, backupCrosswordIds } from '../../utils';
import { useNavigate, useParams } from 'react-router-dom';
import { CrosswordProvider, CrosswordGrid, DirectionClues } from '@jaredreisinger/react-crossword'
import Modal from '../modal';
import useSound from 'use-sound';
import crowdCheer from '../../assets/cheer.mp3'
import Confetti from 'react-confetti'
import HintChat from '../hintChat';

const PageContainer = styled.div`
  min-height: 100vh;
  font-family: monospace;
  background-color: aliceblue;
`;

const GameContainer = styled.div`
  padding: 2rem;
  padding-top:0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  transform: rotate(-2deg);
  background-color: black;
  color: white;
  margin: 2rem 1rem;
  padding: 0.5rem 1rem;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TimerDisplay = styled.div`
  background-color: #ef4444;
  color: white;
  padding: 0.3rem;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  border: 2px solid black;
  transform: rotate(2deg);
`;

const ScoreDisplay = styled(TimerDisplay)`
  background-color: #4ade80;
  color: black;
  transform: rotate(-2deg);
`;

const ExitButton = styled.button`
  cursor: pointer;
  background-color: #a855f7;
  color: white;
  padding: 0.4rem;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  border: 2px solid black;
  transition: all 0.2s;

  &:hover {
    background-color: white;
    color: #a855f7;
    transform: scale(1.05);
  }
`;

const GameContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const GameHintContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;


const MainGameArea = styled.div`
  @media (min-width: 768px) {
    width: 60vw;
  }
`;

const SidebarArea = styled.div`
    @media (min-width: 768px) {
      width: 30vw;
    }

    display: flex;
    flex-direction: column;
    gap: 2rem;

    .direction {
      background-color: #faa8d6;
      border: 2px solid black;
      padding: 1rem;
      transform: rotate(2deg);
      box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
    }

    .down {
      background-color: #d5b1fd;
      transform: rotate(-2deg);
    }

    .header{
      margin: 0.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      transform: rotate(1deg);
    }

    .clue{
      cursor: pointer;
      list-style-type: none;
      padding: 0;
      margin: 0;
      font-size: 1rem;
      font-family: math;
      line-height: 1.5rem;

      -webkit-user-select: none; /* Safari */
      -ms-user-select: none; /* IE 10 and IE 11 */
      user-select: none;
    }

    .correct {
      text-decoration: line-through;
    }
`;

const ErrorCon = styled.div`
  width: 100vw;
  height: 100vh;
  text-align: center;
  top: 40vh;
  position: fixed;
  font-size: 1.3rem;

  span {
    text-decoration: underline dotted;
    text-decoration-color: black;
    cursor: pointer;
  }

  span:hover {
    text-decoration: underline solid;
  }
`;

const HintBox = styled.div`
  background-color: #ecc94b;
  border: 4px solid black;
  padding: 1rem;
  transform: ${props => props.rotate};
  box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
`;

const HintForm = styled.div`
  display: flex;
`;

const HintInput = styled.input`
  flex-grow: 1;
  padding: 0.5rem 1rem;
  border: 4px solid black;
  font-size: 1.25rem;

  &:focus {
    outline: none;
    border-color: #a855f7;
  }
`;

const HintButton = styled.button`
  background-color: black;
  color: white;
  padding: 0.5rem 1.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  border: 4px solid black;
  transition: all 0.2s;

  &:hover {
    background-color: white;
    color: black;
    transform: scale(1.05);
  }
`;

export const HintTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  transform: rotate(1deg);
`;

function convertAnswersToUpperCase(crossword) {
  for (let direction in crossword) {
    for (let key in crossword[direction]) {
      crossword[direction][key].answer = crossword[direction][key].answer.toUpperCase();
    }
  }
  return crossword;
}

const PlayCrossword = () => {
  const crosswordProvider = useRef(null);

  const [timeSpent, setTimeSpent] = useState(0);
  const [crosswordData, setCrosswordData] = useState(null);
  const [solvedWords, setSolvedWords] = useState(new Set());
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gameComplete, setGameComplete] = useState(false);
  const [onExit, setOnExit] = useState(false);
  const [currentClue, setCurrentClue] = useState(null);
  const [playCheer] = useSound(crowdCheer);

  const navigate = useNavigate();

  const { id } = useParams();

  const navigateToRandomCrossword = () => {
    const randomIndex = Math.floor(Math.random() * backupCrosswordIds.length);
    navigate(`/crossword/play/${backupCrosswordIds[randomIndex]}`, { replace: true })
    window.location.reload();
  }

  const getCrossword = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/${id}`);
      const data = await response.json();
      let crossword = data.crossword;
      crossword = convertAnswersToUpperCase(crossword)
      setCrosswordData(crossword);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCrossword();
  }, [])

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prevTime) => (prevTime + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!crosswordData) return;
    const totalWords = Object.keys(crosswordData.across).length + Object.keys(crosswordData.down).length
    if (solvedWords.size === totalWords && solvedWords.size !== 0) {
      playCheer();
      setGameComplete(true);
    }
  }, [solvedWords])

  if (loading) {
    return <PageContainer><div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', height: '100vh'}}>Loading...</div></PageContainer>
  }

  return (
    <PageContainer>
      {
        error ?
          <ErrorCon>Failed to load crossword. <br /> Try playing a <span onClick={navigateToRandomCrossword}> Random crossword</span> or <span onClick={() => { navigate('/crossword/generate') }}>generate a new one</span>?</ErrorCon>
          :
          (
            <GameContainer>
              <Header>
                <Title>Jumbl Crossword</Title>
                <HeaderControls>
                  <TimerDisplay>
                    <RxTimer size={28} style={{ marginRight: '0.5rem' }} />
                    {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                  </TimerDisplay>
                  <ScoreDisplay>
                    <RxTarget size={28} style={{ marginRight: '0.5rem' }} />
                    Score: {solvedWords.size}
                  </ScoreDisplay>
                  <ExitButton onClick={() => setOnExit(true)}>
                    <RxArrowLeft size={24} style={{ display: 'inline', marginRight: '0.5rem' }} /> Exit
                  </ExitButton>
                </HeaderControls>
              </Header>

              <GameHintContent>
              <GameContent>

                <CrosswordProvider
                  ref={crosswordProvider}
                  data={crosswordData}
                  theme={{ allowNonSquare: true, gridBackground: 'transparent' }}
                  onAnswerCorrect={(direction, number, answer) => {
                    setSolvedWords(prevSolvedWords => {
                      prevSolvedWords.add(direction + number);
                      return new Set(prevSolvedWords);
                    })
                  }}
                  onAnswerIncorrect={(direction, number, answer) => {
                    // console.log('<< answer inc', direction, number, answer);
                  }}
                  onAnswerComplete={(direction, number, correct, answer) => {
                    // console.log('<< answer ds', direction, number, answer, correct);
                  }}
                  useStorage={true}
                  storageKey={id}
                  onClueSelected={(dir, cell) => {
                    setCurrentClue(dir+cell)
                  }}
                  onInputSelected={(dir, cell) => {
                    setCurrentClue(dir+cell)
                  }}
                >
                  <MainGameArea>
                    <CrosswordGrid />
                  </MainGameArea>
                  <SidebarArea>
                    <DirectionClues direction="across" />
                    <DirectionClues direction="down" />
                  </SidebarArea>
                </CrosswordProvider>
                </GameContent>
                <HintChat id={id} currentClue={currentClue} crosswordData={crosswordData}/>
              </GameHintContent>
              <Modal
                isOpen={gameComplete}
                btn2Click={() => {
                  navigateToRandomCrossword()
                }}
                btn1Click={() => {
                  navigate('/crossword/generate');
                }}
                title="Crossword Complete 🎉"
                text="Congratulations🎉🎉! You've successfully completed the crossword. We hope you enjoyed playing it as much as we enjoyed creating it for you. How about we play again? This time, we have something even more interesting in store for you!😉.
                "
                btnText1="Generate"
                btnText2="Play Random Crossword"
                btn1Outline={true}
              />
              {gameComplete &&
                <Confetti
                  height={window.innerHeight}
                  width={window.innerWidth - 100}
                  confettiSource={{ x: Math.floor(Math.random() * window.innerWidth), y: Math.floor(Math.random() * window.innerHeight), w: window.innerWidth, h: window.innerHeight }}
                  numberOfPieces={3000}
                  initialVelocityY={20}
                  initialVelocityX={10}
                  recycle={false}
                />
              }
              <Modal
                isOpen={onExit}
                btn2Click={() => {
                  setOnExit(false);
                }}
                btn1Click={() => {
                  crosswordProvider.current.fillAllAnswers();
                  setOnExit(false);
                }}
                title="Are you sure?"
                text='If you want to reveal all the answers, click on "Reveal". If you think you need one more chance, click on "Cancel". I suggest choosing the second option!'
                btnText1="Reveal"
                btnText2="Cancel"
                btn1Outline={true}
              />
            </GameContainer>
          )
      }
    </PageContainer>
  );
};

export default PlayCrossword;