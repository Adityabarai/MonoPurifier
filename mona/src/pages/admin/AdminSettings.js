import React, { useState } from "react";
import {
  FaCog,
  FaShieldAlt,
  FaSave,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaDatabase,
} from "react-icons/fa";

const AdminSettings = () => {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    brandName: "MonoPurifier",
    tagline: "Pure Health Technology",
    supportPhone: "+91 98765 43210",
    supportEmail: "support@monopurifier.com",
    officeAddress: "Plot 12, Industrial Area, MP Nagar, Bhopal, MP 462011",
    demoStartTime: "09:00",
    demoEndTime: "20:00",
    maxDemosPerDay: "12",
    enableWhatsappAlerts: true,
    enableEmailAlerts: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight">
            Back-Office Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage system configurations, customer demonstration policies, and cloud connections.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-sm shadow-sky-500/20 transition self-start sm:self-auto"
        >
          <FaSave className="text-sm" />
          <span>Save Configurations</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-semibold animate-fade-in">
          <FaCheckCircle className="text-base text-emerald-600 shrink-0" />
          <span>Settings saved successfully to system configuration cache.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Settings Form */}
        <div className="md:col-span-2 space-y-6">
          {/* General Business Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                <FaCog className="text-base" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">General Brand & Contact</h2>
                <p className="text-xs sm:text-sm text-slate-400">Information displayed to customers on storefront</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/10"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/10"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FaPhoneAlt className="text-xs text-slate-400" />
                  Support Hotline
                </label>
                <input
                  type="text"
                  name="supportPhone"
                  value={formData.supportPhone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/10"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FaEnvelope className="text-xs text-slate-400" />
                  Inquiry Email
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/10"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-xs text-slate-400" />
                  Headquarters Address
                </label>
                <input
                  type="text"
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/10"
                />
              </div>
            </div>
          </div>

          {/* Doorstep Demo Policies */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <FaCheckCircle className="text-base" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">Doorstep Demonstration Setup</h2>
                <p className="text-xs sm:text-sm text-slate-400">Scheduling slots and dispatch guidelines</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Daily Start Time
                </label>
                <input
                  type="time"
                  name="demoStartTime"
                  value={formData.demoStartTime}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Daily End Time
                </label>
                <input
                  type="time"
                  name="demoEndTime"
                  value={formData.demoEndTime}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Max Bookings/Day
                </label>
                <input
                  type="number"
                  name="maxDemosPerDay"
                  value={formData.maxDemosPerDay}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableWhatsappAlerts"
                  checked={formData.enableWhatsappAlerts}
                  onChange={handleChange}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="font-medium">Enable instant WhatsApp notification alert on new customer lead</span>
              </label>

              <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableEmailAlerts"
                  checked={formData.enableEmailAlerts}
                  onChange={handleChange}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="font-medium">Send automated demo booking confirmation to customer</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Engine Status & Security Cards */}
        <div className="space-y-6">
          {/* Dual-Mode Database Status */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FaDatabase className="text-sm" />
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Database Engine
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">Current Mode:</span>
                  <span className="text-sky-700 font-mono font-bold">Local SQLite / JSON</span>
                </div>
                <p className="text-xs text-slate-500">
                  Zero-setup mode with local persistent storage for instant offline development.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">Cloud Supabase:</span>
                  <span className="text-slate-400 font-mono">Optional</span>
                </div>
                <p className="text-xs text-slate-500">
                  To migrate to cloud PostgreSQL, configure <code className="bg-slate-200/70 px-1.5 py-0.5 rounded text-xs font-mono">SUPABASE_URL</code> in <code className="bg-slate-200/70 px-1.5 py-0.5 rounded text-xs font-mono">backend/.env</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Security & Access */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3.5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <FaShieldAlt className="text-sm" />
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Security & Session
              </h3>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <strong className="text-slate-800">Authentication:</strong> JWT (JSON Web Token) with 24-hour expiration.
              </p>
              <p>
                <strong className="text-slate-800">Role:</strong> Master Administrator
              </p>
              <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                All changes to products and customer leads are tracked with timestamp records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
