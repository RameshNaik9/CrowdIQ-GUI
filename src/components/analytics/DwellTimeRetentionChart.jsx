import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dwellTimeData = [
  { day: "Mon", time: 14 },
  { day: "Tue", time: 16 },
  { day: "Wed", time: 12 },
  { day: "Thu", time: 15 },
  { day: "Fri", time: 17 },
  { day: "Sat", time: 20 },
  { day: "Sun", time: 22 },
];

const DwellTimeRetentionChart = () => {
  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-medium text-gray-100 mb-4">Dwell Time Trends</h2>

      <div className="h-80">
        <ResponsiveContainer>
          <LineChart data={dwellTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Line type="monotone" dataKey="time" stroke="#6366F1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DwellTimeRetentionChart;
