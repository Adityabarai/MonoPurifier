import React, { useState, useEffect, useMemo } from "react";
import {
  FaTint,
  FaShieldAlt,
  FaCheckCircle,
  FaStar,
  FaCalendarCheck,
  FaArrowRight,
  FaChevronDown,
  FaFlask,
  FaHeartbeat,
  FaAward,
  FaTruck,
  FaMicrochip,
  FaCheck,
  FaLayerGroup,
  FaFilter,
  FaWifi,
  FaBuilding,
} from "react-icons/fa";
import { getProducts, submitLead, getHeroImage, SERVER_URL } from "../../services/api";

const Home = () => {
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [heroImage, setHeroImage] = useState("/products/aquapure_copper_plus.png");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeStage, setActiveStage] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    model: "",
  });

  // Helper to resolve hero section image URL
  const resolveHeroImageUrl = (url) => {
    if (!url) return "/products/aquapure_copper_plus.png";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/uploads/")) return `${SERVER_URL}${url}`;
    return url;
  };

  const getProductImage = (p) => {
    if (!p) return "/products/aquapure_ro_elite.png";

    // 1. Dynamic priority: If database has an image URL, ALWAYS use it!
    if (p.image_url) {
      if (p.image_url.startsWith("http://") || p.image_url.startsWith("https://")) {
        return p.image_url;
      }
      if (p.image_url.startsWith("/uploads/")) {
        return `${SERVER_URL}${p.image_url}`;
      }
      if (p.image_url.startsWith("/products/")) {
        return p.image_url;
      }
    }

    // 2. Fallback only if no image in database
    const name = (p.name || "").toLowerCase();
    if (name.includes("copper")) return "/products/aquapure_copper_plus.png";
    if (name.includes("smart") || name.includes("iot")) return "/products/aquapure_smart_iot.jpg";
    if (name.includes("commercial")) return "/products/aquapure_commercial_50lph.jpg";
    if (name.includes("uv pro") || name.includes("uv")) return "/products/aquapure_uv_pro.png";
    if (name.includes("compact")) return "/products/aquapure_compact.png";
    if (name.includes("alkaline")) return "/products/aquapure_alkaline_max.png";
    if (name.includes("basic")) return "/products/aquapure_basic.png";
    return "/products/aquapure_ro_elite.png";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "All":
        return <FaLayerGroup className="text-xs" />;
      case "RO Purifier":
        return <FaFilter className="text-xs" />;
      case "UV Purifier":
        return <FaShieldAlt className="text-xs" />;
      case "Alkaline RO":
        return <FaTint className="text-xs" />;
      case "Smart RO":
        return <FaWifi className="text-xs" />;
      case "Wall Mount RO":
        return <FaMicrochip className="text-xs" />;
      case "Commercial RO":
        return <FaBuilding className="text-xs" />;
      default:
        return <FaTint className="text-xs" />;
    }
  };

  // Fetch real-time products from API
  useEffect(() => {
    getProducts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDynamicProducts(data);
        }
      })
      .catch((err) =>
        console.log("Using default fallback products:", err.message)
      );
  }, []);

  // Fetch dynamic hero section image
  useEffect(() => {
    getHeroImage()
      .then((res) => {
        if (res && res.image_url) {
          setHeroImage(res.image_url);
        }
      })
      .catch((err) =>
        console.log("Using default hero image:", err.message)
      );
  }, []);

  const defaultProducts = [
    {
      id: 1,
      name: "AquaPure RO Elite",
      category: "RO Purifier",
      price: 12999,
      original_price: 16999,
      badge: "Best Seller",
      rating: 4.8,
      reviews_count: 480,
      capacity: "10L Storage Tank",
      technology: "7-Stage RO + UV + UF + TDS Controller",
      description: "Our #1 bestselling domestic purifier engineered for high TDS borewell and municipal water with taste enhancer technology.",
      features: [
        "7-Stage Advanced Filtration",
        "0.0001 Micron RO Membrane",
        "Smart LED TDS & Filter Indicator",
        "Free Doorstep Installation",
      ],
      image_url: "/products/aquapure_ro_elite.png",
      image: "💧",
    },
    {
      id: 2,
      name: "AquaPure UV Pro Direct",
      category: "UV Purifier",
      price: 8999,
      original_price: 11999,
      badge: "Popular",
      rating: 4.6,
      reviews_count: 290,
      capacity: "8L Capacity",
      technology: "UV-C + Ultra Filtration (UF) + Pre-Carbon",
      description: "Zero water wastage high-speed filtration system designed specifically for municipal and corporation water supplies.",
      features: [
        "100% Zero Water Wastage",
        "Instant UV-C Germicidal Disinfection",
        "Auto Shut-off Sensor",
        "Ideal for Municipal Water",
      ],
      image_url: "/products/aquapure_uv_pro.png",
      image: "🌊",
    },
    {
      id: 3,
      name: "AquaPure Copper+ Alkaline",
      category: "Alkaline RO",
      price: 15999,
      original_price: 19999,
      badge: "★ Flagship 2026",
      rating: 4.9,
      reviews_count: 512,
      capacity: "12L Storage Tank",
      technology: "RO + UV + Active Copper + Bio-Alkaline",
      description: "Infuses natural copper ions and essential alkaline minerals to balance drinking water pH to 8.5+ with 99.9% virus eradication.",
      features: [
        "pH 8.5+ Bio-Alkaline Balance",
        "99.9% Pure Active Copper Infusion",
        "UV-C In-Tank Sterilizer",
        "Stainless Steel Tank",
      ],
      image_url: "/products/aquapure_copper_plus.png",
      image: "✨",
    },
    {
      id: 4,
      name: "AquaPure Smart IoT Touch",
      category: "Smart RO",
      price: 18499,
      original_price: 23999,
      badge: "Smart IoT",
      rating: 4.9,
      reviews_count: 328,
      capacity: "10L Storage Tank",
      technology: "Smart IoT + Digital TDS Display + 8-Stage RO+UV",
      description: "Next-gen purifier with live digital touch screen, real-time TDS ppm display, WiFi mobile app monitoring, and automatic filter life alert.",
      features: [
        "Real-time Digital TDS & Purity Display",
        "WiFi & Bluetooth App Monitoring",
        "Auto Filter Health Indicator Ring",
        "0.0001 Micron High-Recovery RO Membrane",
      ],
      image_url: "/products/aquapure_smart_iot.jpg",
      image: "📱",
    },
    {
      id: 5,
      name: "AquaPure Alkaline Max",
      category: "Alkaline RO",
      price: 14499,
      original_price: 18499,
      badge: "Doctor Recommended",
      rating: 4.8,
      reviews_count: 360,
      capacity: "11L Storage Tank",
      technology: "Bio-Alkaline + RO + UV + Hydrogen Infusion",
      description: "Enriches drinking water with essential magnesium, calcium, and potassium electrolytes, ideal for digestion, bone health, and athletic recovery.",
      features: [
        "Bioceramic Mineralizer Cartridge",
        "Boosts Water Antioxidant ORP",
        "Retains 100% Essential Natural Minerals",
        "Free Installation & 1-Yr Warranty",
      ],
      image_url: "/products/aquapure_alkaline_max.png",
      image: "👑",
    },
    {
      id: 6,
      name: "AquaPure Compact Wall-Mount",
      category: "Wall Mount RO",
      price: 9999,
      original_price: 12999,
      badge: "Space Saver",
      rating: 4.5,
      reviews_count: 215,
      capacity: "6L Compact Tank",
      technology: "6-Stage Micro RO + UV",
      description: "Ultra-slim ergonomic wall-mount design crafted for modern apartments and compact modular kitchens without compromising filtration.",
      features: [
        "Ultra-Slim Wall-Mount Profile",
        "6-Stage Multi-Filtration",
        "Transparent Water Level Window",
        "Silent Booster Pump Technology",
      ],
      image_url: "/products/aquapure_compact.png",
      image: "🏡",
    },
    {
      id: 7,
      name: "AquaPure Commercial Pro 50 LPH",
      category: "Commercial RO",
      price: 32999,
      original_price: 42000,
      badge: "Heavy Duty",
      rating: 4.9,
      reviews_count: 145,
      capacity: "50 Litres/Hour Flow",
      technology: "Dual Commercial RO + Industrial UV + Dual Gauges",
      description: "Heavy-duty industrial stainless steel RO purification system engineered for corporate offices, hospitals, restaurants, and educational campuses.",
      features: [
        "50 LPH Continuous High-Flow Output",
        "Dual Industrial Pressure Gauges",
        "Commercial Grade Stainless Steel Chassis",
        "Auto Flushing Membrane Cycle",
      ],
      image_url: "/products/aquapure_commercial_50lph.jpg",
      image: "🏢",
    },
    {
      id: 8,
      name: "AquaPure Basic PureFlow",
      category: "UV Purifier",
      price: 5999,
      original_price: 7999,
      badge: "Value Choice",
      rating: 4.4,
      reviews_count: 190,
      capacity: "5L Storage Tank",
      technology: "Triple Stage Carbon + Sediment + UV",
      description: "Reliable and economical water purification for low-TDS municipal tap water with negligible maintenance and replaceable cartridges.",
      features: [
        "Pure UV Disinfection",
        "Low Operating Cost",
        "Compact Countertop Footprint",
        "Zero Waste Water",
      ],
      image_url: "/products/aquapure_basic.png",
      image: "🌱",
    },
  ];

  // Harmonize products
  const products = (
    dynamicProducts.length > 0
      ? [...dynamicProducts].sort(
          (a, b) => (a.product_id || a.id || 0) - (b.product_id || b.id || 0)
        )
      : defaultProducts
  ).map((p) => ({
    id: p.product_id || p.id,
    name: p.name,
    category: p.category || "RO Purifier",
    price: p.price,
    originalPrice: p.original_price || p.originalPrice || p.price + 3000,
    badge: p.badge || "Certified",
    rating: p.rating || 4.7,
    reviews: p.reviews_count || p.reviews || 150,
    image_url: p.image_url,
    image: p.image || "💧",
    description: p.description || "High-performance multi-stage water purifier with advanced filtration technology.",
    features: Array.isArray(p.features)
      ? p.features
      : [
          p.technology || "Advanced RO Multi-Stage",
          p.capacity || "10L Storage Tank",
          "1 Year Comprehensive Warranty",
          "Free Doorstep Installation",
        ],
  }));

  // Categories list
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(products.map((p) => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Demo Booking Handler
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please provide your name and phone number.");
      return;
    }

    setFormSubmitting(true);
    try {
      await submitLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        model: formData.model.trim() || "AquaPure Copper+ Alkaline",
      });
      setFormSuccess(true);
      setFormData({ name: "", phone: "", address: "", model: "" });
      setTimeout(() => setFormSuccess(false), 8000);
    } catch (error) {
      console.error("Lead submission error:", error);
      alert("Failed to submit demo request. Please call our toll-free helpline 1800-MONO-PURE.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const selectModelForDemo = (modelName) => {
    setFormData((prev) => ({ ...prev, model: modelName }));
    const formElement = document.getElementById("demo-booking");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Purification Stages Data
  const purificationStages = [
    {
      step: "01",
      title: "Spun Pre-Carbon & Sediment",
      short: "Macro Filtration",
      desc: "Traps high-density suspended impurities like rust, fine sand, dirt, and dissolves toxic chlorine and unwanted odors.",
      poreSize: "5 Micron",
      removes: "Rust, Dirt, Sand & Chlorine",
    },
    {
      step: "02",
      title: "0.0001 Micron High-Flow RO",
      short: "Micro Membrane",
      desc: "Filters dissolved salts, heavy metals, arsenic, lead, fluorides, micro-plastics, and pesticides at the molecular level.",
      poreSize: "0.0001 Micron",
      removes: "Heavy Metals, Lead & High TDS",
    },
    {
      step: "03",
      title: "UV-C LED Germicidal Chamber",
      short: "Pathogen Shield",
      desc: "Destroys 99.99% of bacteria, viruses, and cysts using medical-grade UV-C wavelength, ensuring 0% microbial survival.",
      poreSize: "Germicidal 254nm",
      removes: "Viruses, Bacteria & Cysts",
    },
    {
      step: "04",
      title: "Active Copper & Alkaline Cartridge",
      short: "Mineral Infusion",
      desc: "Re-infuses natural copper ions and essential calcium/magnesium minerals, balancing water pH to 8.0 - 8.5 for optimal gut health.",
      poreSize: "Biomineralizer",
      removes: "Acidity & Mineral Deficiency",
    },
  ];

  // FAQ Data
  const faqs = [
    {
      q: "How does the Free Doorstep Demonstration work?",
      a: "Our certified technician visits your home at your scheduled time with our demonstration kit. We test your current tap water TDS level, show the live purification process, and provide fresh alkaline water tasting with zero purchase obligation.",
    },
    {
      q: "What is an ideal TDS level for drinking water?",
      a: "According to WHO and Indian BIS standards, drinking water TDS between 80 to 150 ppm is optimal. MonoPurifier's smart TDS controller ensures your water retains healthy essential minerals without becoming demineralized.",
    },
    {
      q: "Is installation really free?",
      a: "Yes! Every MonoPurifier model includes 100% free doorstep installation by a certified engineer, including all required connection pipes, pre-filter housing, and brass diverter valve.",
    },
    {
      q: "What warranty and service support do you offer?",
      a: "All models come with a 1-Year Comprehensive Warranty covering all electrical parts, filters, and membrane. We also offer 4-hour emergency technician support across 1,200+ cities in India.",
    },
    {
      q: "Can MonoPurifier handle high TDS borewell water?",
      a: "Yes. Our high-recovery RO membranes are engineered to purify hard borewell and tanker water with TDS up to 2,500 ppm, turning it into sweet, odorless, alkaline drinking water.",
    },
  ];

  return (
    <div className="font-sans bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* ========================================================
          1. HERO SECTION
         ======================================================== */}
      <section id="home" className="relative pt-4 pb-12 sm:pt-6 sm:pb-16 md:pt-8 md:pb-20 overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50">
        {/* Subtle decorative background glows */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-700 text-xs font-bold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                <span>⭐ Rated #1 Water Purifier Brand 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 font-heading tracking-tight leading-tight">
                Pure, Mineral-Rich Water for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600">Healthier Living.</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Next-generation 7-stage RO + UV + UF purification with <strong>Active Copper</strong> and <strong>Bio-Alkaline Mineralization</strong>. Engineered specifically to eliminate 99.99% toxins from Indian municipal and borewell water.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#demo-booking"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm tracking-wide shadow-xl shadow-sky-500/25 hover:shadow-2xl hover:-translate-y-0.5 transition duration-200"
                >
                  <FaCalendarCheck className="text-base" />
                  <span>Book Free Doorstep Demo</span>
                </a>

                <a
                  href="#products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-600 font-bold text-sm shadow-sm hover:shadow transition duration-200"
                >
                  <span>Explore All Models</span>
                  <FaArrowRight className="text-xs" />
                </a>
              </div>

              {/* Quick Trust Checks */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <FaCheckCircle className="text-emerald-500" /> Free TDS Water Test
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <FaCheckCircle className="text-emerald-500" /> Free Installation
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <FaCheckCircle className="text-emerald-500" /> 1-Year Comprehensive Warranty
                </span>
              </div>
            </div>

            {/* Right Product Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Product Card Container */}
                <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/80 relative overflow-hidden bg-white/95">
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-extrabold uppercase rounded-full tracking-wider shadow-sm">
                      ★ Flagship 2026 Model
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      AquaPure Copper+ Alkaline
                    </span>
                  </div>

                  {/* Purifier Hero Graphic */}
                  <div className="h-72 sm:h-80 rounded-2xl bg-gradient-to-b from-slate-50/50 to-white flex items-center justify-center relative p-2 mb-4 group overflow-hidden border border-slate-100 shadow-sm">
                    <img
                      src={resolveHeroImageUrl(heroImage)}
                      alt="AquaPure Copper+ Alkaline Flagship"
                      className="max-h-full max-w-full object-contain p-2 transform group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl"
                      onError={(e) => {
                        e.target.src = "/products/aquapure_copper_plus.png";
                      }}
                    />

                    {/* Floating Spec Tags */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-bold text-sky-700 shadow-sm border border-sky-100 flex items-center gap-1.5">
                      <FaTint className="text-sky-500" />
                      <span>pH 8.5+ Alkaline</span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-bold text-emerald-700 shadow-sm border border-emerald-100 flex items-center gap-1.5">
                      <FaShieldAlt className="text-emerald-500" />
                      <span>99.9% Pure Copper</span>
                    </div>
                  </div>

                  {/* Specs & Pricing */}
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h3 className="font-heading font-black text-xl text-slate-900">
                          AquaPure Copper+ Alkaline
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Dual Mineralization & In-Tank UV-C
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 line-through mr-1.5">
                          ₹19,999
                        </span>
                        <span className="font-heading font-black text-2xl text-sky-600">
                          ₹15,999
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => selectModelForDemo("AquaPure Copper+ Alkaline")}
                      className="w-full py-3.5 bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md"
                    >
                      <FaCalendarCheck />
                      <span>Book Free Demo For This Model</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Trust Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-3 md:pt-0">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                99.99%
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Impurity & Toxin Removal
              </p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                150K+
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Happy Indian Families
              </p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                100% Free
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Doorstep Installation
              </p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                4 Hours
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Rapid Service Response
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. INTERACTIVE PURIFICATION TECHNOLOGY BREAKDOWN
         ======================================================== */}
      <section id="technology" className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-extrabold uppercase tracking-wider">
              Patented 7-Stage Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-3 tracking-tight">
              How MonoPurifier Cleans Every Single Drop
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Unlike ordinary purifiers that strip away beneficial minerals, our intelligent 4-phase matrix purifies water while infusing natural active copper and bio-alkaline minerals.
            </p>
          </div>

          {/* Interactive Step Switcher */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Steps List */}
            <div className="lg:col-span-6 space-y-3">
              {purificationStages.map((stage, idx) => (
                <div
                  key={stage.step}
                  onClick={() => setActiveStage(idx)}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 ${
                    activeStage === idx
                      ? "bg-sky-50 border-sky-300 ring-2 ring-sky-400 shadow-md translate-x-2"
                      : "bg-white border-slate-200 hover:border-sky-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-600 bg-white px-2.5 py-1 rounded-lg border border-sky-100">
                      Stage {stage.step}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {stage.short}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-lg text-slate-900 mt-2">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Stage Detail Showcase */}
            <div className="lg:col-span-6">
              <div className="bg-gradient-to-br from-slate-900 to-sky-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 space-y-6">
                  <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-sky-300 uppercase tracking-wider">
                    Stage {purificationStages[activeStage].step} In Detail
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
                    {purificationStages[activeStage].title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {purificationStages[activeStage].desc}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
                    <div className="bg-white/5 p-4 rounded-xl">
                      <span className="text-slate-400 block mb-1">Filtration Rating</span>
                      <strong className="text-white text-base font-mono">
                        {purificationStages[activeStage].poreSize}
                      </strong>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <span className="text-slate-400 block mb-1">Primary Target</span>
                      <strong className="text-sky-300 text-sm">
                        {purificationStages[activeStage].removes}
                      </strong>
                    </div>
                  </div>

                  {/* TDS Simulator comparison */}
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-300">Water Quality Transformation</span>
                      <span className="text-emerald-400 font-bold">Optimal pH 8.5</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-red-950/60 p-2.5 rounded-lg border border-red-800/40 text-center">
                        <span className="text-[10px] text-red-300 block">Raw Tap Water</span>
                        <strong className="text-red-400 text-sm">TDS ~850 ppm</strong>
                      </div>
                      <FaArrowRight className="text-slate-500 shrink-0 text-xs" />
                      <div className="flex-1 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800/40 text-center">
                        <span className="text-[10px] text-emerald-300 block">MonoPurifier</span>
                        <strong className="text-emerald-400 text-sm">TDS ~120 ppm</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. DYNAMIC PRODUCT CATALOG
         ======================================================== */}
      <section id="products" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-xs">
              <FaTint className="text-sky-500 text-xs" /> Full Water Purifier Range
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading mt-3 tracking-tight">
              Choose the Ideal Purifier for Your Home
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              All units certified with 100% Food-Grade Tanks, Zero-Toxin Bio-Mineralizer & 1 Year Comprehensive Onsite Warranty.
            </p>
          </div>

          {/* Premium Filter Pill Navigation Bar */}
          <div className="flex items-center justify-center mb-10 sm:mb-12">
            <div className="w-full sm:w-auto overflow-x-auto no-scrollbar py-1 px-1">
              <div className="inline-flex sm:flex sm:flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-2.5 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm max-w-5xl mx-auto">
                {categories.map((cat) => {
                  const count =
                    cat === "All"
                      ? products.length
                      : products.filter((p) => p.category === cat).length;
                  const isSelected = selectedCategory === cat;

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer select-none ${
                        isSelected
                          ? "bg-slate-900 text-white shadow-md shadow-slate-900/25 scale-[1.02]"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:scale-[1.01]"
                      }`}
                    >
                      <span className={isSelected ? "text-sky-400" : "text-slate-400"}>
                        {getCategoryIcon(cat)}
                      </span>
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${
                          isSelected
                            ? "bg-sky-500 text-white"
                            : "bg-slate-200/80 text-slate-600"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
              <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
                <FaFilter />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                No purifiers in {selectedCategory}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Explore all our models to find the ideal match for your water source.
              </p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="mt-4 px-5 py-2.5 bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition duration-200 shadow-md"
              >
                View All Models
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => {
              const discountPercent = Math.round(
                ((p.originalPrice - p.price) / p.originalPrice) * 100
              );

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Card Visual Header */}
                  <div className="relative h-64 bg-white flex items-center justify-center p-4 border-b border-slate-100 overflow-hidden">
                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                        {p.badge}
                      </span>
                    </div>

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold rounded-full border border-emerald-200">
                          {discountPercent}% OFF
                        </span>
                      </div>
                    )}

                    {/* Product Graphic / Image */}
                    <img
                      src={getProductImage(p)}
                      alt={p.name}
                      className="h-56 w-auto max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const fallback = getProductImage({ name: p.name });
                        if (e.target.src !== window.location.origin + fallback) {
                          e.target.src = fallback;
                        }
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div>
                      {/* Rating & Reviews */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center text-amber-400 text-xs">
                          <FaStar />
                          <span className="font-bold text-slate-800 ml-1">
                            {p.rating}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                          ({p.reviews} verified reviews)
                        </span>
                      </div>

                      <h3 className="font-heading font-black text-xl text-slate-900 tracking-tight">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {p.description}
                      </p>

                      {/* Feature Pills */}
                      <div className="mt-4 space-y-1.5">
                        {p.features.slice(0, 3).map((feat, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs text-slate-600"
                          >
                            <FaCheckCircle className="text-sky-500 text-xs shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-heading font-black text-2xl text-slate-950">
                              ₹{p.price.toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{p.originalPrice.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-600 font-semibold block">
                            EMI from ₹{Math.round(p.price / 12)}/month
                          </span>
                        </div>

                        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                          {p.category}
                        </span>
                      </div>

                      <button
                        onClick={() => selectModelForDemo(p.name)}
                        className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2"
                      >
                        <FaCalendarCheck />
                        <span>Book Free Home Demo</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          4. WHY CHOOSE MONOPURIFIER
         ======================================================== */}
      <section id="why-us" className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-extrabold uppercase tracking-wider">
              The MonoPurifier Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-3 tracking-tight">
              Engineered for Complete Purity & Health
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Combining world-class filtration components with unmatched doorstep care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl mb-4">
                <FaFlask />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                0.0001 Micron RO Membrane
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Removes toxic heavy metals, lead, chromium, and micro-plastics that standard filters miss.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl mb-4">
                <FaHeartbeat />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Active Copper + Alkaline
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Infuses healthy copper ions and balances pH to 8.5+ to aid digestion, immunity, and overall vitality.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mb-4">
                <FaShieldAlt />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                1 Year Complete Warranty
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                100% parts, membrane, and technician coverage with zero hidden costs or inspection fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl mb-4">
                <FaAward />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Food-Grade Stainless Tank
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Prevents secondary bacterial growth and plastic leaching commonly found in conventional purifiers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-4">
                <FaTruck />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Free Doorstep Installation
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Installed within 24 hours of delivery by verified and trained water engineers with full demo.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl mb-4">
                <FaMicrochip />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Smart TDS & Filter Alert
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Real-time digital LED display alerts you before filter life expires so your family never drinks impure water.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. ANNUAL MAINTENANCE CONTRACT (AMC) PLANS
         ======================================================== */}
      <section id="amc" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-extrabold uppercase tracking-wider">
              Hassle-Free Ownership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-3 tracking-tight">
              Annual Maintenance Care (AMC) Plans
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Keep your purifier performing like brand new with transparent, scheduled filter replacements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400">Essential Care</span>
                <h3 className="font-heading font-black text-2xl text-slate-900 mt-1">Basic PureCare</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading font-black text-3xl text-slate-900">₹999</span>
                  <span className="text-xs text-slate-500 font-medium">/ year</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 pb-6 border-b border-slate-100">
                  Ideal for low-usage households with municipal supply.
                </p>

                <ul className="space-y-3 py-6 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-emerald-500 shrink-0" />
                    <span>2 Scheduled Preventive Service Visits</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-emerald-500 shrink-0" />
                    <span>Free Sediment Pre-Filter Replacement</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-emerald-500 shrink-0" />
                    <span>Full TDS & Water Hardness Testing</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <span>✕ Electrical Parts Not Included</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => selectModelForDemo("Basic PureCare AMC")}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition"
              >
                Choose Basic Care
              </button>
            </div>

            {/* Plan 2: Recommended */}
            <div className="bg-white rounded-3xl p-8 border-2 border-sky-500 shadow-xl relative flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-[10px] font-extrabold uppercase px-3.5 py-1 rounded-full shadow-sm tracking-wider">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase text-sky-600">Comprehensive</span>
                <h3 className="font-heading font-black text-2xl text-slate-900 mt-1">PureCare Plus</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading font-black text-3xl text-sky-600">₹1,999</span>
                  <span className="text-xs text-slate-500 font-medium">/ year</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 pb-6 border-b border-slate-100">
                  Complete peace of mind covering all standard filters & visits.
                </p>

                <ul className="space-y-3 py-6 text-xs text-slate-700">
                  <li className="flex items-center gap-2.5 font-medium">
                    <FaCheck className="text-emerald-500 shrink-0" />
                    <span>3 Periodic Service Visits Per Year</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium">
                    <FaCheck className="text-emerald-500 shrink-0" />
                    <span>Sediment + Carbon + Post-Carbon Change</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium">
                    <FaCheck className="text-emerald-500 shrink-0" />
                    <span>Unlimited Breakdown Calls</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium">
                    <FaCheck className="text-emerald-500 shrink-0" />
                    <span>Free Membrane Sanitization</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => selectModelForDemo("PureCare Plus AMC")}
                className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition"
              >
                Choose PureCare Plus
              </button>
            </div>

            {/* Plan 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-purple-600">All-Inclusive</span>
                <h3 className="font-heading font-black text-2xl text-slate-900 mt-1">PureCare Elite</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading font-black text-3xl text-slate-900">₹2,999</span>
                  <span className="text-xs text-slate-500 font-medium">/ year</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 pb-6 border-b border-slate-100">
                  Full zero-worry package including RO Membrane & UV Lamp.
                </p>

                <ul className="space-y-3 py-6 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-emerald-500 shrink-0" />
                    <span>Unlimited Emergency Breakdown Visits</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-emerald-500 shrink-0" />
                    <span>100% Free RO Membrane Replacement</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-emerald-500 shrink-0" />
                    <span>UV Lamp & Power SMPS Replacement</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FaCheck className="text-emerald-500 shrink-0" />
                    <span>Active Copper Mineralizer Refill</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => selectModelForDemo("PureCare Elite AMC")}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition"
              >
                Choose PureCare Elite
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. HIGH-CONVERSION DEMO BOOKING FORM
         ======================================================== */}
      <section id="demo-booking" className="py-20 bg-gradient-to-b from-white to-sky-50 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-10 relative overflow-hidden">
            {/* Trust Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-extrabold uppercase tracking-wider">
                100% Free At Your Doorstep
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading mt-3 tracking-tight">
                Schedule Your Free In-Home Demo
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
                Our technician will test your tap water quality, demonstrate live mineral filtration, and answer all questions with zero purchase obligation.
              </p>
            </div>

            {/* Reassurance Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-center text-xs font-semibold text-slate-600">
              <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-100 flex items-center justify-center gap-2">
                <FaCheckCircle className="text-sky-500" />
                <span>Zero Obligation Visit</span>
              </div>
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 flex items-center justify-center gap-2">
                <FaFlask className="text-emerald-500" />
                <span>Free TDS Water Report</span>
              </div>
              <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100 flex items-center justify-center gap-2">
                <FaAward className="text-purple-500" />
                <span>Certified Engineers</span>
              </div>
            </div>

            {/* Success Toast */}
            {formSuccess && (
              <div className="mb-6 p-5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3.5 text-emerald-900 animate-fade-in">
                <FaCheckCircle className="text-2xl text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base">Demonstration Booked Successfully!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Thank you! Our certified water engineer will call you shortly to confirm your preferred date and time slot.
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Purifier Model
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition bg-white"
                  >
                    <option value="">AquaPure Copper+ Alkaline (Recommended)</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} — ₹{p.price.toLocaleString("en-IN")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City / Area Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bandra West, Mumbai"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 text-white transition-all ${
                  formSubmitting
                    ? "bg-sky-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 hover:shadow-xl hover:-translate-y-0.5"
                }`}
              >
                <FaCalendarCheck className="text-base" />
                <span>
                  {formSubmitting
                    ? "Confirming Appointment..."
                    : "Confirm My Free Demonstration"}
                </span>
              </button>

              <p className="text-center text-slate-400 text-xs mt-2">
                🔒 Your contact info is strictly confidential. No spam guaranteed.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FREQUENTLY ASKED QUESTIONS
         ======================================================== */}
      <section id="faq" className="py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-extrabold uppercase tracking-wider">
              Got Questions?
            </span>
            <h2 className="text-3xl font-black text-slate-900 font-heading mt-3 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-slate-900 hover:text-sky-600 transition"
                  >
                    <span>{faq.q}</span>
                    <FaChevronDown
                      className={`text-xs text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-sky-500" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;