import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Download } from "lucide-react";
import { exportToCSV } from "../../utils/exportUtils";

const RawDataTable = ({ selectedCamera, selectedDateRange, cameraName }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  // ✅ Function to Fetch Logs from API
  const fetchLogs = async () => {
    if (!selectedCamera) return;

    let startDate = new Date();
    let endDate = new Date();
    const userData = JSON.parse(localStorage.getItem("user"));

    if (selectedDateRange === "Last 7 Days") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (selectedDateRange === "Last 30 Days") {
      startDate.setDate(startDate.getDate() - 30);
    } else if (selectedDateRange === "Custom") {
      startDate = new Date(localStorage.getItem("rawDataStartDate"));
      endDate = new Date(localStorage.getItem("rawDataEndDate"));
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/rawlogs?userId=${userData?.id}&cameraId=${selectedCamera}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      if (!response.ok) throw new Error("Failed to fetch logs");
      const data = await response.json();
      setLogs(data.data.flatMap(entry => entry.logs)); // ✅ Flatten the logs array
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // ✅ Fetch logs when camera or date range changes
  useEffect(() => {
    fetchLogs();
  }, [selectedCamera, selectedDateRange]);

  // ✅ Fetch logs when custom date range is applied
  useEffect(() => {
    if (selectedDateRange === "Custom") {
      fetchLogs();
    }
  }, [localStorage.getItem("rawDataStartDate"), localStorage.getItem("rawDataEndDate")]);

  // ✅ Filter logs based on search term
  useEffect(() => {
    setFilteredLogs(
      logs.filter(
        (entry) =>
          entry.tracking_id.toString().includes(searchTerm) ||
          entry.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.age.includes(searchTerm)
      )
    );
  }, [searchTerm, logs]);

  const handleDownload = () => {
    const fileName = `${cameraName}_${selectedDateRange}_rawlogs`;
    const dataToExport = filteredLogs.map((log, index) => ({
      "Serial No.": index + 1,
      "Tracking ID": log.tracking_id,
      "Gender": log.gender,
      "Age Range": log.age,
      "Time Spent (s)": log.time_spent,
      "First Appearance": new Date(log.first_appearance).toLocaleString(),
      "Last Appearance": new Date(log.last_appearance).toLocaleString(),
    }));
    exportToCSV(dataToExport, fileName);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Header with Search and Download */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Tracking Data</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Download className="mr-2" size={18} />
            Download
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search tracking ID, gender, age..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Serial No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Tracking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Age Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Time Spent (s)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                First Appearance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Last Appearance
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredLogs.map((entry, index) => (
              <motion.tr key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {entry.tracking_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {entry.gender}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {entry.age}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {entry.time_spent}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(entry.first_appearance).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(entry.last_appearance).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RawDataTable;