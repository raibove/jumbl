import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-title">
          Jumbl
        </Link>
      </div>
    </header>
  );
};

export default Header;
