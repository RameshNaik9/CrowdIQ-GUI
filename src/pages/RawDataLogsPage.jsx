import { useState, useEffect } from "react";
import { Calendar, Camera, X, Check } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import Header from "../components/common/Header";
import RawDataTable from "../components/datalogs/RawDataTable";

const RawDataLogsPage = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(
    () => localStorage.getItem("rawDataSelectedDateRange") || "Today"
  );

    // Get stored values
  const storedSelectedCamera = localStorage.getItem("rawDataSelectedCamera");
  const storedActiveCamera = JSON.parse(localStorage.getItem("activeCamera") || "null");

  // Use active camera _id if storedSelectedCamera is missing or "null"
  const initialCamera =
    storedSelectedCamera && storedSelectedCamera !== "null"
      ? storedSelectedCamera
      : storedActiveCamera && storedActiveCamera._id
      ? storedActiveCamera._id
      : null;

  const [selectedCamera, setSelectedCamera] = useState(initialCamera);

  const [cameras, setCameras] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateLabel, setCustomDateLabel] = useState(localStorage.getItem("rawDataCustomDateLabel") || "");
  const [pendingCustomDate, setPendingCustomDate] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(localStorage.getItem("rawDataStartDate") || new Date()),
      endDate: new Date(localStorage.getItem("rawDataEndDate") || new Date()),
      key: "selection",
    },
  ], pendingCustomDate);

  // ✅ Fetch all cameras from API & store in localStorage
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(`http://localhost:8080/api/v1/cameras`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "user-id": userData?.id,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch cameras");
        const data = await response.json();

        setCameras(data.data);
        localStorage.setItem("cameras", JSON.stringify(data.data));

        // If no camera is already selected, use active camera from localStorage
        if (!storedSelectedCamera || storedSelectedCamera === "null") {
          const activeCamera = data.data.find((cam) => cam.status === "online") || data.data[0];
          if (activeCamera) {
            setSelectedCamera(activeCamera._id);
            localStorage.setItem("rawDataSelectedCamera", activeCamera._id);
          }
        }
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    fetchCameras();
  }, []);


  // ✅ Persist selected date range in localStorage
  useEffect(() => {
    localStorage.setItem("rawDataSelectedDateRange", selectedDateRange);
  }, [selectedDateRange]);

  // ✅ Persist selected camera in localStorage
  useEffect(() => {
    localStorage.setItem("rawDataSelectedCamera", selectedCamera);
  }, [selectedCamera]);

  // ✅ Handle date range updates dynamically and store in localStorage
  useEffect(() => {
    let startDate = new Date();
    let endDate = new Date();

    if (selectedDateRange === "Last 7 Days") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (selectedDateRange === "Last 30 Days") {
      startDate.setDate(startDate.getDate() - 30);
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (selectedDateRange !== "Custom") {
      setDateRange([{ startDate, endDate, key: "selection" }]);
      localStorage.setItem("rawDataStartDate", startDate.toISOString());
      localStorage.setItem("rawDataEndDate", endDate.toISOString());
    }
  }, [selectedDateRange]);

  const applyCustomDate = () => {
    const formattedDateRange = `${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`;

    setSelectedDateRange("Custom");
    setCustomDateLabel(formattedDateRange);
    setShowDatePicker(false);
    setPendingCustomDate(false);

    // ✅ Store Custom Date Range in LocalStorage
    localStorage.setItem("rawDataSelectedDateRange", "Custom");
    localStorage.setItem("rawDataCustomDateLabel", formattedDateRange);
    localStorage.setItem("rawDataStartDate", dateRange[0].startDate.toISOString());
    localStorage.setItem("rawDataEndDate", dateRange[0].endDate.toISOString());
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title="Raw Data Logs" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Filters: Date & Camera Selection */}
        <div className="flex justify-between items-center mb-6 relative">
          {/* Date Selector */}
          <div className="relative flex items-center space-x-3">
            <Calendar size={20} className="text-gray-400" />
            <select
              value={selectedDateRange}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedDateRange(value);
                setShowDatePicker(value === "Custom");
                if (value === "Custom") {
                  setPendingCustomDate(true);
                } else {
                  setCustomDateLabel("");
                }
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom</option>
            </select>

            {/* Display Selected Custom Date Range */}
            {selectedDateRange === "Custom" && customDateLabel && (
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md text-sm">
                {customDateLabel}
              </span>
            )}
          </div>

          {/* Custom Date Picker UI */}
          {showDatePicker && (
            <div className="absolute top-12 left-0 bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-700 z-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Select Date Range</span>
                <button onClick={() => setShowDatePicker(false)}>
                  <X size={18} className="text-gray-400 hover:text-gray-300" />
                </button>
              </div>
              <DateRange
                ranges={dateRange}
                onChange={(ranges) => setDateRange([ranges.selection])}
                rangeColors={["#3B82F6"]}
                className="text-gray-200"
              />
              <button
                onClick={applyCustomDate}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
              >
                <Check size={16} className="mr-2" />
                Apply Date Range
              </button>
            </div>
          )}

          {/* Camera Selector */}
          <div className="flex items-center space-x-3">
            <Camera size={20} className="text-gray-400" />
            <select
              value={selectedCamera}
              onChange={(e) => {
                setSelectedCamera(e.target.value);
                localStorage.setItem("rawDataSelectedCamera", e.target.value);
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
            >
              {cameras.map((camera) => (
                <option key={camera._id} value={camera._id}>
                  {camera.name} {camera.status === "online" ? "🟢" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Raw Data Table */}
        <RawDataTable selectedCamera={selectedCamera} selectedDateRange={selectedDateRange} cameraName={cameras.find(cam => cam._id === selectedCamera)?.name || ''} />
      </main>
    </div>
  );
};

export default RawDataLogsPage;
