import { useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
} from "recharts";

const ageRangeData = [
  { ageGroup: "0-18", total: 150, males: 80, females: 70 },
  { ageGroup: "18-25", total: 320, males: 180, females: 140 },
  { ageGroup: "26-35", total: 500, males: 260, females: 240 },
  { ageGroup: "36-50", total: 420, males: 230, females: 190 },
  { ageGroup: "50+", total: 300, males: 140, females: 160 },
];

// ✅ Custom Tooltip Component with Matching UI
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { ageGroup, total, males, females } = payload[0].payload;
    return (
      <div className="bg-gray-900 p-3 rounded-lg shadow-md border border-gray-700 text-gray-300">
        <h4 className="text-sm font-medium text-blue-400">{ageGroup} Age Group</h4>
        <p className="text-xs">👥 Total Visitors: <span className="font-bold">{total}</span></p>
        <p className="text-xs text-blue-400">👨 Males: <span className="font-bold">{males}</span></p>
        <p className="text-xs text-pink-400">👩 Females: <span className="font-bold">{females}</span></p>
      </div>
    );
  }
  return null;
};

const AgeRangeDistributionChart = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);

  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-medium text-gray-100 mb-4">Age Range Distribution</h2>

      <div className="h-80">
        <ResponsiveContainer>
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={ageRangeData}
            onClick={(e) => setSelectedAgeGroup(e.activePayload ? e.activePayload[0].payload : null)}
          >
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="ageGroup" stroke="#9CA3AF" />
            <PolarRadiusAxis angle={30} domain={[0, 600]} stroke="#9CA3AF" />
            <Radar name="Total Visitors" dataKey="total" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            <Legend />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Show Details of Selected Age Group */}
      {selectedAgeGroup && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg text-gray-300">
          <h3 className="text-lg font-semibold">{selectedAgeGroup.ageGroup} Age Group</h3>
          <p>👥 Total Visitors: <span className="font-bold">{selectedAgeGroup.total}</span></p>
          <p>👨 Males: <span className="font-bold text-blue-400">{selectedAgeGroup.males}</span></p>
          <p>👩 Females: <span className="font-bold text-pink-400">{selectedAgeGroup.females}</span></p>
        </div>
      )}
    </motion.div>
  );
};

export default AgeRangeDistributionChart;
