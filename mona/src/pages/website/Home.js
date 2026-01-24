import React from "react";
import { useState, useEffect } from "react";

const Home = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [cart, setCart] = useState({});
	const [activeTab, setActiveTab] = useState("basic");
	const [activeFaq, setActiveFaq] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		address: "",
		model: ""
	});

	const slides = [
		{
			id: 1,
			title: "Pure Water, Healthy Life",
			subtitle: "Advanced RO Water Purification Technology",
			description: "Get crystal clear, safe drinking water for your family",
			cta: "Explore RO Purifiers",
			bgColor: "from-sky-400 to-sky-600",
			image: "💧",
		},
		{
			id: 2,
			title: "UV Purification Excellence",
			subtitle: "Kill 99.9% Germs & Bacteria",
			description: "Protect your family with advanced UV technology",
			cta: "View UV Models",
			bgColor: "from-blue-400 to-blue-600",
			image: "🌊",
		},
		{
			id: 3,
			title: "Professional Installation",
			subtitle: "Expert Service at Your Doorstep",
			description: "Free installation with every purchase",
			cta: "Book Demo",
			bgColor: "from-red-500 to-red-600",
			image: "🔧",
		},
		{
			id: 4,
			title: "Annual Maintenance",
			subtitle: "Keep Your Purifier Running Smoothly",
			description: "Hassle-free AMC plans starting at ₹999/year",
			cta: "View Plans",
			bgColor: "from-slate-700 to-slate-900",
			image: "⚙️",
		},
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000);

		return () => clearInterval(timer);
	}, [slides.length]);

	const goToSlide = (index) => {
		setCurrentSlide(index);
	};

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	const features = [
		{
			icon: "water_drop",
			title: "Advanced RO+UV+UF",
			description:
				"Triple purification technology for 100% safe drinking water",
			color: "sky",
		},
		{
			icon: "science",
			title: "Copper + Alkaline Technology",
			description: "Health benefits with copper-infused alkaline water",
			color: "red",
		},
		{
			icon: "verified",
			title: "1 Year Warranty",
			description: "Comprehensive warranty coverage on all products",
			color: "sky",
		},
		{
			icon: "home",
			title: "Doorstep Service",
			description: "Convenient service right at your home",
			color: "slate",
		},
		{
			icon: "construction",
			title: "Free Installation",
			description: "Professional installation at no extra cost",
			color: "red",
		},
		{
			icon: "support_agent",
			title: "24/7 Customer Support",
			description: "Round-the-clock assistance whenever you need",
			color: "slate",
		},
	];

	const getColorClasses = (color) => {
		const colors = {
			sky: {
				bg: "bg-sky-100",
				icon: "text-sky-500",
				hover: "group-hover:bg-sky-500",
			},
			red: {
				bg: "bg-red-100",
				icon: "text-red-600",
				hover: "group-hover:bg-red-600",
			},
			slate: {
				bg: "bg-slate-100",
				icon: "text-slate-700",
				hover: "group-hover:bg-slate-700",
			},
		};
		return colors[color];
	};

	const products = [
		{
			id: 1,
			name: "AquaPure RO Elite",
			category: "RO Purifier",
			price: 12999,
			originalPrice: 16999,
			image: "💧",
			rating: 4.8,
			reviews: 245,
			features: [
				"7-Stage Purification",
				"10L Storage Tank",
				"TDS Controller",
				"Smart LED Display",
			],
			badge: "Best Seller",
		},
		{
			id: 2,
			name: "AquaPure UV Pro",
			category: "UV Purifier",
			price: 8999,
			originalPrice: 11999,
			image: "🌊",
			rating: 4.6,
			reviews: 189,
			features: [
				"UV + UF Technology",
				"8L Capacity",
				"Energy Efficient",
				"Auto Shut-off",
			],
			badge: "Popular",
		},
		{
			id: 3,
			name: "AquaPure Copper+",
			category: "RO + Copper",
			price: 15999,
			originalPrice: 19999,
			image: "⚡",
			rating: 4.9,
			reviews: 312,
			features: [
				"RO + UV + Copper",
				"Alkaline Technology",
				"12L Storage",
				"Mineral Retention",
			],
			badge: "Premium",
		},
		{
			id: 4,
			name: "AquaPure Compact",
			category: "Wall Mount RO",
			price: 9999,
			originalPrice: 12999,
			image: "🔷",
			rating: 4.5,
			reviews: 156,
			features: [
				"Space Saving Design",
				"6-Stage Purification",
				"6L Tank",
				"Quick Installation",
			],
			badge: "New",
		},
		{
			id: 5,
			name: "AquaPure Alkaline Max",
			category: "Alkaline RO",
			price: 18999,
			originalPrice: 22999,
			image: "💎",
			rating: 5.0,
			reviews: 98,
			features: [
				"Alkaline + Copper",
				"9-Stage Purification",
				"15L Capacity",
				"Mobile App Control",
			],
			badge: "Premium",
		},
		{
			id: 6,
			name: "AquaPure Basic",
			category: "UV Purifier",
			price: 5999,
			originalPrice: 7999,
			image: "💠",
			rating: 4.3,
			reviews: 234,
			features: [
				"UV Purification",
				"5L Storage",
				"Budget Friendly",
				"Low Maintenance",
			],
			badge: "Budget",
		},
	];

	const addToCart = (productId) => {
		setCart((prev) => ({
			...prev,
			[productId]: (prev[productId] || 0) + 1,
		}));
	};

	const getBadgeColor = (badge) => {
		const colors = {
			"Best Seller": "bg-red-600",
			Popular: "bg-sky-500",
			Premium: "bg-slate-900",
			New: "bg-green-500",
			Budget: "bg-blue-500",
		};
		return colors[badge] || "bg-slate-600";
	};

	// Customer Reviews Data
	const testimonials = [
		{
			id: 1,
			name: "Priya Sharma",
			location: "Mumbai",
			rating: 5,
			comment: "Best water purifier! Water tastes amazing and service is excellent.",
			image: "👩",
			purchase: "AquaPure RO Elite"
		},
		{
			id: 2,
			name: "Rahul Verma",
			location: "Delhi",
			rating: 5,
			comment: "Installation was quick and professional. Highly recommended!",
			image: "👨",
			purchase: "AquaPure UV Pro"
		},
		{
			id: 3,
			name: "Anita Patel",
			location: "Bangalore",
			rating: 4,
			comment: "Great value for money. Customer support is very responsive.",
			image: "👩‍💼",
			purchase: "AquaPure Compact"
		},
		{
			id: 4,
			name: "Sanjay Kumar",
			location: "Chennai",
			rating: 5,
			comment: "Copper technology makes a noticeable difference in water taste.",
			image: "👨‍💼",
			purchase: "AquaPure Copper+"
		},
		{
			id: 5,
			name: "Meera Nair",
			location: "Kolkata",
			rating: 5,
			comment: "AMC plan is worth every penny. Regular maintenance keeps it running smooth.",
			image: "👩‍🏫",
			purchase: "AquaPure Alkaline Max"
		},
		{
			id: 6,
			name: "Vikram Singh",
			location: "Hyderabad",
			rating: 4,
			comment: "Good product at affordable price. Does the job perfectly.",
			image: "👨‍🔧",
			purchase: "AquaPure Basic"
		}
	];

	// Comparison Data
	const comparisonData = {
		basic: {
			name: "Basic Model",
			price: "₹5,999",
			features: {
				"Purification": "UV Only",
				"Storage Capacity": "5L",
				"Technology": "Single Stage",
				"Maintenance Cost": "₹500/year",
				"Warranty": "1 Year",
				"Smart Features": "No"
			}
		},
		premium: {
			name: "Premium Model",
			price: "₹18,999",
			features: {
				"Purification": "RO+UV+UF+Alkaline",
				"Storage Capacity": "15L",
				"Technology": "9-Stage",
				"Maintenance Cost": "₹1,200/year",
				"Warranty": "2 Years",
				"Smart Features": "Yes"
			}
		}
	};

	// AMC Plans Data
	const amcPlans = [
		{
			name: "Basic AMC",
			price: "₹999/year",
			features: [
				"2 Free Service Visits",
				"Filter Replacement (Extra)",
				"General Checkup",
				"Phone Support"
			],
			popular: false
		},
		{
			name: "Standard AMC",
			price: "₹1,799/year",
			features: [
				"4 Free Service Visits",
				"2 Filter Replacements",
				"Complete Maintenance",
				"Priority Support",
				"Discount on Parts"
			],
			popular: true
		},
		{
			name: "Premium AMC",
			price: "₹2,999/year",
			features: [
				"6 Free Service Visits",
				"All Filter Replacements",
				"Complete Maintenance",
				"24/7 Priority Support",
				"Free Parts Replacement",
				"Extended Warranty"
			],
			popular: false
		}
	];

	// FAQ Data
	const faqs = [
		{
			question: "How long does installation take?",
			answer: "Professional installation typically takes 1-2 hours. Our technicians ensure proper setup and testing."
		},
		{
			question: "What is TDS and why is it important?",
			answer: "TDS (Total Dissolved Solids) measures mineral content in water. Our TDS controller maintains essential minerals while removing harmful contaminants."
		},
		{
			question: "How often should filters be replaced?",
			answer: "Sediment filters: 6 months, RO membrane: 1-2 years, UV lamp: 1 year. Exact timing depends on water quality and usage."
		},
		{
			question: "Is RO water safe for drinking?",
			answer: "Yes! Our RO systems include mineral retention technology to ensure you get pure water with essential minerals preserved."
		},
		{
			question: "Do you provide free installation?",
			answer: "Yes, free professional installation is included with every purifier purchase."
		},
		{
			question: "What is the warranty period?",
			answer: "We offer 1-2 years comprehensive warranty depending on the model, covering parts and labor."
		}
	];

	// Form Handler
	const handleInputChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission here
		console.log("Form submitted:", formData);
		alert("Thank you! Our executive will contact you soon to schedule the demo.");
		setFormData({ name: "", phone: "", address: "", model: "" });
	};

	const toggleFaq = (index) => {
		setActiveFaq(activeFaq === index ? null : index);
	};

	return (
		<div className="min-h-screen">
			{/* Carousel Section */}
			<div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
				{/* Slides */}
				{slides.map((slide, index) => (
					<div
						key={slide.id}
						className={`absolute inset-0 transition-opacity duration-1000 ${
							index === currentSlide ? "opacity-100" : "opacity-0"
						}`}
					>
						<div
							className={`w-full h-full bg-gradient-to-r ${slide.bgColor} flex items-center justify-center`}
						>
							<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
								<div className="grid md:grid-cols-2 gap-8 items-center">
									{/* Content */}
									<div className="text-white space-y-6">
										<h2 className="text-4xl md:text-6xl font-bold leading-tight">
											{slide.title}
										</h2>
										<h3 className="text-xl md:text-2xl font-semibold text-sky-100">
											{slide.subtitle}
										</h3>
										<p className="text-lg md:text-xl text-white/90">
											{slide.description}
										</p>
										<div className="flex gap-4 pt-4">
											<button className="bg-white text-slate-900 px-6 py-3 rounded-md font-semibold hover:bg-sky-100 transition flex items-center gap-2">
												{slide.cta}
												<span className="material-icons">arrow_forward</span>
											</button>
											<button className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition">
												Learn More
											</button>
										</div>
									</div>

									{/* Image/Icon */}
									<div className="hidden md:flex justify-center items-center">
										<div className="text-9xl animate-bounce">{slide.image}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}

				{/* Navigation Arrows */}
				<button
					onClick={prevSlide}
					className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm transition"
				>
					<span className="material-icons text-3xl">chevron_left</span>
				</button>
				<button
					onClick={nextSlide}
					className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm transition"
				>
					<span className="material-icons text-3xl">chevron_right</span>
				</button>

				{/* Dots Indicator */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`transition-all duration-300 rounded-full ${
								index === currentSlide
									? "bg-white w-8 h-3"
									: "bg-white/50 w-3 h-3 hover:bg-white/70"
							}`}
						/>
					))}
				</div>
			</div>

			{/* Features Section */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Section Header */}
					<div className="text-center mb-12">
						<h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
							Why Choose <span className="text-sky-500">MO</span>
							<span className="text-red-600">NA</span>?
						</h2>
						<p className="text-lg text-slate-600 max-w-2xl mx-auto">
							We deliver excellence in water purification with cutting-edge
							technology and unmatched customer service
						</p>
					</div>

					{/* Features Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => {
							const colors = getColorClasses(feature.color);
							return (
								<div
									key={index}
									className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-slate-200 hover:border-transparent hover:-translate-y-2"
								>
									{/* Icon */}
									<div
										className={`${colors.bg} ${colors.hover} w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300`}
									>
										<span
											className={`material-icons text-4xl ${colors.icon} group-hover:text-white transition-colors duration-300`}
										>
											{feature.icon}
										</span>
									</div>

									{/* Content */}
									<h3 className="text-xl font-bold text-slate-900 mb-2">
										{feature.title}
									</h3>
									<p className="text-slate-600 leading-relaxed">
										{feature.description}
									</p>
								</div>
							);
						})}
					</div>

					{/* CTA Section */}
					<div className="mt-12 text-center">
						<button className="bg-red-600 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-red-700 transition shadow-lg hover:shadow-xl inline-flex items-center gap-2">
							Get Started Today
							<span className="material-icons">arrow_forward</span>
						</button>
					</div>
				</div>
			</section>

			{/* Technology / How It Works Section */}
			<section className="py-16 bg-slate-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Section Header */}
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
							How Our <span className="text-sky-500">Purification</span> Technology Works
						</h2>
						<p className="text-lg text-slate-600 max-w-3xl mx-auto">
							Advanced multi-stage purification process that ensures 100% safe and healthy drinking water
						</p>
					</div>

					{/* Purification Process Steps */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
						{/* Process Visualization */}
						<div className="relative">
							{/* Main Purifier Graphic */}
							<div className="bg-gradient-to-b from-slate-100 to-slate-200 rounded-2xl p-8 shadow-lg">
								<div className="relative h-80">
									{/* Water Flow Line */}
									<div className="absolute left-1/2 top-0 bottom-0 w-1 bg-sky-200 transform -translate-x-1/2"></div>
									
									{/* Technology Points */}
									{[
										{ step: 1, name: "Sediment Filter", icon: "filter_alt", position: "top-4", color: "blue" },
										{ step: 2, name: "RO Membrane", icon: "settings", position: "top-24", color: "green" },
										{ step: 3, name: "UV Chamber", icon: "lightbulb", position: "top-44", color: "purple" },
										{ step: 4, name: "UF Filter", icon: "science", position: "top-64", color: "orange" },
										{ step: 5, name: "TDS Controller", icon: "speed", position: "bottom-24", color: "red" },
										{ step: 6, name: "Copper+Alkaline", icon: "battery_charging_full", position: "bottom-4", color: "amber" },
									].map((tech) => (
										<div
											key={tech.step}
											className={`absolute left-1/2 ${tech.position} transform -translate-x-1/2 -translate-y-1/2`}
										>
											<div className={`relative group cursor-pointer`}>
												<div className={`
													w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg
													${tech.color === 'blue' ? 'bg-blue-500' : ''}
													${tech.color === 'green' ? 'bg-green-500' : ''}
													${tech.color === 'purple' ? 'bg-purple-500' : ''}
													${tech.color === 'orange' ? 'bg-orange-500' : ''}
													${tech.color === 'red' ? 'bg-red-500' : ''}
													${tech.color === 'amber' ? 'bg-amber-500' : ''}
													hover:scale-110 transition-transform duration-300
												`}>
													<span className="material-icons">{tech.icon}</span>
												</div>
												{/* Tooltip */}
												<div className="absolute left-1/2 top-full mt-2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
													<div className="bg-slate-900 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap">
														{tech.name}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Process Description */}
						<div className="space-y-6">
							<h3 className="text-3xl font-bold text-slate-900 mb-6">
								6-Stage Advanced Purification
							</h3>
							
							{[
								{
									stage: "Stage 1",
									title: "Sediment Pre-Filtration",
									description: "Removes dust, rust, sand, and other physical impurities",
									icon: "filter_alt",
									color: "text-blue-500"
								},
								{
									stage: "Stage 2",
									title: "RO Membrane",
									description: "Removes dissolved salts, heavy metals, and harmful chemicals",
									icon: "settings",
									color: "text-green-500"
								},
								{
									stage: "Stage 3",
									title: "UV Sterilization",
									description: "Kills 99.9% viruses, bacteria, and other microorganisms",
									icon: "lightbulb",
									color: "text-purple-500"
								},
								{
									stage: "Stage 4",
									title: "UF Filtration",
									description: "Removes remaining fine particles and microorganisms",
									icon: "science",
									color: "text-orange-500"
								},
								{
									stage: "Stage 5",
									title: "TDS Controller",
									description: "Maintains essential minerals for better taste and health",
									icon: "speed",
									color: "text-red-500"
								},
								{
									stage: "Stage 6",
									title: "Copper + Alkaline Booster",
									description: "Adds copper benefits and optimizes pH level",
									icon: "battery_charging_full",
									color: "text-amber-500"
								}
							].map((step, index) => (
								<div key={index} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
									<div className={`${step.color} flex-shrink-0`}>
										<span className="material-icons text-3xl">{step.icon}</span>
									</div>
									<div>
										<div className="text-sm text-slate-500 font-semibold">{step.stage}</div>
										<h4 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h4>
										<p className="text-slate-600">{step.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Technology Details Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								title: "RO Technology",
								description: "Reverse Osmosis removes dissolved impurities at molecular level",
								benefits: ["Removes heavy metals", "Eliminates dissolved salts", "Filters chemicals"],
								icon: "settings",
								color: "from-green-400 to-green-600"
							},
							{
								title: "UV Purification",
								description: "Ultraviolet rays destroy microorganisms' DNA",
								benefits: ["Kills 99.9% germs", "Chemical-free process", "Instant purification"],
								icon: "lightbulb",
								color: "from-purple-400 to-purple-600"
							},
							{
								title: "UF Filtration",
								description: "Ultra Filtration removes fine particles and bacteria",
								benefits: ["No electricity needed", "Retains minerals", "Removes bacteria"],
								icon: "science",
								color: "from-orange-400 to-orange-600"
							},
							{
								title: "TDS Controller",
								description: "Maintains optimal mineral content in water",
								benefits: ["Better taste", "Essential minerals", "Balanced water"],
								icon: "speed",
								color: "from-red-400 to-red-600"
							},
							{
								title: "Copper Technology",
								description: "Natural copper infusion for health benefits",
								benefits: ["Antioxidant properties", "Supports immunity", "Aids digestion"],
								icon: "battery_charging_full",
								color: "from-amber-400 to-amber-600"
							},
							{
								title: "Alkaline Booster",
								description: "Optimizes pH level for better hydration",
								benefits: ["Balanced pH", "Better hydration", "Antioxidant rich"],
								icon: "water_drop",
								color: "from-blue-400 to-blue-600"
							}
						].map((tech, index) => (
							<div
								key={index}
								className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-200"
							>
								{/* Icon Header */}
								<div className={`bg-gradient-to-r ${tech.color} p-6 text-white`}>
									<div className="flex items-center gap-4">
										<span className="material-icons text-4xl">{tech.icon}</span>
										<h3 className="text-xl font-bold">{tech.title}</h3>
									</div>
								</div>

								{/* Content */}
								<div className="p-6">
									<p className="text-slate-600 mb-4">{tech.description}</p>
									
									{/* Benefits */}
									<ul className="space-y-2">
										{tech.benefits.map((benefit, benefitIndex) => (
											<li key={benefitIndex} className="flex items-center text-sm text-slate-700">
												<span className="material-icons text-green-500 text-sm mr-2">check_circle</span>
												{benefit}
											</li>
										))}
									</ul>
								</div>
							</div>
						))}
					</div>

					{/* CTA */}
					<div className="text-center mt-12">
						<button className="bg-sky-500 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-sky-600 transition shadow-lg hover:shadow-xl inline-flex items-center gap-2">
							Learn More About Our Technology
							<span className="material-icons">arrow_forward</span>
						</button>
					</div>
				</div>
			</section>

			{/* Products Section */}
			<section className="py-16 bg-sky-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Section Header */}
					<div className="text-center mb-12">
						<h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
							Featured Products
						</h2>
						<p className="text-lg text-slate-600 max-w-2xl mx-auto">
							Discover our best-selling water purifiers designed for every home
							and budget
						</p>
					</div>

					{/* Products Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{products.map((product) => (
							<div
								key={product.id}
								className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
							>
								{/* Badge */}
								<div className="relative">
									<div
										className={`absolute top-4 left-4 ${getBadgeColor(
											product.badge
										)} text-white px-3 py-1 rounded-full text-sm font-semibold z-10`}
									>
										{product.badge}
									</div>

									{/* Product Image */}
									<div className="bg-gradient-to-br from-sky-100 to-sky-200 h-64 flex items-center justify-center group-hover:from-sky-200 group-hover:to-sky-300 transition-all duration-300">
										<div className="text-8xl transform group-hover:scale-110 transition-transform duration-300">
											{product.image}
										</div>
									</div>
								</div>

								{/* Product Info */}
								<div className="p-6">
									<div className="mb-3">
										<span className="text-sm text-sky-600 font-semibold">
											{product.category}
										</span>
										<h3 className="text-xl font-bold text-slate-900 mt-1">
											{product.name}
										</h3>
									</div>

									{/* Rating */}
									<div className="flex items-center gap-2 mb-4">
										<div className="flex items-center">
											<span className="material-icons text-yellow-400 text-sm">
												star
											</span>
											<span className="text-sm font-semibold text-slate-900 ml-1">
												{product.rating}
											</span>
										</div>
										<span className="text-sm text-slate-500">
											({product.reviews} reviews)
										</span>
									</div>

									{/* Features */}
									<ul className="space-y-2 mb-4">
										{product.features.map((feature, index) => (
											<li
												key={index}
												className="flex items-start text-sm text-slate-600"
											>
												<span className="material-icons text-sky-500 text-sm mr-2">
													check_circle
												</span>
												{feature}
											</li>
										))}
									</ul>

									{/* Price */}
									<div className="mb-4 pt-4 border-t border-slate-200">
										<div className="flex items-baseline gap-2">
											<span className="text-3xl font-bold text-slate-900">
												₹{product.price.toLocaleString()}
											</span>
											<span className="text-lg text-slate-400 line-through">
												₹{product.originalPrice.toLocaleString()}
											</span>
										</div>
										<span className="text-sm text-green-600 font-semibold">
											Save ₹
											{(product.originalPrice - product.price).toLocaleString()}
										</span>
									</div>

									{/* Buttons */}
									<div className="flex gap-2">
										<button
											onClick={() => addToCart(product.id)}
											className="flex-1 bg-sky-500 text-white py-3 rounded-md font-semibold hover:bg-sky-600 transition flex items-center justify-center gap-2"
										>
											<span className="material-icons text-xl">
												shopping_cart
											</span>
											Add to Cart
											{cart[product.id] && (
												<span className="bg-white text-sky-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
													{cart[product.id]}
												</span>
											)}
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* View All Button */}
					<div className="mt-12 text-center">
						<button className="bg-slate-900 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-slate-800 transition shadow-lg inline-flex items-center gap-2">
							View All Products
							<span className="material-icons">arrow_forward</span>
						</button>
					</div>
				</div>
			</section>

			{/* Customer Reviews Section */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
							What Our Customers Say
						</h2>
						<p className="text-lg text-slate-600 max-w-2xl mx-auto">
							Join thousands of satisfied families who trust MONA for pure, healthy water
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{testimonials.map((testimonial) => (
							<div key={testimonial.id} className="bg-slate-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
								<div className="flex items-center gap-4 mb-4">
									<div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-2xl">
										{testimonial.image}
									</div>
									<div>
										<h4 className="font-bold text-slate-900">{testimonial.name}</h4>
										<p className="text-sm text-slate-600">{testimonial.location}</p>
									</div>
								</div>
								
								<div className="flex mb-3">
									{Array.from({ length: 5 }).map((_, i) => (
										<span key={i} className="material-icons text-yellow-400 text-sm">
											{i < testimonial.rating ? "star" : "star_border"}
										</span>
									))}
								</div>
								
								<p className="text-slate-700 mb-3 italic">"{testimonial.comment}"</p>
								<p className="text-sm text-sky-600 font-semibold">Purchased: {testimonial.purchase}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Comparison Section */}
			<section className="py-16 bg-slate-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
							Choose the Right Purifier
						</h2>
						<p className="text-lg text-slate-600 max-w-2xl mx-auto">
							Compare our models to find the perfect fit for your family's needs
						</p>
					</div>

					<div className="max-w-4xl mx-auto">
						{/* Tab Navigation */}
						<div className="flex border-b border-slate-200 mb-8">
							<button
								onClick={() => setActiveTab("basic")}
								className={`flex-1 py-4 font-semibold text-lg ${
									activeTab === "basic"
										? "text-sky-600 border-b-2 border-sky-600"
										: "text-slate-500"
								}`}
							>
								Basic vs Premium
							</button>
						</div>

						{/* Comparison Table */}
						<div className="bg-white rounded-xl shadow-lg overflow-hidden">
							<div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 border-b">
								<div className="font-semibold text-slate-900">Features</div>
								<div className="text-center font-semibold text-slate-900">
									{comparisonData.basic.name}
								</div>
								<div className="text-center font-semibold text-slate-900">
									{comparisonData.premium.name}
								</div>
							</div>

							{Object.entries(comparisonData.basic.features).map(([feature, basicValue]) => (
								<div key={feature} className="grid grid-cols-3 gap-4 p-6 border-b border-slate-100 hover:bg-slate-50">
									<div className="font-medium text-slate-700">{feature}</div>
									<div className="text-center text-slate-600">{basicValue}</div>
									<div className="text-center text-green-600 font-semibold">
										{comparisonData.premium.features[feature]}
									</div>
								</div>
							))}

							<div className="grid grid-cols-3 gap-4 p-6 bg-slate-50">
								<div className="font-semibold text-slate-900">Price</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-slate-900">{comparisonData.basic.price}</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">{comparisonData.premium.price}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* AMC / Service Plans Section */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
							Annual Maintenance Plans
						</h2>
						<p className="text-lg text-slate-600 max-w-2xl mx-auto">
							Keep your purifier running smoothly with our comprehensive service plans
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{amcPlans.map((plan, index) => (
							<div
								key={index}
								className={`relative rounded-xl shadow-lg overflow-hidden ${
									plan.popular ? "ring-2 ring-sky-500 transform scale-105" : ""
								}`}
							>
								{plan.popular && (
									<div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sky-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
										Most Popular
									</div>
								)}
								
								<div className={`p-6 text-white ${
									plan.popular ? "bg-sky-600" : "bg-slate-600"
								}`}>
									<h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
									<div className="text-3xl font-bold">{plan.price}</div>
								</div>
								
								<div className="p-6 bg-white">
									<ul className="space-y-3 mb-6">
										{plan.features.map((feature, featureIndex) => (
											<li key={featureIndex} className="flex items-center text-slate-700">
												<span className="material-icons text-green-500 mr-3">check_circle</span>
												{feature}
											</li>
										))}
									</ul>
									
									<button className={`w-full py-3 rounded-md font-semibold transition ${
										plan.popular
											? "bg-sky-500 text-white hover:bg-sky-600"
											: "bg-slate-200 text-slate-700 hover:bg-slate-300"
									}`}>
										Select Plan
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-16 bg-slate-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
							Frequently Asked Questions
						</h2>
						<p className="text-lg text-slate-600 max-w-2xl mx-auto">
							Get answers to common questions about water purifiers and our services
						</p>
					</div>

					<div className="space-y-4">
						{faqs.map((faq, index) => (
							<div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
								<button
									onClick={() => toggleFaq(index)}
									className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
								>
									<span className="font-semibold text-slate-900 text-lg">{faq.question}</span>
									<span className="material-icons text-sky-500">
										{activeFaq === index ? "expand_less" : "expand_more"}
									</span>
								</button>
								
								{activeFaq === index && (
									<div className="px-6 pb-4">
										<p className="text-slate-600 leading-relaxed">{faq.answer}</p>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Contact / Book Demo Section */}
			<section className="py-16 bg-gradient-to-r from-sky-500 to-blue-600">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
							Book a Free Demo
						</h2>
						<p className="text-lg text-sky-100 max-w-2xl mx-auto">
							Experience pure water at your home. Our expert will demonstrate the perfect purifier for your needs.
						</p>
					</div>

					<div className="bg-white rounded-2xl shadow-2xl p-8">
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-semibold text-slate-700 mb-2">
										Full Name *
									</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
										placeholder="Enter your full name"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-semibold text-slate-700 mb-2">
										Phone Number *
									</label>
									<input
										type="tel"
										name="phone"
										value={formData.phone}
										onChange={handleInputChange}
										required
										className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
										placeholder="Enter your phone number"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-semibold text-slate-700 mb-2">
									Address *
								</label>
								<textarea
									name="address"
									value={formData.address}
									onChange={handleInputChange}
									required
									rows="3"
									className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
									placeholder="Enter your complete address"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-slate-700 mb-2">
									Select Preferred Model
								</label>
								<select
									name="model"
									value={formData.model}
									onChange={handleInputChange}
									className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
								>
									<option value="">Select a model</option>
									<option value="RO Elite">AquaPure RO Elite</option>
									<option value="UV Pro">AquaPure UV Pro</option>
									<option value="Copper+">AquaPure Copper+</option>
									<option value="Alkaline Max">AquaPure Alkaline Max</option>
									<option value="Compact">AquaPure Compact</option>
									<option value="Basic">AquaPure Basic</option>
								</select>
							</div>

							<button
								type="submit"
								className="w-full bg-sky-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-sky-600 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
							>
								<span className="material-icons">calendar_today</span>
								Book Free Demo
							</button>
							
							<p className="text-center text-slate-500 text-sm">
								Our executive will contact you within 24 hours to schedule the demo
							</p>
						</form>
					</div>
				</div>
			</section>

			{/* Material Icons Font */}
			<link
				href="https://fonts.googleapis.com/icon?family=Material+Icons"
				rel="stylesheet"
			/>
		</div>
	);
};

export default Home;