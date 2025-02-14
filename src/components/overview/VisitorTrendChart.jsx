import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

// ✅ Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div
        className="p-3 rounded-md shadow-lg"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.9)", // Dark theme background
          borderColor: "rgba(75, 85, 99, 0.8)", // Subtle border
        }}
      >
        <p className="text-sm font-semibold text-gray-300">{data.payload.time}</p>
        <p
          className="text-sm font-medium"
          style={{ color: data.color }} // Tooltip text color matches the line color
        >
          Visitors: {data.value}
        </p>
      </div>
    );
  }
  return null;
};

const VisitorTrendChart = ({ data }) => {
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Visitor Trend (Hourly)</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default VisitorTrendChart;
