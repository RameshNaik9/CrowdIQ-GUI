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
 * Description: Only polls the backend if we haven't received frames for > 3 seconds,
 * to verify if inference ended unexpectedly.
 */

import { useEffect, useRef, useState, useContext } from "react";
import { CameraConnectionContext } from "../context/CameraConnectionContext";

const FRAME_TIMEOUT_MS = 3000; // 3 seconds threshold
/**
 * WebSocketVideoStream Component
 *
 * @param {string} cameraId - Unique identifier for the camera stream (optional usage).
 *                            We rely on the context's `ws` but keep cameraId for labeling/logging.
 */
const WebSocketVideoStream = ({ cameraId, onInferenceStopped }) => {
  // `onInferenceStopped` is a callback to inform parent that inference is no longer active
  const { ws, connected, error } = useContext(CameraConnectionContext);

  const [status, setStatus] = useState("Disconnected");
  const imgRef = useRef(null);
  const previousUrlRef = useRef(null);

  // Keep track of the last time we received a frame
  const lastFrameTimeRef = useRef(null);

  // We'll store an interval ID for the "frame timeout" check
  const timeoutCheckRef = useRef(null);

  useEffect(() => {
    // Update status based on context
    if (!ws) {
      setStatus(error || "No WebSocket instance");
      return;
    }
    setStatus(connected ? "Connected" : error || "Disconnected");
  }, [connected, error, ws]);

  useEffect(() => {
    // If we have a ws instance, set up an onmessage handler for frames
    if (!ws) return;

    // Handler for incoming messages
    const handleMessage = async (event) => {
      if (typeof event.data === "string") {
        // Possibly a text message (like "inference_stopped")
        console.log("Text message from server:", event.data);
        if (event.data === "inference_stopped") {
          // The server says it's definitely stopped
          if (onInferenceStopped) {
            onInferenceStopped();
          }
        }
        return;
      }

      // It's a binary frame => update the last frame time
      lastFrameTimeRef.current = Date.now();

      // Create blob URL for <img>
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

    // Initialize lastFrameTime to "now" to avoid immediate false detection
    lastFrameTimeRef.current = Date.now();

    // Start or re-start the interval to check for frame timeouts
    if (!timeoutCheckRef.current) {
      timeoutCheckRef.current = setInterval(async () => {
        // If the socket is connected and we haven't received a frame for X seconds,
        // check inference status to see if it's really ended or just a slow network
        if (connected && lastFrameTimeRef.current !== null) {
          const elapsed = Date.now() - lastFrameTimeRef.current;
          if (elapsed > FRAME_TIMEOUT_MS) {
            console.warn("No frames received for > 3s, checking if inference ended...");
            try {
              const res = await fetch(`http://localhost:8000/inference-status?camera_id=${cameraId}`);
              if (res.ok) {
                const data = await res.json();
                if (!data.active) {
                  // The server says it's not active
                  console.warn("Server reports inference is inactive.");
                  if (onInferenceStopped) {
                    onInferenceStopped();
                  }
                } else {
                  console.warn("Server says inference is still active. Possibly a slow frame or camera glitch.");
                }
              }
            } catch (err) {
              console.error("Error checking inference status:", err);
            } finally {
              // Reset lastFrameTime so we won't spam-check. If no new frames come in, we'll check again in 3s.
              lastFrameTimeRef.current = Date.now();
            }
          }
        }
      }, 3000); // check every 3s
    }

    return () => {
      ws.removeEventListener("message", handleMessage);
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, [ws, cameraId, connected, onInferenceStopped]);

  // Cleanup the interval when unmounting
  useEffect(() => {
    return () => {
      if (timeoutCheckRef.current) {
        clearInterval(timeoutCheckRef.current);
        timeoutCheckRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
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
