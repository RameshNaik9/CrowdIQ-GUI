import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981"];

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
        <p className="text-sm font-semibold text-gray-300">Age: {data.payload.name}</p>
        <p
          className="text-sm font-medium"
          style={{ color: data.payload.fill }} // Text color matches bar color
        >
          Count: {data.value}
        </p>
      </div>
    );
  }
  return null;
};

const AgeDistributionChart = ({ data }) => {
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Age Distribution</h2>

      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="count" fill="#8884d8">
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AgeDistributionChart;
