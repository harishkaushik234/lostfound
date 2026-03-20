import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

export const useSocket = () => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const instance = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token }
    });

    setSocket(instance);

    return () => {
      instance.disconnect();
    };
  }, [token]);

  return socket;
};
