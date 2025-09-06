import React from 'react';
import { motion } from 'framer-motion';
import './about.css';

export default function About() {
  return (
    <motion.div
      className="container mx-auto px-6 py-12 rounded-lg"
      id="about"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        About Our System
      </h1>

      <p className="text-lg text-gray-200 leading-relaxed max-w-4xl mx-auto">
        Our <span className="text-pink-400 font-semibold">Employee Leave Management System</span> 
        is a modern web application built using the <span className="text-blue-300 font-semibold">MERN stack</span> 
        (MongoDB, Express.js, React.js, Node.js).  
        <br /><br />
        The goal of this system is to make leave management simple, transparent, and efficient for both 
        employees and administrators.
      </p>

      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-200">
          <li>🔐 <span className="font-semibold text-pink-400">Secure Login</span> for both Employees and Admins.</li>
          <li>📝 Submit leave requests quickly with type, duration, and reason.</li>
          <li>📊 View available leave balances in real time.</li>
          <li>📅 Integrated calendar to check upcoming leaves and availability.</li>
          <li>📨 Email notifications for approvals or rejections.</li>
          <li>📈 Reports & analytics to track leave trends and usage.</li>
        </ul>
      </div>

      <div className="mt-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">Why Choose This System?</h2>
        <p className="text-gray-200 leading-relaxed">
          It is designed to be <span className="text-pink-400 font-semibold">user-friendly</span>, 
          works smoothly for organizations of any size, and ensures 
          <span className="text-pink-400 font-semibold"> data security</span> through role-based access 
          and encryption. The system is scalable, reliable, and provides a professional way to 
          manage employee leaves with ease.
        </p>
      </div>

      {/* Contributors */}
      <div className="mt-10 max-w-4xl mx-auto text-gray-300">
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">Contributors</h2>
        <p className="leading-relaxed">
          Developed by:
          <br />
          <span className="text-pink-400 font-semibold">S. Suresh</span>,{' '}
          <span className="text-pink-400 font-semibold">Y. Naga Vignesh Reddy</span>,{' '}
          <span className="text-pink-400 font-semibold">A. Vishnu Vardhan Reddy</span>,{' '}
          <span className="text-pink-400 font-semibold">G. Anjani Gopaiah</span>
        </p>
      </div>
    </motion.div>
  );
}
