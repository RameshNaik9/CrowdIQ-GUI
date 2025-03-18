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
  const handleConnect = () => {
    // Optionally, build a local camera object and save to localStorage
    const localCamera = {
      _id: "local_" + Date.now(),
      name: "Local Camera",
      location: "This Device",
      stream_link: "local", // or a flag to denote it's a local stream
      type: "local",
      status: "online",
      last_active: new Date().toISOString(),
    };

    localStorage.setItem("activeCamera", JSON.stringify(localCamera));
    navigate(`/live-monitoring/${localCamera._id}`);
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
