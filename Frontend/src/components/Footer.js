import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-black/50 backdrop-blur-md text-white py-4 mt-10 border-t border-white/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <p className="text-sm md:text-base text-center md:text-left">
          &copy; {new Date().getFullYear()} Employee Leave Management System. All rights reserved.
        </p>

        <div className="flex gap-4 mt-2 md:mt-0 justify-center md:justify-end">
          <Link to="/privacy" className="hover:text-pink-400 transition">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-pink-400 transition">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:text-pink-400 transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
