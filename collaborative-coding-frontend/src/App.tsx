import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/Auth/PrivateRoute';
import CodeEditor from './components/CodeEditor';
import FileManager from './components/Files/FileManager';
import Header from './components/Header';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Header onLogout={handleLogout} />}
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/files" 
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <FileManager />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <CodeEditor />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;