import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTint,
  FaBoxes,
  FaPlusCircle,
  FaPhoneAlt,
  FaCog,
  FaGlobe,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaChevronRight,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaUserShield,
} from "react-icons/fa";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { getLeads } from "../../services/api";

const AdminNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const [userData, setUserData] = useState({
    firstName: "Admin",
    lastName: "User",
    initials: "AU",
    username: "admin",
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Responsive mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on mobile navigation
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Load User Data
  useEffect(() => {
    try {
      const user = JSON.parse(
        sessionStorage.getItem("adminUser") ||
          localStorage.getItem("adminUser") ||
          "{}"
      );
      if (user && (user.firstname || user.username)) {
        setUserData({
          firstName: user.firstname || "Admin",
          lastName: user.lastname || "",
          initials: `${user.firstname?.[0] || user.username?.[0] || "A"}${
            user.lastname?.[0] || ""
          }`.toUpperCase(),
          username: user.username || "admin",
        });
      }
    } catch (e) {
      console.error("Error reading admin user data:", e);
    }
  }, []);

  // Fetch count of pending leads for live badge
  useEffect(() => {
    const fetchLeadStats = async () => {
      try {
        const leads = await getLeads();
        if (Array.isArray(leads)) {
          const pending = leads.filter(
            (l) => !l.status || l.status === "New" || l.status === "Demo Scheduled"
          ).length;
          setNewLeadsCount(pending);
        }
      } catch (err) {
        // silent fallback
      }
    };
    fetchLeadStats();
  }, [location.pathname]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of MonoPurifier Admin?")) {
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminUser");
      sessionStorage.removeItem("adminToken");
      navigate("/admin/login");
    }
  };

  // Navigation Items
  const navSections = [
    {
      label: "OVERVIEW",
      items: [
        {
          name: "Dashboard",
          path: "/admin/dashboard",
          icon: <HiOutlineSquares2X2 className="text-lg" />,
          badge: null,
        },
      ],
    },
    {
      label: "CATALOG MANAGEMENT",
      items: [
        {
          name: "All Products",
          path: "/admin/manageproducts",
          icon: <FaBoxes className="text-base" />,
          badge: null,
        },
        {
          name: "Add New Product",
          path: "/admin/addormodifyproducts",
          icon: <FaPlusCircle className="text-base" />,
          badge: null,
        },
      ],
    },
    {
      label: "CRM & INQUIRIES",
      items: [
        {
          name: "Customer Leads",
          path: "/admin/leads",
          icon: <FaPhoneAlt className="text-sm" />,
          badge: newLeadsCount > 0 ? `${newLeadsCount} New` : null,
          badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
        },
      ],
    },
    {
      label: "SYSTEM",
      items: [
        {
          name: "Back-Office Settings",
          path: "/admin/settings",
          icon: <FaCog className="text-base" />,
          badge: null,
        },
      ],
    },
  ];

  // Helper to determine current breadcrumb text
  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p.includes("manageproducts")) return "Catalog / All Products";
    if (p.includes("addormodifyproducts")) return "Catalog / Add Product";
    if (p.includes("leads")) return "CRM / Customer Inquiries & Demos";
    if (p.includes("settings")) return "System / Settings";
    return "Operations / Executive Dashboard";
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden selection:bg-sky-500 selection:text-white">
      {/* Mobile Backdrop Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar Dock */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 h-full w-[270px] bg-white border-r border-slate-200/80 z-50 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none"
        }`}
      >
        {/* Brand Header at very top */}
        <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <FaTint className="text-sm text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 font-heading">
                Mono<span className="text-sky-600">Purifier</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-bold text-sky-600 -mt-0.5">
                Admin Console
              </span>
            </div>
          </Link>

          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <FaTimes className="text-base" />
            </button>
          )}
        </div>

        {/* Navigation Links Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-4">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {section.label}
              </p>
              <nav className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={itemIdx}
                      to={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                        isActive
                          ? "bg-sky-50 text-sky-700 font-bold shadow-sm shadow-sky-100 border border-sky-100"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`shrink-0 transition-colors ${
                            isActive
                              ? "text-sky-600"
                              : "text-slate-400 group-hover:text-slate-600"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="whitespace-nowrap truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold border shrink-0 whitespace-nowrap ml-2 ${
                            item.badgeColor || "bg-sky-100 text-sky-800 border-sky-200"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Sidebar Bottom Card & User Bar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2.5 shrink-0">
          {/* System Status telemetry */}
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-700">API Server</span>
            </div>
            <span className="font-mono text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Port 5000
            </span>
          </div>

          {/* Quick Profile Capsule */}
          <div className="flex items-center justify-between px-1.5 pt-0.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                <FaUserShield className="text-xs" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-tight">
                  {userData.firstName}
                </p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
            >
              <FaSignOutAlt className="text-sm" />
            </button>
          </div>
        </div>
      </aside>

      {/* Right Content Area (Header + Main) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] shrink-0 z-30">
          {/* Left: Hamburger & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <FaBars className="text-base" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="font-semibold text-slate-400">Admin</span>
              <FaChevronRight className="text-xs text-slate-300" />
              <span className="font-bold text-slate-800 tracking-tight">
                {getBreadcrumb()}
              </span>
            </div>
          </div>

          {/* Center: Search Bar trigger */}
          <div className="hidden md:flex items-center max-w-sm w-full mx-4">
            <div className="relative w-full">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                readOnly
                onClick={() => navigate("/admin/manageproducts")}
                placeholder="Search products or leads... (Quick find)"
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 text-slate-700 placeholder-slate-400 rounded-xl border border-transparent focus:border-sky-400 focus:bg-white focus:outline-none transition cursor-pointer"
              />
            </div>
          </div>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Live Storefront Quick Link */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              title="Open Public Customer Storefront in new tab"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-100 transition"
            >
              <FaGlobe className="text-sky-500 text-sm" />
              <span>Storefront</span>
              <FaExternalLinkAlt className="text-xs text-sky-400" />
            </a>

            {/* "+ Add Product" shortcut */}
            <Link
              to="/admin/addormodifyproducts"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-500/20 transition"
            >
              <FaPlusCircle className="text-sm" />
              <span>Add Model</span>
            </Link>

            {/* Notification Indicator */}
            <Link
              to="/admin/leads"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition"
              title={`${newLeadsCount} Pending Demonstration Inquiries`}
            >
              <FaBell className="text-base" />
              {newLeadsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
                </span>
              )}
            </Link>

            <div className="h-5 w-px bg-slate-200 mx-0.5"></div>

            {/* User Profile Capsule */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {userData.initials}
                </div>
                <div className="hidden lg:block text-left leading-tight">
                  <p className="font-bold text-slate-800 text-sm">
                    {userData.firstName}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-slide-up"
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800">
                      {userData.firstName} {userData.lastName}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      @{userData.username}
                    </p>
                  </div>

                  <div className="py-1.5 space-y-0.5">
                    <Link
                      to="/admin/settings"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition font-medium"
                    >
                      <FaCog className="text-slate-400 text-sm" />
                      <span>Settings</span>
                    </Link>
                    <a
                      href="/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition font-medium"
                    >
                      <FaGlobe className="text-slate-400 text-sm" />
                      <span>Storefront</span>
                    </a>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition font-semibold"
                    >
                      <FaSignOutAlt className="text-rose-500 text-sm" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50 px-4 py-3 md:px-6 md:py-3.5 flex flex-col justify-between">
          <div className="max-w-7xl mx-auto w-full pb-3">
            <Outlet />
          </div>

          {/* Discreet SaaS Footer */}
          <footer className="max-w-7xl mx-auto w-full pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <p>
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-slate-600">MonoPurifier</span> • Enterprise Water Purification Systems
            </p>
            <div className="flex items-center gap-4 text-[10px]">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <FaCheckCircle className="text-emerald-500" /> Operational
              </span>
              <span>v2.4.0</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminNavbar;
