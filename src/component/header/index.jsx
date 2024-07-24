import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  width: 100%;
  background-color: #f7fafc;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
`;

const HeaderTitle = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
  text-decoration: none;

  &:hover {
    color: #f6e05e;
  }
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderContainer>
        <HeaderTitle to="/">Jumbl</HeaderTitle>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;
