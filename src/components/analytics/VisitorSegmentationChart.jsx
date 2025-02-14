import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const COLORS = ["#10B981", "#F59E0B"];

// ✅ Custom Tooltip for Better UX
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-3 rounded-md shadow-lg"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.9)", // Dark theme background
          borderColor: "rgba(75, 85, 99, 0.8)", // Subtle border
          color: "#E5E7EB",
        }}
      >
        <p className="text-sm font-semibold">{payload[0].payload.name}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            👥 {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const VisitorSegmentationChart = ({ selectedCamera, selectedDateRange }) => {
  const [visitorData, setVisitorData] = useState([]);

  // ✅ Fetch Visitor Segmentation API
  const fetchVisitorSegmentation = async () => {
    if (!selectedCamera) return;

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
        `http://localhost:8080/api/v1/analytics/visitor-segmentation?userId=${userId}&cameraId=${selectedCamera}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      if (!response.ok) throw new Error("Failed to fetch visitor segmentation");
      const data = await response.json();

      setVisitorData(data.data);
    } catch (error) {
      console.error("Error fetching visitor segmentation:", error);
    }
  };

  useEffect(() => {
    fetchVisitorSegmentation();
  }, [selectedCamera, selectedDateRange]);

  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-medium text-gray-100 mb-4">Returning vs. New Visitors</h2>

      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={visitorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="count" fill="#8884d8">
              {visitorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default VisitorSegmentationChart;
