import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

const genderData = [
  { name: "Male", value: 1245 },
  { name: "Female", value: 1100 },
];

const COLORS = ["#6366F1", "#EC4899"];

const GenderDistributionChart = () => {
  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-medium mb-4 text-gray-100">Gender Distribution</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={genderData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default GenderDistributionChart;
