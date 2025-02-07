import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RTSPSetup = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    username: "",
    password: "",
    ip: "",
    port: "554",
    channel: "",
    stream: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // ✅ Retrieve user ID from localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        throw new Error("User is not logged in. Please log in first.");
      }

      const payload = {
        userId: userData.id, // ✅ Include user ID in request
        name: formData.name,
        location: formData.location,
        username: formData.username,
        password: formData.password,
        ip_address: formData.ip,
        port: formData.port,
        channel_number: formData.channel,
        stream_type: formData.stream,
      };

      const response = await fetch("http://localhost:8080/api/v1/cameras/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Add token for authentication (optional)
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const { detail } = await response.json();
        throw new Error(detail || "Failed to connect to the camera");
      }

      const data = await response.json();
      
      // ✅ Store active camera details in localStorage
      localStorage.setItem("activeCamera", JSON.stringify(data.data));

      // ✅ Success alert
      setSuccess("Camera connected successfully!");
      
      setTimeout(() => {
        // ✅ Redirect to `/live-monitoring/:cameraId`
        navigate(`/live-monitoring/${data.data._id}`);
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 shadow-lg rounded-lg">
      {/* Back Button */}
      <a href="/camera-configuration" className="text-blue-400 hover:underline text-sm mb-4 block">
        ← Back
      </a>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Enter RTSP Stream Details</h2>

      {/* ✅ Success Alert */}
      {success && <p className="text-green-400 text-sm mb-3">{success}</p>}

      {/* ❌ Error Alert */}
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Camera Name", name: "name", type: "text", placeholder: "Enter camera name" },
          { label: "Camera Location", name: "location", type: "text", placeholder: "Enter camera location" },
          { label: "Username", name: "username", type: "text", placeholder: "Enter username" },
          { label: "Password", name: "password", type: "password", placeholder: "Enter password" },
          { label: "IP Address", name: "ip", type: "text", placeholder: "Enter IP address" },
          { label: "RTSP Port", name: "port", type: "number", placeholder: "Enter RTSP port (default: 554)" },
          { label: "Channel Number", name: "channel", type: "number", placeholder: "Enter channel number" },
          { label: "Stream Type", name: "stream", type: "text", placeholder: "Enter stream type (01 for main, 02 for sub)" }
        ].map(({ label, name, type, placeholder }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-gray-300 text-sm mb-1">{label}:</label>
            <input
              type={type}
              id={name}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required
              className="p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Connecting..." : "Validate and Connect"}
        </button>
      </form>
    </div>
  );
};

export default RTSPSetup;
