import React, { useState, useEffect, useCallback } from 'react';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { EditorView } from '@codemirror/view';
import axios from 'axios';
import socket from '../utils/socket';

const CodeEditorWithFileManager: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [filename, setFilename] = useState('');
  const [message, setMessage] = useState('');
  const [code, setCode] = useState('');
  const [currentFile, setCurrentFile] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [searchTerm, setSearchTerm] = useState('');
  const [cursors, setCursors] = useState<{[key: string]: number}>({});
  const [versions, setVersions] = useState<string[]>([]);

  const getLanguageExtension = useCallback((lang: string) => {
    switch (lang) {
      case 'javascript': return javascript();
      case 'python': return python();
      case 'cpp': return cpp();
      case 'java': return java();
      default: return javascript();
    }
  }, []);

  const fetchFiles = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/files', {
        headers: {
          'x-access-token': localStorage.getItem('token') || ''
        }
      });
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files', error);
      setMessage('Failed to fetch files');
    }
  }, []);

  useEffect(() => {
    fetchFiles();
    
    socket.on('code change', (data: { filename: string, code: string }) => {
      if (data.filename === currentFile) {
        setCode(data.code);
      }
    });

    socket.on('cursor move', (data: { username: string, position: number }) => {
      setCursors(prev => ({ ...prev, [data.username]: data.position }));
    });

    return () => {
      socket.off('code change');
      socket.off('cursor move');
    };
  }, [currentFile, fetchFiles]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleCursorActivity = (update: ViewUpdate) => {
    if (update.docChanged || update.selectionSet) {
      const view = update.view;
      const position = view.state.selection.main.head;
      socket.emit('cursor move', { username: localStorage.getItem('username'), position });
    }
  };

  const handleCreateFile = async () => {
    try {
      await axios.post('http://localhost:3001/files', { filename }, {
        headers: {
          'x-access-token': localStorage.getItem('token') || ''
        }
      });
      fetchFiles();
      setFilename('');
      setMessage('File created successfully');
    } catch (error) {
      console.error('Error creating file', error);
      setMessage('Failed to create file');
    }
  };

  const handleDeleteFile = async (fileToDelete: string) => {
    try {
      await axios.delete('http://localhost:3001/files', {
        headers: {
          'x-access-token': localStorage.getItem('token') || ''
        },
        data: { filename: fileToDelete }
      });
      fetchFiles();
      if (currentFile === fileToDelete) {
        setCurrentFile('');
        setCode('');
      }
      setMessage('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file', error);
      setMessage('Failed to delete file');
    }
  };

  const handleSaveVersion = async () => {
    try {
      await axios.post('http://localhost:3001/files/version', 
        { filename: currentFile, content: code },
        { headers: { 'x-access-token': localStorage.getItem('token') || '' } }
      );
      setMessage('File version saved successfully');
      fetchVersions();
    } catch (error) {
      console.error('Error saving file version', error);
      setMessage('Failed to save file version');
    }
  };

  const fetchVersions = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/files/${currentFile}/versions`, {
        headers: { 'x-access-token': localStorage.getItem('token') || '' }
      });
      setVersions(response.data);
    } catch (error) {
      console.error('Error fetching file versions', error);
    }
  };

  const handleFileSelect = async (file: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/files/${file}`, {
        headers: {
          'x-access-token': localStorage.getItem('token') || ''
        }
      });
      setCurrentFile(file);
      setCode(response.data.content);
    } catch (error) {
      console.error('Error fetching file content', error);
      setMessage('Failed to fetch file content');
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    socket.emit('code change', { filename: currentFile, code: value });
  };

  const handleSaveFile = async () => {
    try {
      await axios.post('http://localhost:3001/files/save', { filename: currentFile, content: code }, {
        headers: {
          'x-access-token': localStorage.getItem('token') || ''
        }
      });
      setMessage('File saved successfully');
    } catch (error) {
      console.error('Error saving file', error);
      setMessage('Failed to save file');
    }
  };

  const filteredFiles = files.filter(file => 
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="code-editor-with-file-manager">
      <div className="file-manager">
        <h2>File Manager</h2>
        <div className="version-history">
          <h3>Version History</h3>
          <button onClick={handleSaveVersion}>Save Version</button>
          <ul>
            {versions.map(version => (
              <li key={version}>{version}</li>
            ))}
          </ul>
        </div>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Filename"
        />
        <button onClick={handleCreateFile}>Create File</button>
        <button onClick={handleSaveFile}>Save</button>
        <p>{message}</p>
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <ul>
          {filteredFiles.map((file) => (
            <li key={file}>
              <span onClick={() => handleFileSelect(file)}>{file}</span>
              <button onClick={() => handleDeleteFile(file)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="code-editor">
        <h2>Code Editor {currentFile && `- ${currentFile}`}</h2>
        <select value={language} onChange={handleLanguageChange} title='Select'>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <CodeMirror
            value={code}
            extensions={[getLanguageExtension(language)]}
            theme="dark"
            onChange={handleCodeChange}
            onUpdate={handleCursorActivity}
            className="codemirror-wrapper"
            />
      </div>
    </div>
  );
};

export default CodeEditorWithFileManager;