import { useState } from "react";
import Header from "../components/common/Header";

const demoCameras = [
  {
    name: "Entrance Camera",
    location: "Main Gate",
    stream_link: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4", // Demo video URL
    username: "admin",
    password: "password123",
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
    stream_link: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    username: "user",
    password: "pass1234",
    ip_address: "192.168.1.20",
    port: "554",
    channel_number: "2",
    stream_type: "sub",
    last_active: new Date().toLocaleString(),
    status: "offline",
  },
];

const LiveMonitoringPage = () => {
  const [selectedCamera, setSelectedCamera] = useState(demoCameras[0]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Header */}
      <Header title="Live Monitoring" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Video Player */}
          <div className="lg:col-span-2 bg-gray-900 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Live Feed</h2>
            <video
              src={selectedCamera.stream_link}
              controls
              autoPlay
              loop
              className="w-full h-96 rounded-lg shadow-lg"
            />
          </div>

          {/* Right: Camera Details */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Camera Details</h2>
            <ul className="space-y-2 text-gray-300">
              <li><strong>Name:</strong> {selectedCamera.name}</li>
              <li><strong>Location:</strong> {selectedCamera.location}</li>
              <li><strong>IP Address:</strong> {selectedCamera.ip_address}</li>
              <li><strong>Port:</strong> {selectedCamera.port}</li>
              <li><strong>Channel:</strong> {selectedCamera.channel_number}</li>
              <li><strong>Stream Type:</strong> {selectedCamera.stream_type}</li>
              <li><strong>Last Active:</strong> {selectedCamera.last_active}</li>
              <li>
                <strong>Status:</strong>{" "}
                <span className={`font-bold ${selectedCamera.status === "online" ? "text-green-400" : "text-red-400"}`}>
                  {selectedCamera.status}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Camera Selection */}
        <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Select Camera</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {demoCameras.map((camera, index) => (
              <button
                key={index}
                onClick={() => setSelectedCamera(camera)}
                className={`p-3 w-full text-left rounded-lg shadow-md transition ${
                  selectedCamera.name === camera.name ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {camera.name} - <span className="text-sm">{camera.location}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveMonitoringPage;
