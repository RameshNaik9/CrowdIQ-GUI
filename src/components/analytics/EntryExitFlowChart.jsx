import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const entryExitData = [
  { name: "Entries", value: 3200 },
  { name: "Exits", value: 2950 },
];

const COLORS = ["#6366F1", "#EC4899"];

const EntryExitFlowChart = () => {
  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-medium text-gray-100 mb-4">Visitor Entry & Exit Flow</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={entryExitData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {entryExitData.map((entry, index) => (
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

export default EntryExitFlowChart;
