import React from "react";

const AdminDashboard = () => {
	const user = JSON.parse(
		sessionStorage.getItem("adminUser") ||
			localStorage.getItem("adminUser") ||
			"{}"
	);

	return (
		<div className="p-4 md:p-6">
			<h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6"> 
				Dashboard
			</h1>

			<div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
				<h2 className="text-xl font-semibold text-gray-700 mb-2">
					Welcome, {user.firstname} {user.lastname}!
				</h2>
				<p className="text-gray-600">Here's your admin dashboard overview.</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
				<div className="bg-blue-100 rounded-xl p-6 shadow border border-blue-200">
					<h3 className="text-lg font-semibold text-blue-800">Total Members</h3>
					<p className="text-3xl font-bold text-blue-900 mt-2">0</p>
				</div>

				<div className="bg-green-100 rounded-xl p-6 shadow border border-green-200">
					<h3 className="text-lg font-semibold text-green-800">
						Pending Requests
					</h3>
					<p className="text-3xl font-bold text-green-900 mt-2">0</p>
				</div>

				<div className="bg-purple-100 rounded-xl p-6 shadow border border-purple-200">
					<h3 className="text-lg font-semibold text-purple-800">
						Content Pages
					</h3>
					<p className="text-3xl font-bold text-purple-900 mt-2">0</p>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
