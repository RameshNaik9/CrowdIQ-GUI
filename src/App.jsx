import { Route, Routes, useLocation } from "react-router-dom";

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


function App() {
	const location = useLocation(); // Get the current page location

	return (
		// <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
		<div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {location.pathname !== "/" && <Sidebar />}
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			{/* <Sidebar /> */}
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/camera-configuration' element={<ConfigurationPage/>} />
				<Route path='/live-monitoring' element={<LiveMonitoringPage/>} />
				<Route path='/analytics' element={<AnalyticsPage />} />
				<Route path='/overview' element={<OverviewPage/>} />
				<Route path="/raw-data-logs" element={<RawDataLogsPage />} /> 
				<Route path='/users' element={<UsersPage />} />
				<Route path='/settings' element={<SettingsPage />} />
				<Route path='/login' element={<LoginPage />} />
			</Routes>
		</div>
	);
}

export default App;
