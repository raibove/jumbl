import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #edf2f7, #f7fafc);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
`;

export const FormContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 28rem;
  width: 100%;
  margin-top: 4rem; /* To account for the fixed header */
`;

export const Subtitle = styled.p`
  text-align: center;
  color: #4a5568;
  margin-bottom: 2rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FormLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.25rem;
`;

export const FormInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  transition: box-shadow 0.2s;

  &:focus {
    box-shadow: 0 0 0 2px #f6e05e;
  }
`;

export const SubmitButton = styled.button`
  background: #f6e05e;
  color: #2d3748;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s;
  cursor: pointer;
  border: none;
  outline: none;

  &:hover {
    background: #ecc94b;
  }
`;

export const IconInline = styled.div`
  margin-left: 0.5rem;
`;
