import { useState, useEffect } from "react";

function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState(null);

	// ====== SCROLL HIDE/SHOW STATES ======
	const [showNavbar, setShowNavbar] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	// ====================================

	const toggleDropdown = (dropdown) => {
		setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
	};

	// ====== SCROLL HIDE/SHOW LOGIC ======
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > lastScrollY && currentScrollY > 60) {
				// scrolling down
				setShowNavbar(false);
			} else {
				// scrolling up
				setShowNavbar(true);
			}

			setLastScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);
	// ====================================

	return (
		<nav
			className={`bg-white shadow-md sticky top-0 z-50 transition-transform duration-300 ${
				showNavbar ? "translate-y-0" : "-translate-y-full"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex-shrink-0">
						<div className="text-2xl font-bold">
							<span className="text-sky-500">MO</span>
							<span className="text-red-600">NA</span>
						</div>
					</div>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-8">
						<a
							href="#home"
							className="text-slate-900 hover:text-sky-500 transition"
						>
							Home
						</a>
						<a
							href="#about"
							className="text-slate-900 hover:text-sky-500 transition"
						>
							About
						</a>

						{/* Products Dropdown */}
						<div className="relative">
							<button
								onClick={() => toggleDropdown("products")}
								className="flex items-center text-slate-900 hover:text-sky-500 transition"
							>
								Products
								<span className="material-icons text-sm ml-1">expand_more</span>
							</button>
							{activeDropdown === "products" && (
								<div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
									<a
										href="#ro"
										className="block px-4 py-2 text-slate-900 hover:bg-sky-100"
									>
										RO Purifiers
									</a>
									<a
										href="#uv"
										className="block px-4 py-2 text-slate-900 hover:bg-sky-100"
									>
										UV Purifiers
									</a>
									<a
										href="#filters"
										className="block px-4 py-2 text-slate-900 hover:bg-sky-100"
									>
										Filters
									</a>
								</div>
							)}
						</div>

						{/* Services Dropdown */}
						<div className="relative">
							<button
								onClick={() => toggleDropdown("services")}
								className="flex items-center text-slate-900 hover:text-sky-500 transition"
							>
								Services
								<span className="material-icons text-sm ml-1">expand_more</span>
							</button>
							{activeDropdown === "services" && (
								<div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
									<a
										href="#installation"
										className="block px-4 py-2 text-slate-900 hover:bg-sky-100"
									>
										Installation
									</a>
									<a
										href="#repair"
										className="block px-4 py-2 text-slate-900 hover:bg-sky-100"
									>
										Repair
									</a>
									<a
										href="#amc"
										className="block px-4 py-2 text-slate-900 hover:bg-sky-100"
									>
										AMC (Maintenance)
									</a>
								</div>
							)}
						</div>

						<a
							href="#contact"
							className="text-slate-900 hover:text-sky-500 transition"
						>
							Contact
						</a>

						<a
							href="#demo"
							className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
						>
							Book Demo
						</a>
					</div>

					{/* Right Icons */}
					<div className="hidden md:flex items-center space-x-4">
						<button className="relative text-slate-900 hover:text-sky-500 transition">
							<span className="material-icons">shopping_cart</span>
							<span className="absolute -top-2 -right-2 bg-sky-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
								0
							</span>
						</button>
						<button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition">
							<span className="material-icons text-xl">person</span>
							<span>Login</span>
						</button>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-slate-900 hover:text-sky-500"
						>
							<span className="material-icons">
								{isMenuOpen ? "close" : "menu"}
							</span>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="md:hidden bg-sky-100">
					<div className="px-2 pt-2 pb-3 space-y-1">
						<a
							href="#home"
							className="block px-3 py-2 text-slate-900 hover:bg-sky-300 rounded-md"
						>
							Home
						</a>

						{/* Products Mobile Dropdown */}
						<div>
							<button
								onClick={() => toggleDropdown("products-mobile")}
								className="w-full text-left flex justify-between items-center px-3 py-2 text-slate-900 hover:bg-sky-300 rounded-md"
							>
								Products
								<span className="material-icons text-sm">expand_more</span>
							</button>
							{activeDropdown === "products-mobile" && (
								<div className="pl-6 space-y-1">
									<a
										href="#ro"
										className="block px-3 py-2 text-slate-900 hover:bg-sky-300 rounded-md"
									>
										RO Purifiers
									</a>
									<a
										href="#uv"
										className="block px-3 py-2 text-slate-900 hover:bg-sky-300 rounded-md"
									>
										UV Purifiers
									</a>
									<a
										href="#filters"
										className="block px-3 py-2 text-slate-900 hover:bg-sky-300 rounded-md"
									>
										Filters
									</a>
								</div>
							)}
						</div>

						<a
							href="#about"
							className="block px-3 py-2 text-slate-900 hover:bg-sky-300 rounded-md"
						>
							About
						</a>

						{/* Services Mobile Dropdown */}
						<div>
							<button
								onClick={() => toggleDropdown("services-mobile")}
								className="w-full text-left flex justify-between items-center px-3 py-2 text-slate-900 hover:bg-sky-300 rounded-md"
							>
								Services
								<span className="material-icons text-sm">expand_more</span>
							</button>
							{activeDropdown === "services-mobile" && (
								<div className="pl-6 space-y-1">
									<a
										href="#installation"
										className="block px-3 py-2 text-slate-900 hover:bg-sky-300 rounded-md"
									>
										Installation
									</a>
									<a
										href="#repair"
										className="block px-3 py-2 text-slate-900 hover:bg-sky-300 rounded-md"
									>
										Repair
									</a>
									<a
										href="#amc"
										className="block px-3 py-2 text-slate-900 hover:bg-sky-300 rounded-md"
									>
										AMC (Maintenance)
									</a>
								</div>
							)}
						</div>

						<a
							href="#contact"
							className="block px-3 py-2 text-slate-900 hover:bg-sky-300 rounded-md"
						>
							Contact
						</a>

						<a
							href="#demo"
							className="block px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md text-center"
						>
							Book Demo
						</a>

						<div className="flex items-center justify-around pt-4 border-t border-sky-300">
							<button className="relative text-slate-900 hover:text-sky-500">
								<span className="material-icons">shopping_cart</span>
								<span className="absolute -top-2 -right-2 bg-sky-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
									0
								</span>
							</button>
							<button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800">
								<span className="material-icons text-xl">person</span>
								<span>Login</span>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Material Icons Font */}
			<link
				href="https://fonts.googleapis.com/icon?family=Material+Icons"
				rel="stylesheet"
			/>
		</nav>
	);
}

export default Navbar;
