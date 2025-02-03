import { useState } from "react";
import Header from "../components/common/Header";
import OverviewCards from "../components/analytics/OverviewCards";
import VisitorTrendChart from "../components/analytics/VisitorTrendChart";
import EntryExitFlowChart from "../components/analytics/EntryExitFlowChart";
import VisitorSegmentationChart from "../components/analytics/VisitorSegmentationChart";
import DwellTimeRetentionChart from "../components/analytics/DwellTimeRetentionChart";
import VisitorEngagementHeatmap from "../components/analytics/VisitorEngagementHeatmap";
import AIPoweredInsights from "../components/analytics/AIPoweredInsights";
import { Calendar, Camera, X } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Default styles
import "react-date-range/dist/theme/default.css"; // Theme styles

const demoCameras = [
  { id: "1", name: "Main Entrance" },
  { id: "2", name: "Lobby" },
  { id: "3", name: "Parking Area" },
];

const AnalyticsPage = () => {
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");
  const [selectedCamera, setSelectedCamera] = useState(demoCameras[0].id);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

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
                  setSelectedDateRange(e.target.value);
                  if (e.target.value === "Custom") setShowDatePicker(true);
                  else setShowDatePicker(false);
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
              </div>
            )}
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
          <VisitorEngagementHeatmap />
        </div>

        <AIPoweredInsights />
      </main>
    </div>
  );
};

export default AnalyticsPage;
