
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split('@')[0];
    return parts.slice(0, 2).toUpperCase();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white shadow-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">in</span>
            </div>
            <span className="font-semibold text-xl text-gray-900">
              Intern<span className="text-blue-900">Link</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium transition ${isActive("/") ? "text-blue-900 border-b-2 border-blue-900 pb-1" : "text-gray-600 hover:text-blue-900"}`}>
              Home
            </Link>
            <Link to="/opportunities" className={`text-sm font-medium transition ${isActive("/opportunities") ? "text-blue-900 border-b-2 border-blue-900 pb-1" : "text-gray-600 hover:text-blue-900"}`}>
              Find Attachment
            </Link>
            <Link to="/companies" className={`text-sm font-medium transition ${isActive("/companies") ? "text-blue-900 border-b-2 border-blue-900 pb-1" : "text-gray-600 hover:text-blue-900"}`}>
              Companies
            </Link>
            
            {user && user.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-blue-900 hover:text-blue-700 transition">
                Admin
              </Link>
            )}
            
            {!user ? (
              <div className="flex items-center space-x-4 ml-4">
                <Link to="/student-login" className="text-sm font-medium text-gray-600 hover:text-blue-900 transition">Sign In</Link>
                <Link to="/student-register" className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition shadow-sm">Get Started</Link>
              </div>
            ) : (
              <div className="relative ml-4">
                {/* User Avatar Dropdown */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition">
                    {getInitials(user.full_name || user.email)}
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.full_name || user.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                        {user.role || 'Student'}
                      </span>
                    </div>

                    <Link
                      to="/applications"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      📝 My Applications
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      to="/saved-jobs"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      ❤️ Saved Jobs
                    </Link>
                    
                    {user && user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        ⚙️ Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition rounded-b-xl"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                )}
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
            
            {user && user.role === 'admin' && (
              <Link to="/admin" className="block text-blue-900 hover:text-blue-700" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
            )}
            
            <hr className="my-2" />
            {!user ? (
              <>
                <Link to="/student-login" className="block text-gray-600 hover:text-blue-900" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                <Link to="/student-register" className="block bg-blue-900 text-white px-4 py-2 rounded-lg text-center" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
              </>
            ) : (
              <>
                <Link to="/applications" className="block text-gray-600 hover:text-blue-900" onClick={() => setIsMobileMenuOpen(false)}>My Applications</Link>
                <Link to="/profile" className="block text-gray-600 hover:text-blue-900" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
                <button onClick={handleLogout} className="block text-red-600 w-full text-left">Sign Out</button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
