import { useState, useEffect } from "react";
import { Users, UserCheck, Clock, BarChart2, Calendar, Camera, X, Check } from "lucide-react";
import { motion } from "framer-motion";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateLabel, setCustomDateLabel] = useState(localStorage.getItem("customDateLabel") || "");
  const [pendingCustomDate, setPendingCustomDate] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(localStorage.getItem("startDate") || new Date()),
      endDate: new Date(localStorage.getItem("endDate") || new Date()),
      key: "selection",
    },
  ]);

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
            "user-id": userData?.id,
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

  // ✅ Fetch analytics when camera or date range changes (excluding pending "Custom" selection)
  useEffect(() => {
    if (!selectedCamera || pendingCustomDate) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        let startDate = new Date();
        let endDate = new Date();

        if (selectedDateRange === "Last 7 Days") {
          startDate.setDate(startDate.getDate() - 7);
        } else if (selectedDateRange === "Last 30 Days") {
          startDate.setDate(startDate.getDate() - 30);
        } else if (selectedDateRange === "Custom") {
          startDate = dateRange[0].startDate;
          endDate = dateRange[0].endDate;
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
        setAnalytics(data.data[0]); // ✅ Store first item in `data`
        localStorage.setItem("overviewData", JSON.stringify(data.data[0]));
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedCamera, selectedDateRange, pendingCustomDate]);

  const applyCustomDate = () => {
    const formattedDateRange = `${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`;
    setSelectedDateRange("Custom");
    setCustomDateLabel(formattedDateRange);
    setShowDatePicker(false);
    setPendingCustomDate(false);

    localStorage.setItem("selectedDateRange", "Custom");
    localStorage.setItem("customDateLabel", formattedDateRange);
    localStorage.setItem("startDate", dateRange[0].startDate);
    localStorage.setItem("endDate", dateRange[0].endDate);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Header */}
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Filters: Date & Camera Selection */}
        <div className="flex justify-between items-center mb-6 relative">
          {/* Date Selector */}
          <div className="relative flex items-center space-x-3">
            <Calendar size={20} className="text-gray-400" />
            <select
              value={selectedDateRange}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedDateRange(value);
                setShowDatePicker(value === "Custom");
                if (value === "Custom") {
                  setPendingCustomDate(true);
                } else {
                  setCustomDateLabel("");
                }
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom</option>
            </select>

            {/* Display Selected Custom Date Range */}
            {selectedDateRange === "Custom" && customDateLabel && (
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md text-sm">
                {customDateLabel}
              </span>
            )}
          </div>

          {/* Custom Date Picker UI */}
          {showDatePicker && (
            <div className="absolute top-12 left-0 bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-700 z-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Select Date Range</span>
                <button onClick={() => setShowDatePicker(false)}>
                  <X size={18} className="text-gray-400 hover:text-gray-300" />
                </button>
              </div>
              <DateRange
                ranges={dateRange}
                onChange={(ranges) => setDateRange([ranges.selection])}
                rangeColors={["#3B82F6"]}
                className="text-gray-200"
              />
              <button
                onClick={applyCustomDate}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
              >
                <Check size={16} className="mr-2" />
                Apply Date Range
              </button>
            </div>
          )}

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

        {/* Overview Content */}
        <motion.div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          >
          <StatCard name="Total Visitors" icon={Users} value={analytics?.totalVisitors || "0"} color="#6366F1" />
          <StatCard name="Male Visitors" icon={UserCheck} value={analytics?.maleVisitors || "0"} color="#8B5CF6" />
          <StatCard name="Avg. Dwell Time" icon={Clock} value={analytics?.avgDwellTime || "0m"} color="#EC4899" />
          <StatCard name="Avg. Age" icon={BarChart2} value={analytics?.avgAge || "0"} color="#10B981" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <VisitorTrendChart data={analytics?.visitorTrend || []} />
          <GenderDistributionChart data={analytics?.genderDistribution || []} />
          <AgeDistributionChart data={analytics?.ageDistribution || []} />
          <DwellTimeChart data={analytics?.dwellTimeDistribution || []} />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
