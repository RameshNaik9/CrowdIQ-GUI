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
        className="absolute top-32 flex flex-col items-center z-10 text-center"
        initial={{ opacity: 0, y: -90 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* "CrowdIQ" in League Spartan with light color */}
        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-extrabold tracking-wide whitespace-nowrap"
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
          className="mt-2 text-gray-400 text-sm md:text-base tracking-widest"
          style={{ fontFamily: "'Aleo', serif" }}
        >
          See Beyond The Crowd
        </p>
      </motion.div>

      {/* Start Button with Web3-style Play Icon */}
      <motion.div
        className="mt-12 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
      >
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full shadow-xl transition
                       bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900
                       hover:from-gray-800 hover:to-black text-white"
            style={{ fontFamily: "'Aleo', serif" }}
          >
            <PlayCircle className="mr-2 h-6 w-6" />
            Start
          </motion.button>
        </Link>
      </motion.div>

      {/* Powered by DevelMo */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
      >
        <p
          className="text-gray-500 text-lg italic tracking-wide mb-1"
          style={{ fontFamily: "'Aleo', serif" }}
        >
          POWERED BY
        </p>
        {/* Glow effect behind the logo */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-gradient-to-t from-gray-600 to-transparent opacity-20 blur-3xl rounded-full z-0" />
        <img
          src="/Artboard 7-8.png"
          alt="DevelMo Logo"
          className="relative h-32 w-32 md:h-40 md:w-40 opacity-100 z-10"
        />
      </motion.div>
    </div>
  );
};

export default HomePage;
