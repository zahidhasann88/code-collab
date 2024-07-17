import { Server } from 'socket.io';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('code change', (data) => {
      socket.broadcast.emit('code change', data);
    });

    socket.on('cursor move', (data) => {
      socket.broadcast.emit('cursor move', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
    });

    socket.on('code change', (data: { filename: string, code: string }) => {
      socket.broadcast.emit('code change', data);
    });
  });
};
