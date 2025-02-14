import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#6366F1", "#EC4899"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div
        className="p-3 rounded-md shadow-lg"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.9)", // Dark theme background
          borderColor: "rgba(109, 122, 140, 0.8)", // Border color
        }}
      >
        <p
          className="text-sm font-medium"
          style={{ color: data.payload.fill }} // Match text color to segment color
        >
          {data.name}: {data.value}
        </p>
      </div>
    );
  }
  return null;
};

const GenderDistributionChart = ({ data }) => {
  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-medium mb-4 text-gray-100">Gender Distribution</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data || []} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default GenderDistributionChart;
