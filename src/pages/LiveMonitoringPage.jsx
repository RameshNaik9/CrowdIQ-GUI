// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"; // 🚀 Warning Icon
// import Header from "../components/common/Header";
// import "@fontsource/orbitron";
// import { Switch } from "@headlessui/react"; // ✅ Web3-style toggle switch
// import RTSPPlayer from "../components/monitor/RTSPPlayer"; // ✅ Import RTSP Player Component

// const LiveMonitoringPage = () => {
//   const [videoMode, setVideoMode] = useState("live"); // "live" or "processed"
//   const [cameraData, setCameraData] = useState(null);
//   const [error, setError] = useState(null);
//   const { cameraId } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedCamera = localStorage.getItem("activeCamera");

//     if (storedCamera) {
//       try {
//         const parsedCamera = JSON.parse(storedCamera);
//         if (parsedCamera && parsedCamera._id) {
//           setCameraData(parsedCamera);
//         } else {
//           setCameraData(null);
//         }
//       } catch (error) {
//         console.error("Error parsing camera data:", error);
//         setCameraData(null);
//       }
//     } else {
//       setCameraData(null);
//     }

//     if (!storedCamera && location.pathname !== "/live-monitoring") {
//       navigate("/live-monitoring");
//     }
//   }, [cameraId, navigate]);

//   return (
//     <div className="flex-1 overflow-auto relative z-10">
//       {/* Header */}
//       <Header title="Live Monitoring" />

//       <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 relative">
//         {/* 🔴 If No Active Camera, Show Full Page Overlay */}
//         {!cameraData ? (
//           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 backdrop-blur-md text-white rounded-lg z-50">
//             <ExclamationTriangleIcon className="h-20 w-20 text-yellow-400 mb-6" />
//             <h2 className="text-4xl font-bold text-center">No Active Camera Found</h2>
//             <p className="text-gray-300 mt-3 text-lg text-center">
//               Please connect a camera to start monitoring.
//             </p>
//             <a
//               href="/camera-configuration"
//               className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-lg shadow-lg"
//             >
//               Connect a Camera
//             </a>
//           </div>
//         ) : (
//           <>
//             {/* Web3 Toggle Button */}
//             <div className="flex justify-center items-center gap-4 mb-6">
//               <span className="text-gray-400 text-lg font-medium">Live Video</span>
//               <Switch
//                 checked={videoMode === "processed"}
//                 onChange={() =>
//                   setVideoMode(videoMode === "live" ? "processed" : "live")
//                 }
//                 className={`relative inline-flex h-8 w-16 items-center rounded-full transition duration-300 ${
//                   videoMode === "processed" ? "bg-blue-600" : "bg-gray-700"
//                 }`}
//               >
//                 <span
//                   className={`absolute left-1 inline-block h-6 w-6 transform rounded-full bg-white transition ${
//                     videoMode === "processed" ? "translate-x-8" : "translate-x-0"
//                   }`}
//                 />
//               </Switch>
//               <span className="text-gray-400 text-lg font-medium">Processed Video</span>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Left: Video Player (Only One Video at a Time) */}
//               <div className="lg:col-span-2 bg-gray-900 p-4 rounded-lg shadow-md relative">
//                 <h2 className="text-xl font-semibold text-gray-100 mb-4">
//                   {videoMode === "live" ? "Live Camera Stream" : "Processed Video Stream"}
//                 </h2>

//                 {/* Video container with relative positioning */}
//                 <div className="relative">
//                   {videoMode === "live" ? (
//                     <RTSPPlayer streamUrl={cameraData?.stream_link} setError={setError} />
//                   ) : (
//                     <video
//                       src={cameraData?.processed_stream_link || "/live-processed-fixed.mp4"}
//                       autoPlay
//                       loop
//                       muted
//                       className="w-full h-96 rounded-lg shadow-lg"
//                     />
//                   )}

//                   {/* Error overlay shows only for the live video */}
//                   {videoMode === "live" && error && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white z-10">
//                       <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
//                       <p className="text-lg font-bold">{error}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Right: Camera Details */}
//               <div className="bg-gray-800 p-4 rounded-lg shadow-md">
//                 <h2 className="text-xl font-semibold text-gray-100 mb-4">Camera Details</h2>
//                 <ul className="space-y-2 text-gray-300 font-orbitron text-lg tracking-wider">
//                   <li>
//                     <strong>Name:</strong> {cameraData?.name}
//                   </li>
//                   <li>
//                     <strong>Location:</strong> {cameraData?.location}
//                   </li>
//                   <li>
//                     <strong>IP Address:</strong> {cameraData?.ip_address}
//                   </li>
//                   <li>
//                     <strong>Port:</strong> {cameraData?.port}
//                   </li>
//                   <li>
//                     <strong>Channel:</strong> {cameraData?.channel_number}
//                   </li>
//                   <li>
//                     <strong>Stream Type:</strong> {cameraData?.stream_type}
//                   </li>
//                   <li>
//                     <strong>Last Active:</strong> {cameraData?.last_active}
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// };

