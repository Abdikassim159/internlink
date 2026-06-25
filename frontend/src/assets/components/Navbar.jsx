// src/components/Layout/Navbar.jsx

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg" 
        : "bg-white shadow-md"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-semibold text-xl text-gray-900">
              Attach<span className="text-blue-900">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation - Clean Text Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition ${
                isActive("/") 
                  ? "text-blue-900 border-b-2 border-blue-900 pb-1" 
                  : "text-gray-600 hover:text-blue-900"
              }`}
            >
              Home
            </Link>
            
            <Link 
              to="/opportunities" 
              className={`text-sm font-medium transition ${
                isActive("/opportunities") 
                  ? "text-blue-900 border-b-2 border-blue-900 pb-1" 
                  : "text-gray-600 hover:text-blue-900"
              }`}
            >
              Find Attachment
            </Link>
            
            <Link 
              to="/companies" 
              className={`text-sm font-medium transition ${
                isActive("/companies") 
                  ? "text-blue-900 border-b-2 border-blue-900 pb-1" 
                  : "text-gray-600 hover:text-blue-900"
              }`}
            >
              Companies
            </Link>
            
            <Link 
              to="/success-stories" 
              className={`text-sm font-medium transition ${
                isActive("/success-stories") 
                  ? "text-blue-900 border-b-2 border-blue-900 pb-1" 
                  : "text-gray-600 hover:text-blue-900"
              }`}
            >
              Success Stories
            </Link>
            
            <Link 
              to="/resources" 
              className={`text-sm font-medium transition ${
                isActive("/resources") 
                  ? "text-blue-900 border-b-2 border-blue-900 pb-1" 
                  : "text-gray-600 hover:text-blue-900"
              }`}
            >
              Resources
            </Link>
            
            {!user ? (
              <div className="flex items-center space-x-4 ml-4">
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-gray-600 hover:text-blue-900 transition"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="relative group ml-4">
                <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-900 transition">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm">JD</span>
                  </div>
                  <span>Account</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/student/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                  <Link to="/student/applications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Applications</Link>
                  <Link to="/student/logbook" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Digital Logbook</Link>
                  <Link to="/student/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                  <hr className="my-1" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Sign Out</button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-blue-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-96 py-4" : "max-h-0"}`}>
          <div className="space-y-3 pb-4">
            <Link to="/" className="block text-gray-600 hover:text-blue-900" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/opportunities" className="block text-gray-600 hover:text-blue-900" onClick={() => setIsMobileMenuOpen(false)}>Find Attachment</Link>
            <Link to="/companies" className="block text-gray-600 hover:text-blue-900" onClick={() => setIsMobileMenuOpen(false)}>Companies</Link>
            <Link to="/success-stories" className="block text-gray-600 hover:text-blue-900" onClick={() => setIsMobileMenuOpen(false)}>Success Stories</Link>
            <Link to="/resources" className="block text-gray-600 hover:text-blue-900" onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
            <hr className="my-2" />
            {!user ? (
              <>
                <Link to="/login" className="block text-gray-600 hover:text-blue-900" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="block bg-blue-900 text-white px-4 py-2 rounded-lg text-center" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
              </>
            ) : (
              <>
                <Link to="/student/dashboard" className="block text-gray-600 hover:text-blue-900" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                <Link to="/student/applications" className="block text-gray-600 hover:text-blue-900" onClick={() => setIsMobileMenuOpen(false)}>My Applications</Link>
                <button className="block text-red-600 w-full text-left">Sign Out</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;