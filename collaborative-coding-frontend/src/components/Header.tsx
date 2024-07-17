import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <nav className="header">
      <ul>
        <li><Link to="/">Code Editor</Link></li>
        <li><Link to="/files">File Manager</Link></li>
        <li><button onClick={onLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Header;