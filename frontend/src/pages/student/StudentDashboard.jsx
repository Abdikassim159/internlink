import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentModal from '../../components/PaymentModal';

const API_URL = 'http://localhost:5000/api';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // ===== SAVE STATE =====
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [savingId, setSavingId] = useState(null);
  
  const [stats, setStats] = useState({
    applied: 0,
    shortlisted: 0,
    interview: 0,
    accepted: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [browseSearchTerm, setBrowseSearchTerm] = useState('');
  const [browseType, setBrowseType] = useState('All Types');
  const [browseLocation, setBrowseLocation] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const navigate = useNavigate();

  // ===== GET AUTH HEADERS =====
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // ===== INITIAL LOAD - KEEP YOUR ORIGINAL STRUCTURE =====
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !userData) {
      navigate('/student-login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Keep your original calls
      fetchDashboardData();
      fetchOpportunities();
      fetchSavedOpportunities(); // <-- ADD THIS to load saved data
    } catch (e) {
      console.error('Error parsing user data:', e);
      navigate('/student-login');
    }
  }, []);

  // ===== FETCH DASHBOARD DATA - KEEP AS IS =====
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const appRes = await axios.get(`${API_URL}/applications/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const apps = appRes.data.applications || [];
      setApplications(apps);
      
      setStats({
        applied: apps.length,
        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        interview: apps.filter(a => a.status === 'interview').length,
        accepted: apps.filter(a => a.status === 'accepted').length,
        rejected: apps.filter(a => a.status === 'rejected').length
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  };

  // ===== FETCH OPPORTUNITIES - KEEP AS IS =====
  const fetchOpportunities = async () => {
    try {
      const response = await axios.get(`${API_URL}/opportunities`);
      const data = response.data.opportunities || [];
      setOpportunities(data);
      setFilteredOpportunities(data);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    }
  };

  // ===== FETCH SAVED OPPORTUNITIES - ADD THIS =====
  const fetchSavedOpportunities = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get(`${API_URL}/saved`, getAuthHeaders());
      
      const saved = response.data.saved || [];
      setSavedOpportunities(saved);
      
      const ids = new Set();
      saved.forEach(item => {
        if (item && item.id) {
          ids.add(item.id);
        }
      });
      setSavedIds(ids);
      
      return saved;
    } catch (err) {
      console.error('Error fetching saved:', err);
      return [];
    }
  };

  // ===== TOGGLE SAVE =====
  const handleToggleSave = async (opportunityId) => {
    try {
      setSavingId(opportunityId);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login first');
        return;
      }
      
      const checkResponse = await axios.get(`${API_URL}/saved/check/${opportunityId}`, getAuthHeaders());
      
      if (checkResponse.data.saved === true) {
        // UNSAVE
        await axios.delete(`${API_URL}/saved/${opportunityId}`, getAuthHeaders());
        
        setSavedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(opportunityId);
          return newSet;
        });
        setSavedOpportunities(prev => prev.filter(o => o.id !== opportunityId));
        
      } else {
        // SAVE
        await axios.post(`${API_URL}/saved/${opportunityId}`, {}, getAuthHeaders());
        
        setSavedIds(prev => new Set(prev).add(opportunityId));
        
        const opp = opportunities.find(o => o.id === opportunityId);
        if (opp) {
          setSavedOpportunities(prev => {
            if (prev.find(o => o.id === opportunityId)) return prev;
            return [opp, ...prev];
          });
        }
      }
    } catch (err) {
      console.error('Error toggling save:', err);
      alert(`Error: ${err.response?.data?.error || err.message}`);
      await fetchSavedOpportunities();
    } finally {
      setSavingId(null);
    }
  };

  // ===== HANDLE TAB CLICK - ADD THIS =====
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    
    if (tabId === 'browse') {
      setFilteredOpportunities(opportunities);
    }
    if (tabId === 'applications') {
      fetchDashboardData();
    }
    if (tabId === 'saved') {
      fetchSavedOpportunities();
    }
  };

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredOpportunities(opportunities);
    } else {
      setFilteredOpportunities(opportunities.filter(opp => opp.type === selectedCategory));
    }
  }, [selectedCategory, opportunities]);

  useEffect(() => {
    let filtered = [...opportunities];
    
    if (browseSearchTerm) {
      filtered = filtered.filter(opp => 
        opp.title?.toLowerCase().includes(browseSearchTerm.toLowerCase()) ||
        opp.company_name?.toLowerCase().includes(browseSearchTerm.toLowerCase())
      );
    }
    
    if (browseType !== 'All Types') {
      filtered = filtered.filter(opp => opp.type === browseType);
    }
    
    if (browseLocation) {
      filtered = filtered.filter(opp => 
        opp.location?.toLowerCase().includes(browseLocation.toLowerCase())
      );
    }
    
    setFilteredOpportunities(filtered);
  }, [browseSearchTerm, browseType, browseLocation, opportunities]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handlePayNow = (app) => {
    setSelectedApplication(app);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    fetchDashboardData();
  };

  const handleRemove = async (id) => {
    if (!confirm('Are you sure you want to remove this application?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/applications/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Error removing application:', err);
    }
  };

  const categories = ['All', 'Engineering', 'Finance', 'Technology', 'Marketing'];

  const menuSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'browse', label: 'Browse Opportunities', icon: '🔍' },
        { id: 'applications', label: 'My Applications', icon: '📝' },
        { id: 'saved', label: 'Saved', icon: '❤️' },
      ]
    },
    {
      title: 'MANAGE',
      items: [
        { id: 'profile', label: 'My Profile', icon: '👤' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
      ]
    },
    {
      title: 'RESOURCES',
      items: [
        { id: 'cv', label: 'CV Builder', icon: '📄' },
        { id: 'career', label: 'Career Guidance', icon: '🎯' },
      ]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'shortlisted': 'bg-blue-100 text-blue-700',
      'interview': 'bg-purple-100 text-purple-700',
      'accepted': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': '⏳',
      'shortlisted': '⭐',
      'interview': '📞',
      'accepted': '✅',
      'rejected': '❌'
    };
    return icons[status] || '📌';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getTypeColor = (type) => {
    if (type === 'Internship') return 'bg-blue-100 text-blue-700';
    if (type === 'Attachment') return 'bg-green-100 text-green-700';
    if (type === 'Graduate Trainee') return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mx-auto mb-3"></div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  const bgColor = isDarkMode ? 'bg-black' : 'bg-gray-100';
  const cardBg = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-gray-700' : 'border-gray-100';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const sidebarBg = isDarkMode ? 'bg-black' : 'bg-white';
  const sidebarBorder = isDarkMode ? 'border-gray-800' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200';
  const topBarBg = isDarkMode ? 'bg-black' : 'bg-white';

  return (
    <div className={`min-h-screen flex ${bgColor}`}>
      
      {/* ===== PAYMENT MODAL ===== */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        application={selectedApplication}
        onSuccess={handlePaymentSuccess}
      />

      {/* ===== SIDEBAR ===== */}
      <div className={`w-64 ${sidebarBg} shadow-sm z-40 flex-shrink-0 h-screen sticky top-0 overflow-y-auto border-r ${sidebarBorder}`}>
        <div className={`p-5 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base">in</span>
            </div>
            <div>
              <p className={`font-bold text-base leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>InternLink</p>
              <p className="text-[10px] text-blue-600">Student Portal</p>
            </div>
          </div>
        </div>

        <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-blue-50'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.full_name || 'Student'}
              </p>
              <p className={`text-[10px] truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-4">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                      activeTab === item.id 
                        ? 'bg-blue-900 text-white font-medium' 
                        : isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    {item.label}
                    {item.id === 'saved' && savedOpportunities.length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {savedOpportunities.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className={`p-3 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} mt-auto`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
              isDarkMode 
                ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300' 
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <span className="text-sm">🚪</span>
            Sign Out
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 min-h-screen">
        
        {/* ===== TOP BAR ===== */}
        <div className={`${topBarBg} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} px-6 py-3 sticky top-0 z-30`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'browse' ? 'Browse Opportunities' :
                 activeTab === 'applications' ? 'My Applications' :
                 activeTab === 'saved' ? 'Saved' :
                 activeTab === 'profile' ? 'My Profile' :
                 activeTab === 'notifications' ? 'Notifications' :
                 activeTab === 'cv' ? 'CV Builder' :
                 activeTab === 'career' ? 'Career Guidance' : 'Dashboard'}
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {activeTab === 'applications' ? `${applications.length} application(s)` : 
                 activeTab === 'saved' ? `${savedOpportunities.length} saved opportunity(ies)` :
                 `Welcome back, ${user?.full_name?.split(' ')[0] || 'Student'} 👋`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition ${isDarkMode ? 'bg-gray-800 text-yellow-400 border border-gray-700' : 'bg-gray-100 text-gray-600'}`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <div className={`w-8 h-8 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-100'} rounded-full flex items-center justify-center border ${isDarkMode ? 'border-gray-700' : 'border-transparent'}`}>
                <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'browse' && renderBrowse()}
          {activeTab === 'applications' && renderApplications()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'saved' && renderSavedJobs()}
          {activeTab === 'cv' && renderCV()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'career' && renderCareer()}
        </div>
      </div>
    </div>
  );

  // ============================================================
  // DASHBOARD - KEEP YOUR ORIGINAL CODE
  // ============================================================
  function renderDashboard() {
    return (
      <div>
        <div className={`${cardBg} rounded-xl shadow-sm border ${cardBorder} p-6 mb-6`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>WELCOME BACK</p>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Find your perfect internship & industrial attachment
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                {stats.applied + stats.shortlisted + stats.interview + stats.accepted} opportunities available
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search roles, companies..."
                  className={`w-48 px-4 py-2 pl-9 rounded-lg border text-sm focus:outline-none focus:border-blue-500 ${inputBg}`}
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button 
                onClick={() => handleTabClick('browse')}
                className="px-5 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition"
              >
                Browse Roles
              </button>
              <Link to="/profile" className={`px-5 py-2 text-sm font-medium rounded-lg transition ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                Complete Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className={`${cardBg} rounded-xl shadow-sm border ${cardBorder} overflow-hidden`}>
            <div className="h-1 bg-blue-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Applications Sent</p>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>{stats.applied}</p>
            </div>
          </div>
          <div className={`${cardBg} rounded-xl shadow-sm border ${cardBorder} overflow-hidden`}>
            <div className="h-1 bg-purple-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Interviews Scheduled</p>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-purple-600'}`}>{stats.interview}</p>
            </div>
          </div>
          <div className={`${cardBg} rounded-xl shadow-sm border ${cardBorder} overflow-hidden`}>
            <div className="h-1 bg-green-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Profile Views</p>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-green-600'}`}>{stats.shortlisted + stats.accepted}</p>
            </div>
          </div>
          <div className={`${cardBg} rounded-xl shadow-sm border ${cardBorder} overflow-hidden`}>
            <div className="h-1 bg-yellow-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Saved Roles</p>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-yellow-600'}`}>{savedOpportunities.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className={`${cardBg} rounded-xl shadow-sm border ${cardBorder} p-5`}>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Recommended for You</h3>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-blue-900 text-white'
                        : isDarkMode 
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {filteredOpportunities.slice(0, 4).map((opp) => (
                  <div key={opp.id} className={`border ${cardBorder} rounded-lg p-4 hover:shadow-md transition`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{opp.title}</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {opp.company_name} · {opp.location}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full">{opp.type}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-0.5 rounded-full">
                            {opp.type === 'Internship' ? 'Internship' : 'Industrial Attachment'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Closes {formatDate(opp.deadline)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
                      <Link to={`/opportunity/${opp.id}`} className={`text-sm font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                        See more details →
                      </Link>
                      <Link to={`/apply/${opp.id}`} className="px-5 py-1.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition">
                        Apply
                      </Link>
                    </div>
                  </div>
                ))}
                {filteredOpportunities.length === 0 && (
                  <div className={`text-center py-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No opportunities available. Check back later!
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className={`${cardBg} rounded-xl shadow-sm border ${cardBorder} p-5`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
                <button className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium`}>
                  All activity
                </button>
              </div>
              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.slice(0, 4).map((app) => (
                    <div key={app.id} className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} pb-3 last:border-0 last:pb-0`}>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{app.opportunity?.title || 'N/A'}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{app.opportunity?.company_name || 'N/A'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)} {app.status?.toUpperCase() || 'PENDING'}
                        </span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-sm">No recent activity.</p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleTabClick('browse')}
                  className="inline-block bg-blue-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition w-full text-center"
                >
                  Browse Opportunities
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // BROWSE OPPORTUNITIES - WITH SAVE BUTTON
  // ============================================================
  function renderBrowse() {
    return (
      <div>
        <div className={`${cardBg} rounded-xl shadow-sm border ${cardBorder} p-8 mb-6`}>
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
            Browse Verified Internship & Industrial Attachment Opportunities
          </h2>
          <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed max-w-3xl`}>
            Discover {opportunities.length} verified opportunities from Kenya's leading companies.
          </p>
        </div>

        <div className={`${cardBg} rounded-xl shadow-sm border ${cardBorder} p-6 mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, company..."
                value={browseSearchTerm}
                onChange={(e) => setBrowseSearchTerm(e.target.value)}
                className={`w-full px-4 py-2.5 pl-10 rounded-lg border text-sm focus:outline-none focus:border-blue-500 ${inputBg}`}
              />
              <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={browseType}
              onChange={(e) => setBrowseType(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-blue-500 ${inputBg}`}
            >
              <option value="All Types">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Attachment">Attachment</option>
              <option value="Graduate Trainee">Graduate Trainee</option>
            </select>
            <select
              value={browseLocation}
              onChange={(e) => setBrowseLocation(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-blue-500 ${inputBg}`}
            >
              <option value="">Filter by location...</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Kisumu">Kisumu</option>
              <option value="Nakuru">Nakuru</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {filteredOpportunities.length} opportunities found
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            ❤️ {savedOpportunities.length} saved
          </p>
        </div>

        <div className="space-y-4">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opp) => {
              const isSaved = savedIds.has(opp.id);
              const isSaving = savingId === opp.id;

              return (
                <div key={opp.id} className={`${cardBg} rounded-xl shadow-sm border ${cardBorder} p-5 hover:shadow-md transition relative`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{opp.title}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{opp.company_name} · {opp.location}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-xs px-3 py-0.5 rounded-full font-medium ${getTypeColor(opp.type)}`}>
                          {opp.type}
                        </span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Closes {formatDate(opp.deadline)}
                        </span>
                        {opp.stipend && (
                          <span className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'} font-medium`}>
                            💰 {opp.stipend}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* ===== SAVE BUTTON ===== */}
                    <button
                      onClick={() => handleToggleSave(opp.id)}
                      disabled={isSaving}
                      className={`
                        group relative flex items-center gap-2 px-4 py-2 rounded-xl
                        transition-all duration-300 ease-in-out
                        ${isSaved 
                          ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100' 
                          : 'bg-gray-50 text-gray-500 border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'
                        }
                        ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <span className="relative">
                        <svg 
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isSaved ? 'scale-110' : 'scale-100 group-hover:scale-110'
                          }`}
                          fill={isSaved ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        
                        {isSaved && (
                          <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-20"></span>
                        )}
                      </span>
                      
                      <span className="text-sm font-medium">
                        {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                      </span>
                      
                      {isSaved && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
                    <Link to={`/opportunity/${opp.id}`} className={`text-sm font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      See more details →
                    </Link>
                    <Link to={`/apply/${opp.id}`} className="px-6 py-1.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition">
                      Apply
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`${cardBg} rounded-xl p-12 text-center border ${cardBorder}`}>
              <div className="text-5xl mb-4">🔍</div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No opportunities found</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // MY APPLICATIONS - KEEP YOUR ORIGINAL CODE
  // ============================================================
  function renderApplications() {
    return (
      <div>
        <div className={`${cardBg} rounded-t-xl shadow-sm border ${cardBorder} p-4`}>
          <div className="grid grid-cols-4 gap-4">
            <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>ROLE / COMPANY</div>
            <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>TYPE</div>
            <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>STATUS</div>
            <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-right`}>ACTION</div>
          </div>
        </div>

        {applications.length > 0 ? (
          applications.map((app) => {
            const opportunityTitle = app.opportunity?.title || app.title || 'N/A';
            const companyName = app.opportunity?.company_name || app.company_name || 'N/A';
            const opportunityType = app.opportunity?.type || app.type || 'N/A';
            const isPending = app.status === 'pending';
            
            return (
              <div key={app.id} className={`${cardBg} border-t-0 border ${cardBorder} p-4 hover:bg-gray-50 transition ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {opportunityTitle}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {companyName}
                    </p>
                  </div>
                  <div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {opportunityType}
                    </span>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)} {app.status?.toUpperCase() || 'PENDING'}
                    </span>
                    {isPending && (
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                        Pending payment
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    {isPending && (
                      <button
                        onClick={() => handlePayNow(app)}
                        className="px-4 py-1.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition flex items-center gap-1"
                      >
                        <span>💰</span> Pay now
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(app.id)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-lg transition ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {isPending && (
                  <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    💳 Pay with M-Pesa or Card: click <strong>Pay now</strong> — on the payment page choose M-Pesa and enter 254XXXXXXXXX
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className={`${cardBg} rounded-b-xl shadow-sm border ${cardBorder} p-12 text-center`}>
            <div className="text-6xl mb-4">📭</div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No Applications</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Start browsing and apply to opportunities!</p>
            <button 
              onClick={() => handleTabClick('browse')}
              className="inline-block mt-4 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Browse Opportunities
            </button>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // PROFILE - KEEP YOUR ORIGINAL CODE
  // ============================================================
  function renderProfile() {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Profile</h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your information</p>
          </div>
          <Link to="/profile" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition">
            Edit Profile
          </Link>
        </div>
        <div className={`${cardBg} rounded-xl p-6 shadow-sm border ${cardBorder}`}>
          <div className={`flex items-center gap-5 pb-5 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-900">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.full_name || 'Student'}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
              <span className={`inline-block mt-1 text-xs px-3 py-0.5 rounded-full capitalize ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                {user?.role || 'Student'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>Full Name</p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.full_name || 'Not set'}</p>
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>Email</p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.email || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // SAVED JOBS - WITH REAL DATA
  // ============================================================
  function renderSavedJobs() {
    const handleRemoveSaved = async (id) => {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/saved/${id}`, getAuthHeaders());
        setSavedOpportunities(prev => prev.filter(job => job.id !== id));
        setSavedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      } catch (err) {
        console.error('Error removing saved job:', err);
        alert('Failed to remove saved job');
      }
    };

    return (
      <div>
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Saved Opportunities</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {savedOpportunities.length} saved opportunity(ies)
          </p>
        </div>

        {savedOpportunities.length > 0 ? (
          <div className="space-y-4">
            {savedOpportunities.map((job) => (
              <div key={job.id} className={`${cardBg} rounded-xl shadow-sm border ${cardBorder} p-5 hover:shadow-md transition`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {job.title}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {job.company_name} · {job.location}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`text-xs px-3 py-0.5 rounded-full font-medium ${getTypeColor(job.type)}`}>
                        {job.type}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Closes {formatDate(job.deadline)}
                      </span>
                      {job.saved_at && (
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Saved: {new Date(job.saved_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveSaved(job.id)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                        isDarkMode 
                          ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      Remove
                    </button>
                    <Link
                      to={`/apply/${job.id}`}
                      className="px-4 py-1.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition"
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${cardBg} rounded-xl p-16 text-center shadow-sm border ${cardBorder}`}>
            <div className="text-6xl mb-4">❤️</div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No Saved Opportunities</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Save opportunities you're interested in by clicking the ❤️ button
            </p>
            <button 
              onClick={() => handleTabClick('browse')}
              className="inline-block mt-4 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Browse Opportunities
            </button>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // CV BUILDER - KEEP YOUR ORIGINAL CODE
  // ============================================================
  function renderCV() {
    return (
      <div>
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>CV Builder</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload and manage your CV</p>
        </div>
        <div className={`${cardBg} rounded-xl p-8 shadow-sm border ${cardBorder}`}>
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No CV Uploaded</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Upload your CV to apply</p>
            <label className="inline-block bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition cursor-pointer">
              Upload CV
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
            </label>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-4`}>PDF, DOC, or DOCX (Max 5MB)</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // NOTIFICATIONS - KEEP YOUR ORIGINAL CODE
  // ============================================================
  function renderNotifications() {
    return (
      <div>
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Stay updated</p>
        </div>
        <div className={`${cardBg} rounded-xl p-16 text-center shadow-sm border ${cardBorder}`}>
          <div className="text-6xl mb-4">🔔</div>
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No Notifications</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>You'll receive notifications here</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // CAREER GUIDANCE - KEEP YOUR ORIGINAL CODE
  // ============================================================
  function renderCareer() {
    return (
      <div>
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Career Guidance</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Resources to help your career</p>
        </div>
        <div className={`${cardBg} rounded-xl p-16 text-center shadow-sm border ${cardBorder}`}>
          <div className="text-6xl mb-4">🎯</div>
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Coming Soon</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Career resources will be available here</p>
        </div>
      </div>
    );
  }
};

export default StudentDashboard;