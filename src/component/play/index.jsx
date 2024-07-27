import React, { useState, useEffect } from 'react';
import { RxArrowLeft, RxPaperPlane, RxTarget, RxTimer } from 'react-icons/rx';
import styled, { css } from 'styled-components';
import { BACKEND_URL } from '../../utils';
import { useParams } from 'react-router-dom';
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

const CurrentClueBox = styled.div`
  background-color: #93c5fd;
  border: 4px solid black;
  padding: 1rem;
  margin-bottom: 1rem;
  transform: rotate(-1deg);
  box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
`;

const ClueTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  transform: rotate(1deg);
`;

const ClueText = styled.p`
  font-size: 1.5rem;
`;

// const CrosswordGrid = styled.div`
//   border: 8px solid black;
//   padding: 1rem;
//   background-color: #f3f4f6;
//   box-shadow: 12px 12px 0px 0px rgba(0,0,0,1);
// `;

const GridRow = styled.div`
  display: flex;
`;

const GridCell = styled.input`
  width: 3rem;
  height: 3rem;
  border: 4px solid black;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.2s;

  &:focus {
    outline: none;
  }

  ${props => props.isActive && css`
    background-color: #fde047;
    transform: scale(1.1);
    box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
    z-index: 10;
  `}

  ${props => props.isActiveRow && css`
    background-color: #fef9c3;
  `}

  &:hover {
    background-color: #fef9c3;
  }
`;

const SidebarArea = styled.div`
    .direction {
      background-color: #86efac;
      border: 2px solid black;
      padding: 1rem;
      transform: rotate(2deg);
      box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
    }

    .down {
      background: #fda4af;
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

const ClueBox = styled.div`
  background-color: ${props => props.bgColor};
  border: 2px solid black;
  padding: 1rem;
  transform: ${props => props.rotate};
  box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
`;

const ClueList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  space-y: 0.5rem;
`;

const ClueItem = styled.li`
  font-size: 1.25rem;
`;

const HintBox = styled(ClueBox)`
  background-color: #d8b4fe;
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

const CustomDirectionWrapper = styled.div`
      background: red;

    .direction {
      background: red;
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

  const { id } = useParams();

  const getCrossword = async () => {
    const response = await fetch(`${BACKEND_URL}/${id}`);
    const data = await response.json();
    let crossword = data.crossword;
    crossword = convertAnswersToUpperCase(crossword)
    setCrosswordData(crossword);
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

  if (!crosswordData) {
    return <div>Loading</div>
  }

  return (
    <PageContainer>
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

          {/* <SidebarArea> */}
          {/* <ClueBox bgColor="#86efac" rotate="rotate(-2deg)">
              <ClueTitle>Across</ClueTitle>
              <ClueList>

              </ClueList>
            </ClueBox>

            <ClueBox bgColor="#fda4af" rotate="rotate(2deg)">
              <ClueTitle>Down</ClueTitle>
              <ClueList>

              </ClueList>
            </ClueBox> */}
          {/* 
            <HintBox>
              <ClueTitle style={{transform: 'rotate(-2deg)'}}>Need a Hint?</ClueTitle>
              <HintForm>
                <HintInput
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask for help..."
                />
                <HintButton>
                  <RxPaperPlane size={24} />
                </HintButton>
              </HintForm>
            </HintBox> */}
          {/* </SidebarArea> */}
        </GameContent>
      </GameContainer>
    </PageContainer>
  );
};

export default PlayCrossword;