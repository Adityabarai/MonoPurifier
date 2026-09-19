import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTint,
  FaPhoneAlt,
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Purifier Models", href: "#products" },
    { name: "Technology", href: "#technology" },
    { name: "Why Us", href: "#why-us" },
    { name: "AMC Plans", href: "#amc" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 font-sans ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-3 border-b border-slate-100"
          : "bg-white/95 backdrop-blur-sm py-4 border-b border-slate-200/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform duration-200">
              <FaTint className="text-xl text-white" />
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 font-heading">
                Mono<span className="text-sky-600">Purifier</span>
              </span>
              <span className="block text-[9px] tracking-widest uppercase font-bold text-slate-400 -mt-1">
                Pure Health Technology
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-700 hover:text-sky-600 transition-colors duration-150 relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-sky-500 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Actions & CTAs */}
          <div className="hidden md:flex items-center space-x-3.5">
            {/* Toll Free Helpline */}
            <a
              href="tel:1800666678"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition text-xs font-semibold"
              title="Customer Helpline"
            >
              <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                <FaPhoneAlt className="text-[10px]" />
              </div>
              <span>1800-MONO-PURE</span>
            </a>

            {/* Book Free Demo Button */}
            <a
              href="#demo-booking"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-sky-500/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <FaCheckCircle className="text-xs" />
              <span>Book Free Demo</span>
            </a>

            {/* Admin Back-Office Link */}
            <Link
              to="/admin/login"
              className="p-2 text-slate-400 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition"
              title="Admin Portal"
            >
              <FaShieldAlt className="text-base" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="#demo-booking"
              className="px-3 py-1.5 bg-sky-500 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Free Demo
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-slide-up">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-800 font-semibold hover:bg-sky-50 hover:text-sky-600 transition"
              >
                <span>{link.name}</span>
                <FaChevronRight className="text-xs text-slate-300" />
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <a
              href="tel:1800666678"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 rounded-xl"
            >
              <FaPhoneAlt className="text-sky-500 text-xs" />
              <span>Helpline: 1800-MONO-PURE</span>
            </a>

            <Link
              to="/admin/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
            >
              <span className="flex items-center gap-2">
                <FaShieldAlt className="text-sky-500 text-xs" />
                <span>Admin Login</span>
              </span>
              <FaChevronRight className="text-[10px] text-slate-400" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
