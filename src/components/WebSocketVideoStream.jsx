// import { useEffect, useRef, useState } from "react";

// /**
//  * WebSocketVideoStream Component
//  *
//  * Connects to the WebSocket server to receive a live stream of JPEG images
//  * and displays them in an <img> tag. Uses an exponential backoff strategy for
//  * reconnection to prevent overwhelming the system. Cleans up Blob URLs to avoid
//  * memory leaks.
//  *
//  * @param {string} cameraId - Unique identifier for the camera stream.
//  */
// const WebSocketVideoStream = ({ cameraId }) => {
//   const [connected, setConnected] = useState(false);
//   const [error, setError] = useState(null);
//   const imgRef = useRef(null);
//   const wsRef = useRef(null);
//   const previousUrlRef = useRef(null);
//   const reconnectTimeoutRef = useRef(null);
//   const reconnectDelayRef = useRef(3000);
//   const MAX_RECONNECT_DELAY = 30000;

//   // We'll store the interval ID for sending periodic pings
//   const pingIntervalRef = useRef(null);

//   /**
//    * Establish the WebSocket connection and set up event handlers.
//    */
//   const connectWebSocket = () => {
//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//     }

//     const ws = new WebSocket(`ws://localhost:8000/ws/${cameraId}`);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       setConnected(true);
//       setError(null);
//       reconnectDelayRef.current = 3000;

//       // Start sending a "ping" every 5 seconds
//       pingIntervalRef.current = setInterval(() => {
//         if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//           wsRef.current.send("ping");
//         }
//       }, 5000);
//     };

//     ws.onmessage = (event) => {
//       // Here we assume anything that's not our "ping/pong" is frame data
//       // If you want to handle "pong" messages specifically, you could do so here.
//       const blob = new Blob([event.data], { type: "image/jpeg" });
//       const url = URL.createObjectURL(blob);
//       if (previousUrlRef.current) {
//         URL.revokeObjectURL(previousUrlRef.current);
//       }
//       previousUrlRef.current = url;
//       if (imgRef.current) {
//         imgRef.current.src = url;
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error:", err);
//       setError("WebSocket connection error");
//     };

//     ws.onclose = () => {
//       console.log("WebSocket disconnected");
//       setConnected(false);

//       // Clear the ping interval whenever connection closes
//       if (pingIntervalRef.current) {
//         clearInterval(pingIntervalRef.current);
//       }

//       // Attempt reconnection using exponential backoff
//       reconnectTimeoutRef.current = setTimeout(() => {
//         reconnectDelayRef.current = Math.min(
//           reconnectDelayRef.current * 2,
//           MAX_RECONNECT_DELAY
//         );
//         connectWebSocket();
//       }, reconnectDelayRef.current);
//     };
//   };

//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       // Cleanup
//       if (wsRef.current) {
//         wsRef.current.close();
//       }
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//       if (pingIntervalRef.current) {
//         clearInterval(pingIntervalRef.current);
//       }
//       if (previousUrlRef.current) {
//         URL.revokeObjectURL(previousUrlRef.current);
//       }
//     };
//   }, [cameraId]);

//   return (
//     <div style={{ textAlign: "center" }}>
//       {connected ? (
//         <p className="text-green-400 mb-2">Status: Connected</p>
//       ) : (
//         <p className="text-red-400 mb-2">Status: {error || "Disconnected"}</p>
//       )}
//       <img
//         ref={imgRef}
//         alt="Live video stream"
//         style={{ width: "80%", border: "1px solid black", borderRadius: "8px" }}
//       />
//     </div>
//   );
// };

// export default WebSocketVideoStream;

/**
 * File: src/components/WebSocketVideoStream.jsx
 * Description: A component that displays the live WebSocket video stream
 * using the *already established* WebSocket from CameraConnectionContext.
 *
 * It:
 *  - Listens to ws.onmessage for JPEG frames
 *  - Renders them into an <img> tag
 *  - Manages blob URLs to avoid memory leaks
 *
 * NOTE: We removed local reconnection or ping logic because the global
 *       context now manages the persistent socket.
 */

import { useEffect, useRef, useState, useContext } from "react";
import { CameraConnectionContext } from "../context/CameraConnectionContext";

/**
 * WebSocketVideoStream Component
 *
 * @param {string} cameraId - Unique identifier for the camera stream (optional usage).
 *                            We rely on the context's `ws` but keep cameraId for labeling/logging.
 */
const WebSocketVideoStream = ({ cameraId }) => {
  const { ws, connected, error } = useContext(CameraConnectionContext);

  const [status, setStatus] = useState("Disconnected");
  const imgRef = useRef(null);
  const previousUrlRef = useRef(null);

  useEffect(() => {
    // Update status based on context
    if (!ws) {
      setStatus(error || "No WebSocket instance");
      return;
    }

    if (connected) {
      setStatus("Connected");
    } else {
      setStatus(error || "Disconnected");
    }
  }, [connected, error, ws]);

  useEffect(() => {
    // If we have a ws instance, set up an onmessage handler for frames
    if (!ws) return;

    const handleMessage = (event) => {
      // We expect binary frames (JPEG). If the server sends text, you can handle that separately
      if (typeof event.data === "string") {
        // Possibly a text message from the server
        console.log("Text message from server:", event.data);
        return;
      }

      // Assume binary data => construct blob -> objectURL -> <img src=...>
      const blob = new Blob([event.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);

      // Clean up the old URL to avoid memory leaks
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
      previousUrlRef.current = url;

      // Set the new image src
      if (imgRef.current) {
        imgRef.current.src = url;
      }
    };

    ws.addEventListener("message", handleMessage);

    // Cleanup on unmount
    return () => {
      ws.removeEventListener("message", handleMessage);
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, [ws]);

  return (
    <div style={{ textAlign: "center" }}>
      {/* Status line (same styling) */}
      {connected ? (
        <p className="text-green-400 mb-2">Status: {status}</p>
      ) : (
        <p className="text-red-400 mb-2">Status: {status}</p>
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
