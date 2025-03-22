// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const LocalCameraSetup = () => {
//   const videoRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Request access to the local camera
//   useEffect(() => {
//     const getLocalStream = async () => {
//       try {
//         const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
//         setStream(mediaStream);
//         if (videoRef.current) {
//           videoRef.current.srcObject = mediaStream;
//         }
//       } catch (err) {
//         setError("Failed to access the local camera.");
//       }
//     };

//     getLocalStream();

//     // Cleanup on unmount
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   // Handle the connect action
//     const handleConnect = async () => {
//       const userData = JSON.parse(localStorage.getItem("user"));
//       if (!userData || !userData.id) {
//         setError("User is not logged in.");
//         return;
//       }
//       // Build the payload with fixed values for a local camera
//       const payload = {
//         userId: userData.id,
//         name: "Local Camera",         // fixed name for consistency
//         location: "This Device",      // fixed location
//         username: "",
//         password: "",
//         ip_address: "local",          // use a dummy value
//         port: 554,
//         channel_number: "1",
//         stream_type: "main",
//         type: "local",
//         stream_link: "local",
//       };
    
//       try {
//         const response = await fetch("http://localhost:8080/api/v1/cameras/connect", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify(payload),
//         });
//         if (!response.ok) {
//           const { detail } = await response.json();
//           throw new Error(detail || "Failed to connect to the local camera");
//         }
//         const data = await response.json();
//         localStorage.setItem("activeCamera", JSON.stringify(data.data));
//         navigate(`/live-monitoring/${data.data._id}`);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-semibold text-gray-100">Local Camera Setup</h3>
//       {error && <p className="text-red-400">{error}</p>}
//       <div className="w-full h-full bg-black rounded-lg overflow-hidden">
//         <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
//       </div>
//       <div className="flex justify-center">
//         <button
//           onClick={handleConnect}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
//         >
//           Connect Local Camera
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LocalCameraSetup;

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const LocalCameraSetup = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "Local Camera",
    location: "This Device",
  });
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

  // Handle input change for name and location
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle the connect action
  const handleConnect = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.id) {
      setError("User is not logged in.");
      return;
    }
    // Build the payload with user-entered name and location; remaining fields are defaults.
    const payload = {
      userId: userData.id,
      name: formData.name,
      location: formData.location,
      username: "",
      password: "",
      ip_address: "local",  // dummy value for local camera
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

      {/* Input fields for camera name and location */}
      <div className="space-y-2">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-gray-300 text-sm">Camera Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="location" className="text-gray-300 text-sm">Camera Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="p-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Video Preview */}
      <div className="w-full h-full bg-black rounded-lg overflow-hidden">
        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
      </div>

      {/* Connect Button */}
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
