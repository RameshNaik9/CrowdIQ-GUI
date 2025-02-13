import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import OverviewCards from "../components/analytics/OverviewCards";
import VisitorTrendChart from "../components/analytics/VisitorTrendChart";
import EntryExitFlowChart from "../components/analytics/EntryExitFlowChart";
import VisitorSegmentationChart from "../components/analytics/VisitorSegmentationChart";
import DwellTimeRetentionChart from "../components/analytics/DwellTimeRetentionChart";
import AgeRangeDistributionChart from "../components/analytics/AgeRangeDistributionChart";
import AIPoweredInsights from "../components/analytics/AIPoweredInsights";
import { Calendar, Camera, X, Check } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const AnalyticsPage = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(
    () => localStorage.getItem("selectedDateRange") || "Last 7 Days"
  );
  const [selectedCamera, setSelectedCamera] = useState(
    () => localStorage.getItem("selectedCamera") || null
  );
  const [cameras, setCameras] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateLabel, setCustomDateLabel] = useState(localStorage.getItem("customDateLabel") || "");
  const [pendingCustomDate, setPendingCustomDate] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // ✅ Fetch cameras from API and store in localStorage
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

        // ✅ Ensure selected camera persists across refreshes
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

  // ✅ Handle date range updates dynamically
  useEffect(() => {
    if (selectedDateRange === "Last 7 Days") {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      setDateRange([{ startDate, endDate: new Date(), key: "selection" }]);
    } else if (selectedDateRange === "Last 30 Days") {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      setDateRange([{ startDate, endDate: new Date(), key: "selection" }]);
    }
  }, [selectedDateRange]);

  // ✅ Apply custom date selection
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
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title="Visitor Analytics" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Filters: Date & Camera Selection */}
        <div className="flex justify-between items-center mb-6 relative">
          {/* Date Range Selector */}
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
              onChange={(e) => {
                setSelectedCamera(e.target.value);
                localStorage.setItem("selectedCamera", e.target.value);
              }}
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

        {/* KPI Cards (Overview) */}
        <OverviewCards
          cameraId={selectedCamera}
          selectedDateRange={selectedDateRange}
          startDate={dateRange[0].startDate.toISOString()}
          endDate={dateRange[0].endDate.toISOString()}
        />

        {/* Visitor Trends (Horizontal Full-Width) */}
        <div className="col-span-2 mb-8">
          <VisitorTrendChart />
        </div>

        {/* Remaining Charts in 2x2 Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <EntryExitFlowChart />
          <VisitorSegmentationChart />
          <DwellTimeRetentionChart />
          <AgeRangeDistributionChart />
        </div>

        <AIPoweredInsights />
      </main>
    </div>
  );
};

export default AnalyticsPage;
