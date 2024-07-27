import React from 'react';
import styled from 'styled-components';
import { RxArrowRight } from 'react-icons/rx'
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  height: 100vh;
  background-color: #fde047;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Courier New', Courier, monospace;
  padding: 2rem;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  color: black;
  margin-bottom: 1rem;
  text-align: center;
  transform: rotate(-2deg);
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 3rem;
  text-align: center;
  max-width: 600px;
`;

const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 4px solid black;
  box-shadow: 4px 4px 0px 0px rgba(160,160,160,1);

  &:hover {
    background-color: white;
    color: black;
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0px 0px rgba(0,0,0,1);
  }
`;

const Home = () => {
    const navigate = useNavigate();
  return (
    <PageContainer>
      <Title>Welcome to Jumbl</Title>
      <Subtitle>
        The most fun and challenging crossword puzzle game you'll ever play!
        Are you ready to jumble your brain?
      </Subtitle>
      <Button onClick={()=>{navigate('/crossword/generate')}}>
        Start Playing <RxArrowRight size={24} style={{marginLeft: '0.5rem', verticalAlign: 'middle'}} />
      </Button>
    </PageContainer>
  );
};

export default Home;