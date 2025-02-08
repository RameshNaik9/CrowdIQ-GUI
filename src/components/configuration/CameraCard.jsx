import { useState, useEffect } from "react";
import { X, Link2, Edit2, Circle, Power } from "lucide-react"; // ✅ Web3 Icons for Close, Connect, Edit, Disconnect

const CameraCard = ({ camera, healthCheckActive, expanded, onToggleExpand }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedState, setExpanded] = useState(expanded || false); // ✅ State to track expanded view
  const [isActive, setIsActive] = useState(false); // ✅ Track if the camera is active

  // Format the last active time professionally in 12-hour format
  const formattedLastActive = new Date(camera.last_active).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true
  });

  // ✅ Check if this camera is already active
  useEffect(() => {
    const activeCamera = JSON.parse(localStorage.getItem("activeCamera"));
    if (activeCamera && activeCamera._id === camera._id) {
      setIsActive(true);
    }
  }, [camera._id]);

  // ✅ Handle Connecting an Existing Camera
  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        throw new Error("User is not logged in.");
      }

      const payload = {
        userId: userData.id, // ✅ Pass user ID
        cameraId: camera._id, // ✅ Pass Camera ID
      };

      const response = await fetch("http://localhost:8080/api/v1/cameras/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the camera.");
      }

      const data = await response.json();
      localStorage.setItem("activeCamera", JSON.stringify(data.data)); // ✅ Save as Active Camera

      // ✅ Show success message and set camera as active
      setSuccess("Camera connected successfully!");
      setIsActive(true);

      // ✅ Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = `/live-monitoring/${data.data._id}`;
      }, 500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Disconnecting the Camera
  const handleDisconnect = () => {
    localStorage.removeItem("activeCamera"); // ✅ Remove from localStorage
    setIsActive(false);
    setSuccess("Camera disconnected successfully!");
  };

  return (
    <>
      {/* Standard Camera Card */}
      <div 
        className={`bg-gray-800 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer relative ${
          isActive ? "border-b-4 border-green-400 rounded-b-md" : ""
        } ${healthCheckActive ? "filter blur-md pointer-events-none" : ""}`}
      >
        {/* Camera Basic Info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{camera.name}</h3>
            <p className="text-gray-400 text-sm truncate w-48">{camera.location}</p>
            <p className="text-gray-500 text-xs">Last Active: {formattedLastActive}</p>
          </div>
          {/* Status Icon */}
          <div className="flex items-center">
            <Circle size={10} className={`mr-2 ${camera.status === "online" ? "text-green-400" : "text-red-400"}`} />
            <span className="text-sm text-gray-300">{camera.status}</span>
          </div>
        </div>

        {/* Active Status Badge */}
        {isActive && (
          <span className="absolute bottom-0 left-0 right-0 text-center text-green-300 text-xs py-1 rounded-b-md">
            Active
          </span>
        )}

        {/* Buttons (View Details & Connect/Disconnect) */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onToggleExpand}
            className="text-blue-400 hover:text-blue-500 flex items-center text-sm transition"
          >
            View Details →
          </button>

          {/* ✅ "Connect" or "Disconnect" Button */}
          {isActive ? (
            <button
              onClick={handleDisconnect}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-2.5 py-1 rounded-lg flex items-center transition"
            >
              <Power size={16} className="mr-1" />
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-2.5 py-1 rounded-lg flex items-center transition"
            >
              <Link2 size={16} className="mr-2" />
              {loading ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>

        {/* ✅ Show Messages Below Card */}
        {success && <p className="text-green-400 text-sm mt-2">{success}</p>}
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {/* ✅ Expanded View Modal */}
      {expanded && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full transform scale-95 animate-scale-up">
            {/* Close Button */}
            <button
              onClick={onToggleExpand}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            {/* Camera Details */}
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">{camera.name}</h2>
            <p className="text-gray-400 mb-1"><strong>Location:</strong> {camera.location}</p> {/* ✅ Full address in modal */}
            <p className="text-gray-400 mb-1"><strong>IP Address:</strong> {camera.ip_address}</p>
            <p className="text-gray-400 mb-1"><strong>Port:</strong> {camera.port}</p>
            <p className="text-gray-400 mb-1"><strong>Channel:</strong> {camera.channel_number}</p>
            <p className="text-gray-400 mb-1"><strong>Stream Type:</strong> {camera.stream_type}</p>
            <p className="text-gray-400 mb-4"><strong>Last Active:</strong> {formattedLastActive}</p>

            {/* Buttons in Expanded View */}
            <div className="flex justify-between">
              {/* ✅ "Connect" or "Disconnect" Button */}
              {isActive ? (
                <button
                  onClick={handleDisconnect}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition"
                >
                  <Power size={16} className="mr-2" />
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
                >
                  <Link2 size={16} className="mr-2" />
                  {loading ? "Connecting..." : "Connect"}
                </button>
              )}

              {/* ✅ "Edit" Button */}
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition"
              >
                <Edit2 size={16} className="mr-2" />
                Edit
              </button>
            </div>

            {/* ✅ Show Messages Below Buttons */}
            {success && <p className="text-green-400 text-sm mt-3">{success}</p>}
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default CameraCard;
