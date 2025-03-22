import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GoogleLogin from "../components/auth/GoogleLogin"; // Import GoogleLogin component

const LoginPage = ({ setUser }) => {
  return (
    <div className="relative w-full h-screen flex bg-gray-900 text-white">
      {/* Background Gradient & Blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90" />
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Left: Branding & Logo */}
      <motion.div
        className="flex flex-col justify-center items-center w-1/2 h-full text-center z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1
          className="text-7xl md:text-8xl font-extrabold tracking-wide"
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
        {/* Light Glow Effect Behind Logo */}
        <div className="relative mt-6">
          <div className="absolute inset-0 w-48 h-48 bg-blue-500 opacity-20 blur-3xl rounded-full z-0"></div>
          <img
            src="/DM-02.png"
            alt="DevelMo Logo"
            className="relative h-40 w-40 md:h-56 md:w-56 opacity-100 z-10"
          />
        </div>
      </motion.div>

      {/* Right: Login Card */}
      <motion.div
        className="w-1/2 flex justify-center items-center z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-lg text-center border border-gray-700 w-[90%] max-w-md">
          <h1 className="text-3xl font-bold text-gray-100">Welcome to CrowdIQ</h1>
          <p className="text-gray-400 text-sm mt-2">Sign in to continue</p>

          {/* Google Sign-In Button (Now moved to a separate component) */}
          <GoogleLogin setUser={setUser} />

          {/* Redirect Link to Home */}
          <p className="mt-4 text-sm text-gray-400">
            Not registered? <Link to="/" className="text-blue-500 hover:underline">Go to Home</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
