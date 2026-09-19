import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import monoLogo from "../../assets/image/monopurifier_logo.jpg";
import {
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaSpinner,
  FaTint,
  FaKey,
} from "react-icons/fa";
import { loginAdmin } from "../../services/api";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
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
    try {
      const data = await loginAdmin(formData.username.trim(), formData.password);

      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem("adminUser", JSON.stringify(data.admin));
      storage.setItem("adminToken", data.token);

      // Clear the other storage
      if (formData.rememberMe) {
        sessionStorage.removeItem("adminUser");
        sessionStorage.removeItem("adminToken");
      } else {
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid credentials. Please verify your username and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950 overflow-hidden font-sans">
      {/* Dynamic Background Atmospheric Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Floating Return Action */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white backdrop-blur-md border border-white/15 text-xs font-bold transition-all duration-200 shadow-sm"
        >
          <FaArrowLeft className="text-xs text-sky-400" />
          <span>Back to Storefront</span>
        </Link>
      </div>

      {/* Main Luxury Glassmorphic Card */}
      <div className="w-full max-w-5xl bg-slate-900/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden grid lg:grid-cols-12 relative z-10">
        {/* Left Side: MonoPurifier Brand Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
          {/* Subtle water-flow highlight */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Top Brand Identity */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/25">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <FaTint className="text-xl text-sky-400" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white font-heading">
                  Mono<span className="text-sky-400">Purifier</span>
                </span>
                <span className="block text-[10px] tracking-widest uppercase font-bold text-sky-300 -mt-1">
                  Pure Health Technology
                </span>
              </div>
            </div>

            {/* 3D Brand Logo Showcase Badge */}
            <div className="my-6 relative flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950/80 flex items-center justify-center p-2">
                  <img
                    src={monoLogo}
                    alt="MonoPurifier Official Brand Logo"
                    className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-center lg:text-left">
              <h2 className="text-lg font-extrabold text-white tracking-tight font-heading">
                Enterprise Command Center
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Centralized cloud management for water purification telemetry, inventory, and doorstep demo requests.
              </p>
            </div>
          </div>

          {/* Feature Pillars Checklist */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-2.5 relative z-10">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <FaCheckCircle className="text-sky-400 text-sm shrink-0" />
              <span>Real-Time TDS & Water Flow IoT Monitoring</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <FaCheckCircle className="text-sky-400 text-sm shrink-0" />
              <span>Automated Lead Tracking & Demo Scheduling</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <FaCheckCircle className="text-sky-400 text-sm shrink-0" />
              <span>Dynamic Storefront Catalog Synchronization</span>
            </div>
          </div>

          {/* Bottom Security Compliance */}
          <div className="mt-6 pt-4 flex items-center gap-2 text-[11px] font-semibold text-emerald-400 relative z-10">
            <FaShieldAlt className="text-sm" />
            <span>256-Bit TLS Bank-Grade Encryption</span>
          </div>
        </div>

        {/* Right Side: High-End Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 bg-white flex flex-col justify-between relative">
          <div>
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200/80 rounded-full text-sky-700 text-xs font-bold tracking-wide uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                <span>Restricted Staff Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
                Sign in to Admin Console
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Enter your authorized administrative credentials to continue.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50/90 border border-red-200 rounded-2xl flex items-start gap-3 animate-fade-in shadow-xs">
                <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FaShieldAlt className="text-xs" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-800">Authentication Alert</h4>
                  <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Admin Username / ID
                </label>
                <div className="relative rounded-2xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <FaUser className="text-sm" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="e.g. admin"
                    required
                    autoComplete="username"
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Secure Password
                  </label>
                  <span
                    onClick={() =>
                      alert(
                        "For security resets, please contact the MonoPurifier system administrator or helpline: 1800-MONO-PURE."
                      )
                    }
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer transition"
                  >
                    Forgot Password?
                  </span>
                </div>
                <div className="relative rounded-2xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter security password"
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500 focus:bg-white transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-base" />
                    ) : (
                      <FaEye className="text-base" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-4 h-4 text-sky-600 bg-slate-100 border-slate-300 rounded focus:ring-sky-500 focus:ring-2 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-600">
                    Keep me signed in for 30 days
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 ${
                    loading
                      ? "bg-slate-400 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 hover:from-sky-500 hover:to-blue-700 shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  }`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-base" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <FaKey className="text-sm" />
                      <span>Sign In to Admin Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs font-medium text-slate-400">
              © {new Date().getFullYear()} MonoPurifier™ Pure Health Technology. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
