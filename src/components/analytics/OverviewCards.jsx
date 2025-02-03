import { motion } from "framer-motion";
import { Users, Clock, BarChart2, UserCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";

const overviewData = [
  { name: "Total Visitors", value: "4,321", change: 5.2, icon: Users },
  { name: "Peak Hour Comparison", value: "2 PM - 3 PM", change: -3.8, icon: BarChart2 },
  { name: "Dwell Time Change", value: "15m 42s", change: 7.1, icon: Clock },
  { name: "Returning Visitors", value: "45%", change: 2.4, icon: UserCheck },
];

const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {overviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className="bg-gray-800 bg-opacity-50 shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">{item.name}</h3>
              <p className="mt-1 text-xl font-semibold text-gray-100">{item.value}</p>
            </div>

            <div
              className={`p-3 rounded-full bg-opacity-20 ${item.change >= 0 ? "bg-green-500" : "bg-red-500"}`}
            >
              <item.icon className={`${item.change >= 0 ? "text-green-500" : "text-red-500"}`} size={24} />
            </div>
          </div>

          <div className={`mt-4 flex items-center ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {item.change >= 0 ? <ArrowUpRight size="20" /> : <ArrowDownRight size="20" />}
            <span className="ml-1 text-sm font-medium">{Math.abs(item.change)}%</span>
            <span className="ml-2 text-sm text-gray-400">vs last period</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCards;
