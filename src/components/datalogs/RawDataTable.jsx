import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

// ✅ Mock Data (Replace with API response in the future)
const mockData = [
  { serial_number: 1, tracking_id: 1, gender: "Male", age: "36-50", time_spent: 8.1, first_appearance: "2025-01-11 15:31:39", last_appearance: "2025-01-11 15:31:47" },
  { serial_number: 2, tracking_id: 2, gender: "Male", age: "36-50", time_spent: 8.1, first_appearance: "2025-01-11 15:31:39", last_appearance: "2025-01-11 15:31:47" },
  { serial_number: 3, tracking_id: 7, gender: "Male", age: "36-50", time_spent: 7.0, first_appearance: "2025-01-11 15:31:52", last_appearance: "2025-01-11 15:31:59" },
  { serial_number: 4, tracking_id: 10, gender: "Female", age: "26-35", time_spent: 5.4, first_appearance: "2025-01-11 15:32:10", last_appearance: "2025-01-11 15:32:15" },
];

const RawDataTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(mockData);

  useEffect(() => {
    setFilteredData(
      mockData.filter(
        (entry) =>
          entry.tracking_id.toString().includes(searchTerm) ||
          entry.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.age.includes(searchTerm)
      )
    );
  }, [searchTerm]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Tracking Data</h2>
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Serial No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tracking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Age Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time Spent (s)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">First Appearance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Appearance</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredData.map((entry) => (
              <motion.tr key={entry.serial_number} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{entry.serial_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{entry.tracking_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.time_spent}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.first_appearance}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{entry.last_appearance}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RawDataTable;
