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

const engagementData = [
  { zone: "Entrance", engagement: 120, fullMark: 150 },
  { zone: "Lobby", engagement: 98, fullMark: 150 },
  { zone: "Cafeteria", engagement: 86, fullMark: 150 },
  { zone: "Parking", engagement: 99, fullMark: 150 },
  { zone: "Elevator", engagement: 85, fullMark: 150 },
  { zone: "Corridor", engagement: 65, fullMark: 150 },
];

const VisitorEngagementHeatmap = () => {
  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-medium text-gray-100 mb-4">Visitor Engagement Heatmap</h2>

      <div className="h-80">
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={engagementData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="zone" stroke="#9CA3AF" />
            <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#9CA3AF" />
            <Radar name="Engagement Level" dataKey="engagement" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            <Legend />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default VisitorEngagementHeatmap;
