import React, { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaPhoneAlt,
  FaWhatsapp,
  FaTrashAlt,
  FaSyncAlt,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaTint,
  FaTimes,
  FaTimesCircle,
  FaInfoCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import { getLeads, updateLeadStatus, deleteLead } from "../../services/api";

const STATUS_CONFIG = {
  New: {
    label: "New",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  Contacted: {
    label: "Contacted",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  "Demo Scheduled": {
    label: "Demo Scheduled",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  Completed: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  Cancelled: {
    label: "Cancelled",
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

const ManageLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getLeads();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setError("Failed to load demo inquiries. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateLeadStatus(id, newStatus);
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id ? { ...lead, status: newStatus } : lead
        )
      );
      showToast(`Inquiry status updated to "${newStatus}"`, "success");
    } catch (err) {
      console.error("Error updating status:", err);
      showToast("Failed to update status. Please try again.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete inquiry record for "${name}"?`)) {
      return;
    }
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      showToast(`Inquiry record deleted successfully.`, "info");
    } catch (err) {
      console.error("Error deleting lead:", err);
      showToast("Failed to delete inquiry.", "error");
    }
  };

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "All" || (lead.status || "New") === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        lead.name?.toLowerCase().includes(query) ||
        lead.phone?.includes(query) ||
        lead.address?.toLowerCase().includes(query) ||
        lead.city?.toLowerCase().includes(query) ||
        lead.model?.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, searchQuery]);

  // Counts
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => (l.status || "New") === "New").length;
    const contactedCount = leads.filter((l) => l.status === "Contacted").length;
    const scheduledCount = leads.filter(
      (l) => l.status === "Demo Scheduled"
    ).length;
    const completedCount = leads.filter((l) => l.status === "Completed").length;
    return { total, newCount, contactedCount, scheduledCount, completedCount };
  }, [leads]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-2xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-slide-up ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : toast.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-sky-50 border-sky-200 text-sky-800"
          }`}
        >
          {toast.type === "success" ? (
            <FaCheckCircle className="text-emerald-600 text-sm" />
          ) : toast.type === "error" ? (
            <FaTimesCircle className="text-rose-600 text-sm" />
          ) : (
            <FaInfoCircle className="text-sky-600 text-sm" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600">
            <FaTimes className="text-[10px]" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              Customer Inquiries & Demos
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
              {leads.length} Records
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Track customer requests for doorstep water purifier demonstrations
          </p>
        </div>

        <button
          onClick={fetchLeads}
          disabled={loading}
          title="Refresh Inquiries"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-xl border border-slate-200/80 shadow-sm transition self-start sm:self-auto"
        >
          <FaSyncAlt className={`text-xs ${loading ? "animate-spin text-sky-600" : "text-slate-400"}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Compact KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setStatusFilter("All")}
          className={`p-3.5 rounded-2xl border text-left transition ${
            statusFilter === "All"
              ? "bg-sky-50/80 border-sky-300 shadow-sm"
              : "bg-white border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Total Leads
          </span>
          <span className="text-2xl font-black text-slate-900 font-heading mt-1 block">
            {stats.total}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter("New")}
          className={`p-3.5 rounded-2xl border text-left transition ${
            statusFilter === "New"
              ? "bg-sky-50/80 border-sky-300 shadow-sm"
              : "bg-white border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              New Leads
            </span>
            {stats.newCount > 0 && (
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-ping"></span>
            )}
          </div>
          <span className="text-2xl font-black text-sky-700 font-heading mt-1 block">
            {stats.newCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter("Contacted")}
          className={`p-3.5 rounded-2xl border text-left transition ${
            statusFilter === "Contacted"
              ? "bg-purple-50/80 border-purple-300 shadow-sm"
              : "bg-white border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block">
            Contacted
          </span>
          <span className="text-2xl font-black text-purple-700 font-heading mt-1 block">
            {stats.contactedCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter("Demo Scheduled")}
          className={`p-3.5 rounded-2xl border text-left transition ${
            statusFilter === "Demo Scheduled"
              ? "bg-amber-50/80 border-amber-300 shadow-sm"
              : "bg-white border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">
            Scheduled
          </span>
          <span className="text-2xl font-black text-amber-700 font-heading mt-1 block">
            {stats.scheduledCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter("Completed")}
          className={`p-3.5 rounded-2xl border text-left col-span-2 sm:col-span-1 transition ${
            statusFilter === "Completed"
              ? "bg-emerald-50/80 border-emerald-300 shadow-sm"
              : "bg-white border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
            Completed
          </span>
          <span className="text-2xl font-black text-emerald-700 font-heading mt-1 block">
            {stats.completedCount}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by customer name, phone number, model, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200/80 focus:border-sky-500 focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", "New", "Contacted", "Demo Scheduled", "Completed", "Cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchLeads} className="underline font-bold hover:text-rose-800">
            Retry
          </button>
        </div>
      )}

      {/* Main Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <FaSyncAlt className="animate-spin text-2xl mx-auto mb-2 text-sky-500" />
            <p className="text-xs font-medium">Loading inquiries...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <FaPhoneAlt className="text-3xl mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No matching inquiries found</p>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery || statusFilter !== "All"
                ? "Try adjusting your search keywords or filter pill."
                : "Customer demo requests will appear here automatically."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-3.5">Customer</th>
                  <th className="py-3.5 px-3">Purifier Model</th>
                  <th className="py-3.5 px-3">Contact & Quick Actions</th>
                  <th className="py-3.5 px-3">Address & City</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Received</th>
                  <th className="py-3.5 px-3.5 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLeads.map((lead) => {
                  const currentCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.New;
                  const cleanPhone = (lead.phone || "").replace(/\D/g, "");
                  const whatsappPhone = cleanPhone.startsWith("91")
                    ? cleanPhone
                    : cleanPhone.length === 10
                    ? `91${cleanPhone}`
                    : cleanPhone;

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 transition duration-150"
                    >
                      {/* Customer Info */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {lead.name ? lead.name.slice(0, 2).toUpperCase() : "CU"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm md:text-base leading-tight">
                              {lead.name}
                            </p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              #{lead.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Requested Model */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 text-sky-800 font-semibold text-xs sm:text-sm border border-sky-100">
                          <FaTint className="text-sky-500 shrink-0 text-xs" />
                          {lead.model || "AquaPure RO Elite"}
                        </span>
                      </td>

                      {/* Phone & Quick Contact Actions */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-slate-800 font-medium text-sm">
                            {lead.phone}
                          </span>
                          {cleanPhone && (
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`tel:${cleanPhone}`}
                                title="Call customer"
                                className="p-2 bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-600 rounded-xl transition"
                              >
                                <FaPhoneAlt className="text-xs" />
                              </a>
                              <a
                                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                                  `Hello ${lead.name || ""}, greetings from MonoPurifier! We received your inquiry for ${
                                    lead.model || "our water purifier"
                                  }. When would you like to schedule your free doorstep demo?`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat on WhatsApp"
                                className="p-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 rounded-xl transition"
                              >
                                <FaWhatsapp className="text-sm" />
                              </a>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Address & City */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="flex items-start gap-1.5 text-slate-600 text-xs sm:text-sm">
                          <FaMapMarkerAlt className="text-slate-400 shrink-0 text-xs mt-0.5" />
                          <span className="truncate">
                            {lead.address || "Address not provided"}
                            {lead.city ? `, ${lead.city}` : ""}
                          </span>
                        </div>
                      </td>

                      {/* Status Dropdown Pill */}
                      <td className="py-3 px-3">
                        <select
                          value={lead.status || "New"}
                          disabled={updatingId === lead.id}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer transition ${currentCfg.bg} ${currentCfg.text} ${currentCfg.border}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Demo Scheduled">Demo Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Received Date */}
                      <td className="py-3 px-3 text-xs sm:text-sm text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <FaClock className="text-xs text-slate-400" />
                          <span>{formatDate(lead.created_at)}</span>
                        </div>
                      </td>

                      {/* Delete Action */}
                      <td className="py-3 px-3.5 text-right">
                        <button
                          onClick={() => handleDelete(lead.id, lead.name)}
                          title="Delete Record"
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        >
                          <FaTrashAlt className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Summary */}
        <div className="p-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredLeads.length}</strong> of{" "}
            <strong className="text-slate-800">{leads.length}</strong> total inquiries
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <FaCalendarAlt className="text-xs" /> Real-time customer capture
          </span>
        </div>
      </div>
    </div>
  );
};

export default ManageLeads;
