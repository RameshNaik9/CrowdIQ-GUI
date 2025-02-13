import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Clock, BarChart2, UserCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";

const OverviewCards = ({ cameraId, selectedDateRange, startDate, endDate }) => {
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ Extract userId from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;

  useEffect(() => {
    if (!userId || !cameraId) return;

    const fetchKPIData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:8080/api/v1/analytics/kpi?userId=${userId}&cameraId=${cameraId}&startDate=${startDate}&endDate=${endDate}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch KPI data");

        const data = await response.json();
        setKpiData(data.data);
      } catch (error) {
        console.error("Error fetching KPI data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();
  }, [userId, cameraId, selectedDateRange, startDate, endDate]);

  // ✅ Ensure numbers are formatted correctly
  const formatNumber = (num, decimalPlaces = 2) => {
    const parsed = parseFloat(num);
    return isNaN(parsed) ? "0.00" : parsed.toFixed(decimalPlaces);
  };

  const overviewData = [
    {
      name: "Avg Visitors Per Day",
      value: loading ? "..." : Math.round(kpiData?.avgVisitorsPerDay || 0),
      change: loading ? "0.00" : formatNumber(kpiData?.avgVisitorsChange),
      icon: Users,
      tooltip: "This represents the average number of visitors per day during the selected period.",
    },
    {
      name: "Peak Hour",
      value: loading
        ? "..."
        : `${kpiData?.peakHour || "N/A"} (${kpiData?.peakHourVisitors || 0})`,
      change: loading ? "0.00" : formatNumber(kpiData?.peakHourChange),
      icon: BarChart2,
      tooltip: `This is the hour when the highest number of visitors (${kpiData?.peakHourVisitors || 0}) were recorded.`,
    },
    {
      name: "Dwell Time",
      value: loading ? "..." : kpiData?.dwellTime || "0m 0s",
      change: loading ? "0.00" : formatNumber(kpiData?.dwellTimeChange),
      icon: Clock,
      tooltip: "This indicates the average amount of time visitors spent in the monitored area.",
    },
    {
      name: "Returning Visitors",
      value: loading ? "..." : `${formatNumber(kpiData?.returningVisitors)}%`,
      change: loading ? "0.00" : formatNumber(kpiData?.returningVisitorsChange),
      icon: UserCheck,
      tooltip: "This represents the percentage of visitors who have returned compared to the previous period.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {overviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className="relative bg-gray-800 bg-opacity-50 shadow-lg rounded-xl p-6 border border-gray-700 group"
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
              className={`p-3 rounded-full bg-opacity-20 ${
                item.change >= 0 ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <item.icon className={`${item.change >= 0 ? "text-green-500" : "text-red-500"}`} size={24} />
            </div>
          </div>

          <div className={`mt-4 flex items-center ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {item.change >= 0 ? <ArrowUpRight size="20" /> : <ArrowDownRight size="20" />}
            <span className="ml-1 text-sm font-medium">{Math.abs(item.change)}%</span>
            <span className="ml-2 text-sm text-gray-400">vs last period</span>
          </div>

          {/* ✅ Tooltip on Hover */}
          <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-md max-w-xs text-center z-50">
            {item.tooltip}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCards;
