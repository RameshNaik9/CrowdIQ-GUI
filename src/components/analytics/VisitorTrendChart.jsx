import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const VisitorTrendChart = ({ cameraId, selectedDateRange, startDate, endDate }) => {
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Extract userId from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;

  useEffect(() => {
    if (!userId || !cameraId || !startDate || !endDate) return;

    const fetchVisitorTrends = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:8080/api/v1/analytics/visitor-trends?userId=${userId}&cameraId=${cameraId}&startDate=${startDate}&endDate=${endDate}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch visitor trends");

        const data = await response.json();

        // ✅ Format Data for Graph
        const formattedData = data.data.currentPeriod.map((item) => ({
          time: item.hour,
          current: item.visitors,
          previous: data.data.previousPeriod.find((p) => p.hour === item.hour)?.visitors || 0,
        }));

        setVisitorData(formattedData);
      } catch (error) {
        console.error("Error fetching visitor trends:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorTrends();
  }, [userId, cameraId, selectedDateRange, startDate, endDate]); // ✅ Re-fetch when date range changes

  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-100">Visitor Trends (Hourly)</h2>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
                formatter={(value, name) => {
                  const color = name === "current" ? "#8B5CF6" : "#10B981";
                  return <span style={{ color }}>{value}</span>;
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="current" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Current Period" />
              <Area type="monotone" dataKey="previous" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Previous Period" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default VisitorTrendChart;
