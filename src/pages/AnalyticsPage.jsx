import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import OverviewCards from "../components/analytics/OverviewCards";
import VisitorTrendChart from "../components/analytics/VisitorTrendChart";
import EntryExitFlowChart from "../components/analytics/EntryExitFlowChart";
import VisitorSegmentationChart from "../components/analytics/VisitorSegmentationChart";
import DwellTimeRetentionChart from "../components/analytics/DwellTimeRetentionChart";
// import VisitorEngagementHeatmap from "../components/analytics/VisitorEngagementHeatmap";
import AgeRangeDistributionChart from "../components/analytics/AgeRangeDistributionChart";
import AIPoweredInsights from "../components/analytics/AIPoweredInsights";
import { Calendar, Camera, X, Check } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Default styles
import "react-date-range/dist/theme/default.css"; // Theme styles

const demoCameras = [
  { id: "1", name: "Main Entrance" },
  { id: "2", name: "Lobby" },
  { id: "3", name: "Parking Area" },
];

const AnalyticsPage = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(() =>
    localStorage.getItem("selectedDateRange") || "Last 7 Days"
  );
  const [selectedCamera, setSelectedCamera] = useState(() =>
    localStorage.getItem("selectedCamera") || demoCameras[0].id
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(localStorage.getItem("startDate") || new Date()),
      endDate: new Date(localStorage.getItem("endDate") || new Date()),
      key: "selection",
    },
  ]);
  const [data, setData] = useState(null); // Placeholder for fetched data

  useEffect(() => {
    // Store selections in localStorage to persist after refresh
    localStorage.setItem("selectedDateRange", selectedDateRange);
    localStorage.setItem("selectedCamera", selectedCamera);
    if (selectedDateRange.includes("-")) {
      localStorage.setItem("startDate", dateRange[0].startDate);
      localStorage.setItem("endDate", dateRange[0].endDate);
    }

    // 🔥 **Simulated API Fetch (Replace with real API call)**
    console.log(`Fetching data for ${selectedDateRange}, Camera ID: ${selectedCamera}`);
    setTimeout(() => {
      setData({ message: "New data loaded!" });
    }, 500); // Simulate delay
  }, [selectedDateRange, selectedCamera]);

  const applyCustomDate = () => {
    const formattedDateRange = `${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`;
    setSelectedDateRange(formattedDateRange);
    setShowDatePicker(false);
    localStorage.setItem("selectedDateRange", formattedDateRange);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title="Visitor Analytics" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Filters: Date & Camera Selection */}
        <div className="flex justify-between items-center mb-6 relative">
          {/* Date Range Selector */}
          <div className="relative">
            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-gray-400" />
              <select
                value={selectedDateRange}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedDateRange(value);
                  setShowDatePicker(value === "Custom");
                }}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Custom</option>
              </select>
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
          </div>

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
              {demoCameras.map((camera) => (
                <option key={camera.id} value={camera.id}>{camera.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Fetch Message (Demo) */}
        {data && (
          <p className="text-green-400 text-sm text-center mb-4">{data.message}</p>
        )}

        <OverviewCards />

        {/* Visitor Trends (Hourly) - Full Width */}
        <div className="col-span-2 mb-8">
          <VisitorTrendChart />
        </div>

        {/* Remaining Charts in 2x2 Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <EntryExitFlowChart />
          <VisitorSegmentationChart />
          <DwellTimeRetentionChart />
          {/* <VisitorEngagementHeatmap /> */}
      <AgeRangeDistributionChart />
        </div>

        <AIPoweredInsights />
      </main>
    </div>
  );
};

export default AnalyticsPage;
