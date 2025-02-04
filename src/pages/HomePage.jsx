import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRightCircle } from "lucide-react";

const HomePage = () => {
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      {/* Background Gradient & Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90" />
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Branding: Name + Tagline (Shifted Upwards) */}
      <motion.div
        className="flex flex-col items-center z-10 text-center transform -translate-y-10" // Adjusted translate-y value
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-wide">
          C r o w d I Q
        </h1>
        <p className="text-gray-400 text-sm md:text-base mt-2 tracking-wide uppercase">
          See beyond the crowd
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Link to="/overview">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold transition"
          >
            Explore Platform <ArrowRightCircle size={24} />
          </motion.button>
        </Link>
      </motion.div>

      {/* Powered by DevelMo (Reduced Logo Size & Cursive Font) */}
      <motion.div
        className="absolute bottom-12 flex flex-col items-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <p className="text-gray-500 text-lg italic tracking-wide font-serif">
          Powered by
        </p>
        <img
          src="/DM-01.png"
          alt="DevelMo Logo"
          className="h-40 w-40 md:h-56 md:w-56 opacity-90"
        />
      </motion.div>
    </div>
  );
};

export default HomePage;