import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentModal from '../../components/PaymentModal';
import {
  LayoutDashboard,
  User,
  FileText,
  Bookmark,
  Briefcase,
  Calendar,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
  File,
  GraduationCap,
  Users,
  Award,
  Clock,
  ChevronRight,
  Plus,
  Search,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Edit2,
  X,
  Save,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Trash2
} from 'lucide-react';

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
  
  // ===== PROFILE STATE =====
  const [profileData, setProfileData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  
  // ===== MESSAGES STATE =====
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isMessageDetailOpen, setIsMessageDetailOpen] = useState(false);
  
  const [stats, setStats] = useState({
    applied: 0,
    shortlisted: 0,
    interview: 0,
    accepted: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
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

  // ===== INITIAL LOAD =====
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
      loadAllData();
    } catch (e) {
      console.error('Error parsing user data:', e);
      navigate('/student-login');
    }
  }, []);

  // ===== LOAD ALL DATA =====
  const loadAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔵 Loading dashboard data...');
      
      // 1. Fetch opportunities
      try {
        const oppsRes = await axios.get(`${API_URL}/opportunities`);
        let opps = [];
        if (oppsRes.data && oppsRes.data.opportunities) {
          opps = oppsRes.data.opportunities;
        } else if (Array.isArray(oppsRes.data)) {
          opps = oppsRes.data;
        } else {
          opps = oppsRes.data || [];
        }
        setOpportunities(opps);
        setFilteredOpportunities(opps);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setOpportunities([]);
        setFilteredOpportunities([]);
      }
      
      // 2. Fetch applications
      try {
        const appRes = await axios.get(`${API_URL}/applications/my`, getAuthHeaders());
        const apps = appRes.data.applications || [];
        setApplications(apps);
        
        setStats({
          applied: apps.length,
          shortlisted: apps.filter(a => a.status === 'shortlisted').length,
          interview: apps.filter(a => a.status === 'interview').length,
          accepted: apps.filter(a => a.status === 'accepted').length,
          rejected: apps.filter(a => a.status === 'rejected').length
        });
      } catch (err) {
        console.error('Error fetching applications:', err);
      }
      
      // 3. Fetch saved opportunities
      try {
        const savedRes = await axios.get(`${API_URL}/saved`, getAuthHeaders());
        const saved = savedRes.data.saved || [];
        setSavedOpportunities(saved);
        
        const ids = new Set();
        saved.forEach(item => {
          if (item && item.id) {
            ids.add(item.id);
          }
        });
        setSavedIds(ids);
      } catch (err) {
        console.error('Error fetching saved:', err);
      }
      
      // 4. Fetch profile
      try {
        const profileRes = await axios.get(`${API_URL}/profile`, getAuthHeaders());
        setProfileData(profileRes.data);
        setUser(prev => ({ 
          ...prev, 
          ...profileRes.data,
          full_name: profileRes.data.fullName || prev?.full_name,
          phone: profileRes.data.phone,
          location: profileRes.data.location,
          university: profileRes.data.university,
          course: profileRes.data.course,
          yearOfStudy: profileRes.data.yearOfStudy,
          bio: profileRes.data.bio,
          skills: profileRes.data.skills || []
        }));
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
      
      // 5. Fetch messages
      try {
        const messagesRes = await axios.get(`${API_URL}/messages`, getAuthHeaders());
        setMessages(messagesRes.data.messages || []);
        setUnreadCount(messagesRes.data.unread_count || 0);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setLoading(false);
    }
  };

  // ===== FETCH SAVED OPPORTUNITIES =====
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
        await axios.delete(`${API_URL}/saved/${opportunityId}`, getAuthHeaders());
        
        setSavedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(opportunityId);
          return newSet;
        });
        setSavedOpportunities(prev => prev.filter(o => o.id !== opportunityId));
        
      } else {
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

  // ===== FETCH MESSAGES =====
  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages`, getAuthHeaders());
      
      setMessages(response.data.messages || []);
      setUnreadCount(response.data.unread_count || 0);
      setLoadingMessages(false);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setLoadingMessages(false);
    }
  };

  // ===== HANDLE MESSAGE CLICK =====
  const handleMessageClick = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages/${messageId}`, getAuthHeaders());
      
      setSelectedMessage(response.data);
      setIsMessageDetailOpen(true);
      fetchMessages();
    } catch (err) {
      console.error('Error fetching message detail:', err);
    }
  };

  // ===== HANDLE DELETE MESSAGE =====
  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/messages/${messageId}`, getAuthHeaders());
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setIsMessageDetailOpen(false);
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message');
    }
  };

  // ===== MARK ALL AS READ =====
  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const unreadMessages = messages.filter(msg => !msg.is_read);
      
      for (const msg of unreadMessages) {
        await axios.put(`${API_URL}/messages/${msg.id}/read`, {}, getAuthHeaders());
      }
      
      setMessages(prev => prev.map(msg => ({ ...msg, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
      alert('Failed to mark all as read');
    }
  };

  // ===== PROFILE: OPEN EDIT MODAL =====
  const handleOpenEditModal = () => {
    setEditData({
      fullName: profileData?.fullName || user?.full_name || '',
      email: profileData?.email || user?.email || '',
      phone: profileData?.phone || '',
      location: profileData?.location || '',
      university: profileData?.university || '',
      course: profileData?.course || '',
      yearOfStudy: profileData?.yearOfStudy || '1st Year',
      bio: profileData?.bio || '',
      skills: profileData?.skills || []
    });
    setIsEditModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // ===== PROFILE: CLOSE EDIT MODAL =====
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    document.body.style.overflow = 'auto';
    setProfileError('');
    setNewSkill('');
  };

  // ===== PROFILE: SAVE CHANGES =====
  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      const token = localStorage.getItem('token');
      
      await axios.put(`${API_URL}/profile`, 
        {
          fullName: editData.fullName,
          email: editData.email,
          phone: editData.phone,
          location: editData.location,
          university: editData.university,
          course: editData.course,
          yearOfStudy: editData.yearOfStudy,
          bio: editData.bio,
          skills: editData.skills
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setProfileData(editData);
      setUser(prev => ({ 
        ...prev, 
        ...editData,
        full_name: editData.fullName
      }));
      
      setSavingProfile(false);
      handleCloseEditModal();
      setProfileMessage('✅ Profile updated successfully!');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err) {
      setSavingProfile(false);
      setProfileError('Failed to update profile');
      setTimeout(() => setProfileError(''), 3000);
    }
  };

  // ===== PROFILE: ADD SKILL =====
  const handleAddSkill = () => {
    if (newSkill.trim() && !editData.skills?.includes(newSkill.trim())) {
      setEditData({
        ...editData,
        skills: [...(editData.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  // ===== PROFILE: REMOVE SKILL =====
  const handleRemoveSkill = (skill) => {
    setEditData({
      ...editData,
      skills: editData.skills?.filter(s => s !== skill) || []
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  // ===== HANDLE TAB CLICK =====
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
    if (tabId === 'messages') {
      fetchMessages();
    }
  };

  // ===== FETCH DASHBOARD DATA =====
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const appRes = await axios.get(`${API_URL}/applications/my`, getAuthHeaders());
      
      const apps = appRes.data.applications || [];
      setApplications(apps);
      
      setStats({
        applied: apps.length,
        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        interview: apps.filter(a => a.status === 'interview').length,
        accepted: apps.filter(a => a.status === 'accepted').length,
        rejected: apps.filter(a => a.status === 'rejected').length
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  // ===== FILTER OPPORTUNITIES =====
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
      await axios.delete(`${API_URL}/applications/${id}`, getAuthHeaders());
      fetchDashboardData();
    } catch (err) {
      console.error('Error removing application:', err);
    }
  };

  const categories = ['All', 'Engineering', 'Finance', 'Technology', 'Marketing'];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'saved', label: 'Saved Opportunities', icon: Bookmark },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'resume', label: 'Resume/CV', icon: File },
    { id: 'career', label: 'Career Resources', icon: GraduationCap },
    { id: 'events', label: 'Events & Webinars', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-700',
    'shortlisted': 'bg-blue-100 text-blue-700',
    'interview': 'bg-green-100 text-green-700',
    'accepted': 'bg-purple-100 text-purple-700',
    'rejected': 'bg-red-100 text-red-700'
  };

  const statusIcons = {
    'pending': ClockIcon,
    'shortlisted': Star,
    'interview': CheckCircle,
    'accepted': CheckCircle,
    'rejected': XCircle,
  };

  const getStatusColor = (status) => {
    return statusColors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    return statusIcons[status] || AlertCircle;
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

  const dashboardStats = [
    { label: 'Applications', value: stats.applied, icon: FileText, color: '#F5831F' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: Users, color: '#6366F1' },
    { label: 'Interviews', value: stats.interview, icon: Calendar, color: '#10B981' },
    { label: 'Offers', value: stats.accepted, icon: Award, color: '#8B5E3C' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F5831F]"></div>
      </div>
    );
  }

  const isDarkBg = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${isDarkBg} flex`}>
      {/* ===== SIDEBAR ===== */}
      <aside 
        className={`bg-[#1C1209] text-white w-64 flex-shrink-0 h-screen sticky top-0 overflow-y-auto transition-all duration-300`}
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F5831F] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">in</span>
            </div>
            <span className="font-semibold text-lg">Intern<span className="text-[#F5831F]">Link</span></span>
          </div>
        </div>

        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F5831F] flex items-center justify-center text-white font-bold">
              {user?.full_name?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-semibold text-sm">Welcome back,</p>
              <p className="font-bold text-sm text-[#F5831F]">{user?.full_name?.split(' ')[0] || user?.fullName?.split(' ')[0] || 'User'}</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#F5831F] text-white' 
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'messages' && unreadCount > 0 && (
                  <span className="ml-auto bg-[#F5831F] text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
                {item.id === 'notifications' && (
                  <span className="ml-auto bg-[#F5831F] text-white text-xs px-2 py-0.5 rounded-full">3</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 min-h-screen">
        {/* ===== TOP BAR ===== */}
        <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 sticky top-0 z-10`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'profile' ? 'My Profile' :
                 activeTab === 'applications' ? 'My Applications' :
                 activeTab === 'saved' ? 'Saved Opportunities' :
                 activeTab === 'messages' ? 'Messages' :
                 activeTab === 'notifications' ? 'Notifications' :
                 activeTab === 'resume' ? 'Resume/CV' :
                 activeTab === 'career' ? 'Career Resources' :
                 activeTab === 'events' ? 'Events & Webinars' :
                 activeTab === 'settings' ? 'Settings' : 'Dashboard'}
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {activeTab === 'dashboard' ? 'Discover and apply to the best internships and attachments.' :
                 activeTab === 'profile' ? 'Manage your personal information' :
                 activeTab === 'applications' ? `${applications.length} application(s)` :
                 activeTab === 'saved' ? `${savedOpportunities.length} saved opportunity(ies)` :
                 activeTab === 'messages' ? `${unreadCount} unread message(s)` :
                 `Welcome back, ${user?.full_name?.split(' ')[0] || 'User'} 👋`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button className={`p-2 rounded-lg hover:bg-gray-100 relative ${isDarkMode ? 'hover:bg-gray-700' : ''}`}>
                <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#F5831F] rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-[#F5831F] flex items-center justify-center text-white font-bold">
                {user?.full_name?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'applications' && renderApplications()}
          {activeTab === 'saved' && renderSavedJobs()}
          {activeTab === 'browse' && renderBrowse()}
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'resume' && renderResume()}
          {activeTab === 'career' && renderCareer()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'settings' && renderSettings()}
        </main>
      </div>

      {/* ===== EDIT PROFILE MODAL ===== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#F5831F]/10 rounded-xl flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-[#F5831F]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                  <p className="text-sm text-gray-500">Update your personal information</p>
                </div>
              </div>
              <button onClick={handleCloseEditModal} className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              {profileError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm">{profileError}</div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-gray-400" /> Full Name
                  </label>
                  <input type="text" value={editData.fullName || ''} onChange={(e) => setEditData({...editData, fullName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-gray-400" /> Email
                  </label>
                  <input type="email" value={editData.email || ''} onChange={(e) => setEditData({...editData, email: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white" placeholder="Enter your email" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-400" /> Phone
                  </label>
                  <input type="tel" value={editData.phone || ''} onChange={(e) => setEditData({...editData, phone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white" placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" /> Location
                  </label>
                  <input type="text" value={editData.location || ''} onChange={(e) => setEditData({...editData, location: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white" placeholder="Enter your location" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-gray-400" /> University
                  </label>
                  <input type="text" value={editData.university || ''} onChange={(e) => setEditData({...editData, university: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white" placeholder="Enter your university" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-gray-400" /> Course
                  </label>
                  <input type="text" value={editData.course || ''} onChange={(e) => setEditData({...editData, course: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white" placeholder="Enter your course" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" /> Year of Study
                </label>
                <select value={editData.yearOfStudy || '1st Year'} onChange={(e) => setEditData({...editData, yearOfStudy: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white appearance-none">
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-gray-400" /> Bio
                </label>
                <textarea value={editData.bio || ''} onChange={(e) => setEditData({...editData, bio: e.target.value})} rows="3" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white resize-none" placeholder="Tell us about yourself..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-gray-400" /> Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editData.skills?.map((skill, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5 bg-[#F5831F]/10 text-[#F5831F] px-3 py-1.5 rounded-full text-sm font-medium border border-[#F5831F]/20">
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="text-gray-400 hover:text-red-500 transition ml-1" type="button">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={handleKeyPress} placeholder="Add a skill..." className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white" />
                  <button onClick={handleAddSkill} className="px-4 py-2.5 bg-[#F5831F] text-white rounded-xl hover:bg-[#e0731a] transition flex items-center gap-1 font-medium" type="button">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={handleCloseEditModal} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium" disabled={savingProfile}>Cancel</button>
              <button onClick={handleSaveProfile} disabled={savingProfile} className={`px-6 py-2.5 bg-[#F5831F] text-white rounded-xl hover:bg-[#e0731a] transition font-medium flex items-center gap-2 shadow-md hover:shadow-lg ${savingProfile ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {savingProfile ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MESSAGE DETAIL MODAL ===== */}
      {isMessageDetailOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F5831F]/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#F5831F]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedMessage.subject || 'Message'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    From: {selectedMessage.sender_name} · {selectedMessage.time_ago}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMessageDetailOpen(false);
                  setSelectedMessage(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-6">
              {selectedMessage.is_important && (
                <div className="bg-[#F5831F]/10 text-[#F5831F] p-3 rounded-xl border border-[#F5831F]/20 mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Important Message</span>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsMessageDetailOpen(false);
                    setSelectedMessage(null);
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PAYMENT MODAL ===== */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        application={selectedApplication}
        onSuccess={handlePaymentSuccess}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.98);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-bounce {
          animation: bounce 0.6s ease-in-out 2;
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );

  // ============================================================
  // RENDER FUNCTIONS
  // ============================================================

  // ===== DASHBOARD =====
  function renderDashboard() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Applications</h2>
                <button onClick={() => handleTabClick('applications')} className="text-sm text-[#F5831F] font-medium hover:underline">View All →</button>
              </div>
              <div className="space-y-3">
                {applications.slice(0, 4).map((app, index) => (
                  <div key={index} className={`flex items-center justify-between py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-50'} last:border-0`}>
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>{app.opportunity?.title || app.title || 'N/A'}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{app.opportunity?.company_name || app.company_name || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status?.toUpperCase() || 'PENDING'}
                      </span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(app.applied_at)}</span>
                    </div>
                  </div>
                ))}
                {applications.length === 0 && (
                  <div className={`text-center py-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No applications yet.</div>
                )}
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recommended Opportunities</h2>
                <button onClick={() => handleTabClick('browse')} className="text-sm text-[#F5831F] font-medium hover:underline">View All →</button>
              </div>
              <div className="space-y-3">
                {filteredOpportunities.slice(0, 4).map((opp, index) => {
                  const isSaved = savedIds.has(opp.id);
                  const isSaving = savingId === opp.id;
                  
                  return (
                    <div key={index} className={`flex items-center justify-between p-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} border rounded-lg hover:shadow-md transition`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>{opp.title}</p>
                          {index < 2 && <span className="bg-[#F5831F] text-white text-[10px] px-2 py-0.5 rounded-full">New</span>}
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{opp.company_name} · {opp.location}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(opp.type)}`}>{opp.type}</span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Deadline: {formatDate(opp.deadline)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleSave(opp.id)}
                          disabled={isSaving}
                          className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                            isSaved 
                              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                              : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-[#F5831F]/10 hover:border-[#F5831F] hover:text-[#F5831F]'
                          } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <svg 
                            className={`w-4 h-4 transition-transform duration-300 ${isSaved ? 'scale-110' : 'scale-100 group-hover:scale-110'}`}
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
                          <span className="text-xs font-medium">{isSaving ? '...' : isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                        <Link to={`/apply/${opp.id}`} className="px-3 py-1.5 bg-[#F5831F] text-white text-sm rounded-lg hover:bg-[#e0731a] transition">Apply</Link>
                      </div>
                    </div>
                  );
                })}
                {filteredOpportunities.length === 0 && (
                  <div className={`text-center py-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No opportunities available.</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#F5831F] to-[#e0731a] rounded-xl p-5 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Congratulations!</p>
                  <h3 className="text-lg font-bold mt-1">You got {stats.interview + stats.shortlisted} new</h3>
                  <p className="text-lg font-bold">opportunities</p>
                  <button className="mt-3 bg-white/20 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-white/30 transition">This week</button>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><Award className="w-6 h-6" /></div>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>Recent Messages</h3>
                <button onClick={() => handleTabClick('messages')} className="text-xs text-[#F5831F] font-medium hover:underline">View All →</button>
              </div>
              <div className="space-y-3">
                {messages.slice(0, 3).map((msg, index) => (
                  <div key={index} className={`pb-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-50'} last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition`} onClick={() => handleMessageClick(msg.id)}>
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>{msg.sender_name || 'Admin'}</p>
                      {!msg.is_read && <span className="w-2 h-2 rounded-full bg-[#F5831F] animate-pulse"></span>}
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{msg.message}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5`}>{msg.time_ago || 'Just now'}</p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No messages yet</div>
                )}
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm mb-3`}>Tips for You</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition">
                  <div className="w-6 h-6 rounded-full bg-[#F5831F]/10 flex items-center justify-center flex-shrink-0 mt-0.5"><TrendingUp className="w-3 h-3 text-[#F5831F]" /></div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>Complete your profile</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add more details to stand out.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition">
                  <div className="w-6 h-6 rounded-full bg-[#F5831F]/10 flex items-center justify-center flex-shrink-0 mt-0.5"><File className="w-3 h-3 text-[#F5831F]" /></div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>Upload your CV</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>A complete CV increases viability.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#8B5E3C] to-[#6B4226] rounded-xl p-5 text-white">
              <h3 className="font-bold text-sm">Standout to top</h3>
              <p className="text-sm font-bold mb-1">companies</p>
              <p className="text-xs opacity-80 mb-3">Make your profile visible to over 500+ companies.</p>
              <button className="bg-white text-[#8B5E3C] text-sm px-4 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition">Upgrade Profile →</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== PROFILE =====
  function renderProfile() {
    return (
      <div className="space-y-6">
        {profileMessage && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200">{profileMessage}</div>
        )}

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
          <div className="flex flex-wrap items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#F5831F] to-[#e0731a] rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg">
              {user?.full_name?.split(' ').map(n => n[0]).join('') || user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.full_name || user?.fullName || 'Student'}</h2>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
                    <span className={`flex items-center gap-1 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'} px-3 py-1 rounded-full`}>
                      <GraduationCap className="w-4 h-4 text-[#F5831F]" /> {user?.course || 'Not set'}, {user?.university || 'Not set'}
                    </span>
                    <span className={`flex items-center gap-1 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'} px-3 py-1 rounded-full`}>
                      <MapPin className="w-4 h-4 text-[#F5831F]" /> {user?.location || 'Not set'}
                    </span>
                    <span className={`flex items-center gap-1 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'} px-3 py-1 rounded-full`}>
                      <Calendar className="w-4 h-4 text-[#F5831F]" /> {user?.yearOfStudy || 'Not set'}
                    </span>
                  </div>
                </div>
                <button onClick={handleOpenEditModal} className="flex items-center gap-2 px-5 py-2.5 bg-[#F5831F] text-white rounded-lg hover:bg-[#e0731a] transition shadow-md hover:shadow-lg">
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl p-4 shadow-sm border`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Applied</p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.applied}</p>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl p-4 shadow-sm border`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Shortlisted</p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.shortlisted}</p>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl p-4 shadow-sm border`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Interview</p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.interview}</p>
          </div>
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl p-4 shadow-sm border`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Accepted</p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.accepted}</p>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
            <User className="w-5 h-5 text-[#F5831F]" /> Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Full Name</label>
            <p className={`${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-100'} p-3 rounded-lg border`}>{user?.full_name || user?.fullName || 'Not set'}</p></div>
            <div><label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Email</label>
            <p className={`${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-100'} p-3 rounded-lg border`}>{user?.email || 'Not set'}</p></div>
            <div><label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Phone</label>
            <p className={`${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-100'} p-3 rounded-lg border`}>{user?.phone || 'Not provided'}</p></div>
            <div><label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Location</label>
            <p className={`${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-100'} p-3 rounded-lg border`}>{user?.location || 'Not provided'}</p></div>
            <div><label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>University</label>
            <p className={`${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-100'} p-3 rounded-lg border`}>{user?.university || 'Not provided'}</p></div>
            <div><label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Course</label>
            <p className={`${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-100'} p-3 rounded-lg border`}>{user?.course || 'Not provided'}</p></div>
            <div><label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Year of Study</label>
            <p className={`${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-100'} p-3 rounded-lg border`}>{user?.yearOfStudy || 'Not provided'}</p></div>
            <div className="md:col-span-2"><label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Bio</label>
            <p className={`${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-600 border-gray-100'} p-3 rounded-lg border`}>{user?.bio || 'No bio provided'}</p></div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
            <FileText className="w-5 h-5 text-[#F5831F]" /> Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {user?.skills?.length > 0 ? (
              user.skills.map((skill, index) => (
                <span key={index} className="bg-[#F5831F]/10 text-[#F5831F] px-4 py-1.5 rounded-full text-sm font-medium border border-[#F5831F]/20">{skill}</span>
              ))
            ) : (
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No skills added yet</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== APPLICATIONS =====
  function renderApplications() {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Applications</h2>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{applications.length} applied</span>
        </div>
        <div className="space-y-3">
          {applications.length > 0 ? (
            applications.map((app, index) => (
              <div key={index} className={`flex items-center justify-between py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-50'} last:border-0`}>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{app.opportunity?.title || app.title || 'N/A'}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{app.opportunity?.company_name || app.company_name || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>{app.status?.toUpperCase() || 'PENDING'}</span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(app.applied_at)}</span>
                  {app.status === 'pending' && (
                    <button onClick={() => handlePayNow(app)} className="px-3 py-1 bg-[#F5831F] text-white text-xs rounded-lg hover:bg-[#e0731a] transition">Pay Now</button>
                  )}
                  <button onClick={() => handleRemove(app.id)} className="text-xs text-red-500 hover:text-red-700 transition">Remove</button>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium">No Applications</p>
              <p className="text-sm">Start browsing and apply to opportunities!</p>
              <button onClick={() => handleTabClick('browse')} className="mt-3 bg-[#F5831F] text-white px-4 py-2 rounded-lg hover:bg-[#e0731a] transition">Browse Opportunities</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== SAVED JOBS =====
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
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Saved Opportunities</h2>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{savedOpportunities.length} saved</span>
        </div>
        
        {savedOpportunities.length > 0 ? (
          <div className="space-y-4">
            {savedOpportunities.map((job) => (
              <div key={job.id} className={`flex items-center justify-between p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} border rounded-lg hover:shadow-md transition`}>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{job.title}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{job.company_name} · {job.location}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(job.type)}`}>{job.type}</span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Closes {formatDate(job.deadline)}</span>
                    {job.saved_at && (
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Saved: {new Date(job.saved_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/apply/${job.id}`} className="px-3 py-1.5 bg-[#F5831F] text-white text-sm rounded-lg hover:bg-[#e0731a] transition">Apply</Link>
                  <button onClick={() => handleRemoveSaved(job.id)} className="px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Bookmark className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-lg font-medium">No Saved Opportunities</p>
            <p className="text-sm">Save opportunities you're interested in by clicking the ❤️ button</p>
            <button onClick={() => handleTabClick('browse')} className="mt-3 bg-[#F5831F] text-white px-4 py-2 rounded-lg hover:bg-[#e0731a] transition">Browse Opportunities</button>
          </div>
        )}
      </div>
    );
  }

  // ===== BROWSE =====
  function renderBrowse() {
    return (
      <div className="space-y-6">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Browse Opportunities</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Discover {opportunities.length} verified opportunities.</p>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by title, company..." value={browseSearchTerm} onChange={(e) => setBrowseSearchTerm(e.target.value)} className={`w-full px-4 py-2.5 pl-10 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'} text-sm focus:outline-none focus:ring-2 focus:ring-[#F5831F]`} />
            </div>
            <select value={browseType} onChange={(e) => setBrowseType(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'} text-sm focus:outline-none focus:ring-2 focus:ring-[#F5831F]`}>
              <option value="All Types">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Attachment">Attachment</option>
              <option value="Graduate Trainee">Graduate Trainee</option>
            </select>
            <select value={browseLocation} onChange={(e) => setBrowseLocation(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'} text-sm focus:outline-none focus:ring-2 focus:ring-[#F5831F]`}>
              <option value="">Filter by location...</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Kisumu">Kisumu</option>
              <option value="Nakuru">Nakuru</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{filteredOpportunities.length} opportunities found</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>❤️ {savedOpportunities.length} saved</p>
        </div>

        <div className="space-y-4">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opp) => {
              const isSaved = savedIds.has(opp.id);
              const isSaving = savingId === opp.id;
              
              return (
                <div key={opp.id} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5 hover:shadow-md transition`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{opp.title}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{opp.company_name} · {opp.location}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-xs px-3 py-0.5 rounded-full font-medium ${getTypeColor(opp.type)}`}>{opp.type}</span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Closes {formatDate(opp.deadline)}</span>
                        {opp.stipend && <span className="text-xs text-green-600 font-medium">💰 {opp.stipend}</span>}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleToggleSave(opp.id)}
                      disabled={isSaving}
                      className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        isSaved 
                          ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100 hover:scale-105' 
                          : 'bg-gray-50 text-gray-500 border-2 border-gray-200 hover:bg-[#F5831F]/10 hover:border-[#F5831F] hover:text-[#F5831F] hover:scale-105'
                      } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className="relative">
                        <svg 
                          className={`w-5 h-5 transition-transform duration-300 ${isSaved ? 'scale-110' : 'scale-100 group-hover:scale-110'}`}
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
                      
                      <span className="text-sm font-medium">{isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}</span>
                      
                      {isSaved && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}">
                    <Link to={`/opportunity/${opp.id}`} className="text-sm font-medium text-[#F5831F] hover:underline">See more details →</Link>
                    <Link to={`/apply/${opp.id}`} className="px-6 py-1.5 bg-[#F5831F] text-white text-sm font-medium rounded-lg hover:bg-[#e0731a] transition">Apply</Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl p-12 text-center border`}>
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No opportunities found</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== MESSAGES =====
  function renderMessages() {
    if (loadingMessages) {
      return (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-12 text-center`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5831F] mx-auto"></div>
          <p className={`mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading messages...</p>
        </div>
      );
    }

    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Messages
            {unreadCount > 0 && (
              <span className="ml-2 text-sm font-normal text-[#F5831F]">
                ({unreadCount} unread)
              </span>
            )}
          </h2>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-xs text-[#F5831F] hover:underline font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-4 ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} border rounded-lg transition cursor-pointer ${
                  !msg.is_read ? (isDarkMode ? 'bg-gray-700/50 border-[#F5831F]/30' : 'bg-blue-50/50 border-blue-200') : ''
                } ${msg.is_important ? 'border-l-4 border-l-[#F5831F]' : ''}`}
                onClick={() => handleMessageClick(msg.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>
                        {msg.sender_name || 'Admin'}
                      </p>
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#F5831F] animate-pulse"></span>
                      )}
                      {msg.is_important && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5831F]/20 text-[#F5831F] font-medium">
                          ⭐ Important
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        msg.sender_role === 'employer' ? 'bg-blue-100 text-blue-700' : 
                        msg.sender_role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {msg.sender_role || 'System'}
                      </span>
                    </div>
                    {msg.subject && (
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-1`}>
                        {msg.subject}
                      </p>
                    )}
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 line-clamp-2`}>
                      {msg.message}
                    </p>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} flex-shrink-0 ml-4`}>
                    {msg.time_ago || 'Just now'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-lg font-medium">No Messages</p>
            <p className="text-sm">You don't have any messages yet.</p>
          </div>
        )}
      </div>
    );
  }

  // ===== NOTIFICATIONS =====
  function renderNotifications() {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
        <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Notifications</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div><p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>New Application Status</p><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your application has been shortlisted.</p><p className="text-xs text-gray-400 mt-1">2 hours ago</p></div>
          </div>
        </div>
      </div>
    );
  }

  // ===== RESUME =====
  function renderResume() {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
        <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Resume / CV</h2>
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <File className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No CV Uploaded</h3>
          <p className="text-sm mb-6">Upload your CV to apply for opportunities</p>
          <label className="inline-block bg-[#F5831F] text-white px-6 py-2 rounded-lg hover:bg-[#e0731a] transition cursor-pointer">
            Upload CV
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
          </label>
          <p className="text-xs text-gray-400 mt-4">PDF, DOC, or DOCX (Max 5MB)</p>
        </div>
      </div>
    );
  }

  // ===== CAREER =====
  function renderCareer() {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
        <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Career Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:shadow-md'} border rounded-lg transition`}>
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>CV Writing Guide</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Learn how to write a professional CV.</p>
            <button className="mt-2 text-[#F5831F] text-sm font-medium hover:underline">Read More →</button>
          </div>
        </div>
      </div>
    );
  }

  // ===== EVENTS =====
  function renderEvents() {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
        <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Events & Webinars</h2>
        <div className="space-y-4">
          <div className={`flex items-center gap-4 p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} border rounded-lg hover:shadow-md transition`}>
            <div className="text-center min-w-[60px]"><p className="text-2xl font-bold text-[#F5831F]">24</p><p className="text-xs text-gray-500">MAY</p></div>
            <div className="flex-1"><h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>CV Writing Workshop</h3><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Online Webinar · 2:00 PM</p></div>
            <button className="px-4 py-1.5 bg-[#F5831F] text-white text-sm rounded-lg hover:bg-[#e0731a] transition">Register</button>
          </div>
        </div>
      </div>
    );
  }

  // ===== SETTINGS =====
  function renderSettings() {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
        <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Settings</h2>
        <div className="space-y-4">
          <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} border rounded-lg`}>
            <div><h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</h3><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive email updates</p></div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#F5831F] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F5831F]"></div>
            </label>
          </div>
          <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} border rounded-lg`}>
            <div><h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</h3><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Switch between light and dark</p></div>
            <button onClick={toggleDarkMode} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>{isDarkMode ? 'On' : 'Off'}</button>
          </div>
        </div>
      </div>
    );
  }
};

export default StudentDashboard;