/**
 * File: src/pages/LiveMonitoringPage.jsx
 * Description:
 *  - If camera type is "local" and inference not started, we use getUserMedia to turn on the local webcam.
 *    This shows a live feed and the green camera light. The user can then click "Start Inference."
 *  - After starting inference, we switch to showing the processed WebSocket stream.
 *  - For non-local cameras or after inference starts, we show the processed stream from the backend.
 */

import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Header from "../components/common/Header";
import "@fontsource/orbitron";
import WebSocketVideoStream from "../components/WebSocketVideoStream";
import { CameraConnectionContext } from "../context/CameraConnectionContext";

const LiveMonitoringPage = () => {
  const [cameraData, setCameraData] = useState(null);

  // Inference state
  const [inferenceStarted, setInferenceStarted] = useState(false);
  const [inferenceMessage, setInferenceMessage] = useState("");
  const [inferenceError, setInferenceError] = useState("");
  const [isInferenceLoading, setIsInferenceLoading] = useState(false);

  // State for the local camera stream (MediaStream)
  const [localStream, setLocalStream] = useState(null);

  // Refs
  const localVideoRef = useRef(null);

  const { cameraId } = useParams();
  const navigate = useNavigate();
  const { connected, error: wsError } = useContext(CameraConnectionContext);

  // Load camera data from localStorage
  useEffect(() => {
    const storedCamera = localStorage.getItem("activeCamera");
    if (storedCamera) {
      try {
        const parsed = JSON.parse(storedCamera);
        if (parsed && parsed._id) {
          setCameraData(parsed);
        } else {
          setCameraData(null);
        }
      } catch (err) {
        console.error("Error parsing camera data:", err);
        setCameraData(null);
      }
    } else {
      setCameraData(null);
    }

    // If no active camera, redirect
    if (!storedCamera && location.pathname !== "/live-monitoring") {
      navigate("/live-monitoring");
    }
  }, [cameraId, navigate]);

  // Check if inference was previously started
  useEffect(() => {
    if (!cameraId) return;
    const storedInference = localStorage.getItem(`inference_${cameraId}`);
    if (storedInference === "started") {
      setInferenceStarted(true);
    }
  }, [cameraId]);

  /**
   * If camera is local and inference not started, request the user’s webcam.
   */
  useEffect(() => {
    let streamCleanup = null;
    const startLocalCamera = async () => {
      if (cameraData?.type === "local" && !inferenceStarted) {
        try {
          // Request permission to use the webcam
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          setLocalStream(stream);
        } catch (err) {
          console.error("Error accessing local camera:", err);
          setInferenceError("Failed to access your local camera. Please check permissions.");
        }
      }
    };

    startLocalCamera();

    // Cleanup function to stop the local camera track
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraData, inferenceStarted]);

  /**
   * Attach localStream to the video element whenever it changes
   */
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  /**
   * Start Inference
   */
  const handleStartInference = async () => {
    if (!cameraData) {
      setInferenceError("Camera data is not available.");
      return;
    }
    setIsInferenceLoading(true);
    setInferenceMessage("");
    setInferenceError("");

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.id;
      const payload = {
        user_id: userId,
        camera_id: cameraData._id,
        rtsp_url: cameraData.stream_link, // "local" or actual RTSP
      };

      const resp = await fetch("http://localhost:8000/start-inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const { detail } = await resp.json();
        throw new Error(detail || "Failed to start inference.");
      }
      const data = await resp.json();
      console.log("Inference started:", data);
      setInferenceMessage(data.message || "Inference started successfully.");
      setInferenceStarted(true);
      localStorage.setItem(`inference_${cameraId}`, "started");

      // Stop the local camera once inference starts (optional)
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
    } catch (err) {
      console.error("Error starting inference:", err.message);
      setInferenceError(err.message);
    } finally {
      setIsInferenceLoading(false);
    }
  };

  /**
   * Stop Inference
   */
  const handleStopInference = async () => {
    if (!cameraData) {
      setInferenceError("Camera data is not available.");
      return;
    }
    setIsInferenceLoading(true);
    setInferenceMessage("");
    setInferenceError("");

    try {
      const payload = { camera_id: cameraData._id };
      const resp = await fetch("http://localhost:8000/stop-inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const errorData = await resp.json();
        if (errorData.detail && errorData.detail.includes("No active inference running")) {
          setInferenceMessage("Inference was not running. Ready to start.");
          setInferenceStarted(false);
          localStorage.removeItem(`inference_${cameraId}`);
        } else {
          throw new Error(errorData.detail || "Failed to stop inference.");
        }
      } else {
        const data = await resp.json();
        console.log("Inference stopped:", data);
        setInferenceMessage(data.message || "Inference stopped successfully.");
        setInferenceStarted(false);
        localStorage.removeItem(`inference_${cameraId}`);
      }
    } catch (err) {
      console.error("Error stopping inference:", err.message);
      setInferenceError(err.message);
    } finally {
      setIsInferenceLoading(false);
    }
  };

  /**
   * Called when the WebSocketVideoStream detects no frames => inference ended
   */
  const handleInferenceStopped = () => {
    console.log("[LiveMonitoringPage] Inference ended (no frames).");
    setInferenceStarted(false);
    setInferenceMessage("Inference ended (no frames).");
    if (cameraId) {
      localStorage.removeItem(`inference_${cameraId}`);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Live Monitoring" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 relative">
        {/* If no camera data => show overlay */}
        {!cameraData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 backdrop-blur-md text-white rounded-lg z-50">
            <ExclamationTriangleIcon className="h-20 w-20 text-yellow-400 mb-6" />
            <h2 className="text-4xl font-bold text-center">No Active Camera Found</h2>
            <p className="text-gray-300 mt-3 text-lg text-center">
              Please connect a camera to start monitoring.
            </p>
            <a
              href="/camera-configuration"
              className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-lg shadow-lg"
            >
              Connect a Camera
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Video Panel */}
              <div className="lg:col-span-2 bg-gray-900 p-4 rounded-lg shadow-md relative">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">
                  {cameraData?.type === "local" && !inferenceStarted
                    ? "Live Camera Stream"
                    : "Processed Video Stream"}
                </h2>

                <div className="relative">
                  {/* 1) If local camera & not inference => show real local webcam feed */}
                  {cameraData?.type === "local" && !inferenceStarted ? (
                    <>
                      {/* Use srcObject to display localStream from getUserMedia */}
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-auto aspect-video rounded-lg shadow-lg"
                        controlsList="nodownload nofullscreen noremoteplayback"
                        disablePictureInPicture
                        onContextMenu={(e) => e.preventDefault()}
                      />
                      <div className="mt-4 text-center">
                        {connected ? (
                          <button
                            onClick={handleStartInference}
                            disabled={isInferenceLoading}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                          >
                            {isInferenceLoading ? "Starting Inference..." : "Start Inference"}
                          </button>
                        ) : (
                          <p className="text-red-400 text-sm">
                            {wsError || "WebSocket not connected."}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    // 2) Otherwise, show processed video flow
                    <>
                      {!inferenceStarted ? (
                        // Fallback processed video with "Start Inference" button
                        <>
                          <video
                            src={cameraData?.processed_stream_link}
                            autoPlay
                            loop
                            muted
                            className="w-full h-auto aspect-video rounded-lg shadow-lg"
                            controlsList="nodownload nofullscreen noremoteplayback"
                            disablePictureInPicture
                            onContextMenu={(e) => e.preventDefault()}
                          />
                          <div className="mt-4 text-center">
                            {connected ? (
                              <button
                                onClick={handleStartInference}
                                disabled={isInferenceLoading}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                              >
                                {isInferenceLoading ? "Starting Inference..." : "Start Inference"}
                              </button>
                            ) : (
                              <p className="text-red-400 text-sm">
                                {wsError || "WebSocket not connected."}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        // 3) If inference is started => show real-time processed WebSocket
                        <>
                          <WebSocketVideoStream
                            cameraId={cameraId}
                            onInferenceStopped={handleInferenceStopped}
                          />
                          <div className="mt-4 text-center">
                            {connected ? (
                              <button
                                onClick={handleStopInference}
                                disabled={isInferenceLoading}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                              >
                                {isInferenceLoading ? "Stopping Inference..." : "Stop Inference"}
                              </button>
                            ) : (
                              <p className="text-red-400 text-sm">
                                {wsError || "WebSocket not connected."}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Show success/error messages */}
                {inferenceMessage && (
                  <p className="text-green-400 mt-2 text-center">{inferenceMessage}</p>
                )}
                {inferenceError && (
                  <p className="text-red-400 mt-2 text-center">{inferenceError}</p>
                )}
              </div>

              {/* Camera Details Panel */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Camera Details</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300 font-orbitron">
                    <tbody>
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">Name</th>
                        <td className="py-2 px-3">{cameraData?.name || "N/A"}</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">Location</th>
                        <td className="py-2 px-3">{cameraData?.location || "N/A"}</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">IP Address</th>
                        <td className="py-2 px-3">{cameraData?.ip_address || "N/A"}</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">Port</th>
                        <td className="py-2 px-3">{cameraData?.port || "N/A"}</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">Channel</th>
                        <td className="py-2 px-3">{cameraData?.channel_number || "N/A"}</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">Stream Type</th>
                        <td className="py-2 px-3">{cameraData?.stream_type || "N/A"}</td>
                      </tr>
                      <tr>
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">Last Active</th>
                        <td className="py-2 px-3">
                          {cameraData?.last_active
                            ? new Date(cameraData.last_active).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                                hour12: true,
                              })
                            : "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default LiveMonitoringPage;
