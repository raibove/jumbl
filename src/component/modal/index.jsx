import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #dedede;
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
`;


const ModalTitle = styled.h2`
  color: #4a4a4a;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const ModalText = styled.p`
  color: #6a6a6a;
  margin-bottom: 30px;
  font-size: 1rem;
`;


const Button = styled.button`
  cursor: pointer;
  background-color: ${props => props.btn1Outline ? 'inherit' : props.bgColor};
  color: ${props => props.btn1Outline ? 'black' : 'white'};
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  border: 2px solid black;
  transition: all 0.2s;
  border-radius: 5px;
  &:hover {
    transform: scale(1.05);
  }
`;

const ButtonCon = styled.div`
    display: flex;
    gap: 3rem;
    justify-content: center;
`;

const Modal = ({ isOpen, btn1Click, btn2Click, title, text, btnText1, btnText2, btn1Outline=false }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>{title}</ModalTitle>
        <ModalText>{text}</ModalText>
        <ButtonCon>
        <Button onClick={btn1Click} bgColor="#a855f7" btn1Outline={btn1Outline}>{btnText1}</Button>
        <Button onClick={btn2Click} bgColor="#209313">{btnText2}</Button>
        </ButtonCon>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;