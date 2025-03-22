import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GoogleLogin from "../components/auth/GoogleLogin"; // Adjust path as necessary

const LoginPage = ({ setUser }) => {
  return (
    <div className="relative w-full h-screen flex flex-row items-center justify-center overflow-hidden text-white">
      {/* Dark Faded Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-95" />
      <div className="absolute inset-0 backdrop-blur-md z-0" />

      {/* Left Section: Branding */}
      <motion.div
        className="relative z-10 w-1/2 h-full flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0, x: -90 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        {/* "CrowdIQ" in League Spartan */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-wide whitespace-nowrap"
          style={{
            fontFamily: "'League Spartan', sans-serif",
            color: "#F9FAFB",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
          }}
        >
          CrowdIQ
        </h1>
        {/* Tagline in Aleo */}
        <p
          className="mt-4 text-gray-400 text-lg sm:text-xl md:text-2xl tracking-widest"
          style={{ fontFamily: "'Aleo', serif" }}
        >
          See Beyond The Crowd
        </p>

        {/* Same Logo from Home Page */}
        <div className="relative mt-8 w-80 h-80 overflow-hidden rounded-full z-10">
          <img
            src="/Artboard 7-8.png" 
            alt="DevelMo Logo"
            className="w-full h-full object-cover"
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
