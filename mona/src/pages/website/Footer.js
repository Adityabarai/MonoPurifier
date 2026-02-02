import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Description */}
        <div>
          <div className="text-3xl font-bold mb-3">
            <span className="text-sky-500">MO</span>
            <span className="text-red-600">NA</span>
          </div>
          <p className="text-slate-400 text-sm">
            Providing clean water solutions for your home and office. Quality
            service and support guaranteed.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#home" className="hover:text-sky-500 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-sky-500 transition">
                About
              </a>
            </li>
            <li>
              <a href="#products" className="hover:text-sky-500 transition">
                Products
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-sky-500 transition">
                Services
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-sky-500 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Products / Services */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Products</h3>
          <ul className="space-y-2 text-slate-400">
            <li>
              <a href="#ro" className="hover:text-sky-500 transition">
                RO Purifiers
              </a>
            </li>
            <li>
              <a href="#uv" className="hover:text-sky-500 transition">
                UV Purifiers
              </a>
            </li>
            <li>
              <a href="#filters" className="hover:text-sky-500 transition">
                Filters
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter + Social */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Subscribe</h3>
          <p className="text-slate-400 text-sm mb-3">
            Get updates on our latest products and offers.
          </p>
          <div className="flex max-w-full">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-l-md text-slate-900 outline-none min-w-0"
            />
            <button className="bg-sky-500 px-4 py-2 rounded-r-md hover:bg-sky-600 transition">
              Subscribe
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-3 mt-5 text-white">
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-700 hover:bg-sky-500 transition"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-700 hover:bg-sky-500 transition"
            >
              <FaTwitter size={16} />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-700 hover:bg-sky-500 transition"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-700 hover:bg-sky-500 transition"
            >
              <FaLinkedinIn size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-700 mt-8 pt-4 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} MONA. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
