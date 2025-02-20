import { useEffect, useRef, useState } from "react";

/**
 * WebSocketVideoStream Component
 * 
 * Connects to the WebSocket server to receive a live stream of JPEG images
 * and displays them in an <img> tag. Automatically reconnects if the connection
 * is lost.
 *
 * @param {string} cameraId - Unique identifier for the camera stream.
 */
const WebSocketVideoStream = ({ cameraId }) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const imgRef = useRef(null);
  const wsRef = useRef(null);
  const previousUrlRef = useRef(null); // Stores previous Blob URL to free memory

  useEffect(() => {
    let reconnectInterval;

    /**
     * Establish the WebSocket connection and set up event handlers.
     */
    const connectWebSocket = () => {
      const ws = new WebSocket(`ws://localhost:8000/ws/${cameraId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setConnected(true);
        setError(null);
        if (reconnectInterval) clearInterval(reconnectInterval);
      };

      ws.onmessage = (event) => {
        // Create a blob from the incoming data and generate an object URL
        const blob = new Blob([event.data], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);

        // Revoke the previous URL to avoid memory leaks
        if (previousUrlRef.current) {
          URL.revokeObjectURL(previousUrlRef.current);
        }
        previousUrlRef.current = url;

        if (imgRef.current) {
          imgRef.current.src = url;
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("WebSocket connection error");
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setConnected(false);
        // Attempt to reconnect every 3 seconds
        reconnectInterval = setInterval(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    // Cleanup: close connection and revoke URL on unmount
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectInterval) clearInterval(reconnectInterval);
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, [cameraId]);

  return (
    <div style={{ textAlign: "center" }}>
      {connected ? (
        <p className="text-green-400 mb-2">Status: Connected</p>
      ) : (
        <p className="text-red-400 mb-2">Status: {error || "Disconnected"}</p>
      )}
      <img
        ref={imgRef}
        alt="Live video stream"
        style={{ width: "80%", border: "1px solid black", borderRadius: "8px" }}
      />
    </div>
  );
};

export default WebSocketVideoStream;
