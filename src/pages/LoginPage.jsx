import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"; // Importing Google icon from react-icons

const LoginPage = () => {
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      {/* Background Gradient & Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90" />
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Login Box */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-lg text-center border border-gray-700 z-10 w-[90%] max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl font-bold text-gray-100">Welcome to CrowdIQ</h1>
        <p className="text-gray-400 text-sm mt-2">Sign in to continue</p>

        {/* Google Sign-In Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-white text-gray-900 px-4 py-3 rounded-lg shadow-md hover:bg-gray-200 transition font-semibold"
          onClick={() => console.log("Google Sign-In Triggered")}
        >
          <FcGoogle size={20} className="text-red-500" />
          Continue with Google
        </motion.button>

        {/* Redirect Link to Home */}
        <p className="mt-4 text-sm text-gray-400">
          Not registered? <Link to="/" className="text-blue-500 hover:underline">Go to Home</Link>
        </p>
      </motion.div>

      {/* Powered by DevelMo */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <img
          src="/DM-01.png"
          alt="DevelMo Logo"
          className="h-40 w-40 md:h-56 md:w-56 opacity-100"
        />
      </motion.div>
    </div>
  );
};

export default LoginPage;

