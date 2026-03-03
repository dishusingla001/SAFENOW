import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";

// Mock WebSocket URL - replace with actual backend URL
const SOCKET_URL = "ws://localhost:3001";

export const useWebSocket = (user) => {
  const [connected, setConnected] = useState(false);
  const [requests, setRequests] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // For demo purposes, we'll use a mock connection
    // In production, replace this with actual Socket.io connection

    // Mock connection simulation
    setConnected(true);

    // Simulate receiving mock data for admin
    if (user.role === "admin") {
      const mockRequests = [
        {
          id: "1",
          userId: "9876543210",
          userName: "Priya Sharma",
          type: "Ambulance",
          location: { latitude: 28.6139, longitude: 77.209 },
          timestamp: new Date(Date.now() - 300000).toISOString(),
          status: "pending",
        },
        {
          id: "2",
          userId: "9123456789",
          userName: "Anita Desai",
          type: "Police",
          location: { latitude: 28.7041, longitude: 77.1025 },
          timestamp: new Date(Date.now() - 120000).toISOString(),
          status: "pending",
        },
      ];
      setRequests(mockRequests);
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      setConnected(false);
    };
  }, [user]);

  const sendSOSRequest = useCallback(
    (requestData) => {
      // Mock sending SOS request
      const newRequest = {
        id: Date.now().toString(),
        ...requestData,
        timestamp: new Date().toISOString(),
        status: "pending",
      };

      // In production, emit through socket
      // socketRef.current?.emit('sos-request', newRequest);

      // For demo, add to local state if admin
      if (user?.role === "admin") {
        setRequests((prev) => [newRequest, ...prev]);
      }

      return newRequest;
    },
    [user],
  );

  const updateRequestStatus = useCallback((requestId, status) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status } : req)),
    );

    // In production, emit through socket
    // socketRef.current?.emit('update-request', { requestId, status });
  }, []);

  return {
    connected,
    requests,
    sendSOSRequest,
    updateRequestStatus,
  };
};
