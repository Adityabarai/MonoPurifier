import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaTint,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Highlights Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800/60 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-950 text-sky-400 flex items-center justify-center shrink-0 border border-sky-800/50">
              <FaShieldAlt className="text-lg" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">1 Year Comprehensive Warranty</h4>
              <p className="text-xs text-slate-400 mt-0.5">Free parts replacement & visits</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/50">
              <FaCheckCircle className="text-lg" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Free Doorstep Installation</h4>
              <p className="text-xs text-slate-400 mt-0.5">By certified water engineers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center shrink-0 border border-purple-800/50">
              <FaTint className="text-lg" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Mineral Retention</h4>
              <p className="text-xs text-slate-400 mt-0.5">Active Copper & Alkaline pH 8.5+</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center shrink-0 border border-amber-800/50">
              <FaPhoneAlt className="text-lg" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">4-Hour Service Guarantee</h4>
              <p className="text-xs text-slate-400 mt-0.5">Prompt nationwide technician visits</p>
            </div>
          </div>
        </div>

        {/* Main 4-Column Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                <FaTint className="text-lg text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-heading">
                Mono<span className="text-sky-400">Purifier</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Engineering India's next-generation multi-stage water purifiers with intelligent RO, UV-C sterilizers, and natural copper-alkaline mineralization.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <p className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-sky-400" />
                <span>Customer Care: <strong className="text-white font-mono">1800-MONO-PURE</strong> (Toll Free)</span>
              </p>
              <p className="flex items-center gap-2.5">
                <FaEnvelope className="text-sky-400" />
                <span>Inquiries: <strong className="text-white">care@monopurifier.com</strong></span>
              </p>
              <p className="flex items-center gap-2.5">
                <FaMapMarkerAlt className="text-sky-400" />
                <span>Headquarters: Mumbai, Maharashtra, India</span>
              </p>
            </div>
          </div>

          {/* Col 2: Solutions */}
          <div>
            <h3 className="font-bold text-white text-sm tracking-wider uppercase mb-4">
              Purifier Series
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#products" className="hover:text-sky-400 transition">AquaPure RO Elite</a></li>
              <li><a href="#products" className="hover:text-sky-400 transition">AquaPure UV Pro</a></li>
              <li><a href="#products" className="hover:text-sky-400 transition">AquaPure Copper+ Alkaline</a></li>
              <li><a href="#products" className="hover:text-sky-400 transition">AquaPure Compact Wall Mount</a></li>
              <li><a href="#products" className="hover:text-sky-400 transition">Commercial & Office Units</a></li>
            </ul>
          </div>

          {/* Col 3: Services & Support */}
          <div>
            <h3 className="font-bold text-white text-sm tracking-wider uppercase mb-4">
              Care & Support
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#demo-booking" className="hover:text-sky-400 transition">Book Free Doorstep Demo</a></li>
              <li><a href="#amc" className="hover:text-sky-400 transition">Annual Maintenance (AMC)</a></li>
              <li><a href="#technology" className="hover:text-sky-400 transition">Purification Stages</a></li>
              <li><a href="#faq" className="hover:text-sky-400 transition">Frequently Asked Questions</a></li>
              <li><a href="/admin/login" className="hover:text-sky-400 transition">Dealer & Admin Portal</a></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h3 className="font-bold text-white text-sm tracking-wider uppercase mb-4">
              Water Health Tips
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to receive seasonal water quality reports and filter replacement reminders.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300">
                ✓ Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-sky-600/20"
                >
                  Join Healthy Water Club
                </button>
              </form>
            )}

            <div className="pt-4 flex items-center space-x-2 text-white">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-sky-600 flex items-center justify-center transition"
              >
                <FaFacebookF size={13} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-sky-600 flex items-center justify-center transition"
              >
                <FaTwitter size={13} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-sky-600 flex items-center justify-center transition"
              >
                <FaInstagram size={13} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-sky-600 flex items-center justify-center transition"
              >
                <FaLinkedinIn size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MonoPurifier Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <a href="#privacy" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300 transition">Terms of Service</a>
            <a href="#warranty" className="hover:text-slate-300 transition">Warranty Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
