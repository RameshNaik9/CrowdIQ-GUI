import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const visitorData = [
  { time: "6 AM", count: 20 },
  { time: "7 AM", count: 45 },
  { time: "8 AM", count: 75 },
  { time: "9 AM", count: 120 },
  { time: "10 AM", count: 180 },
  { time: "11 AM", count: 200 },
  { time: "12 PM", count: 250 },
  { time: "1 PM", count: 230 },
  { time: "2 PM", count: 210 },
  { time: "3 PM", count: 190 },
  { time: "4 PM", count: 150 },
  { time: "5 PM", count: 130 },
];

const VisitorTrendChart = () => {
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
          <LineChart data={visitorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }} />
            <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default VisitorTrendChart;
