import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      {/* Background Gradient & Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90" />
      <div className="absolute inset-0 backdrop-blur-sm z-0" /> {/* Ensures it's behind other elements */}

      {/* Branding: Name + Tagline (Positioned at the Top) */}
      <motion.div
        className="absolute top-32 flex flex-col items-center z-10 text-center"
        initial={{ opacity: 0, y: -90 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1
          className="text-9xl md:text-[10rem] font-extrabold tracking-wide"
          style={{
            textShadow: "4px 4px 12px rgba(0, 0, 0, 0.9), 0px 0px 20px rgba(59, 130, 246, 0.8)",
            transform: "perspective(600px) rotateX(0deg)",
          }}
        >
          C r o w d I Q
        </h1>
        <p className="text-gray-400 text-sm md:text-base mt-2 tracking-wide">
          S&nbsp;e&nbsp;e&nbsp;&nbsp;&nbsp;b&nbsp;e&nbsp;y&nbsp;o&nbsp;n&nbsp;d&nbsp;&nbsp;&nbsp;t&nbsp;h&nbsp;e&nbsp;&nbsp;&nbsp;c&nbsp;r&nbsp;o&nbsp;w&nbsp;d
        </p>
      </motion.div>

      {/* ✅ Login and Explore Button (Appears after delay) */}
      <motion.div
        className="mt-12 z-20" // Added z-20 to prevent blur effect
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
      >
        <Link to="/camera-configuration">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition flex items-center"
          >
            Login and Explore
          </motion.button>
        </Link>
      </motion.div>

      {/* ✅ Powered by DevelMo (With Smooth Light Glow Beneath Logo) */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
      >
        <p className="text-gray-500 text-lg italic tracking-wide font-serif">
          Powered by
        </p>
        {/* 🌟 Glow effect using a gradient for smooth fade */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-48 h-48 md:w-56 md:h-56 bg-gradient-to-t from-blue-500 to-transparent opacity-20 blur-3xl rounded-full z-0" />
        <img
          src="/DM-01.png"
          alt="DevelMo Logo"
          className="relative h-40 w-40 md:h-56 md:w-56 opacity-100 z-30"
        />
      </motion.div>
    </div>
  );
};

export default HomePage;
