import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ===== DARK MODE =====
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  // ===== DARK MODE STYLES =====
  const navBg = isScrolled 
    ? (isDarkMode ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md') 
    : (isDarkMode ? 'bg-gray-900' : 'bg-white');
  
  const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-600';
  const textColorHover = isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-900';
  const activeColor = isDarkMode ? 'text-blue-400 border-blue-400' : 'text-blue-900 border-blue-900';
  const logoText = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-100';
  const dropdownBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const dropdownText = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const dropdownHover = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50';
  const dividerColor = isDarkMode ? 'border-gray-700' : 'border-gray-100';
  const mobileMenuBg = isDarkMode ? 'bg-gray-900' : 'bg-white';

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${navBg} shadow-sm border-b ${borderColor}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">in</span>
            </div>
            <span className={`font-semibold text-xl ${logoText}`}>
              Intern<span className="text-blue-900">Link</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition ${isActive("/") ? activeColor : `${textColor} ${textColorHover}`}`}
            >
              Home
            </Link>
            <Link 
              to="/opportunities" 
              className={`text-sm font-medium transition ${isActive("/opportunities") ? activeColor : `${textColor} ${textColorHover}`}`}
            >
              Find Attachment
            </Link>
            <Link 
              to="/companies" 
              className={`text-sm font-medium transition ${isActive("/companies") ? activeColor : `${textColor} ${textColorHover}`}`}
            >
              Companies
            </Link>
            
            {user && (
              <Link 
                to="/student/dashboard" 
                className={`text-sm font-medium transition ${isActive("/student/dashboard") ? activeColor : `${textColor} ${textColorHover}`}`}
              >
                📊 Dashboard
              </Link>
            )}
            
            {user && user.role === 'admin' && (
              <Link to="/admin" className={`text-sm font-medium transition ${isActive("/admin") ? activeColor : `${textColor} ${textColorHover}`}`}>
                Admin
              </Link>
            )}
            
            {!user ? (
              <div className="flex items-center space-x-4 ml-4">
                <Link to="/student-login" className={`text-sm font-medium ${textColor} ${textColorHover} transition`}>
                  Sign In
                </Link>
                <Link to="/student-register" className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition shadow-sm">
                  Get Started
                </Link>
                {/* ===== DARK MODE TOGGLE - AFTER GET STARTED ===== */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition ${
                    isDarkMode 
                      ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                {/* ===== DARK MODE TOGGLE - FOR LOGGED IN USERS ===== */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition ${
                    isDarkMode 
                      ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                
                {/* User Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition">
                      {getInitials(user.full_name || user.email)}
                    </div>
                    <svg 
                      className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border ${dropdownBg} py-1 z-50 animate-fadeIn`}>
                      <div className={`px-4 py-3 border-b ${dividerColor}`}>
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.full_name || user.email?.split('@')[0] || 'User'}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                        <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                          {user.role || 'Student'}
                        </span>
                      </div>

                      <Link
                        to="/student/dashboard"
                        className={`block px-4 py-2 text-sm ${dropdownText} ${dropdownHover} transition`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        📊 Dashboard
                      </Link>
                      <Link
                        to="/applications"
                        className={`block px-4 py-2 text-sm ${dropdownText} ${dropdownHover} transition`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        📝 My Applications
                      </Link>
                      <Link
                        to="/profile"
                        className={`block px-4 py-2 text-sm ${dropdownText} ${dropdownHover} transition`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        👤 My Profile
                      </Link>
                      <Link
                        to="/saved-jobs"
                        className={`block px-4 py-2 text-sm ${dropdownText} ${dropdownHover} transition`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        ❤️ Saved Jobs
                      </Link>
                      
                      {user && user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className={`block px-4 py-2 text-sm ${dropdownText} ${dropdownHover} transition`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          ⚙️ Admin Dashboard
                        </Link>
                      )}

                      <div className={`border-t ${dividerColor} mt-1 pt-1`}>
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
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${isDarkMode ? 'text-gray-200' : 'text-gray-600'} hover:text-blue-900 focus:outline-none`}
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
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-[600px] py-4" : "max-h-0"}`}>
          <div className={`space-y-3 pb-4 ${mobileMenuBg}`}>
            <Link to="/" className={`block ${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-600 hover:text-blue-900'}`} onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/opportunities" className={`block ${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-600 hover:text-blue-900'}`} onClick={() => setIsMobileMenuOpen(false)}>
              Find Attachment
            </Link>
            <Link to="/companies" className={`block ${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-600 hover:text-blue-900'}`} onClick={() => setIsMobileMenuOpen(false)}>
              Companies
            </Link>
            
            {user && (
              <Link to="/student/dashboard" className={`block ${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-600 hover:text-blue-900'}`} onClick={() => setIsMobileMenuOpen(false)}>
                📊 Dashboard
              </Link>
            )}
            
            {user && user.role === 'admin' && (
              <Link to="/admin" className="block text-blue-900 hover:text-blue-700" onClick={() => setIsMobileMenuOpen(false)}>
                Admin
              </Link>
            )}
            
            <hr className={`my-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />
            
            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg transition ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            
            {!user ? (
              <>
                <Link to="/student-login" className={`block ${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-600 hover:text-blue-900'}`} onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/student-register" className="block bg-blue-900 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-800 transition" onClick={() => setIsMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link to="/student/dashboard" className={`block ${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-600 hover:text-blue-900'}`} onClick={() => setIsMobileMenuOpen(false)}>
                  📊 Dashboard
                </Link>
                <Link to="/applications" className={`block ${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-600 hover:text-blue-900'}`} onClick={() => setIsMobileMenuOpen(false)}>
                  📝 My Applications
                </Link>
                <Link to="/profile" className={`block ${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-600 hover:text-blue-900'}`} onClick={() => setIsMobileMenuOpen(false)}>
                  👤 My Profile
                </Link>
                <button onClick={handleLogout} className="block text-red-600 w-full text-left hover:text-red-800 transition">
                  Sign Out
                </button>
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
        
        /* Dark mode smooth transition */
        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;