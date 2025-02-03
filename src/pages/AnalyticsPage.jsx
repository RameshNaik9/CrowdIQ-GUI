import { useState } from "react";
import Header from "../components/common/Header";
import OverviewCards from "../components/analytics/OverviewCards";
import VisitorTrendChart from "../components/analytics/VisitorTrendChart";
import EntryExitFlowChart from "../components/analytics/EntryExitFlowChart";
import VisitorSegmentationChart from "../components/analytics/VisitorSegmentationChart";
import DwellTimeRetentionChart from "../components/analytics/DwellTimeRetentionChart";
import VisitorEngagementHeatmap from "../components/analytics/VisitorEngagementHeatmap";
import AIPoweredInsights from "../components/analytics/AIPoweredInsights";
import { Calendar, Camera } from "lucide-react";

const demoCameras = [
  { id: "1", name: "Main Entrance" },
  { id: "2", name: "Lobby" },
  { id: "3", name: "Parking Area" },
];

const AnalyticsPage = () => {
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 Days");
  const [selectedCamera, setSelectedCamera] = useState(demoCameras[0].id);

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title="Visitor Analytics" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Filters: Date & Camera Selection */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Calendar size={20} className="text-gray-400" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom</option>
            </select>
          </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <VisitorTrendChart />
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
