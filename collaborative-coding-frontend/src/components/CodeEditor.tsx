import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import socket from '../utils/socket';

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState('');
  const editorRef = useRef<EditorView | null>(null);

  useEffect(() => {
    socket.on('code change', (newCode: string) => {
      setCode(newCode);
    });
    return () => {
      socket.off('code change');
    };
  }, []);

  const handleCodeChange = (value: string) => {
    setCode(value);
    socket.emit('code change', value);
  };

  return (
    <div className="code-editor">
    <CodeMirror
      value={code}
      extensions={[javascript()]}
      theme="dark"
      onChange={handleCodeChange}
      onCreateEditor={(view) => {
        editorRef.current = view;
      }}
    />
  </div>
  );
};

export default CodeEditor;