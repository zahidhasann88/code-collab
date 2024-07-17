import React from 'react';
import { Link } from 'react-router-dom';
interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <nav className="header">
      <ul>
        <li><Link to="/">CodeCollab</Link></li>
      </ul>
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
};

export default Header;
