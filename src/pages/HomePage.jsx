import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      {/* Background Gradient & Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90" />
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Branding: Name + Tagline (Positioned at the Top) */}
      <motion.div
        className="absolute top-36 flex flex-col items-center z-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1
          className="text-8xl md:text-10xl font-extrabold tracking-wide"
          style={{
            textShadow: "3px 3px 10px rgba(0, 0, 0, 0.8), 0px 0px 15px rgba(59, 130, 246, 0.6)",
            transform: "perspective(500px) rotateX(0deg)",
          }}
        >
          C r o w d I Q
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mt-2 tracking-wide ">
          See beyond the crowd
        </p>

        {/* Login and Explore Button */}
        <Link to="/overview">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition flex items-center"
          >
            Login and Explore
          </motion.button>
        </Link>
      </motion.div>

      {/* Powered by DevelMo (Reduced Logo Size & Cursive Font) */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center z-10"
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
          className="h-48 w-48 md:h-56 md:w-56 opacity-100"
        />
      </motion.div>
    </div>
  );
};

export default HomePage;
