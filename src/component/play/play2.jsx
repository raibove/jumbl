import React, { useState, useEffect } from 'react';
import { RxArrowLeft, RxPaperPlane, RxTarget, RxTimer } from 'react-icons/rx';
import styled, { css } from 'styled-components';
import { BACKEND_URL } from '../../utils';
import { useParams } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #fde047;
  padding: 1rem;
  font-family: monospace;
`;

const GameContainer = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  background-color: white;
  border: 8px solid black;
  box-shadow: 12px 12px 0px 0px rgba(0,0,0,1);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  transform: rotate(-2deg);
  background-color: black;
  color: white;
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
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  border: 4px solid black;
  transform: rotate(2deg);
  box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
`;

const ScoreDisplay = styled(TimerDisplay)`
  background-color: #4ade80;
  color: black;
  transform: rotate(-2deg);
`;

const ExitButton = styled.button`
  background-color: #a855f7;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  border: 4px solid black;
  transition: all 0.2s;
  box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);

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

const CrosswordGrid = styled.div`
  border: 8px solid black;
  padding: 1rem;
  background-color: #f3f4f6;
  box-shadow: 12px 12px 0px 0px rgba(0,0,0,1);
`;

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
  @media (min-width: 768px) {
    width: 33.333333%;
  }
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ClueBox = styled.div`
  background-color: ${props => props.bgColor};
  border: 4px solid black;
  padding: 1rem;
  transform: ${props => props.rotate};
  box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
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

const PlayCrossword2 = () => {
  const [currentClue, setCurrentClue] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [activeCell, setActiveCell] = useState({ row: -1, col: -1 });
  const {id} = useParams();

  // Mock crossword data
  const crosswordData = {
    size: 10,
    across: [
      { number: 1, clue: "Jumbl's specialty (9 letters)" },
      { number: 4, clue: "Puzzle type (9 letters)" },
    ],
    down: [
      { number: 1, clue: "What you're solving right now (9 letters)" },
      { number: 2, clue: "Mental exercise (5 letters)" },
    ]
  };

  const renderGrid = () => {
    return Array(crosswordData.size).fill().map((_, rowIndex) => (
      <GridRow key={rowIndex}>
        {Array(crosswordData.size).fill().map((_, colIndex) => (
          <GridCell
            key={`${rowIndex}-${colIndex}`}
            type="text"
            maxLength="1"
            isActive={activeCell.row === rowIndex && activeCell.col === colIndex}
            isActiveRow={activeCell.row === rowIndex}
            onChange={() => setScore(prevScore => prevScore + 10)}
            onFocus={() => setActiveCell({ row: rowIndex, col: colIndex })}
          />
        ))}
      </GridRow>
    ));
  };

  const getCrossword = async ()=>{
    const response = await fetch(`${BACKEND_URL}/${id}`);
    const data = await response.json();
    console.log(data);
  }
  useEffect(()=>{
    getCrossword();
  }, [])
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <PageContainer>
      <GameContainer>
        <Header>
          <Title>Jumbl Crossword</Title>
          <HeaderControls>
            <TimerDisplay>
              <RxTimer size={28} style={{marginRight: '0.5rem'}} />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </TimerDisplay>
            <ScoreDisplay>
              <RxTarget size={28} style={{marginRight: '0.5rem'}} />
              Score: {score}
            </ScoreDisplay>
            <ExitButton>
              <RxArrowLeft size={24} style={{display: 'inline', marginRight: '0.5rem'}} /> Exit
            </ExitButton>
          </HeaderControls>
        </Header>

        <GameContent>
          <MainGameArea>
            <CurrentClueBox>
              <ClueTitle>Current Clue</ClueTitle>
              <ClueText>{currentClue || "Select a cell to see the clue"}</ClueText>
            </CurrentClueBox>
            <CrosswordGrid>
              {renderGrid()}
            </CrosswordGrid>
          </MainGameArea>

          <SidebarArea>
            <ClueBox bgColor="#86efac" rotate="rotate(-2deg)">
              <ClueTitle>Across</ClueTitle>
              <ClueList>
                {crosswordData.across.map(clue => (
                  <ClueItem key={clue.number}>
                    <strong>{clue.number}.</strong> {clue.clue}
                  </ClueItem>
                ))}
              </ClueList>
            </ClueBox>

            <ClueBox bgColor="#fda4af" rotate="rotate(2deg)">
              <ClueTitle>Down</ClueTitle>
              <ClueList>
                {crosswordData.down.map(clue => (
                  <ClueItem key={clue.number}>
                    <strong>{clue.number}.</strong> {clue.clue}
                  </ClueItem>
                ))}
              </ClueList>
            </ClueBox>

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
            </HintBox>
          </SidebarArea>
        </GameContent>
      </GameContainer>
    </PageContainer>
  );
};

export default PlayCrossword2;