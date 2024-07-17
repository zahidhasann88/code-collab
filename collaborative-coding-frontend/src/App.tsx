import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/Auth/PrivateRoute';
import CodeEditor from './components/CodeEditor';
import FileManager from './components/Files/FileManager';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/files" element={<PrivateRoute component={FileManager} />} />
          <Route path="/" element={<PrivateRoute component={CodeEditor} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;