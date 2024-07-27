import React, { useState, useEffect } from 'react';
import { RxArrowLeft, RxPaperPlane, RxTarget, RxTimer } from 'react-icons/rx';
import styled from 'styled-components';
import { BACKEND_URL, backupCrosswordIds } from '../../utils';
import { useNavigate, useParams } from 'react-router-dom';
import { CrosswordProvider, CrosswordGrid, DirectionClues } from '@jaredreisinger/react-crossword'

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

const MainGameArea = styled.div`
  @media (min-width: 768px) {
    width: 66.666667%;
  }
`;

const SidebarArea = styled.div`
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
    }

    .correct {
      text-decoration: line-through;
    }
     
  @media (min-width: 768px) {
    width: 33.333333%;
  }
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

function convertAnswersToUpperCase(crossword) {
  for (let direction in crossword) {
    for (let key in crossword[direction]) {
      crossword[direction][key].answer = crossword[direction][key].answer.toUpperCase();
    }
  }
  return crossword;
}

const PlayCrossword = () => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [crosswordData, setCrosswordData] = useState(null);
  const [solvedWords, setSolvedWords] = useState(new Set());
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { id } = useParams();

  const navigateToRandomCrossword = ()=>{
    const randomIndex = Math.floor(Math.random() * backupCrosswordIds.length);
    navigate(`/crossword/play/${backupCrosswordIds[randomIndex]}`, {replace: true})
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

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <PageContainer>
      {
        error ?
          <ErrorCon>Failed to load crossword. <br/> Try playing a <span onClick={navigateToRandomCrossword}> Random crossword</span> or <span onClick={()=>{navigate('/crossword/generate')}}>generate a new one</span>?</ErrorCon>
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
                  <ExitButton>
                    <RxArrowLeft size={24} style={{ display: 'inline', marginRight: '0.5rem' }} /> Exit
                  </ExitButton>
                </HeaderControls>
              </Header>

              <GameContent>

                <CrosswordProvider
                  data={crosswordData}
                  theme={{ allowNonSquare: true, gridBackground: 'transparent' }}
                  onAnswerCorrect={(direction, number, answer) => {
                    setSolvedWords(prevSolvedWords => {
                      prevSolvedWords.add(direction + number);
                      // Return the same Set instance
                      return prevSolvedWords
                      // return new Set(prevSolvedWords);
                    })
                    console.log('<< answer correct', direction, number, answer);
                  }}
                  onAnswerIncorrect={(direction, number, answer) => {
                    console.log('<< answer inc', direction, number, answer);
                  }}
                  onAnswerComplete={(direction, number, correct, answer) => {
                    console.log('<< answer ds', direction, number, answer, correct);

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
            </GameContainer>
          )
      }
    </PageContainer>
  );
};

export default PlayCrossword;