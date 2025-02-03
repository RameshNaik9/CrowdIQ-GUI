import { useState } from "react";
import { ChevronDown, ChevronUp, Link2, Circle } from "lucide-react";

const CameraCard = ({ camera }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md transition-all">
      {/* Camera Basic Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">{camera.name}</h3>
          <p className="text-gray-400 text-sm">{camera.location}</p>
          <p className="text-gray-500 text-xs">Last Active: {camera.last_active}</p>
        </div>
        {/* Status Icon */}
        <div className="flex items-center">
          <Circle size={10} className={`mr-2 ${camera.status === "online" ? "text-green-400" : "text-red-400"}`} />
          <span className="text-sm text-gray-300">{camera.status}</span>
        </div>
      </div>

      {/* View More + Connect Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-400 hover:text-blue-500 flex items-center text-sm transition"
        >
          {isExpanded ? "Hide Details" : "View Details"}
          {isExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
        </button>

        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg flex items-center transition">
          <Link2 size={16} className="mr-2" />
          Connect
        </button>
      </div>

      {/* Expanded Camera Details (Only Expands When Needed) */}
      {isExpanded && (
        <div className="mt-4 text-gray-300 text-sm space-y-2">
          <p><strong>IP Address:</strong> {camera.ip_address}</p>
          <p><strong>Port:</strong> {camera.port}</p>
          <p><strong>Channel:</strong> {camera.channel_number}</p>
          <p><strong>Stream Type:</strong> {camera.stream_type}</p>
          <p><strong>Username:</strong> {camera.username}</p>
          <p><strong>Password:</strong> {camera.password}</p>
        </div>
      )}
    </div>
  );
};

export default CameraCard;
