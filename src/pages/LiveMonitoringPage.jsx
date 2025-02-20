import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"; // 🚀 Warning Icon
import Header from "../components/common/Header";
import "@fontsource/orbitron";
import { Switch } from "@headlessui/react"; // ✅ Web3-style toggle switch
import WebSocketVideoStream from "../components/WebSocketVideoStream"; // POC WebSocket component

/**
 * LiveMonitoringPage Component
 * 
 * Displays the live monitoring UI. It shows either a static demo video or a live
 * processed video stream (using a WebSocket) based on the current mode.
 * In processed mode, buttons allow the user to start and stop inference.
 */
const LiveMonitoringPage = () => {
  // Toggle between "live" (demo live video) and "processed" (live processed video stream)
  const [videoMode, setVideoMode] = useState("live");
  const [cameraData, setCameraData] = useState(null);

  // Inference state management for processed video stream
  const [inferenceStarted, setInferenceStarted] = useState(false);
  const [inferenceMessage, setInferenceMessage] = useState("");
  const [inferenceError, setInferenceError] = useState("");
  const [isInferenceLoading, setIsInferenceLoading] = useState(false);

  const { cameraId } = useParams();
  const navigate = useNavigate();

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
    if (!storedCamera && location.pathname !== "/live-monitoring") {
      navigate("/live-monitoring");
    }
  }, [cameraId, navigate]);

  // Check for any existing inference state in localStorage
  useEffect(() => {
    if (cameraId) {
      const storedInferenceState = localStorage.getItem(`inference_${cameraId}`);
      if (storedInferenceState === "started") {
        setInferenceStarted(true);
      }
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
      const payload = {
        camera_id: cameraData._id,
        rtsp_url: cameraData.stream_link,
      };
      const response = await fetch("http://localhost:8000/start-inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to start inference.");
      }
      const data = await response.json();
      console.log("Inference started successfully:", data);
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
      // If the error indicates no active inference, then update state accordingly.
      const errorData = await response.json();
      if (
        errorData.detail &&
        errorData.detail.includes("No active inference running")
      ) {
        // Update the state to reflect that no inference is active.
        setInferenceMessage("Inference was not running. Ready to start.");
        setInferenceStarted(false);
        localStorage.removeItem(`inference_${cameraId}`);
      } else {
        throw new Error(errorData.message || "Failed to stop inference.");
      }
    } else {
      const data = await response.json();
      console.log("Inference stopped successfully:", data);
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

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Live Monitoring" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 relative">
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
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className="text-gray-400 text-lg font-medium">Live Video</span>
              <Switch
                checked={videoMode === "processed"}
                onChange={() => setVideoMode(videoMode === "live" ? "processed" : "live")}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition duration-300 ${videoMode === "processed" ? "bg-blue-600" : "bg-gray-700"}`}
              >
                <span className={`absolute left-1 inline-block h-6 w-6 transform rounded-full bg-white transition ${videoMode === "processed" ? "translate-x-8" : "translate-x-0"}`} />
              </Switch>
              <span className="text-gray-400 text-lg font-medium">Processed Video</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-900 p-4 rounded-lg shadow-md relative">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">
                  {videoMode === "live" ? "Live Camera Stream" : "Processed Video Stream"}
                </h2>
                <div className="relative">
                  {videoMode === "live" ? (
                    <video
                      src="/live-video.mp4"
                      autoPlay
                      loop
                      muted
                    //   className="w-full h-96 rounded-lg shadow-lg"
                      className="w-full h-auto aspect-video rounded-lg shadow-lg"
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  ) : (
                    <>
                      {/* For processed video mode, show either the demo video with a start button or the live WebSocket stream */}
                      {!inferenceStarted ? (
                        <>
                          <video
                            src={cameraData?.processed_stream_link || "/live-processed-fixed.mp4"}
                            autoPlay
                            loop
                            muted
                            // className="w-full h-96 rounded-lg shadow-lg"
                            className="w-full h-auto aspect-video rounded-lg shadow-lg"
                            controlsList="nodownload nofullscreen noremoteplayback"
                            disablePictureInPicture
                            onContextMenu={(e) => e.preventDefault()}
                          />
                          <div className="mt-4 text-center">
                            <button
                              onClick={handleStartInference}
                              disabled={isInferenceLoading}
                              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                            >
                              {isInferenceLoading ? "Starting Inference..." : "Start Inference"}
                            </button>
                          </div>
                          {inferenceMessage && (
                            <p className="text-green-400 mt-2 text-center">{inferenceMessage}</p>
                          )}
                          {inferenceError && (
                            <p className="text-red-400 mt-2 text-center">{inferenceError}</p>
                          )}
                        </>
                      ) : (
                        <>
                          <WebSocketVideoStream cameraId={cameraId} />
                          <div className="mt-4 text-center">
                            <button
                              onClick={handleStopInference}
                              disabled={isInferenceLoading}
                              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                            >
                              {isInferenceLoading ? "Stopping Inference..." : "Stop Inference"}
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Camera Details</h2>
                <ul className="space-y-2 text-gray-300 font-orbitron text-lg tracking-wider">
                  <li>
                    <strong>Name:</strong> {cameraData?.name}
                  </li>
                  <li>
                    <strong>Location:</strong> {cameraData?.location}
                  </li>
                  <li>
                    <strong>IP Address:</strong> {cameraData?.ip_address}
                  </li>
                  <li>
                    <strong>Port:</strong> {cameraData?.port}
                  </li>
                  <li>
                    <strong>Channel:</strong> {cameraData?.channel_number}
                  </li>
                  <li>
                    <strong>Stream Type:</strong> {cameraData?.stream_type}
                  </li>
                  <li>
                    <strong>Last Active:</strong> {cameraData?.last_active}
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default LiveMonitoringPage;
