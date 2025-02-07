import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import RTSPSetup from "../components/configuration/RTSPSetup";
import CameraCard from "../components/configuration/CameraCard";

const cameraTypes = [
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData.id) {
          throw new Error("User is not logged in.");
        }

        const response = await fetch(`http://localhost:8080/api/v1/cameras`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is sent
            "user-id": userData.id, // ✅ Send userId in headers
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cameras.");
        }

        const data = await response.json();

        // ✅ Sort cameras by `createdAt` (latest first)
        const sortedCameras = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setCameras(sortedCameras);
        localStorage.setItem("cameras", JSON.stringify(sortedCameras)); // ✅ Store in localStorage
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, []);

  const handleCameraSelection = (cameraId) => {
    setSelectedCamera(cameraId);
    setShowDropdown(false);
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
                onClick={() => handleCameraSelection(camera.id)}
                className={`block w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition ${
                  camera.id !== "rtsp" ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={camera.id !== "rtsp"}
              >
                {camera.name}
              </button>
            ))}
          </div>
        )}

        {/* Selected Camera Connection Component */}
        {selectedCamera && (
          <div className="mt-6 p-4 bg-gray-900 rounded-lg shadow-md">
            {selectedCamera === "rtsp" && <RTSPSetup />}
          </div>
        )}

        {/* Divider */}
        <hr className="my-6 border-gray-700" />

        {/* Connection History */}
        <h3 className="text-xl font-semibold text-gray-100 mb-4">Connection History</h3>

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
                onToggleExpand={() => setExpandedCard(expandedCard === camera._id ? null : camera._id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No previous connections found.</p>
        )}
      </main>
    </div>
  );
};

export default ConfigurationPage;
