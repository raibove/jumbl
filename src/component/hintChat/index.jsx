import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { RxPaperPlane } from 'react-icons/rx';
import { BACKEND_URL } from '../../utils';

const HintBox = styled.div`
  background-color: #ecc94b;
  border: 4px solid black;
  padding: 1rem;
  transform: ${props => props.rotate};
  box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
`;

const HintTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  transform: rotate(1deg);
`;

const HintForm = styled.form`
  display: flex;
  margin-bottom: 1rem;
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

  &:hover:not(:disabled) {
    background-color: white;
    color: black;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ChatArea = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
  background-color: rgba(255, 255, 255, 0.5);
  border: 2px solid black;
  padding: 0.5rem;
`;

const Message = styled.div`
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const UserMessage = styled(Message)`
  text-align: right;
  color: #1a202c;
`;

const BotMessage = styled(Message)`
  text-align: left;
  color: #2d3748;
`;

const HintCount = styled.div`
  font-size: 0.875rem;
  font-style: italic;
  margin-top: 0.5rem;
  color: ${props => props.color? props.color : 'black'};
`;

const HintChat = ({ id, currentClue, crosswordData }) => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hintCount, setHintCount] = useState(0);
    const chatAreaRef = useRef(null);
    const [dir, setDir] = useState(null);
    const [num, setNum] = useState(1);

    //   useEffect(() => {
    //     const storedHintCount = localStorage.getItem(`hint/${id}`);
    //     if (storedHintCount) {
    //       setHintCount(parseInt(storedHintCount, 10));
    //     }
    //   }, [id]);

    useEffect(() => {
        if (currentClue) {
            const regex = /([a-zA-Z]+)(\d+)/;
            const match = currentClue.match(regex);
            if (match) {
                const currentDir = match[1];
                const currentNum = parseInt(match[2], 10);
                if(currentDir, currentNum, crosswordData[currentDir][currentNum]){
                    setDir(currentDir);
                    setNum(currentNum);
                }
            }
        }
    }, [currentClue])

    //   useEffect(() => {
    //     if (chatAreaRef.current) {
    //       chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    //     }
    //   }, [chat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (message.trim() === '' || loading || hintCount >= 3 || !dir) return;

        const newUserMessage = { type: 'user', content: message };
        setChat(prevChat => [...prevChat, newUserMessage]);
        setMessage('');
        setLoading(true);
        const correctClue = crosswordData[dir][num];
        try {
            const inputData = {
                type: 'crossword-hint',
                inputWord: correctClue.answer,
                inputQuestion: message
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
              if(!resp.ok){
                throw new Error('error load hint')
              }
              const txt = await resp.text();

            const botResponse = { type: 'bot', content: txt };
            setChat(prevChat => [...prevChat, botResponse]);
            const newHintCount = hintCount + 1;
            setHintCount(newHintCount);
            //   localStorage.setItem(`hint/${id}`, newHintCount.toString());
        } catch (error) {
            console.error('Error fetching hint:', error);
            setChat(prevChat => [...prevChat, { type: 'bot', content: 'Sorry, I couldn\'t get a hint at the moment. Please try with different input.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <HintBox>
            <HintTitle>Need a Hint?</HintTitle>
            {chat.length!==0 && <ChatArea ref={chatAreaRef}>
                {chat.map((msg, index) => (
                    msg.type === 'user' ? (
                        <UserMessage key={index}>{msg.content}</UserMessage>
                    ) : (
                        <BotMessage key={index}>{msg.content}</BotMessage>
                    )
                ))}
            </ChatArea>}
            <HintForm onSubmit={handleSubmit}>
                <HintInput
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask for help..."
                    disabled={loading || hintCount >= 3}
                />
                <HintButton type="submit" disabled={loading || hintCount >= 3}>
                    <RxPaperPlane size={24} />
                </HintButton>
            </HintForm>
           {dir ? <HintCount>Selected cell: {dir} {num}</HintCount> : <HintCount color='red'>Select cell to get hint</HintCount>}

            <HintCount>
                You can use only 3 hints for each game.
                Hints used: {hintCount}/3
                {hintCount >= 3 &&  <HintCount color='red'>Max hints reached</HintCount>}
            </HintCount>
            <br/>
            <HintCount><b>Note: Hint feature sometime may be wrong as I am still experimenting with it.</b></HintCount>
        </HintBox>
    );
};

export default HintChat;