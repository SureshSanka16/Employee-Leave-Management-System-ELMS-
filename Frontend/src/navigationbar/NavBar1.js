import React from 'react';
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import MainHome from '../components/MainHome';
import AdminLogin from '../components/AdminLogin';
import Login from '../components/Login';
import About from '../components/About';
import PageNotFound from '../components/PageNotFound';
import { motion } from 'framer-motion';

// Import background image
import bg1 from '../components/images/bg1.jpg';

export default function NavBar1({ onAdminLogin, onEmployeeLogin }) {
  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg1})` }}
    >
      {/* Navbar */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-full 
                   bg-white/10 backdrop-blur-xl 
                   border-b border-white/20 
                   shadow-lg flex items-center justify-between 
                   px-8 py-4 z-50"
      >
        {/* Title */}
        <div className="text-lg font-bold text-white tracking-wide">
          Employee Leave Management System
        </div>

        {/* Links */}
        <ul className="flex gap-8 text-white font-medium">
          <li className="hover:text-pink-400 transition">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-pink-400 transition">
            <Link to="/about">About</Link>
          </li>
          <li className="hover:text-pink-400 transition">
            <Link to="/employeelogin">Employee Login</Link>
          </li>
          <li className="hover:text-pink-400 transition">
            <Link to="/adminlogin">Admin Login</Link>
          </li>
        </ul>
      </motion.div>

      {/* Page Routes */}
      <div className="pt-24"> 
        <Routes>
          <Route path="/" element={<MainHome />} exact />
          <Route path="/about" element={<About />} exact />
          <Route path="/employeelogin" element={<Login onEmployeeLogin={onEmployeeLogin} />} exact />
          <Route path="/adminlogin" element={<AdminLogin onAdminLogin={onAdminLogin} />} exact />
          <Route path="*" element={<PageNotFound />} exact />
        </Routes>
      </div>
    </div>
  );
}
