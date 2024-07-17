import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [filename, setFilename] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFiles();
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
      setMessage('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file', error);
      setMessage('Failed to delete file');
    }
  };

  return (
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
            {file}
            <button onClick={() => handleDeleteFile(file)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileManager;