// export default LiveMonitoringPage;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"; // 🚀 Warning Icon
import Header from "../components/common/Header";
import "@fontsource/orbitron";
import { Switch } from "@headlessui/react"; // ✅ Web3-style toggle switch

const LiveMonitoringPage = () => {
  const [videoMode, setVideoMode] = useState("live"); // "live" or "processed"
  const [cameraData, setCameraData] = useState(null);
  const { cameraId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedCamera = localStorage.getItem("activeCamera");

    if (storedCamera) {
      try {
        const parsedCamera = JSON.parse(storedCamera);
        if (parsedCamera && parsedCamera._id) {
          setCameraData(parsedCamera);
        } else {
          setCameraData(null);
        }
      } catch (error) {
        console.error("Error parsing camera data:", error);
        setCameraData(null);
      }
    } else {
      setCameraData(null);
    }

    if (!storedCamera && location.pathname !== "/live-monitoring") {
      navigate("/live-monitoring");
    }
  }, [cameraId, navigate]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Header */}
      <Header title="Live Monitoring" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 relative">
        {/* 🔴 If No Active Camera, Show Full Page Overlay */}
        {!cameraData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 backdrop-blur-md text-white rounded-lg z-50">
            <ExclamationTriangleIcon className="h-20 w-20 text-yellow-400 mb-6" />
            <h2 className="text-4xl font-bold text-center">No Active Camera Found</h2>
            <p className="text-gray-300 mt-3 text-lg text-center">
              Please connect a camera to start monitoring.
            </p>
            <a
              href="/camera-configuration"
              className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-lg shadow-lg"
            >
              Connect a Camera
            </a>
          </div>
        ) : (
          <>
            {/* Web3 Toggle Button */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className="text-gray-400 text-lg font-medium">Live Video</span>
              <Switch
                checked={videoMode === "processed"}
                onChange={() =>
                  setVideoMode(videoMode === "live" ? "processed" : "live")
                }
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition duration-300 ${
                  videoMode === "processed" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute left-1 inline-block h-6 w-6 transform rounded-full bg-white transition ${
                    videoMode === "processed" ? "translate-x-8" : "translate-x-0"
                  }`}
                />
              </Switch>
              <span className="text-gray-400 text-lg font-medium">Processed Video</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Video Player (Only One Video at a Time) */}
              <div className="lg:col-span-2 bg-gray-900 p-4 rounded-lg shadow-md relative">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">
                  {videoMode === "live" ? "Live Camera Stream" : "Processed Video Stream"}
                </h2>

                {/* Video container with relative positioning */}
                <div className="relative">
                  {videoMode === "live" ? (
                    <video
                      src="/live-video.mp4"
                      autoPlay
                      loop
                      muted
                      className="w-full h-96 rounded-lg shadow-lg"
                      // controls
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  ) : (
                    <video
                      src={cameraData?.processed_stream_link || "/live-processed-fixed.mp4"}
                      autoPlay
                      loop
                      muted
                      className="w-full h-96 rounded-lg shadow-lg"
                      // controls
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  )}
                </div>
              </div>

              {/* Right: Camera Details */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Camera Details</h2>
                <ul className="space-y-2 text-gray-300 font-orbitron text-lg tracking-wider">
                  <li>
                    <strong>Name:</strong> {cameraData?.name}
                  </li>
                  <li>
                    <strong>Location:</strong> {cameraData?.location}
                  </li>
                  <li>
                    <strong>IP Address:</strong> {cameraData?.ip_address}
                  </li>
                  <li>
                    <strong>Port:</strong> {cameraData?.port}
                  </li>
                  <li>
                    <strong>Channel:</strong> {cameraData?.channel_number}
                  </li>
                  <li>
                    <strong>Stream Type:</strong> {cameraData?.stream_type}
                  </li>
                  <li>
                    <strong>Last Active:</strong> {cameraData?.last_active}
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default LiveMonitoringPage;
