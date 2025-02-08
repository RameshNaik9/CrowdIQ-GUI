import { useState, useEffect } from "react";
import { Users, UserCheck, Clock, BarChart2, Calendar, Camera } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import VisitorTrendChart from "../components/overview/VisitorTrendChart";
import AgeDistributionChart from "../components/overview/AgeDistributionChart";
import GenderDistributionChart from "../components/overview/GenderDistributionChart";
import DwellTimeChart from "../components/overview/DwellTimeChart";

const OverviewPage = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(
    () => localStorage.getItem("selectedDateRange") || "Today"
  );
  const [selectedCamera, setSelectedCamera] = useState(
    () => localStorage.getItem("selectedCamera") || null
  );
  const [cameras, setCameras] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all cameras from API & store in localStorage
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(`http://localhost:8080/api/v1/cameras`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "user-id": userData?.id, // ✅ Ensure user ID is sent
          },
        });

        if (!response.ok) throw new Error("Failed to fetch cameras");
        const data = await response.json();

        setCameras(data.data);
        localStorage.setItem("cameras", JSON.stringify(data.data));

        // ✅ Ensure the selected camera persists across refreshes
        const storedCamera = localStorage.getItem("selectedCamera");
        if (!storedCamera && data.data.length > 0) {
          setSelectedCamera(data.data[0]._id);
          localStorage.setItem("selectedCamera", data.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras();
  }, []);

  // ✅ Persist selected date range in localStorage
  useEffect(() => {
    localStorage.setItem("selectedDateRange", selectedDateRange);
  }, [selectedDateRange]);

  // ✅ Persist selected camera in localStorage
  useEffect(() => {
    localStorage.setItem("selectedCamera", selectedCamera);
  }, [selectedCamera]);

  // ✅ Fetch analytics when camera or date range changes
  useEffect(() => {
    if (!selectedCamera) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const startDate = new Date();
        const endDate = new Date();

        if (selectedDateRange === "Last 7 Days") {
          startDate.setDate(startDate.getDate() - 7);
        } else if (selectedDateRange === "Last 30 Days") {
          startDate.setDate(startDate.getDate() - 30);
        }

        const response = await fetch(
          `http://localhost:8080/api/v1/overview?cameraId=${selectedCamera}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch analytics");
        const data = await response.json();
        setAnalytics(data.data);
        localStorage.setItem("overviewData", JSON.stringify(data.data));
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedCamera, selectedDateRange]);

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
              {cameras.map((camera) => (
                <option key={camera._id} value={camera._id}>
                  {camera.name}
                </option>
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
          <StatCard name="Total Visitors" icon={Users} value={analytics?.totalVisitors || "0"} color="#6366F1" />
          <StatCard name="Male Visitors" icon={UserCheck} value={analytics?.maleVisitors || "0"} color="#8B5CF6" />
          <StatCard name="Avg. Dwell Time" icon={Clock} value={analytics?.avgDwellTime || "0m"} color="#EC4899" />
          <StatCard name="Avg. Age" icon={BarChart2} value={analytics?.avgAge || "0"} color="#10B981" />
        </motion.div>

        {/* Charts Section */}
        {loading ? (
          <p className="text-center text-gray-400">Loading data...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <VisitorTrendChart data={analytics?.visitorTrend || []} />
            <GenderDistributionChart data={analytics?.genderDistribution || []} />
            <AgeDistributionChart data={analytics?.ageDistribution || []} />
            <DwellTimeChart data={analytics?.dwellTimeDistribution || []} />
          </div>
        )}
      </main>
    </div>
  );
};

export default OverviewPage;
