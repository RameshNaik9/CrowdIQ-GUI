import { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react"; // ✅ Web3-style Refresh Icon
import Header from "../components/common/Header";
import RTSPSetup from "../components/configuration/RTSPSetup";
import LocalCameraSetup from "../components/configuration/LocalCameraSetup";
import CameraCard from "../components/configuration/CameraCard";

const cameraTypes = [
  { id: "local", name: "Local Camera" },
  { id: "rtsp", name: "RTSP" },
  { id: "onvif", name: "ONVIF" },
  { id: "http", name: "HTTP" },
  { id: "webrtc", name: "WebRTC" },
];

const ConfigurationPage = () => {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // ✅ Refreshing State
  const [error, setError] = useState(null);

  // ✅ Fetch Cameras
  const fetchCameras = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        throw new Error("User is not logged in.");
      }

      const response = await fetch(`http://localhost:8080/api/v1/cameras`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "user-id": userData.id, // ✅ Send userId in headers
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cameras.");
      }

      const data = await response.json();

      // ✅ Sort cameras by `createdAt` (latest first)
      const sortedCameras = data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setCameras(sortedCameras);
      localStorage.setItem("cameras", JSON.stringify(sortedCameras)); // ✅ Store in localStorage
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  // ✅ Handle Refresh Button Click
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        throw new Error("User is not logged in.");
      }

      const response = await fetch(
        "http://localhost:8080/api/v1/cameras/trigger-health-check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userId: userData.id }), // ✅ Send userId in the request body
        }
      );

      if (!response.ok) {
        throw new Error("Failed to trigger health check.");
      }

      // ✅ Wait for 2 seconds to ensure health check is performed
      setTimeout(() => {
        fetchCameras();
        setRefreshing(false);
      }, 2000);

    } catch (err) {
      setError(err.message);
      setRefreshing(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Header */}
      <Header title="Camera Configuration" />

      {/* Page Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* New Connection Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-100">Manage Camera Connections</h2>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            + New Connection
          </button>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="bg-gray-800 p-3 rounded-lg shadow-lg w-40 flex flex-col items-center">
            {cameraTypes.map((camera) => (
              <button
                key={camera.id}
                onClick={() => setSelectedCamera(camera.id)}
                className={`block w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition ${
                  camera.id !== "rtsp" && camera.id !== "local" ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={camera.id !== "rtsp" && camera.id !== "local"}
              >
                {camera.name}
              </button>
            ))}
          </div>
        )}

        {/* Selected Camera Connection Component */}
        {/* {selectedCamera && (
          <div className="mt-6 p-4 bg-gray-900 rounded-lg shadow-md">
            {selectedCamera === "rtsp" && <RTSPSetup />}
            {selectedCamera === "local" && <LocalCameraSetup />}
          </div>
        )} */}

        {/* Modal for Selected Camera Setup */}
        {selectedCamera && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Modal Backdrop */}
            <div
              className="absolute inset-0 bg-black opacity-60"
              onClick={() => setSelectedCamera(null)}
            />
            {/* Modal Content */}
            <div
              // className={`relative bg-gray-900 p-6 rounded-lg shadow-lg z-10 max-w-4xl w-full ${
              //   selectedCamera === "rtsp" ? "h-[600px] overflow-y-auto" : "h-auto"
              // }`}
                   className="relative bg-gray-900 p-6 rounded-lg shadow-lg z-10 max-w-4xl w-full
                max-h-[80vh] overflow-y-auto"
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => setSelectedCamera(null)}
              >
                ✕
              </button>
              {selectedCamera === "rtsp" && <RTSPSetup />}
              {selectedCamera === "local" && <LocalCameraSetup />}
            </div>
          </div>
        )}

        {/* Divider */}
        <hr className="my-6 border-gray-700" />

        {/* Connection History with Refresh Button */}
        <div className="flex items-center space-x-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-100">Connection History</h3>
          <button
            onClick={handleRefresh}
            className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-full transition"
            disabled={refreshing}
          >
            <RotateCcw size={20} className={`transition-transform ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Camera Grid with Centered Overlay When Refreshing */}
        <div className="relative">
          {loading ? (
            <p className="text-gray-400">Loading cameras...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : cameras.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cameras.map((camera) => (
                <CameraCard
                  key={camera._id}
                  camera={camera}
                  expanded={expandedCard === camera._id}
                  onToggleExpand={() =>
                    setExpandedCard(expandedCard === camera._id ? null : camera._id)
                  }
                  healthCheckActive={refreshing} // <-- Pass the refreshing state here
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No previous connections found.</p>
          )}

          {refreshing && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="bg-black bg-opacity-60 p-6 rounded-lg">
                <span className="text-white text-lg">
                  Performing health checks on cameras active within the last 48 hours..</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConfigurationPage;
