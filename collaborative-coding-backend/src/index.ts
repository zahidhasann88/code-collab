import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { setupSocket } from './socket';
import { registerUser, authenticateUser } from './auth/auth';
import { authMiddleware } from './auth/middleware';
import { listFiles, createFile, deleteFile } from './files/fileController';

const baseDir = path.join(__dirname, '../files');
if (!fs.existsSync(baseDir)) {
  console.log('Creating files directory:', baseDir);
  fs.mkdirSync(baseDir, { recursive: true });
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: ["GET", "POST"]
  }
});

// Updated CORS middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3002"]
}));
app.use(express.json());

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  registerUser(username, password);
  res.send({ message: 'User registered successfully.' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await authenticateUser(username, password);
    if (token) {
      res.send({ token });
    } else {
      res.status(401).send({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.use(authMiddleware);

app.get('/', (req, res) => {
  res.send('Collaborative Coding Environment Backend');
});

app.get('/files', listFiles);
app.post('/files', createFile);
app.delete('/files', deleteFile);

setupSocket(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});