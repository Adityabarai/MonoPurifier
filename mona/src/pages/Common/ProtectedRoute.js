import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const checkAuth = () => {
			const adminUser =
				localStorage.getItem("adminUser") ||
				sessionStorage.getItem("adminUser");
			const adminToken =
				localStorage.getItem("adminToken") ||
				sessionStorage.getItem("adminToken");
			if (adminUser && adminToken) {
				JSON.parse(adminUser);
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
			setIsLoading(false);
		};
		checkAuth();
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
