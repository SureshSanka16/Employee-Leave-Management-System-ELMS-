import { useEffect } from 'react';
import Typed from 'typed.js';

export default function MainHome() {
  useEffect(() => {
    const typed = new Typed('#typed-text', {
      strings: ['Welcome To Employee Leave Management System'], 
      typeSpeed: 50,
      loop: false,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div>
      <div className="container mx-auto text-center">
        {/* Typed Text */}
        <h1 
          className="text-4xl font-extrabold mt-12 
                     text-transparent bg-clip-text 
                     bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
        >
          <span id="typed-text"></span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-gray-200 text-lg">
          A simple and secure way to manage employee leaves
        </p>

        {/* Image */}
        <div className="flex justify-center">
          <img 
            src="/images/21.jpg"  // ✅ Use public folder path
            alt="Employee Leave Management System" 
            className="mt-10 max-w-lg w-full h-auto drop-shadow-lg" 
          />
        </div>
      </div>
    </div>
  );
}
