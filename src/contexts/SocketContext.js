import React, { createContext, useContext, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const socket = io("http://127.0.0.1:8001", {
  transports: ["websocket"],
  upgrade: false,
  reconnectionAttempts: 5,
  timeout: 5000,
});
// const socket = io(`${process.env.REACT_APP_SOCKET_ENDPOINT}`, {
//   transports: ["websocket"],
//   secure: true,
//   reconnectionAttempts: 5,
//   timeout: 5000,
//   // path: "/",
// });

export const SocketProvider = ({ children }) => {
    useEffect(() => {
      socket.on("connect", () => console.log("✅ Connected to socket server!", socket.id));
      socket.on("connect_error", (err) => console.error("❌ Socket connection error:", err.message));
      socket.on("disconnect", () => console.log("❌ Disconnected from socket server"));
  
      return () => {
        socket.disconnect();
      };
    }, []);
  
    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
  };
