import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [events, setEvents] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [error, setError] = useState(null);

  useEffect(() => {
    let socketConnection;

    try {
      socketConnection = io("http://localhost:3001", {
        transports: ["websocket"],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      setSocket(socketConnection);

      // Handle connection events
      const handleError = (err) => {
        console.error("WebSocket error:", err);
        setError("Connection error. Please try again later.");
        setConnectionStatus("disconnected");
      };

      const onAllEvents = (initialEvents) => {
        console.log("Received all events:", initialEvents);
        setEvents(initialEvents);
      };

      const onNewEvent = (newEvent) => {
        console.log("Received new event:", newEvent);
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      };

      const onConnectionStatus = (status) => {
        console.log("Connection status:", status);
        setConnectionStatus(status.status);
      };

      const onConnect = () => {
        console.log("Connected to WebSocket server with ID:", socketConnection.id);
        setConnectionStatus("connected");
        setError(null); // Clear any previous errors
      };

      const onDisconnect = () => {
        console.warn("Disconnected from WebSocket server");
        setConnectionStatus("disconnected");
      };

      // Add event listeners
      socketConnection.on("all_events", onAllEvents);
      socketConnection.on("new_event", onNewEvent);
      socketConnection.on("connection_status", onConnectionStatus);
      socketConnection.on("connect", onConnect);
      socketConnection.on("disconnect", onDisconnect);
      socketConnection.on("error", handleError);

      // Cleanup on unmount
      return () => {
        try {
          console.log("Cleaning up WebSocket connection");
          socketConnection.off("all_events", onAllEvents);
          socketConnection.off("new_event", onNewEvent);
          socketConnection.off("connection_status", onConnectionStatus);
          socketConnection.off("connect", onConnect);
          socketConnection.off("disconnect", onDisconnect);
          socketConnection.off("error", handleError);
          socketConnection.disconnect(); // Safely disconnect
        } catch (cleanupError) {
          console.error("Error during WebSocket cleanup:", cleanupError);
        }
      };
    } catch (initError) {
      console.error("Failed to initialize WebSocket connection:", initError);
      setError("Failed to initialize WebSocket. Please try again later.");
      setConnectionStatus("disconnected");
    }
  }, []);

  return { events, connectionStatus, error };
};

export default useWebSocket;
