import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366F1", "#EC4899", "#FBBF24"]; // Male, Female, Other

const AvgVisitorsByGenderChart = ({ cameraId, startDate, endDate }) => {
  const [genderData, setGenderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Extract userId from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;

  useEffect(() => {
    if (!userId || !cameraId || !startDate || !endDate) return;

    const fetchAvgVisitorsByGender = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:8080/api/v1/analytics/avg-visitors-gender?userId=${userId}&cameraId=${cameraId}&startDate=${startDate}&endDate=${endDate}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch gender visitor data");

        const data = await response.json();

        // ✅ Format Data for Pie Chart
        const formattedData = [
          { name: "Male", value: data.data.avgMalePerDay },
          { name: "Female", value: data.data.avgFemalePerDay },
          { name: "Other", value: data.data.avgOtherPerDay },
        ];

        setGenderData(formattedData);
      } catch (error) {
        console.error("Error fetching avg visitors by gender:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvgVisitorsByGender();
  }, [userId, cameraId, startDate, endDate]);

  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-medium text-gray-100 mb-4">Avg Visitors Per Day by Gender</h2>

      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
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
      )}
    </motion.div>
  );
};

export default AvgVisitorsByGenderChart;
