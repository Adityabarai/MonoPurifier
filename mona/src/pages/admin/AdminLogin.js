import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdityaBarai from "../../assets/image/AdityaBarai.png";
import { FaLock } from "react-icons/fa";

const AdminLogin = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		rememberMe: false,
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		if (error) setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (!formData.username.trim() || !formData.password.trim()) {
			setError("Please enter both username and password");
			return;
		}
		setLoading(true);
		const response = await axios.post("http://localhost:5000/api/admin/login", {
			username: formData.username,
			password: formData.password,
		});
		const storage = formData.rememberMe ? localStorage : sessionStorage;
		storage.setItem("adminUser", JSON.stringify(response.data.admin));
		storage.setItem("adminToken", response.data.token);
		if (formData.rememberMe) {
			sessionStorage.removeItem("adminUser");
			sessionStorage.removeItem("adminToken");
		} else {
			localStorage.removeItem("adminUser");
			localStorage.removeItem("adminToken");
		}
		navigate("/admin/dashboard", { replace: true });
	};
	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
			<div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden grid md:grid-cols-2 border border-white/40">
				<div className="hidden md:flex items-center justify-center p-8 bg-white/60">
					<img src={AdityaBarai} alt="Admin" className="drop-shadow-xl" />
				</div>
				<div className="p-8 md:p-10 bg-gray-50">
					<h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
						<FaLock className="text-primary mr-3" /> Admin Login
					</h1>
					<p className="text-gray-600 mb-8">
						Access your secure administration dashboard
					</p>
					<form onSubmit={handleSubmit}>
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Username
							</label>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleInputChange}
								placeholder="Enter username"
								className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
								disabled={loading}
							/>
						</div>
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								placeholder="Enter password"
								className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
								disabled={loading}
							/>
						</div>
						<div className="mb-6 flex items-center">
							<input
								type="checkbox"
								name="rememberMe"
								id="rememberMe"
								checked={formData.rememberMe}
								onChange={handleInputChange}
								className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
								disabled={loading}
							/>
							<label
								htmlFor="rememberMe"
								className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
							>
								Remember me
							</label>
						</div>
						{error && (
							<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-red-600 text-sm font-medium">{error}</p>
							</div>
						)}
						<button
							type="submit"
							className={`w-full py-3 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 ${
								loading
									? "bg-primary text-secondary cursor-not-allowed"
									: "bg-primary hover:text-primary"
							}`}
							disabled={loading}
						>
							{loading ? "Logging in..." : "Login"}
						</button>
					</form>
					<p className="mt-8 text-center text-sm text-gray-600">
						© 2025 Aditya Barai. All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
