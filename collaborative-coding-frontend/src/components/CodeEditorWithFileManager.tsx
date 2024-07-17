import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import axios from 'axios';
import socket from '../utils/socket';

const CodeEditorWithFileManager: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [filename, setFilename] = useState('');
  const [message, setMessage] = useState('');
  const [code, setCode] = useState('');
  const [currentFile, setCurrentFile] = useState('');

  useEffect(() => {
    fetchFiles();
    socket.on('code change', (newCode: string) => {
      setCode(newCode);
    });
    return () => {
      socket.off('code change');
    };
  }, []);

  const fetchFiles = async () => {
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
    socket.emit('code change', value);
  };

  return (
    <div className="code-editor-with-file-manager">
      <div className="file-manager">
        <h2>File Manager</h2>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Filename"
        />
        <button onClick={handleCreateFile}>Create File</button>
        <p>{message}</p>
        <ul>
          {files.map((file) => (
            <li key={file}>
              <span onClick={() => handleFileSelect(file)}>{file}</span>
              <button onClick={() => handleDeleteFile(file)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="code-editor">
        <h2>Code Editor {currentFile && `- ${currentFile}`}</h2>
        <CodeMirror
          value={code}
          extensions={[javascript()]}
          theme="dark"
          onChange={handleCodeChange}
        />
      </div>
    </div>
  );
};

export default CodeEditorWithFileManager;