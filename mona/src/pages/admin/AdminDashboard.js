import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaRupeeSign,
  FaBoxes,
  FaArrowRight,
  FaSyncAlt,
  FaCheckCircle,
  FaClock,
  FaWhatsapp,
  FaSearch,
  FaExclamationCircle,
  FaServer,
  FaImage,
} from "react-icons/fa";
import { getProducts, getLeads } from "../../services/api";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [leadFilter, setLeadFilter] = useState("All");
  const [leadSearch, setLeadSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsData, leadsData] = await Promise.allSettled([
        getProducts(true),
        getLeads(),
      ]);

      if (prodsData.status === "fulfilled" && Array.isArray(prodsData.value)) {
        setProducts(prodsData.value);
      }
      if (leadsData.status === "fulfilled" && Array.isArray(leadsData.value)) {
        setLeads(leadsData.value);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Metrics calculations
  const totalProducts = products.length;
  const activeProducts = products.filter(
    (p) => p.status === 1 && p.is_deleted === 0
  ).length;

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => (l.status || "New") === "New").length;
  const scheduledDemos = leads.filter(
    (l) => l.status === "Demo Scheduled"
  ).length;

  // Commercial Pipeline Revenue (estimated interest value from leads)
  const pipelineRevenue = useMemo(() => {
    return leads.reduce((acc, lead) => {
      const matched = products.find(
        (p) =>
          p.name &&
          lead.model &&
          p.name.toLowerCase().includes(lead.model.toLowerCase())
      );
      const price = matched?.price || 12999;
      return acc + price;
    }, 0);
  }, [leads, products]);

  // Product categories breakdown
  const categoryStats = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const cat = p.category || "Standard RO";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / (totalProducts || 1)) * 100),
    }));
  }, [products, totalProducts]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesFilter =
        leadFilter === "All" ||
        (leadFilter === "New" && (lead.status || "New") === "New") ||
        lead.status === leadFilter;

      const q = leadSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (lead.name && lead.name.toLowerCase().includes(q)) ||
        (lead.phone && lead.phone.includes(q)) ||
        (lead.model && lead.model.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [leads, leadFilter, leadSearch]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 60) {
        return `${Math.max(1, diffMins)}m ago`;
      }
      if (diffHours < 24) {
        return `${diffHours}h ago`;
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  const cleanPhone = (phone) => {
    if (!phone) return "";
    return phone.replace(/[^0-9]/g, "");
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time catalog performance and customer inquiry metrics
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          title="Refresh Dashboard Data"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-xl border border-slate-200/80 shadow-sm transition self-start sm:self-auto"
        >
          <FaSyncAlt className={`text-xs ${loading ? "animate-spin text-sky-600" : "text-slate-400"}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards Grid - Clean, balanced 4 cards with Revenue Tracking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Products */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
              Active Catalog
            </span>
            <span className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <FaBoxes className="text-base" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading">
              {loading ? "..." : activeProducts}
            </span>
            <span className="text-sm text-slate-400 font-medium">
              / {totalProducts} models
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
              <FaCheckCircle className="text-xs" /> Live in Store
            </span>
            <Link
              to="/admin/manageproducts"
              className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
            >
              View <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>

        {/* Card 2: Total Inquiries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
              Total Inquiries
            </span>
            <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <FaPhoneAlt className="text-base" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading">
              {loading ? "..." : totalLeads}
            </span>
            <span className="text-xs sm:text-sm text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded">
              Leads
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Customer inquiries</span>
            <Link
              to="/admin/leads"
              className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
            >
              Manage <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>

        {/* Card 3: Action Required (New Inquiries) */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm hover:shadow-md transition bg-gradient-to-b from-white to-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800">
              Action Required
            </span>
            <span className="p-2.5 bg-amber-100 text-amber-600 rounded-xl relative">
              <FaExclamationCircle className="text-base" />
              {newLeads > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
              )}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 font-heading">
              {loading ? "..." : newLeads}
            </span>
            <span className="text-xs sm:text-sm text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Awaiting Call
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between text-sm">
            <span className="text-amber-800 font-medium">Needs callback</span>
            <Link
              to="/admin/leads"
              className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1"
            >
              Call Now <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>

        {/* Card 4: Revenue & Pipeline Value */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-sm hover:shadow-md transition bg-gradient-to-b from-white to-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800">
              Pipeline Revenue
            </span>
            <span className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <FaRupeeSign className="text-base" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 font-heading">
              ₹{loading ? "..." : pipelineRevenue.toLocaleString("en-IN")}
            </span>
            <span className="text-xs sm:text-sm text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Est. Value
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center justify-between text-sm">
            <span className="text-emerald-800 font-medium">
              {scheduledDemos} demos scheduled
            </span>
            <Link
              to="/admin/leads"
              className="text-emerald-800 hover:text-emerald-900 font-bold flex items-center gap-1"
            >
              View Leads <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>

      {/* Storefront Hero Section Quick Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md shadow-sky-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <FaImage className="text-2xl text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wide mb-1">
              <span>Homepage Hero Showcase</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Home Page Main Section Image
            </h3>
            <p className="text-xs text-sky-100 mt-0.5">
              Customize or replace the flagship purifier spotlight image on your storefront hero banner.
            </p>
          </div>
        </div>

        <Link
          to="/admin/manageproducts"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-sky-50 text-sky-700 font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition whitespace-nowrap self-start sm:self-auto"
        >
          <span>Manage in Products Catalog</span>
          <FaArrowRight className="text-xs" />
        </Link>
      </div>

      {/* Main Content Grid: Recent Inquiries Feed (left) & Purifier Tech + System Telemetry (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Demonstration Inquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          {/* Table Header with Filters */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Demonstration Inquiries
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Real-time inquiries submitted from the website storefront
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["All", "New", "Demo Scheduled", "Completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setLeadFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                    leadFilter === status
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search */}
          <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2">
            <FaSearch className="text-slate-400 text-xs" />
            <input
              type="text"
              value={leadSearch}
              onChange={(e) => setLeadSearch(e.target.value)}
              placeholder="Search by customer name, mobile number, or model..."
              className="bg-transparent text-sm w-full text-slate-700 placeholder-slate-400 focus:outline-none"
            />
            {leadSearch && (
              <button
                onClick={() => setLeadSearch("")}
                className="text-xs text-slate-400 hover:text-slate-600 px-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Leads Feed */}
          <div className="p-4 flex-1">
            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <FaSyncAlt className="animate-spin text-2xl mx-auto mb-2 text-sky-500" />
                <p className="text-sm font-medium">Loading inquiries...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <FaPhoneAlt className="text-2xl mx-auto mb-2 text-slate-300" />
                <p className="text-base font-bold text-slate-600">No matching inquiries found</p>
                <p className="text-sm text-slate-400 mt-1">
                  Customer demo requests will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.slice(0, 6).map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-xl border border-slate-200/70 hover:border-sky-300 hover:bg-sky-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    {/* Customer Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-100 to-indigo-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-200/60">
                        {lead.name ? lead.name.slice(0, 2).toUpperCase() : "CU"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm md:text-base">
                            {lead.name}
                          </h3>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                              lead.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : lead.status === "Demo Scheduled"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : lead.status === "Contacted"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-sky-50 text-sky-700 border-sky-200"
                            }`}
                          >
                            {lead.status || "New"}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-slate-700 font-medium">
                            {lead.phone}
                          </span>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">
                            {lead.model || "RO Purifier"}
                          </span>
                          <span>•</span>
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <FaClock className="text-[10px]" />
                            {formatDate(lead.created_at)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons: Phone & WhatsApp */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {lead.phone && (
                        <>
                          <a
                            href={`tel:${cleanPhone(lead.phone)}`}
                            title="Direct Phone Call"
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-600 transition"
                          >
                            <FaPhoneAlt className="text-xs" />
                          </a>
                          <a
                            href={`https://wa.me/91${cleanPhone(
                              lead.phone
                            )}?text=${encodeURIComponent(
                              `Hello ${lead.name}, greetings from MonoPurifier! We received your inquiry for ${
                                lead.model || "our water purifier"
                              }. How can we assist you with your free doorstep demonstration?`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Chat on WhatsApp"
                            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 transition"
                          >
                            <FaWhatsapp className="text-sm" />
                          </a>
                        </>
                      )}

                      <Link
                        to="/admin/leads"
                        className="px-3.5 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100 bg-sky-50 rounded-xl transition"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer View All */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Showing top {Math.min(filteredLeads.length, 6)} of {totalLeads} total records
            </span>
            <Link
              to="/admin/leads"
              className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              Manage Full Leads Pipeline <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Purifier Technology Share & System Engine Telemetry */}
        <div className="space-y-6">
          {/* Category / Technology Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
                  Purifier Technology Share
                </h2>
                <span className="text-xs sm:text-sm font-semibold text-slate-400">
                  {totalProducts} Models
                </span>
              </div>

              <div className="space-y-3.5">
                {categoryStats.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700">{item.name}</span>
                      <span className="text-slate-500 font-medium">
                        {item.count} models ({item.percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0
                            ? "bg-sky-500"
                            : idx === 1
                            ? "bg-indigo-500"
                            : idx === 2
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${Math.max(item.percent, 8)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Catalog Status: Active</span>
              <Link
                to="/admin/manageproducts"
                className="font-bold text-sky-600 hover:text-sky-700"
              >
                Filter Catalog →
              </Link>
            </div>
          </div>

          {/* System Engine Health Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm border border-slate-700/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-sky-500/20 text-sky-400 rounded-lg">
                  <FaServer className="text-sm" />
                </span>
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-200">
                  Engine & DB Telemetry
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Healthy
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Operating on zero-setup database mode with high-availability SQLite/JSON storage engine and Express REST endpoints.
            </p>

            <div className="pt-2 border-t border-slate-700/80 space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Server Port:</span>
                <span className="text-sky-300 font-bold">http://localhost:5000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DB Engine:</span>
                <span className="text-emerald-300 font-bold">localDb (Zero-setup)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Media CDN:</span>
                <span className="text-slate-200">/uploads/products/</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
