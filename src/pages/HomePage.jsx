import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";

const HomePage = () => {
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Dark Faded Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-95" />
      <div className="absolute inset-0 backdrop-blur-md z-0" />

      {/* Branding: Title & Tagline */}
      <motion.div
        className="absolute top-24 sm:top-32 flex flex-col items-center z-10 text-center px-4"
        initial={{ opacity: 0, y: -90 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* "CrowdIQ" in League Spartan with light color */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] font-extrabold tracking-wide whitespace-nowrap"
          style={{
            fontFamily: "'League Spartan', sans-serif",
            color: "#F9FAFB", // Light color for visibility on dark background
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)"
          }}
        >
          CrowdIQ
        </h1>
        {/* Tagline in Aleo */}
        <p
          className="mt-4 text-gray-400 text-sm sm:text-base md:text-lg tracking-widest"
          style={{ fontFamily: "'Aleo', serif" }}
        >
          See Beyond The Crowd
        </p>
      </motion.div>

      {/* Start Button with Web3-style Play Icon */}
      <motion.div
        className="mt-16 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
      >
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full shadow-xl transition
                       bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900
                       hover:from-gray-800 hover:to-black text-white"
            style={{ fontFamily: "'Aleo', serif" }}
          >
            <PlayCircle className="mr-3 h-6 w-6" />
            Start
          </motion.button>
        </Link>
      </motion.div>

      {/* Powered by DevelMo */}
      <motion.div
        className="absolute bottom-8 sm:bottom-10 flex flex-col items-center z-10 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
      >
        <p
          className="text-gray-500 text-base sm:text-lg italic tracking-wide mb-2"
          style={{ fontFamily: "'Aleo', serif" }}
        >
          POWERED BY
        </p>
        {/* Glow effect behind the logo */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-40 sm:w-48 h-40 sm:h-48 bg-gradient-to-t from-gray-600 to-transparent opacity-20 blur-3xl rounded-full z-0" />
        {/* Logo container with fixed dimensions and cropping */}
        <div className="relative w-48 h-48 overflow-hidden rounded-full z-10">
          <img
            src="/Artboard 7-8.png"
            alt="DevelMo Logo"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
