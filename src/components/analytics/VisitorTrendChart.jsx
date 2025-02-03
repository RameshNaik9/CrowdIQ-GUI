import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const visitorData = [
  { time: "6 AM", today: 20, lastWeek: 18 },
  { time: "7 AM", today: 45, lastWeek: 38 },
  { time: "8 AM", today: 75, lastWeek: 60 },
  { time: "9 AM", today: 120, lastWeek: 100 },
  { time: "10 AM", today: 180, lastWeek: 150 },
  { time: "11 AM", today: 200, lastWeek: 180 },
  { time: "12 PM", today: 250, lastWeek: 220 },
  { time: "1 PM", today: 230, lastWeek: 200 },
  { time: "2 PM", today: 210, lastWeek: 190 },
  { time: "3 PM", today: 190, lastWeek: 170 },
  { time: "4 PM", today: 150, lastWeek: 140 },
  { time: "5 PM", today: 130, lastWeek: 120 },
];

const VisitorTrendChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 7 Days");

  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-100">Visitor Trends (Hourly)</h2>
        <select
          className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option>Today</option>
          <option>Last 7 Days</option>
        </select>
      </div>

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
                const color = name === "today" ? "#8B5CF6" : "#10B981";
                return <span style={{ color }}>{value}</span>;
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="today" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
            <Area type="monotone" dataKey="lastWeek" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default VisitorTrendChart;