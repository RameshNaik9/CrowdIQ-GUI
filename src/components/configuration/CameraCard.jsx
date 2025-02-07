import { useState } from "react";
import { ChevronDown, ChevronUp, Link2, Circle } from "lucide-react";

const CameraCard = ({ camera, expanded, onToggleExpand }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
        cameraId: camera._id, // ✅ Pass camera ID (added to fix the error)
        name: camera.name,
        location: camera.location,
        username: camera.username,
        password: camera.password,
        ip_address: camera.ip_address,
        port: camera.port,
        channel_number: camera.channel_number,
        stream_type: camera.stream_type,
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
    <div className="bg-gray-800 p-4 rounded-lg shadow-md transition-all">
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

      {/* View More + Connect Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={onToggleExpand}
          className="text-blue-400 hover:text-blue-500 flex items-center text-sm transition"
        >
          {expanded ? "Hide Details" : "View Details"}
          {expanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
        </button>

        <button
          onClick={handleConnect}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg flex items-center transition"
        >
          <Link2 size={16} className="mr-2" />
          {loading ? "Connecting..." : "Connect"}
        </button>
      </div>

      {/* Expanded Camera Details (Only Expands When Needed) */}
      {expanded && (
        <div className="mt-4 text-gray-300 text-sm space-y-2">
          <p><strong>IP Address:</strong> {camera.ip_address}</p>
          <p><strong>Port:</strong> {camera.port}</p>
          <p><strong>Channel:</strong> {camera.channel_number}</p>
          <p><strong>Stream Type:</strong> {camera.stream_type}</p>
          <p><strong>Username:</strong> {camera.username}</p>
          <p><strong>Password:</strong> {camera.password}</p>
        </div>
      )}

      {/* ✅ Success Message (Shows before redirecting) */}
      {success && <p className="text-green-400 text-sm mt-3">{success}</p>}

      {/* ❌ Error Message */}
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </div>
  );
};

export default CameraCard;
