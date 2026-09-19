import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaArrowLeft,
  FaSpinner,
  FaTint,
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
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-sky-50/40 to-slate-100 font-sans">
      {/* Brand Header with Clean MonoPurifier Icon */}
      <div className="text-center mb-7">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
            <FaTint className="text-xl text-white" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-heading">
              Mono<span className="text-sky-600">Purifier</span>
            </span>
            <span className="block text-[9px] tracking-widest uppercase font-bold text-slate-400 -mt-1">
              Pure Health Technology
            </span>
          </div>
        </Link>
      </div>

      {/* Simple Decent Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-200/80">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight">
            Admin Portal
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Sign in to manage purifier catalog, leads, and store settings.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
            <FaShieldAlt className="text-red-500 shrink-0 text-sm" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FaUser className="text-sm" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
                autoComplete="username"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Please contact system administrator or call toll-free helpline: 1800-MONO-PURE to reset password."
                  )
                }
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FaLock className="text-sm" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
                autoComplete="current-password"
                disabled={loading}
                className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-sm" />
                ) : (
                  <FaEye className="text-sm" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center pt-1">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={loading}
              className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500 cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 text-xs font-medium text-slate-600 cursor-pointer"
            >
              Remember me on this device
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-slate-900 hover:bg-sky-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition"
          >
            <FaArrowLeft className="text-[10px]" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-xs text-slate-400">
        © {new Date().getFullYear()} MonoPurifier™. All rights reserved.
      </div>
    </div>
  );
};

export default AdminLogin;

