// StyledComponents.js
import styled from 'styled-components';
export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #fde047;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  font-family: monospace;
  box-sizing: border-box;
`;

export const ContentContainer = styled.div`
  background-color: white;
  border: 4px solid black;
  box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
  padding: 2rem;
  max-width: 42rem;
`;

export const Title = styled.h1`
  font-size: 3.75rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: black;
  transform: rotate(-2deg);
  margin: 1rem;
`;

export const Subtitle = styled.p`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  margin-top: 1rem;
  transform: rotate(1deg);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const FormGroup = styled.div`
  transform: ${props => props.$rotate ? 'rotate(1deg)' : 'rotate(-1deg)'};
`;

export const Label = styled.label`
  display: block;
  font-size: 1.25rem;
  font-weight: bold;
  color: black;
  margin-bottom: 0.5rem;
`;


export const SubLabel = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 400;
  color: black;
  margin-top: 0.3rem;

  span {
    cursor: pointer;
    color: green;
    font-weight: 600;
  }
`;

export const Input = styled.input`
  cursor: pointer;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 4px solid black;
  font-size: 1.25rem;
  box-sizing: border-box;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px ${props => props.$ringColor || '#60a5fa'};
  }
`;

export const Select = styled(Input).attrs({ as: 'select' })`
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='black' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.5em;
`;

export const Button = styled.button`
  width: 100%;
  background-color: black;
  color: white;
  font-size: 1.5rem;
  padding: 1rem 1.5rem;
  border: 4px solid black;
  transform: rotate(1deg);
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    background-color: white;
    color: black;
    transform: rotate(-1deg);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px #60a5fa;
  }

  &:disabled {
    cursor: not-allowed;
    pointer-events: all !important;
  }
`;
