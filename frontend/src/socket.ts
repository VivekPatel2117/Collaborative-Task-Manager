import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
  upgrade: false, 
  reconnection: true,
  reconnectionAttempts: 10,
  withCredentials: true,
});
