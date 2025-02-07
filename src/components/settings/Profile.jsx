import { User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Import for navigation
import SettingSection from "./SettingSection";

const Profile = () => {
	const navigate = useNavigate(); // ✅ React Router navigation hook

	const handleLogout = () => {
		// ✅ Clear user data from local storage
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		localStorage.clear();

		// ✅ Redirect to Home Page
		navigate("/");
	};

	// ✅ Get user details from local storage
	const user = JSON.parse(localStorage.getItem("user")) || {};
	const userName = user.name || "John Doe";
	const userEmail = user.email || "john.doe@example.com";
	const userImage = user.image || "https://randomuser.me/api/portraits/men/3.jpg";

	return (
		<SettingSection icon={User} title={"Profile"}>
			<div className="flex flex-col sm:flex-row items-center mb-6 w-full">
				{/* Profile Image & Info */}
				<div className="flex items-center">
					<img
						src={userImage}
						alt="Profile"
						className="rounded-full w-20 h-20 object-cover mr-4"
					/>

					<div>
						<h3 className="text-lg font-semibold text-gray-100">{userName}</h3>
						<p className="text-gray-400">{userEmail}</p>
					</div>
				</div>

				{/* Buttons: Edit Profile & Logout (Aligned Right) */}
				<div className="ml-auto flex gap-4">
					<button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200">
						Edit Profile
					</button>

					{/* 🔴 Logout Button */}
					<button
						className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>
			</div>
		</SettingSection>
	);
};

export default Profile;
