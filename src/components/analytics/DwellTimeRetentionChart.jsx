import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ✅ Custom Tooltip Component for Better UX
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-3 rounded-md shadow-lg"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.9)", // Dark theme background
          borderColor: "rgba(75, 85, 99, 0.8)", // Subtle border
        }}
      >
        <p className="text-sm font-semibold text-gray-300">Dwell Time: {payload[0].payload.time}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value} visitors
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DwellTimeRetentionChart = ({ selectedCamera, selectedDateRange }) => {
  const [dwellTimeData, setDwellTimeData] = useState([]);

  // ✅ Fetch Dwell Time Trends API
  const fetchDwellTimeTrends = async () => {
    if (!selectedCamera) return;

    // ✅ Extract userId from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?.id;

    let startDate = new Date();
    let endDate = new Date();

    if (selectedDateRange === "Last 7 Days") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (selectedDateRange === "Last 30 Days") {
      startDate.setDate(startDate.getDate() - 30);
    } else if (selectedDateRange === "Custom") {
      startDate = new Date(localStorage.getItem("startDate"));
      endDate = new Date(localStorage.getItem("endDate"));
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/analytics/dwell-time-trends?userId=${userId}&cameraId=${selectedCamera}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      if (!response.ok) throw new Error("Failed to fetch dwell time trends");
      const data = await response.json();

      // ✅ Format data for recharts (Ensuring both periods align)
      const formattedData = data.data.currentPeriod.map((entry, index) => ({
        time: entry.time,
        "Current Period": entry.visitors,
        "Previous Period": data.data.previousPeriod[index]?.visitors || 0,
      }));

      setDwellTimeData(formattedData);
    } catch (error) {
      console.error("Error fetching dwell time trends:", error);
    }
  };

  useEffect(() => {
    fetchDwellTimeTrends();
  }, [selectedCamera, selectedDateRange]);

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Dwell Time Comparison (10-20 min)</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dwellTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* ✅ Current Period Line */}
            <Line
              type="monotone"
              dataKey="Current Period"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />

            {/* ✅ Previous Period Line */}
            <Line
              type="monotone"
              dataKey="Previous Period"
              stroke="#F59E0B"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DwellTimeRetentionChart;
