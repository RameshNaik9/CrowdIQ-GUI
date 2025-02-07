import { useState } from "react";
import { X, Link2, Edit2, Circle } from "lucide-react"; // ✅ Web3 Icons for Close, Connect, Edit

const CameraCard = ({ camera }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expanded, setExpanded] = useState(false); // ✅ State to track expanded view

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

      // ✅ Show success message first
      setSuccess("Camera connected successfully!");

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

  return (
    <>
      {/* Standard Camera Card */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer">
        {/* Camera Basic Info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{camera.name}</h3>
            <p className="text-gray-400 text-sm">{camera.location}</p>
            <p className="text-gray-500 text-xs">Last Active: {camera.last_active}</p>
          </div>
          {/* Status Icon */}
          <div className="flex items-center">
            <Circle size={10} className={`mr-2 ${camera.status === "online" ? "text-green-400" : "text-red-400"}`} />
            <span className="text-sm text-gray-300">{camera.status}</span>
          </div>
        </div>

        {/* Buttons (View Details & Connect) */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setExpanded(true)}
            className="text-blue-400 hover:text-blue-500 flex items-center text-sm transition"
          >
            View Details →
          </button>

          {/* ✅ "Connect" Button (on Card itself) */}
          <button
            onClick={handleConnect}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg flex items-center transition"
          >
            <Link2 size={16} className="mr-2" />
            {loading ? "Connecting..." : "Connect"}
          </button>
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
              onClick={() => setExpanded(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            {/* Camera Details */}
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">{camera.name}</h2>
            <p className="text-gray-400 mb-1"><strong>Location:</strong> {camera.location}</p>
            <p className="text-gray-400 mb-1"><strong>IP Address:</strong> {camera.ip_address}</p>
            <p className="text-gray-400 mb-1"><strong>Port:</strong> {camera.port}</p>
            <p className="text-gray-400 mb-1"><strong>Channel:</strong> {camera.channel_number}</p>
            <p className="text-gray-400 mb-1"><strong>Stream Type:</strong> {camera.stream_type}</p>
            <p className="text-gray-400 mb-4"><strong>Last Active:</strong> {camera.last_active}</p>

            {/* Buttons in Expanded View */}
            <div className="flex justify-between">
              {/* ✅ "Connect" Button in Expanded View */}
              <button
                onClick={handleConnect}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
              >
                <Link2 size={16} className="mr-2" />
                {loading ? "Connecting..." : "Connect"}
              </button>

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
