import { useState } from "react";
import Header from "../components/common/Header";
import RTSPSetup from "../components/configuration/RTSPSetup";
import CameraCard from "../components/configuration/CameraCard"; // Import CameraCard

const cameraTypes = [
  { id: "rtsp", name: "RTSP" },
  { id: "onvif", name: "ONVIF" },
  { id: "http", name: "HTTP" },
  { id: "webrtc", name: "WebRTC" },
];

// Sample Connection History Data
const demoCameras = [
  {
    name: "Entrance Camera",
    location: "Main Gate",
    stream_link: "rtsp://example.com/stream1",
    username: "admin",
    password: "pass123",
    ip_address: "192.168.1.10",
    port: "554",
    channel_number: "1",
    stream_type: "main",
    last_active: new Date().toLocaleString(),
    status: "online",
  },
  {
    name: "Lobby Camera",
    location: "Building Lobby",
    stream_link: "rtsp://example.com/stream2",
    username: "user",
    password: "pass456",
    ip_address: "192.168.1.20",
    port: "554",
    channel_number: "2",
    stream_type: "sub",
    last_active: new Date().toLocaleString(),
    status: "offline",
  },
];

const ConfigurationPage = () => {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [connectionHistory] = useState(demoCameras);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectionHistory.length > 0 ? (
            connectionHistory.map((camera, index) => <CameraCard key={index} camera={camera} />)
          ) : (
            <p className="text-gray-400">No previous connections found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConfigurationPage;
