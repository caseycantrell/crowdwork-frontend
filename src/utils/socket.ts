import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// creates a singleton socket instance to share across page navigation
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || '', {
      withCredentials: true,
    });
  }
  return socket;
};