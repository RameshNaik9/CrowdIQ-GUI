import { useState, useEffect } from "react";
import { Users, UserCheck, Clock, BarChart2, Calendar, Camera } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import VisitorTrendChart from "../components/overview/VisitorTrendChart";
import AgeDistributionChart from "../components/overview/AgeDistributionChart";
import GenderDistributionChart from "../components/overview/GenderDistributionChart";
import DwellTimeChart from "../components/overview/DwellTimeChart";

const demoCameras = [
  { id: "1", name: "Main Entrance" },
  { id: "2", name: "Lobby" },
  { id: "3", name: "Parking Area" },
];

const OverviewPage = () => {
  // ✅ Load stored values from localStorage
  const [selectedDateRange, setSelectedDateRange] = useState(() =>
    localStorage.getItem("selectedDateRange") || "Today"
  );
  const [selectedCamera, setSelectedCamera] = useState(() =>
    localStorage.getItem("selectedCamera") || demoCameras[0].id
  );

  // ✅ Save selections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedDateRange", selectedDateRange);
  }, [selectedDateRange]);

  useEffect(() => {
    localStorage.setItem("selectedCamera", selectedCamera);
  }, [selectedCamera]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Header */}
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Filters: Date & Camera Selection */}
        <div className="flex justify-between items-center mb-6">
          {/* Date Selector */}
          <div className="flex items-center space-x-3">
            <Calendar size={20} className="text-gray-400" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom</option>
            </select>
          </div>

          {/* Camera Selector */}
          <div className="flex items-center space-x-3">
            <Camera size={20} className="text-gray-400" />
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
            >
              {demoCameras.map((camera) => (
                <option key={camera.id} value={camera.id}>{camera.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Visitors" icon={Users} value="2,345" color="#6366F1" />
          <StatCard name="Male Visitors" icon={UserCheck} value="1,245" color="#8B5CF6" />
          <StatCard name="Avg. Dwell Time" icon={Clock} value="14m 32s" color="#EC4899" />
          <StatCard name="Avg. Age" icon={BarChart2} value="29 Years" color="#10B981" />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <VisitorTrendChart />
          <GenderDistributionChart />
          <AgeDistributionChart />
          <DwellTimeChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
