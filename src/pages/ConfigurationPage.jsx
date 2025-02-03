import { useState } from "react";
import Header from "../components/common/Header";
import RTSPSetup from "../components/configuration/RTSPSetup";

const cameraTypes = [
  { id: "rtsp", name: "RTSP" },
  { id: "onvif", name: "ONVIF" },
  { id: "http", name: "HTTP" },
  { id: "webrtc", name: "WebRTC" },
];

const ConfigurationPage = () => {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [connectionHistory, setConnectionHistory] = useState(
    JSON.parse(localStorage.getItem("cameraConnections")) || []
  );

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
        <div className="bg-gray-800 p-4 rounded-lg">
          {connectionHistory.length > 0 ? (
            <ul className="space-y-2">
              {connectionHistory.map((camera, index) => (
                <li key={index} className="p-2 bg-gray-700 rounded-lg flex justify-between">
                  <span className="text-white">{camera.name} ({camera.ip_address})</span>
                  <button className="text-red-400 hover:text-red-500 transition">Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No previous connections found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConfigurationPage;
