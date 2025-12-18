import { useEffect } from "react";
import { socket } from "../socket";

export const useSocket = (userId?: string) => {
  useEffect(() => {
    if (!userId) return;

    socket.connect();
    socket.emit("join", userId);
    return () => {
      socket.disconnect();
    };
  }, [userId]);
};
