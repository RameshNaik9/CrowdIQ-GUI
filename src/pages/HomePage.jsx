import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// If you're using lucide-react:
import { Play } from "lucide-react";

const HomePage = () => {
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background Gradient (Pastel) */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-90" />
      <div className="absolute inset-0 backdrop-blur-sm z-0" />

      {/* Branding: Name + Tagline */}
      <motion.div
        className="absolute top-32 flex flex-col items-center z-10 text-center"
        initial={{ opacity: 0, y: -90 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* "CrowdIQ" in League Spartan with a dark color */}
        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]
                     font-extrabold tracking-wide whitespace-nowrap text-gray-900"
          style={{
            fontFamily: "'League Spartan', sans-serif",
            textShadow: "3px 3px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          CrowdIQ
        </h1>

        {/* Tagline in Aleo */}
        <p
          className="mt-2 text-gray-800 text-sm md:text-base tracking-widest"
          style={{ fontFamily: "'Aleo', serif" }}
        >
          See Beyond The Crowd
        </p>
      </motion.div>

      {/* Start Button with Play Icon */}
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
            className="px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition
                       bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                       hover:from-pink-500 hover:to-indigo-500
                       text-white flex items-center justify-center"
            style={{ fontFamily: "'Aleo', serif" }}
          >
            <Play className="mr-2 h-5 w-5" />
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
          className="text-gray-700 text-lg italic tracking-wide mb-1"
          style={{ fontFamily: "'Aleo', serif" }}
        >
          Powered by
        </p>
        {/* Glow behind the logo */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-gradient-to-t from-purple-400 to-transparent opacity-30 blur-3xl rounded-full z-0" />
        <img
          src="/Artboard 16-100.jpg"
          alt="DevelMo Logo"
          className="relative h-32 w-32 md:h-40 md:w-40 opacity-100 z-10"
        />
      </motion.div>
    </div>
  );
};

export default HomePage;
