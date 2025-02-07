import { useEffect, useState } from "react";
import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = () => {
	// State to hold user details
	const [user, setUser] = useState(null);

	// Load user details from localStorage
	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem("user"));
		if (storedUser) {
			setUser(storedUser);
		}
	}, []);

	return (
		<SettingSection icon={User} title={"Profile"}>
			<div className="flex flex-col sm:flex-row items-center mb-6">
				<img
					src={user?.image || "https://randomuser.me/api/portraits/men/3.jpg"}
					alt="Profile"
					className="rounded-full w-20 h-20 object-cover mr-4"
				/>

				<div>
					<h3 className="text-lg font-semibold text-gray-100">
						{user?.name || "John Doe"}
					</h3>
					<p className="text-gray-400">{user?.email || "john.doe@example.com"}</p>
				</div>
			</div>

			<button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto">
				Edit Profile
			</button>
		</SettingSection>
	);
};

export default Profile;
