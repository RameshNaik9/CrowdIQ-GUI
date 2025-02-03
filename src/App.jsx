import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/UsersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import ConfigurationPage from "./pages/ConfigurationPage";
import LiveMonitoringPage from "./pages/LiveMonitoringPage";
import RawDataLogsPage from "./pages/RawDataLogsPage";


function App() {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Sidebar />
			<Routes>
				{/* <Route path='/' element={<OverviewPage />} /> */}
				<Route path='/camera-configuration' element={<ConfigurationPage/>} />
				<Route path='/live-monitoring' element={<LiveMonitoringPage/>} />
				<Route path='/analytics' element={<AnalyticsPage />} />
				<Route path='/overview' element={<OverviewPage/>} />
				<Route path="/raw-data-logs" element={<RawDataLogsPage />} /> 
				<Route path='/users' element={<UsersPage />} />
				<Route path='/settings' element={<SettingsPage />} />
			</Routes>
		</div>
	);
}

export default App;
