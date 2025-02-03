import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const COLORS = ["#10B981", "#F59E0B"];

const visitorSegmentationData = [
  { name: "Returning Visitors", count: 1450 },
  { name: "New Visitors", count: 2760 },
];

const VisitorSegmentationChart = () => {
  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-medium text-gray-100 mb-4">Returning vs. New Visitors</h2>

      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={visitorSegmentationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8">
              {visitorSegmentationData.map((entry, index) => (
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
