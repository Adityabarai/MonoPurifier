import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom"; // Add Outlet import
import {
	FaBars,
	FaHome,
	FaGlobe,
	FaAngleDown,
	FaAngleDoubleRight,
	FaSignOutAlt,
	FaCog,
	FaTimes,
} from "react-icons/fa";
import AdityaBarai from "../../assets/image/AdityaBarai.png";

const AdminNavbar = () => {
	const [sidebarHidden, setSidebarHidden] = useState(false);
	const [activeMenu, setActiveMenu] = useState(null);
	const [activeSubMenu, setActiveSubMenu] = useState(null);
	const [isMobile, setIsMobile] = useState(false);
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		initials: "",
	});
	const navigate = useNavigate();
	const location = useLocation();

	// Handle responsive behavior
	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.innerWidth < 768;
			setIsMobile(mobile);
			if (mobile) {
				setSidebarHidden(true);
			} else {
				setSidebarHidden(false);
			}
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		const user = JSON.parse(
			sessionStorage.getItem("adminUser") ||
				localStorage.getItem("adminUser") ||
				"{}"
		);

		if (user && (user.firstname || user.lastname)) {
			setUserData({
				firstName: user.firstname || "",
				lastName: user.lastname || "",
				initials:
					`${user.firstname?.[0] || ""}${
						user.lastname?.[0] || ""
					}`.toUpperCase() || "AB",
			});
		}
	}, []);

	// Close sidebar when clicking outside on mobile
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (isMobile && !sidebarHidden) {
				const sidebar = document.querySelector("aside");
				const toggleButton = document.querySelector(
					'button[aria-label="Toggle sidebar"]'
				);
				if (
					sidebar &&
					!sidebar.contains(event.target) &&
					toggleButton &&
					!toggleButton.contains(event.target)
				) {
					setSidebarHidden(true);
				}
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [sidebarHidden, isMobile]);

	// Close sidebar on route change for mobile
	useEffect(() => {
		if (isMobile) {
			setSidebarHidden(true);
		}
	}, [location.pathname, isMobile]);

	const handleLogout = () => {
		if (window.confirm("Are you sure you want to log out?")) {
			localStorage.removeItem("adminUser");
			localStorage.removeItem("adminToken");
			sessionStorage.removeItem("adminUser");
			sessionStorage.removeItem("adminToken");
			navigate("/admin/login");
		}
	};

	const toggleMenu = (menuNumber) => {
		setActiveMenu(activeMenu === menuNumber ? null : menuNumber);
		if (activeMenu !== menuNumber) {
			setActiveSubMenu(null);
		}
	};

	const toggleSubMenu = (subMenuNumber) => {
		setActiveSubMenu(activeSubMenu === subMenuNumber ? null : subMenuNumber);
	};

	const toggleSidebar = () => {
		if (isMobile) {
			setSidebarHidden(!sidebarHidden);
		}
	};

	const handleNavigation = (path) => {
		navigate(path);
		if (isMobile) {
			setSidebarHidden(true);
		}
	};

	const menuItems = [
		{
			id: 1,
			name: "Website",
			icon: <FaGlobe className="inline mr-2" />,
			subItems: [
				{
					id: 1,
					name: "Products Management",
					icon: <FaAngleDoubleRight className="inline mr-2" />,
					items: [
						{ name: "Add Products", path: "/admin/addormodifyproducts" },
						{ name: "Manage Products", path: "/admin/manageproducts" },
					],
				},
				{
					id: 2,
					name: "Feedback Management",
					icon: <FaAngleDoubleRight className="inline mr-2" />,
					items: [
						{ name: "Add Review", path: "/admin/add-content" },
						{ name: "Manage Review", path: "/admin/manage-content" },
					],
				},
				{
					id: 3,
					name: "Membership",
					icon: <FaAngleDoubleRight className="inline mr-2" />,
					items: [
						{
							name: "Pending Members",
							path: "/admin/pending-members?status=0",
						},
						{ name: "Manage Members", path: "/admin/manage-members?status=1" },
					],
				},
				{
					id: 4,
					name: "CEAI CENTER",
					icon: <FaAngleDoubleRight className="inline mr-2" />,
					items: [{ name: "CEAI Query", path: "/admin/ceai-query" }],
				},
			],
		},
	];

	return (
		<div className="font-poppins bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 min-h-screen">
			{/* Header */}
			<header className="flex fixed top-0 w-full z-50 justify-between items-center shadow-md bg-white p-4">
				<div className="flex gap-3 items-center">
					{/* Show toggle button only on mobile */}
					{isMobile && (
						<button
							onClick={toggleSidebar}
							aria-label="Toggle sidebar"
							className="bg-primary/20 rounded-md p-2 hover:bg-primary/30 transition-colors duration-200"
						>
							{sidebarHidden ? (
								<FaBars className="text-2xl text-primary" />
							) : (
								<FaTimes className="text-2xl text-primary" />
							)}
						</button>
					)}

					{/* Show sidebar toggle button on desktop only when needed (optional) */}
					{!isMobile && <div className="w-10"></div>}

					<img
						src={AdityaBarai}
						alt="CEAI Logo"
						className="h-[70px] w-auto max-w-[300px] object-contain"
					/>
				</div>

				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-3">
						<div className="flex justify-center items-center rounded-full bg-red-500 text-white w-10 h-10 font-semibold">
							{userData.initials}
						</div>
						<span className="font-medium text-gray-800 hidden md:block">
							{userData.firstName} {userData.lastName}
						</span>

						<button
							onClick={handleLogout}
							className="flex items-center gap-2 px-4 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-sm"
						>
							<FaSignOutAlt /> <span className="hidden md:inline">Logout</span>
						</button>
					</div>
				</div>
			</header>

			{/* Overlay for mobile */}
			{!sidebarHidden && isMobile && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-30"
					onClick={() => setSidebarHidden(true)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed pt-28 shadow-lg transition-all duration-300 top-0 bottom-0 w-72 p-4 z-40 bg-white overflow-y-auto ${
					sidebarHidden && isMobile ? "-left-72" : "left-0"
				} ${!isMobile ? "left-0" : ""}`} // Always visible on desktop
			>
				{/* Show close button only on mobile when sidebar is open */}
				{isMobile && !sidebarHidden && (
					<button
						onClick={() => setSidebarHidden(true)}
						className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
						aria-label="Close sidebar"
					>
						<FaTimes className="text-xl" />
					</button>
				)}

				{/* Home Button */}
				<button
					onClick={() => handleNavigation("/admin/dashboard")}
					className="w-full p-3 bg-primary text-white mb-3 rounded-md hover:bg-[#1E40AF] transition-colors duration-200 text-left flex items-center"
				>
					<FaHome className="inline mr-3" /> Home
				</button>

				{/* Main Menu Items */}
				{menuItems.map((menu) => (
					<div key={menu.id} className="mb-2">
						<button
							onClick={() => toggleMenu(menu.id)}
							className={`w-full p-3 rounded-md text-left flex justify-between items-center transition-all duration-200 ${
								activeMenu === menu.id
									? "bg-primary text-white"
									: "text-gray-800 hover:bg-[#1E40AF] hover:text-white"
							}`}
						>
							<span className="flex items-center">
								{menu.icon} {menu.name}
							</span>
							<FaAngleDown
								className={`transition-transform duration-200 ${
									activeMenu === menu.id ? "rotate-180" : ""
								}`}
							/>
						</button>

						{/* Submenu */}
						{activeMenu === menu.id && (
							<div className="bg-primary/10 rounded-md mt-1 space-y-1 p-1">
								{menu.subItems.map((subItem) => (
									<div key={subItem.id}>
										<button
											onClick={() => toggleSubMenu(subItem.id)}
											className={`w-full p-2 rounded-md text-left flex justify-between items-center transition-all duration-200 ${
												activeSubMenu === subItem.id
													? "bg-primary/30 text-gray-800"
													: "text-gray-700 hover:bg-[#1E40AF]/20"
											}`}
										>
											<span className="flex items-center">
												{subItem.icon} {subItem.name}
											</span>
											<FaAngleDown
												className={`transition-transform duration-200 ${
													activeSubMenu === subItem.id ? "rotate-180" : ""
												}`}
											/>
										</button>

										{/* Sub-submenu Items */}
										{activeSubMenu === subItem.id && (
											<div className="bg-primary/20 rounded-md mt-1 ml-2">
												{subItem.items.map((item, index) => (
													<Link
														key={index}
														to={item.path}
														onClick={() => {
															if (isMobile) setSidebarHidden(true);
														}}
														className="block p-2 pl-6 hover:bg-[#1E40AF]/30 text-gray-800 transition-colors duration-200 rounded-md"
													>
														{item.name}
													</Link>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				))}

				{/* Additional Static Menus */}
				<button
					onClick={() => handleNavigation("/admin/settings")}
					className="w-full p-3 rounded-md text-left text-gray-800 hover:bg-[#1E40AF] hover:text-white transition-all duration-200 mt-2 flex items-center"
				>
					<FaCog className="inline mr-3" /> Settings
				</button>
			</aside>

			{/* Main Content Area - FIXED: Added Outlet to render child routes */}
			<main
				className={`pt-20 transition-all duration-300 pb-16 ${
					!isMobile ? "ml-72" : "ml-0"
				}`}
			>
				<div className="p-4">
					{/* This Outlet will render the child routes (AdminDashboard, etc.) */}
					<Outlet />
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-primary py-4  bottom-0 w-full z-50 overflow-auto">
				<p className="text-lg text-white text-center">
					Powered By Aditya Barai
				</p>
			</footer>
		</div>
	);
};

export default AdminNavbar;
