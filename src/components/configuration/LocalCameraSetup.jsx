import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const LocalCameraSetup = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Request access to the local camera
  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError("Failed to access the local camera.");
      }
    };

    getLocalStream();

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle the connect action
    const handleConnect = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.id) {
        setError("User is not logged in.");
        return;
    }
    // Build the payload for a local camera.
    const payload = {
        userId: userData.id,
        name: "Local Camera",
        location: "This Device",
        // For local camera, you might not need username, password, ip_address, port, channel_number, stream_type.
        // You can pass dummy values or leave them as empty strings as required.
        username: "",
        password: "",
        ip_address: "",
        port: 554,
        channel_number: "1",
        stream_type: "main",
        type: "local",
        stream_link: "local",
    };

    try {
        const response = await fetch("http://localhost:8080/api/v1/cameras/connect", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
        });
        if (!response.ok) {
        const { detail } = await response.json();
        throw new Error(detail || "Failed to connect to the local camera");
        }
        const data = await response.json();
        localStorage.setItem("activeCamera", JSON.stringify(data.data));
        navigate(`/live-monitoring/${data.data._id}`);
    } catch (err) {
        setError(err.message);
    }
    };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-100">Local Camera Setup</h3>
      {error && <p className="text-red-400">{error}</p>}
      <div className="w-full h-full bg-black rounded-lg overflow-hidden">
        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleConnect}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Connect Local Camera
        </button>
      </div>
    </div>
  );
};

export default LocalCameraSetup;
