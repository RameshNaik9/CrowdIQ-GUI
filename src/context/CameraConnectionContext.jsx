/**
 * File: src/context/CameraConnectionContext.jsx
 * Description: A React Context Provider to manage persistent camera WebSocket connections.
 * It:
 *   - Reads the active camera from localStorage
 *   - Checks the RTSP URL's validity with /check-stream
 *   - Opens a WebSocket connection if valid
 *   - Exposes the connection state and any messages to child components
 */

import { createContext, useEffect, useRef, useState } from "react";

/** The shape of our context data. */
export const CameraConnectionContext = createContext({
  connected: false,
  error: null,
  ws: null, // holds the WebSocket instance
});

/**
 * CameraConnectionProvider
 * 
 * - On mount, reads the 'activeCamera' from localStorage
 * - If an RTSP URL is present, calls /check-stream to confirm connectivity
 * - If successful, opens ws://localhost:8000/ws/{cameraId}
 * - Manages reconnection logic if needed
 */
export const CameraConnectionProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null); // holds our WebSocket instance

  useEffect(() => {
    // Attempt to read the active camera from localStorage
    const storedCamera = localStorage.getItem("activeCamera");
    if (!storedCamera) {
      // No active camera found, do nothing
      return;
    }

    const cameraData = JSON.parse(storedCamera);
    const { _id: cameraId, stream_link: rtspUrl } = cameraData || {};

    if (!cameraId || !rtspUrl) {
      return; // Missing info => can't open WebSocket
    }

    // 1) Check if the RTSP URL is valid
    const checkRtspValidity = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/check-stream?rtsp_url=${encodeURIComponent(rtspUrl)}`
        );
        if (!response.ok) {
          const { detail } = await response.json();
          throw new Error(detail || "RTSP validation failed.");
        }
        // If we reach here, RTSP is valid => we can open the WebSocket
        openWebSocket(cameraId);
      } catch (err) {
        setError(err.message);
      }
    };

    checkRtspValidity();

    // Cleanup: close socket if the provider unmounts
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  /**
   * openWebSocket
   * Given a cameraId, opens a persistent WebSocket connection to the server.
   */
  const openWebSocket = (cameraId) => {
    const wsUrl = `ws://localhost:8000/ws/${cameraId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[WebSocket] Connection established");
      setConnected(true);
      setError(null);
    };

    ws.onerror = (evt) => {
      console.error("[WebSocket] Error:", evt);
      setError("WebSocket connection error");
    };

    ws.onclose = () => {
      console.log("[WebSocket] Connection closed");
      setConnected(false);
      // You could attempt reconnection here if desired
      // e.g., setTimeout(() => openWebSocket(cameraId), 3000);
    };

    /**
     * Example onmessage usage:
     * If the server sends text messages or pings, handle them here.
     * But we assume the primary data is binary frames. We'll handle 
     * binary frames in onmessage or the child component that deals with images.
     */
    ws.onmessage = (evt) => {
      if (typeof evt.data === "string") {
        // Possibly a text message from server
        console.log("Received text message:", evt.data);
      } else {
        // Possibly a binary frame
        // Child components might directly override this handler or
        // we can store frame data in context if we want global usage.
      }
    };
  };

  return (
    <CameraConnectionContext.Provider value={{ connected, error, ws: wsRef.current }}>
      {children}
    </CameraConnectionContext.Provider>
  );
};
