import { useEffect, useRef } from "react";
import JSMpeg from "@cycjimmy/jsmpeg-player"; // ✅ Correct Import

const RTSPPlayer = ({ streamUrl, setError }) => {
  const videoRef = useRef(null);
  let player = useRef(null);

  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    try {
      // ✅ Initialize JSMpeg Player (Corrected)
      player.current = new JSMpeg(videoRef.current, {
        source: streamUrl,
        autoplay: true,
        loop: true,
        disableGl: false, // ✅ Enable WebGL for better performance
        audio: false, // ✅ Disable audio for efficiency
      });

      console.log("JSMpeg Player Initialized for", streamUrl);
    } catch (error) {
      console.error("RTSP Streaming Error:", error);
      setError("Failed to load RTSP stream.");
    }

    return () => {
      if (player.current) {
        player.current.destroy();
      }
    };
  }, [streamUrl, setError]);

  return (
    <div className="w-full h-96 rounded-lg shadow-lg bg-black flex items-center justify-center">
      <canvas ref={videoRef} className="w-full h-full" />
    </div>
  );
};

export default RTSPPlayer;
