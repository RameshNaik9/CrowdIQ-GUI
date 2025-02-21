/**
 * File: App.jsx
 * Description: Main React app file with routes. 
 * We add the CameraConnectionProvider so that the WebSocket
 * is created at app startup (if an active camera is detected).
 */

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Google Auth Provider
import Sidebar from "./components/common/Sidebar";
import HomePage from "./pages/HomePage";
import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/UsersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import ConfigurationPage from "./pages/ConfigurationPage";
import LiveMonitoringPage from "./pages/LiveMonitoringPage";
import RawDataLogsPage from "./pages/RawDataLogsPage";
import LoginPage from "./pages/LoginPage";

/** Import your new Context Provider */
import { CameraConnectionProvider } from "./context/CameraConnectionContext";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setUser] = useState(null);
  const [activeCamera, setActiveCamera] = useState(null);

  // Load user & active camera from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedCamera = localStorage.getItem("activeCamera");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedCamera) {
      const cameraData = JSON.parse(storedCamera);
      setActiveCamera(cameraData._id);
    }
  }, []);

  // Redirect `/live-monitoring` => `/live-monitoring/:cameraId` if a camera is active
  useEffect(() => {
    if (location.pathname === "/live-monitoring" && activeCamera) {
      navigate(`/live-monitoring/${activeCamera}`);
    }
  }, [location.pathname, activeCamera, navigate]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {/* Wrap everything in the CameraConnectionProvider */}
      <CameraConnectionProvider>
        <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
          {location.pathname !== "/" && location.pathname !== "/login" && <Sidebar />}
          {/* BG Overlay */}
          <div className="fixed inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
            <div className="absolute inset-0 backdrop-blur-sm" />
          </div>

          {/* Routes */}
          {/* <div className="relative flex-1"> */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/camera-configuration" element={<ConfigurationPage />} />
              <Route path="/live-monitoring" element={<LiveMonitoringPage />} />
              <Route path="/live-monitoring/:cameraId" element={<LiveMonitoringPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/raw-data-logs" element={<RawDataLogsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
            </Routes>
          {/* </div> */}
        </div>
      </CameraConnectionProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
