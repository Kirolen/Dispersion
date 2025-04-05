import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import makeToast from '../Toaster/Toaster';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setUserId, setRole } from '../store/reducers/userSlice';


const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;
    else {
      if (authToken) {
        try {
          const decodedTokenData = jwtDecode(authToken);
          dispatch(setUserId(decodedTokenData.id || ''));
          dispatch(setRole(decodedTokenData.role || ''));
          console.log("UserID: " + decodedTokenData.id);
        } catch (error) {
          console.error('Error decoding authToken:', error);
        }
      }
    }

    const newSocket = io("http://localhost:5000", {
      query: { token: authToken },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 2,
      reconnectionDelay: 2000
    });

    newSocket.on("connect", () => makeToast("success", "Socket Connected"));
    newSocket.on("disconnect", (reason) => {
      makeToast("error", `Socket Disconnected: ${reason}`);
      console.warn("🔴 Disconnected from server:", reason);
    });
    newSocket.on("connect_error", (err) => {
      console.error("⚠️ WebSocket connection error:", err);
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    if (!socket) {
      setupSocket();
    }

    return () => {
      if (socket) {
        socket.off("newGlobalNotification");
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{
      socket, setupSocket
    }}>
      {children}
    </SocketContext.Provider>
  );
};
