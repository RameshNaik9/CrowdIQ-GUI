import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      {/* Background Gradient & Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90" />
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Branding: Name + Tagline (Shifted Upwards) */}
      <motion.div
        className="flex flex-col items-center z-10 text-center transform -translate-y-16" // Adjusted for more upper placement
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-wide">
          C r o w d I Q
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mt-2 tracking-wide ">
          See beyond the crowd
        </p>
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
          className="h-36 w-36 md:h-48 md:w-48 opacity-100"
        />
      </motion.div>
    </div>
  );
};

export default HomePage;
