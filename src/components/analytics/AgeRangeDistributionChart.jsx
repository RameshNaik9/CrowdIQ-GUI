import { useState, useEffect } from "react";
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

const AgeRangeDistributionChart = ({ cameraId, startDate, endDate }) => {
  const [ageRangeData, setAgeRangeData] = useState([]);

  // ✅ Fetch Age Range Data from API
  useEffect(() => {
    const fetchAgeRangeData = async () => {
      if (!cameraId || !startDate || !endDate) return;

      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(
          `http://localhost:8080/api/v1/analytics/age-range-distribution?userId=${userData?.id}&cameraId=${cameraId}&startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.ok) throw new Error("Failed to fetch age distribution");
        const data = await response.json();
        setAgeRangeData(data.data);
      } catch (error) {
        console.error("Error fetching age distribution:", error);
      }
    };

    fetchAgeRangeData();
  }, [cameraId, startDate, endDate]);

  // ✅ Custom Tooltip Component
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

  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-medium text-gray-100 mb-4">Age Range Distribution</h2>

      <div className="h-80">
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ageRangeData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="ageGroup" stroke="#9CA3AF" />
            <PolarRadiusAxis angle={30} domain={[0, 600]} stroke="#9CA3AF" />
            <Radar name="Total Visitors" dataKey="total" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            <Legend />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AgeRangeDistributionChart;
