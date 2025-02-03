import { useState } from "react";
import Header from "../components/common/Header";

const cameraData = {
  name: "Entrance Camera",
  location: "Main Gate",
  stream_link: "/live-video.mp4", // Normal video stream (Demo)
  processed_stream_link: "/live-processed-fixed.mp4", // Processed video stream (Demo)
  username: "admin",
  password: "password123",
  ip_address: "192.168.1.10",
  port: "554",
  channel_number: "1",
  stream_type: "main",
  last_active: new Date().toLocaleString(),
  status: "online",
};

const LiveMonitoringPage = () => {
  const [videoMode, setVideoMode] = useState("live"); // "live" or "processed"

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Header */}
      <Header title="Live Monitoring" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Video Mode Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setVideoMode("live")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              videoMode === "live" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Live Video
          </button>
          <button
            onClick={() => setVideoMode("processed")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              videoMode === "processed" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Processed Video
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Video Player */}
          <div className="lg:col-span-2 bg-gray-900 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              {videoMode === "live" ? "Live Camera Stream" : "Processed Video Stream"}
            </h2>
            <video
              src={videoMode === "live" ? cameraData.stream_link : cameraData.processed_stream_link}
              autoPlay
              loop
              muted
              className="w-full h-96 rounded-lg shadow-lg"
            />
          </div>

          {/* Right: Camera Details */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Camera Details</h2>
            <ul className="space-y-2 text-gray-300">
              <li><strong>Name:</strong> {cameraData.name}</li>
              <li><strong>Location:</strong> {cameraData.location}</li>
              <li><strong>IP Address:</strong> {cameraData.ip_address}</li>
              <li><strong>Port:</strong> {cameraData.port}</li>
              <li><strong>Channel:</strong> {cameraData.channel_number}</li>
              <li><strong>Stream Type:</strong> {cameraData.stream_type}</li>
              <li><strong>Last Active:</strong> {cameraData.last_active}</li>
              <li>
                <strong>Status:</strong>{" "}
                <span className={`font-bold ${cameraData.status === "online" ? "text-green-400" : "text-red-400"}`}>
                  {cameraData.status}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveMonitoringPage;
