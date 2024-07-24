import React, { useState } from 'react';
import { RxAvatar, RxArrowRight } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import Header from '../header';
import { Container, FormContainer, Subtitle, Form, FormGroup, FormLabel, FormInput, SubmitButton, IconInline } from '../../common-styled';

const UsernamePage = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('jumbl/username', username);
    navigate('/generate', { state: { username } });
  };

  return (
    <>
      <Header />
      <Container>
        <FormContainer>
          <Subtitle>Enter your username to start creating your crossword puzzle!</Subtitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="username">
                <RxAvatar size={18} className="icon" />
                Username
              </FormLabel>
              <FormInput
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormGroup>
            <SubmitButton type="submit">
              Next <IconInline><RxArrowRight size={18} /></IconInline>
            </SubmitButton>
          </Form>
        </FormContainer>
      </Container>
    </>
  );
};

export default UsernamePage;
