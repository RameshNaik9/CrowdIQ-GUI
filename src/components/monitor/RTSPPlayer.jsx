import { useEffect, useRef } from "react";
import JSMpeg from "@cycjimmy/jsmpeg-player"; // Default import

const RTSPPlayer = ({ streamUrl, setError }) => {
  const videoRef = useRef(null);
  let player = useRef(null);

  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    try {
      // Initialize JSMpeg Player directly using the default import
      player.current = new JSMpeg.VideoElement(videoRef.current, streamUrl, {
        autoplay: true,
        loop: true,
        disableGl: false,
        audio: false,
      });

      console.log("JSMpeg Player Initialized for", streamUrl);
    } catch (error) {
      console.error("RTSP Streaming Error:", error);
      setError("Failed to load RTSP stream.");
    }
  }, [streamUrl, setError]);

  return <div ref={videoRef} className="video-player"></div>;
};

export default RTSPPlayer;