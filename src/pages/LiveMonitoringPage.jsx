/**
 * File: src/pages/LiveMonitoringPage.jsx
 * Description: 
 *  - Provides Live vs. Processed (inference) video toggle.
 *  - Calls the backend to start/stop inference.
 *  - Integrates with WebSocketVideoStream, which does on-demand polling if frames stop.
 *  - If the stream truly ends, we handle it by resetting our UI state to "Start Inference."
 */

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"; // 🚀 Warning Icon
import Header from "../components/common/Header";
import "@fontsource/orbitron";
import { Switch } from "@headlessui/react"; // ✅ Web3-style toggle switch
import WebSocketVideoStream from "../components/WebSocketVideoStream"; // POC WebSocket component

/** Import the camera connection context to know if the WebSocket is connected */
import { CameraConnectionContext } from "../context/CameraConnectionContext";

const LiveMonitoringPage = () => {
  // Toggle between "live" (demo local video) and "processed" (live processed video)
  // const [videoMode, setVideoMode] = useState("live");
  const [videoMode] = useState("processed");

  const [cameraData, setCameraData] = useState(null);

  // Inference state management for processed video stream
  const [inferenceStarted, setInferenceStarted] = useState(false);
  const [inferenceMessage, setInferenceMessage] = useState("");
  const [inferenceError, setInferenceError] = useState("");
  const [isInferenceLoading, setIsInferenceLoading] = useState(false);

  /** Read the cameraId from the route (e.g., /live-monitoring/:cameraId) */
  const { cameraId } = useParams();
  const navigate = useNavigate();

  /** Bring in WebSocket connection state from our global context */
  const { connected, error: wsError } = useContext(CameraConnectionContext);

  // Retrieve active camera details from localStorage
  useEffect(() => {
    const storedCamera = localStorage.getItem("activeCamera");
    if (storedCamera) {
      try {
        const parsedCamera = JSON.parse(storedCamera);
        if (parsedCamera && parsedCamera._id) {
          setCameraData(parsedCamera);
        } else {
          setCameraData(null);
        }
      } catch (error) {
        console.error("Error parsing camera data:", error);
        setCameraData(null);
      }
    } else {
      setCameraData(null);
    }

    // If no activeCamera in localStorage and path != /live-monitoring, redirect
    if (!storedCamera && location.pathname !== "/live-monitoring") {
      navigate("/live-monitoring");
    }
  }, [cameraId, navigate]);

  // Check if we previously started inference for this camera
  useEffect(() => {
    if (!cameraId) return;
    const storedInferenceState = localStorage.getItem(`inference_${cameraId}`);
    if (storedInferenceState === "started") {
      setInferenceStarted(true);
    }
  }, [cameraId]);

  /**
   * handleStartInference
   * 
   * Starts the live processed stream by calling the backend API.
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
    // ✅ Extract userId from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?.id;
    
      const payload = {
        user_id: userId,
        camera_id: cameraData._id,
        rtsp_url: cameraData.stream_link,
      };
      const response = await fetch("http://localhost:8000/start-inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const { detail } = await response.json();
        throw new Error(detail || "Failed to start inference.");
      }
      const data = await response.json();
      console.log("Inference started:", data);
      setInferenceMessage(data.message || "Inference started successfully.");
      setInferenceStarted(true);
      localStorage.setItem(`inference_${cameraId}`, "started");
    } catch (err) {
      console.error("Error starting inference:", err.message);
      setInferenceError(err.message);
    } finally {
      setIsInferenceLoading(false);
    }
  };

  /**
   * handleStopInference
   * 
   * Stops the live processed stream by calling the backend API.
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
      const response = await fetch("http://localhost:8000/stop-inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        // If the error indicates no active inference, show appropriate message
        const errorData = await response.json();
        // If the error indicates no active inference, set our state accordingly
        if (
          errorData.detail &&
          errorData.detail.includes("No active inference running")
        ) {
          setInferenceMessage("Inference was not running. Ready to start.");
          setInferenceStarted(false);
          localStorage.removeItem(`inference_${cameraId}`);
        } else {
          throw new Error(errorData.detail || "Failed to stop inference.");
        }
      } else {
        const data = await response.json();
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

  // Handle "inference_stopped" from the child if frames ceased
  const handleInferenceStopped = () => {
    console.log("[LiveMonitoringPage] handleInferenceStopped => setting inference to false");
    setInferenceStarted(false);
    setInferenceMessage("Inference ended (no frames).");
    if (cameraId) {
      localStorage.removeItem(`inference_${cameraId}`);
    }
  };

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Live Monitoring" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 relative">
        {/* 1) If no camera data, show overlay */}
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
            {/* 2) Toggle Switch: Live vs. Processed Video */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className="opacity-30 text-gray-400 text-lg font-medium">Live Video</span>
              {/* <Switch
                checked={videoMode === "processed"}
                onChange={() =>
                  setVideoMode(videoMode === "live" ? "processed" : "live")
                }
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition duration-300 ${
                  videoMode === "processed" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute left-1 inline-block h-6 w-6 transform rounded-full bg-white transition ${
                    videoMode === "processed" ? "translate-x-8" : "translate-x-0"
                  }`}
                />
              </Switch> */}
              <Switch
                checked={true}
                disabled
                className="relative inline-flex h-8 w-16 items-center rounded-full transition duration-300 bg-blue-600"
              >
                <span className=" opacity-30 absolute left-1 inline-block h-6 w-6 transform rounded-full bg-white transition translate-x-8" />
              </Switch>

              <span className="text-gray-100 text-lg font-medium">Processed Video</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 3) Main Video Panel */}
              <div className="lg:col-span-2 bg-gray-900 p-4 rounded-lg shadow-md relative">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">
                  {videoMode === "live" ? "Live Camera Stream" : "Processed Video Stream"}
                </h2>
                <div className="relative">
                  {videoMode === "live" ? (
                    // 3a) Local Demo Video
                    <video
                      // src="/live-video.mp4"
                      autoPlay
                      loop
                      muted
                      className="w-full h-auto aspect-video rounded-lg shadow-lg"
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  ) : (
                    // 3b) Processed (WebSocket-based) Video
                    <>
                      {/* If NOT started inference, show fallback video + start button */}
                      {!inferenceStarted ? (
                        // Show a placeholder / fallback video until inference is started
                        <>
                          <video
                            src={cameraData?.processed_stream_link }
                            autoPlay
                            loop
                            muted
                            className="w-full h-auto aspect-video rounded-lg shadow-lg"
                            controlsList="nodownload nofullscreen noremoteplayback"
                            disablePictureInPicture
                            onContextMenu={(e) => e.preventDefault()}
                          />
                          <div className="mt-4 text-center">
                            {/* Show Start Inference button only if WebSocket is connected */}
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
                          {inferenceMessage && (
                            <p className="text-green-400 mt-2 text-center">{inferenceMessage}</p>
                          )}
                          {inferenceError && (
                            <p className="text-red-400 mt-2 text-center">{inferenceError}</p>
                          )}
                        </>
                      ) : (
                        // If Inference is started, show the real-time WebSocket stream
                        <>
                          <WebSocketVideoStream
                            cameraId={cameraId}
                            onInferenceStopped={handleInferenceStopped}
                          />
                          <div className="mt-4 text-center">
                            {/* Show Stop Inference button only if connected */}
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
                          {inferenceMessage && (
                            <p className="text-green-400 mt-2 text-center">{inferenceMessage}</p>
                          )}
                          {inferenceError && (
                            <p className="text-red-400 mt-2 text-center">{inferenceError}</p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* 4) Camera Details Panel */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Camera Details</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300 font-orbitron">
                    <tbody>
                      {/* Name */}
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">Name</th>
                        <td className="py-2 px-3">
                          {cameraData?.name || "N/A"}
                        </td>
                      </tr>
                      
                      {/* Location */}
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">Location</th>
                        <td className="py-2 px-3">
                          {cameraData?.location || "N/A"}
                        </td>
                      </tr>
                      
                      {/* IP Address */}
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">IP Address</th>
                        <td className="py-2 px-3">
                          {cameraData?.ip_address || "N/A"}
                        </td>
                      </tr>

                      {/* Port */}
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">Port</th>
                        <td className="py-2 px-3">
                          {cameraData?.port || "N/A"}
                        </td>
                      </tr>

                      {/* Channel */}
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">Channel</th>
                        <td className="py-2 px-3">
                          {cameraData?.channel_number || "N/A"}
                        </td>
                      </tr>

                      {/* Stream Type */}
                      <tr className="border-b border-gray-700">
                        <th className="py-2 px-3 text-gray-200 font-medium whitespace-nowrap">Stream Type</th>
                        <td className="py-2 px-3">
                          {cameraData?.stream_type || "N/A"}
                        </td>
                      </tr>

                      {/* Last Active */}
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
