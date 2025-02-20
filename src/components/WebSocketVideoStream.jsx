import  { useEffect, useRef, useState } from "react";

/**
 * WebSocketVideoStream Component
 * 
 * Connects to the WebSocket server to receive a live stream of JPEG images
 * and displays them in an <img> tag. Uses an exponential backoff strategy for 
 * reconnection to prevent overwhelming the system. Cleans up Blob URLs to avoid 
 * memory leaks.
 *
 * @param {string} cameraId - Unique identifier for the camera stream.
 */
const WebSocketVideoStream = ({ cameraId }) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const imgRef = useRef(null);
  const wsRef = useRef(null);
  const previousUrlRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectDelayRef = useRef(3000);
  const MAX_RECONNECT_DELAY = 30000;

  /**
   * Establish the WebSocket connection and set up event handlers.
   */
  const connectWebSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/${cameraId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
      setError(null);
      reconnectDelayRef.current = 3000;
    };

    ws.onmessage = (event) => {
      const blob = new Blob([event.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
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
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectDelayRef.current = Math.min(
          reconnectDelayRef.current * 2,
          MAX_RECONNECT_DELAY
        );
        connectWebSocket();
      }, reconnectDelayRef.current);
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, [cameraId]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Live Processed Video Stream</h2>
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
