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
  ChevronDown,
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
  Trash2,
  HelpCircle,
  Folder,
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

// ── Brand palette ──
const BRAND      = '#F5831F';
const DARK_BG    = '#1C1209';
const SIDEBAR_BG = '#FBF3E7';
const TEXT_DIM   = '#9A8568';

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

  // ===== NOTIFICATION STATE =====
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [notifUnreadCount, setNotifUnreadCount] = useState(0);

  // ===== NOTIFICATION SETTINGS =====
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    messagePreview: true
  });

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
  const [topSearchTerm, setTopSearchTerm] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
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

  // ===== FETCH NOTIFICATIONS =====
  const fetchNotifications = async () => {
    try {
      setLoadingNotifs(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/notifications`, getAuthHeaders());
      
      setNotifications(response.data.notifications || []);
      setNotifUnreadCount(response.data.unread_count || 0);
      setLoadingNotifs(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
      setNotifUnreadCount(0);
      setLoadingNotifs(false);
    }
  };

  // ===== MARK NOTIFICATION AS READ =====
  const handleMarkNotifAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/notifications/${id}/read`, {}, getAuthHeaders());
      
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
      setNotifUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  // ===== MARK ALL NOTIFICATIONS AS READ =====
  const handleMarkAllNotifsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/notifications/read-all`, {}, getAuthHeaders());
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setNotifUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
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

      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings) {
        try {
          setNotificationSettings(JSON.parse(savedSettings));
        } catch (e) {
          console.error('Error loading notification settings:', e);
        }
      }

      loadAllData();
      fetchNotifications();
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

  // ===== MARK ALL MESSAGES AS READ =====
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
      setProfileMessage('Profile updated successfully!');
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
    if (tabId === 'notifications') {
      fetchNotifications();
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
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'saved', label: 'Saved Opportunities', icon: Bookmark },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'resume', label: 'Resume / CV', icon: File },
    { id: 'documents', label: 'Documents', icon: Folder },
    { id: 'career', label: 'Career Resources', icon: GraduationCap },
    { id: 'events', label: 'Events & Webinars', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const statusColors = {
    'pending': 'bg-amber-50 text-amber-700',
    'shortlisted': 'bg-emerald-50 text-emerald-700',
    'interview': 'bg-violet-50 text-violet-700',
    'accepted': 'bg-green-50 text-green-700',
    'rejected': 'bg-red-50 text-red-700'
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
    if (type === 'Internship') return 'bg-blue-50 text-blue-700';
    if (type === 'Attachment') return 'bg-emerald-50 text-emerald-700';
    if (type === 'Graduate Trainee') return 'bg-violet-50 text-violet-700';
    return 'bg-gray-100 text-gray-600';
  };

  const dashboardStats = [
    { label: 'Applications', value: stats.applied, sub: stats.applied > 0 ? `${stats.applied} total` : 'No applications yet', subColor: TEXT_DIM, Icon: Briefcase },
    { label: 'Shortlisted',  value: stats.shortlisted, sub: stats.shortlisted > 0 ? 'Great progress' : 'Keep applying', subColor: '#16A34A', Icon: Bookmark },
    { label: 'Interviews',   value: stats.interview, sub: stats.interview > 0 ? 'This week' : 'None scheduled', subColor: '#16A34A', Icon: Users },
    { label: 'Saved',        value: savedOpportunities.length, sub: savedOpportunities.length > 0 ? `${savedOpportunities.length} saved` : 'Save opportunities', subColor: BRAND, Icon: Star },
  ];

  // Profile completion percentage
  const profileFields = [user?.phone, user?.location, user?.university, user?.course, user?.bio, user?.skills?.length > 0];
  const filledCount = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round(((filledCount + 1) / (profileFields.length + 1)) * 100);

  // ===== NOTIFICATION ICON HELPER =====
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'application': return <Briefcase className="w-5 h-5" style={{ color: BRAND }} />;
      case 'message': return <MessageSquare className="w-5 h-5" style={{ color: '#6366F1' }} />;
      case 'opportunity': return <Briefcase className="w-5 h-5" style={{ color: '#10B981' }} />;
      case 'reminder': return <Clock className="w-5 h-5" style={{ color: '#F59E0B' }} />;
      default: return <Bell className="w-5 h-5" style={{ color: BRAND }} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: SIDEBAR_BG }}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent" style={{ borderColor: `${BRAND} transparent ${BRAND} ${BRAND}` }}></div>
          <p style={{ color: TEXT_DIM, fontSize: 13 }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isDarkBg = isDarkMode ? 'bg-gray-900' : '';

  return (
    <div
      className={`min-h-screen flex ${isDarkBg}`}
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", background: isDarkMode ? undefined : '#FAFAF8' }}
    >
      {/* ===== SIDEBAR ===== */}
      <aside
        className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col"
        style={{ background: isDarkMode ? '#15110C' : SIDEBAR_BG, borderRight: `1px solid ${isDarkMode ? '#2A2218' : '#F0E4D0'}`, overflow: 'hidden' }}
      >
        {/* Logo */}
        <div className="px-6 pt-6 pb-5 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width: 38, height: 38, background: DARK_BG, boxShadow: '0 0 0 1.5px rgba(245,131,31,0.3)' }}
            >
              <img
                src="/logo.jpeg"
                alt="Intern Link"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:18px;">🎓</div>`;
                }}
              />
            </div>
            <div className="leading-tight">
              <p
                className="font-bold text-[17px]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: isDarkMode ? '#fff' : '#1A1005' }}
              >
                Intern <span style={{ color: BRAND }}>Link</span>
              </p>
              <p style={{ fontSize: 9.5, color: TEXT_DIM, letterSpacing: '0.06em' }}>
                Learn. Experience. Succeed.
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-3 flex-1 overflow-y-auto pb-3 min-h-0">
          <div className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all"
                  style={{
                    background: isActive ? (isDarkMode ? 'rgba(245,131,31,0.15)' : '#F0D8B0') : 'transparent',
                    color: isActive ? (isDarkMode ? BRAND : '#5C3D1A') : (isDarkMode ? '#A89878' : '#7A6850'),
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.04)' : '#F5EBDA'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon style={{ width: 17, height: 17, flexShrink: 0 }} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id === 'messages' && unreadCount > 0 && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: BRAND, color: '#fff', minWidth: 18, textAlign: 'center' }}
                    >
                      {unreadCount}
                    </span>
                  )}
                  {item.id === 'notifications' && notifUnreadCount > 0 && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: BRAND, color: '#fff', minWidth: 18, textAlign: 'center' }}
                    >
                      {notifUnreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Complete Profile widget */}
        <div className="px-4 pb-3 flex-shrink-0">
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: isDarkMode ? '#1E1810' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0E4D0'}` }}
          >
            <p className="font-semibold mb-0.5" style={{ fontSize: 12.5, color: isDarkMode ? '#fff' : '#1A1005' }}>
              Complete Your Profile
            </p>
            <p className="mb-3" style={{ fontSize: 10.5, color: TEXT_DIM, lineHeight: 1.4 }}>
              Increase your chances by 80%
            </p>

            <div className="relative mx-auto mb-3" style={{ width: 76, height: 76 }}>
              <svg viewBox="0 0 80 80" width="76" height="76">
                <circle cx="40" cy="40" r="34" fill="none" stroke={isDarkMode ? '#2A2218' : '#F0E4D0'} strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke={BRAND} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - profileCompletion / 100)}`}
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold" style={{ fontSize: 16, color: isDarkMode ? '#fff' : '#1A1005' }}>
                  {profileCompletion}%
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenEditModal}
              className="w-full flex items-center justify-center gap-1.5 font-semibold text-white transition-all"
              style={{ background: '#3D2A18', fontSize: 12, padding: '9px 0', borderRadius: 10 }}
              onMouseEnter={e => (e.currentTarget.style.background = BRAND)}
              onMouseLeave={e => (e.currentTarget.style.background = '#3D2A18')}
            >
              Complete Now
              <ChevronRight style={{ width: 13, height: 13 }} />
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 pb-5 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 font-semibold transition-all"
            style={{
              background: isDarkMode ? 'rgba(239,68,68,0.1)' : '#FBEAE5',
              color: '#C0392B',
              fontSize: 13,
              padding: '11px 0',
              borderRadius: 12,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F8D7D0')}
            onMouseLeave={e => (e.currentTarget.style.background = isDarkMode ? 'rgba(239,68,68,0.1)' : '#FBEAE5')}
          >
            <LogOut style={{ width: 15, height: 15 }} />
            Logout
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 min-h-screen min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between gap-6"
          style={{ background: isDarkMode ? '#1A1611' : '#FFFFFF', borderBottom: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}
        >
          <div className="relative flex-1" style={{ maxWidth: 420 }}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 16, height: 16, color: '#9CA3AF' }} />
            <input
              type="text"
              value={topSearchTerm}
              onChange={(e) => setTopSearchTerm(e.target.value)}
              placeholder="Search opportunities, companies..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all"
              style={{
                fontSize: 13, background: isDarkMode ? '#242019' : '#F7F5F1',
                color: isDarkMode ? '#fff' : '#111', border: `1px solid ${isDarkMode ? '#2A2218' : 'transparent'}`,
              }}
              onFocus={e => { e.target.style.borderColor = BRAND; e.target.style.background = isDarkMode ? '#242019' : '#fff'; e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.10)`; }}
              onBlur={e => { e.target.style.borderColor = isDarkMode ? '#2A2218' : 'transparent'; e.target.style.background = isDarkMode ? '#242019' : '#F7F5F1'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => handleTabClick('notifications')}
              className="relative p-2 rounded-xl transition-colors"
              style={{ background: isDarkMode ? '#242019' : '#F7F5F1' }}
            >
              <Bell style={{ width: 18, height: 18, color: isDarkMode ? '#D1D5DB' : '#4B5563' }} />
              {notifUnreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center font-bold text-white rounded-full"
                  style={{ width: 16, height: 16, fontSize: 9, background: BRAND }}
                >
                  {notifUnreadCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(v => !v)}
                className="flex items-center gap-2.5"
              >
                <div
                  className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden"
                  style={{ width: 38, height: 38, background: `linear-gradient(145deg, ${BRAND}, #D4690F)`, fontSize: 14 }}
                >
                  {(user?.full_name || user?.fullName || 'U').charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="font-semibold leading-tight" style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#1A1005' }}>
                    {user?.full_name || user?.fullName || 'Student'}
                  </p>
                  <p style={{ fontSize: 11, color: TEXT_DIM }}>
                    {user?.course || 'Student'}
                  </p>
                </div>
                <ChevronDown style={{ width: 14, height: 14, color: TEXT_DIM }} />
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 rounded-xl py-1.5 z-50"
                  style={{ background: '#fff', border: '1px solid #F0EEE9', boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
                >
                  <button
                    onClick={() => { setProfileMenuOpen(false); handleTabClick('profile'); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left transition-colors"
                    style={{ fontSize: 13, color: '#374151' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F7F5F1')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <User style={{ width: 15, height: 15 }} /> My Profile
                  </button>
                  <button
                    onClick={() => { setProfileMenuOpen(false); handleTabClick('settings'); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left transition-colors"
                    style={{ fontSize: 13, color: '#374151' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F7F5F1')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Settings style={{ width: 15, height: 15 }} /> Settings
                  </button>
                  <div style={{ borderTop: '1px solid #F0EEE9' }} className="my-1" />
                  <button
                    onClick={() => { setProfileMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left transition-colors"
                    style={{ fontSize: 13, color: '#C0392B' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#FBEAE5')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut style={{ width: 15, height: 15 }} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'applications' && renderApplications()}
          {activeTab === 'saved' && renderSavedJobs()}
          {activeTab === 'browse' && renderBrowse()}
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'resume' && renderResume()}
          {activeTab === 'documents' && renderResume()}
          {activeTab === 'career' && renderCareer()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'help' && renderCareer()}
        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,131,31,0.10)' }}>
                  <Edit2 className="w-5 h-5" style={{ color: BRAND }} />
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
                  <input type="text" value={editData.fullName || ''} onChange={(e) => setEditData({...editData, fullName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition bg-gray-50 focus:bg-white" style={{ '--tw-ring-color': BRAND }} onFocus={e => e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.15)`} onBlur={e => e.target.style.boxShadow = 'none'} placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-gray-400" /> Email
                  </label>
                  <input type="email" value={editData.email || ''} onChange={(e) => setEditData({...editData, email: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none transition bg-gray-50 focus:bg-white" onFocus={e => e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.15)`} onBlur={e => e.target.style.boxShadow = 'none'} placeholder="Enter your email" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-400" /> Phone
                  </label>
                  <input type="tel" value={editData.phone || ''} onChange={(e) => setEditData({...editData, phone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none transition bg-gray-50 focus:bg-white" onFocus={e => e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.15)`} onBlur={e => e.target.style.boxShadow = 'none'} placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" /> Location
                  </label>
                  <input type="text" value={editData.location || ''} onChange={(e) => setEditData({...editData, location: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none transition bg-gray-50 focus:bg-white" onFocus={e => e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.15)`} onBlur={e => e.target.style.boxShadow = 'none'} placeholder="Enter your location" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-gray-400" /> University
                  </label>
                  <input type="text" value={editData.university || ''} onChange={(e) => setEditData({...editData, university: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none transition bg-gray-50 focus:bg-white" onFocus={e => e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.15)`} onBlur={e => e.target.style.boxShadow = 'none'} placeholder="Enter your university" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-gray-400" /> Course
                  </label>
                  <input type="text" value={editData.course || ''} onChange={(e) => setEditData({...editData, course: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none transition bg-gray-50 focus:bg-white" onFocus={e => e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.15)`} onBlur={e => e.target.style.boxShadow = 'none'} placeholder="Enter your course" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" /> Year of Study
                </label>
                <select value={editData.yearOfStudy || '1st Year'} onChange={(e) => setEditData({...editData, yearOfStudy: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none transition bg-gray-50 focus:bg-white appearance-none" onFocus={e => e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.15)`} onBlur={e => e.target.style.boxShadow = 'none'}>
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
                <textarea value={editData.bio || ''} onChange={(e) => setEditData({...editData, bio: e.target.value})} rows="3" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none transition bg-gray-50 focus:bg-white resize-none" onFocus={e => e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.15)`} onBlur={e => e.target.style.boxShadow = 'none'} placeholder="Tell us about yourself..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-gray-400" /> Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editData.skills?.map((skill, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: 'rgba(245,131,31,0.10)', color: BRAND, border: '1px solid rgba(245,131,31,0.2)' }}>
                      {skill}
                      <button onClick={() => handleRemoveSkill(skill)} className="text-gray-400 hover:text-red-500 transition ml-1" type="button">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={handleKeyPress} placeholder="Add a skill..." className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none transition bg-gray-50 focus:bg-white" onFocus={e => e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.15)`} onBlur={e => e.target.style.boxShadow = 'none'} />
                  <button onClick={handleAddSkill} className="px-4 py-2.5 text-white rounded-xl transition flex items-center gap-1 font-medium" style={{ background: BRAND }} onMouseEnter={e => e.currentTarget.style.background = '#D4690F'} onMouseLeave={e => e.currentTarget.style.background = BRAND} type="button">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={handleCloseEditModal} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium" disabled={savingProfile}>Cancel</button>
              <button onClick={handleSaveProfile} disabled={savingProfile} className="px-6 py-2.5 text-white rounded-xl transition font-medium flex items-center gap-2 shadow-md hover:shadow-lg" style={{ background: savingProfile ? '#C49050' : '#3D2A18' }} onMouseEnter={e => { if (!savingProfile) e.currentTarget.style.background = BRAND; }} onMouseLeave={e => { if (!savingProfile) e.currentTarget.style.background = '#3D2A18'; }}>
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

      {/* Message Detail Modal */}
      {isMessageDetailOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,131,31,0.10)' }}>
                  <MessageSquare className="w-5 h-5" style={{ color: BRAND }} />
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
                <div className="p-3 rounded-xl mb-4 flex items-center gap-2" style={{ background: 'rgba(245,131,31,0.10)', color: BRAND, border: '1px solid rgba(245,131,31,0.2)' }}>
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Important Message</span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <Mail className="w-4 h-4" style={{ color: '#16A34A' }} />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#15803D' }}>Email Notification Sent</p>
                  <p className="text-xs" style={{ color: '#16A34A' }}>
                    A copy of this message was sent to your email address
                  </p>
                </div>
                <CheckCircle className="w-5 h-5" style={{ color: '#16A34A' }} />
              </div>

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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        application={selectedApplication}
        onSuccess={handlePaymentSuccess}
      />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-bounce { animation: bounce 0.6s ease-in-out 2; }
        .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
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
        {/* Welcome heading */}
        <div>
          <h1 className="font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: isDarkMode ? '#fff' : '#1A1005' }}>
            Welcome back, {user?.full_name?.split(' ')[0] || user?.fullName?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p style={{ fontSize: 13, color: TEXT_DIM, marginTop: 2 }}>
            Discover and apply to the best internships and attachments.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dashboardStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-4"
              style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ width: 40, height: 40, background: 'rgba(245,131,31,0.12)' }}
                >
                  <stat.Icon style={{ width: 18, height: 18, color: BRAND }} />
                </div>
                <p style={{ fontSize: 12, color: TEXT_DIM }}>{stat.label}</p>
              </div>
              <p className="font-bold" style={{ fontSize: 26, color: isDarkMode ? '#fff' : '#1A1005', fontFamily: "'Playfair Display', Georgia, serif" }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 11.5, color: stat.subColor, marginTop: 2, fontWeight: 600 }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Recommended Opportunities */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold" style={{ fontSize: 15.5, color: isDarkMode ? '#fff' : '#1A1005' }}>Recommended Opportunities</h2>
            <button onClick={() => handleTabClick('browse')} className="text-sm font-semibold hover:underline" style={{ color: BRAND }}>View All →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredOpportunities.slice(0, 4).map((opp, index) => {
              const isSaved = savedIds.has(opp.id);
              const isSaving = savingId === opp.id;
              return (
                <div
                  key={index}
                  className="rounded-2xl p-4 flex flex-col transition-all"
                  style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white"
                      style={{ width: 38, height: 38, background: `linear-gradient(145deg, ${BRAND}, #D4690F)`, fontSize: 13 }}
                    >
                      {(opp.company_name || 'C').charAt(0)}
                    </div>
                    {index < 2 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,131,31,0.12)', color: BRAND }}>
                        New
                      </span>
                    )}
                  </div>
                  <p className="font-semibold leading-snug mb-1" style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#1A1005' }}>
                    {opp.title}
                  </p>
                  <p style={{ fontSize: 11.5, color: TEXT_DIM, marginBottom: 8 }}>
                    {opp.company_name}
                  </p>
                  <p className="flex items-center gap-1" style={{ fontSize: 11, color: TEXT_DIM, marginBottom: 10 }}>
                    <MapPin style={{ width: 11, height: 11 }} /> {opp.location}
                  </p>
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getTypeColor(opp.type)}`}>{opp.type}</span>
                  </div>
                  <p style={{ fontSize: 10.5, color: TEXT_DIM, marginBottom: 12 }}>
                    Deadline: {formatDate(opp.deadline)}
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <Link
                      to={`/apply/${opp.id}`}
                      className="flex-1 text-center text-white font-semibold rounded-lg transition-all"
                      style={{ background: BRAND, fontSize: 12, padding: '8px 0' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#D4690F')}
                      onMouseLeave={e => (e.currentTarget.style.background = BRAND)}
                    >
                      Apply
                    </Link>
                    <button
                      onClick={() => handleToggleSave(opp.id)}
                      disabled={isSaving}
                      className="flex items-center justify-center rounded-lg flex-shrink-0 transition-all"
                      style={{
                        width: 32, height: 32,
                        background: isSaved ? 'rgba(245,131,31,0.12)' : (isDarkMode ? '#242019' : '#F7F5F1'),
                        color: isSaved ? BRAND : TEXT_DIM,
                      }}
                    >
                      <Bookmark style={{ width: 14, height: 14 }} fill={isSaved ? BRAND : 'none'} />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredOpportunities.length === 0 && (
              <div className="col-span-full text-center py-10" style={{ color: TEXT_DIM, fontSize: 13 }}>
                No opportunities available yet.
              </div>
            )}
          </div>
        </div>

        {/* 3-column row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Application Status */}
          <div className="rounded-2xl p-5" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#1A1005' }}>Application Status</h3>
              <button onClick={() => handleTabClick('applications')} className="text-xs font-semibold hover:underline" style={{ color: BRAND }}>View All →</button>
            </div>
            <div className="space-y-3.5">
              {applications.slice(0, 4).map((app, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium truncate" style={{ fontSize: 12.5, color: isDarkMode ? '#fff' : '#1A1005' }}>
                      {app.opportunity?.title || app.title || 'N/A'}
                    </p>
                    <p style={{ fontSize: 11, color: TEXT_DIM }}>{app.opportunity?.company_name || app.company_name || 'N/A'}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(app.status)}`}>
                      {(app.status || 'pending').charAt(0).toUpperCase() + (app.status || 'pending').slice(1)}
                    </span>
                    <p style={{ fontSize: 10, color: TEXT_DIM, marginTop: 2 }}>{formatDate(app.applied_at)}</p>
                  </div>
                </div>
              ))}
              {applications.length === 0 && (
                <p style={{ fontSize: 12.5, color: TEXT_DIM, textAlign: 'center', padding: '16px 0' }}>No applications yet.</p>
              )}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="rounded-2xl p-5" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#1A1005' }}>Recent Messages</h3>
              <button onClick={() => handleTabClick('messages')} className="text-xs font-semibold hover:underline" style={{ color: BRAND }}>View All →</button>
            </div>
            <div className="space-y-3.5">
              {messages.slice(0, 3).map((msg, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 cursor-pointer rounded-lg p-1.5 -m-1.5 transition-colors"
                  onClick={() => handleMessageClick(msg.id)}
                  onMouseEnter={e => (e.currentTarget.style.background = isDarkMode ? '#242019' : '#F7F5F1')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    className="rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white"
                    style={{ width: 30, height: 30, background: `linear-gradient(145deg, ${BRAND}, #D4690F)`, fontSize: 11 }}
                  >
                    {(msg.sender_name || 'A').charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium truncate" style={{ fontSize: 12.5, color: isDarkMode ? '#fff' : '#1A1005' }}>
                        {msg.sender_name || 'Admin'}
                      </p>
                      {!msg.is_read && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: BRAND }} />}
                    </div>
                    <p className="truncate" style={{ fontSize: 11.5, color: TEXT_DIM }}>{msg.message}</p>
                  </div>
                  <p style={{ fontSize: 10, color: TEXT_DIM, flexShrink: 0 }}>{msg.time_ago || 'Now'}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p style={{ fontSize: 12.5, color: TEXT_DIM, textAlign: 'center', padding: '16px 0' }}>No messages yet.</p>
              )}
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => handleTabClick('messages')}
                className="w-full mt-4 text-center font-semibold rounded-lg transition-all"
                style={{ background: isDarkMode ? '#242019' : '#F7F5F1', color: isDarkMode ? '#fff' : '#1A1005', fontSize: 12, padding: '9px 0' }}
              >
                Go to Messages
              </button>
            )}
          </div>

          {/* Tips for You */}
          <div className="rounded-2xl p-5" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
            <h3 className="font-bold mb-4" style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#1A1005' }}>Tips for You</h3>
            <div className="space-y-3">
              {[
                { Icon: TrendingUp, title: 'Complete your profile', body: 'Add more details to stand out.' },
                { Icon: File,       title: 'Upload your CV',        body: 'A complete CV increases visibility.' },
                { Icon: Briefcase,  title: 'Apply consistently',    body: 'Top students apply to 5+ jobs weekly.' },
                { Icon: Calendar,   title: 'Attend webinars',       body: 'Improve skills and boost your profile.' },
              ].map((tip, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 text-left rounded-lg p-1.5 -m-1.5 transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.background = isDarkMode ? '#242019' : '#F7F5F1')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, background: 'rgba(245,131,31,0.12)' }}>
                    <tip.Icon style={{ width: 14, height: 14, color: BRAND }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium" style={{ fontSize: 12.5, color: isDarkMode ? '#fff' : '#1A1005' }}>{tip.title}</p>
                    <p style={{ fontSize: 11, color: TEXT_DIM }}>{tip.body}</p>
                  </div>
                  <ChevronRight style={{ width: 14, height: 14, color: TEXT_DIM, flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            className="lg:col-span-2 rounded-2xl p-6 relative overflow-hidden flex items-center justify-between gap-6"
            style={{ background: 'linear-gradient(110deg, #F3E2C8 0%, #FBF2E4 100%)' }}
          >
            <div className="relative z-10">
              <h3 className="font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, color: '#1A1005' }}>
                Stand out to top companies
              </h3>
              <p style={{ fontSize: 12.5, color: '#7A6A52', maxWidth: 360, lineHeight: 1.6 }}>
                Make your profile visible to over 500+ companies actively looking for talent like you.
              </p>
              <button
                className="mt-4 flex items-center gap-2 font-semibold text-white transition-all"
                style={{ background: '#3D2A18', fontSize: 12.5, padding: '10px 20px', borderRadius: 10 }}
                onMouseEnter={e => (e.currentTarget.style.background = BRAND)}
                onMouseLeave={e => (e.currentTarget.style.background = '#3D2A18')}
              >
                Upgrade Profile <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
            <div className="hidden md:flex relative z-10 flex-shrink-0 items-end" style={{ width: 130, height: 110 }}>
              <svg viewBox="0 0 130 110" width="130" height="110">
                <rect x="20" y="50" width="35" height="50" rx="6" fill="#D4A24A" opacity="0.85"/>
                <circle cx="37" cy="36" r="14" fill="#8B5E3C"/>
                <rect x="70" y="35" width="45" height="60" rx="6" fill="#fff" stroke="#E5D5BA" strokeWidth="1.5"/>
                <rect x="78" y="45" width="29" height="4" rx="2" fill="#F5831F"/>
                <rect x="78" y="55" width="22" height="3" rx="1.5" fill="#E5D5BA"/>
                <rect x="78" y="63" width="25" height="3" rx="1.5" fill="#E5D5BA"/>
                <circle cx="92" cy="78" r="8" fill="#16A34A"/>
                <path d="M88 78l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#1A1005' }}>Upcoming Events</h3>
              <button onClick={() => handleTabClick('events')} className="text-xs font-semibold hover:underline" style={{ color: BRAND }}>View All →</button>
            </div>
            <div className="flex items-center gap-3.5">
              <div
                className="flex flex-col items-center justify-center rounded-xl flex-shrink-0"
                style={{ width: 52, height: 52, background: 'rgba(245,131,31,0.10)' }}
              >
                <span className="font-bold" style={{ fontSize: 9.5, color: BRAND, letterSpacing: '0.05em' }}>MAY</span>
                <span className="font-bold" style={{ fontSize: 17, color: BRAND, lineHeight: 1 }}>24</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate" style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#1A1005' }}>CV Writing Workshop</p>
                <p style={{ fontSize: 11.5, color: TEXT_DIM }}>Online Webinar</p>
                <p className="flex items-center gap-1 mt-0.5" style={{ fontSize: 11, color: TEXT_DIM }}>
                  <Clock style={{ width: 11, height: 11 }} /> 2:00 PM
                </p>
              </div>
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
          <div className="rounded-xl p-4" style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', fontSize: 13 }}>{profileMessage}</div>
        )}

        <div className="rounded-2xl p-6" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
          <div className="flex flex-wrap items-start gap-6">
            <div
              className="rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ width: 88, height: 88, fontSize: 28, background: `linear-gradient(145deg, ${BRAND}, #D4690F)` }}
            >
              {(user?.full_name || user?.fullName || 'U').split(' ').map(n => n[0]).join('').slice(0,2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 21, color: isDarkMode ? '#fff' : '#1A1005' }}>
                    {user?.full_name || user?.fullName || 'Student'}
                  </h2>
                  <p style={{ fontSize: 13, color: TEXT_DIM }}>{user?.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ fontSize: 12, background: isDarkMode ? '#242019' : '#F7F5F1', color: TEXT_DIM }}>
                      <GraduationCap style={{ width: 13, height: 13, color: BRAND }} /> {user?.course || 'Not set'}, {user?.university || 'Not set'}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ fontSize: 12, background: isDarkMode ? '#242019' : '#F7F5F1', color: TEXT_DIM }}>
                      <MapPin style={{ width: 13, height: 13, color: BRAND }} /> {user?.location || 'Not set'}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ fontSize: 12, background: isDarkMode ? '#242019' : '#F7F5F1', color: TEXT_DIM }}>
                      <Calendar style={{ width: 13, height: 13, color: BRAND }} /> {user?.yearOfStudy || 'Not set'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleOpenEditModal}
                  className="flex items-center gap-2 font-semibold text-white rounded-xl transition-all"
                  style={{ background: '#3D2A18', fontSize: 13, padding: '10px 18px' }}
                  onMouseEnter={e => (e.currentTarget.style.background = BRAND)}
                  onMouseLeave={e => (e.currentTarget.style.background = '#3D2A18')}
                >
                  <Edit2 style={{ width: 14, height: 14 }} /> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Applied',     value: stats.applied },
            { label: 'Shortlisted', value: stats.shortlisted },
            { label: 'Interview',   value: stats.interview },
            { label: 'Accepted',    value: stats.accepted },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
              <p style={{ fontSize: 12, color: TEXT_DIM }}>{s.label}</p>
              <p className="font-bold" style={{ fontSize: 22, color: isDarkMode ? '#fff' : '#1A1005', fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontSize: 15, color: isDarkMode ? '#fff' : '#1A1005' }}>
            <User style={{ width: 17, height: 17, color: BRAND }} /> Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ['Full Name', user?.full_name || user?.fullName || 'Not set'],
              ['Email', user?.email || 'Not set'],
              ['Phone', user?.phone || 'Not provided'],
              ['Location', user?.location || 'Not provided'],
              ['University', user?.university || 'Not provided'],
              ['Course', user?.course || 'Not provided'],
              ['Year of Study', user?.yearOfStudy || 'Not provided'],
            ].map(([label, value]) => (
              <div key={label}>
                <label style={{ fontSize: 12, color: TEXT_DIM, display: 'block', marginBottom: 4 }}>{label}</label>
                <p className="rounded-lg p-3" style={{ fontSize: 13, background: isDarkMode ? '#242019' : '#F7F5F1', color: isDarkMode ? '#fff' : '#1A1005', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>{value}</p>
              </div>
            ))}
            <div className="md:col-span-2">
              <label style={{ fontSize: 12, color: TEXT_DIM, display: 'block', marginBottom: 4 }}>Bio</label>
              <p className="rounded-lg p-3" style={{ fontSize: 13, background: isDarkMode ? '#242019' : '#F7F5F1', color: isDarkMode ? '#D1D5DB' : '#4B5563', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>{user?.bio || 'No bio provided'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontSize: 15, color: isDarkMode ? '#fff' : '#1A1005' }}>
            <FileText style={{ width: 17, height: 17, color: BRAND }} /> Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {user?.skills?.length > 0 ? (
              user.skills.map((skill, index) => (
                <span key={index} className="px-4 py-1.5 rounded-full font-medium" style={{ fontSize: 12.5, background: 'rgba(245,131,31,0.10)', color: BRAND, border: '1px solid rgba(245,131,31,0.2)' }}>{skill}</span>
              ))
            ) : (
              <p style={{ fontSize: 13, color: TEXT_DIM }}>No skills added yet</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== APPLICATIONS =====
  function renderApplications() {
    return (
      <div className="rounded-2xl p-5" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold" style={{ fontSize: 15.5, color: isDarkMode ? '#fff' : '#1A1005' }}>My Applications</h2>
          <span style={{ fontSize: 13, color: TEXT_DIM }}>{applications.length} applied</span>
        </div>
        <div className="space-y-3">
          {applications.length > 0 ? (
            applications.map((app, index) => (
              <div key={index} className="flex items-center justify-between py-3" style={{ borderBottom: index < applications.length - 1 ? `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` : 'none' }}>
                <div>
                  <p className="font-medium" style={{ fontSize: 13.5, color: isDarkMode ? '#fff' : '#1A1005' }}>{app.opportunity?.title || app.title || 'N/A'}</p>
                  <p style={{ fontSize: 12, color: TEXT_DIM }}>{app.opportunity?.company_name || app.company_name || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(app.status)}`}>{(app.status || 'pending').toUpperCase()}</span>
                  <span style={{ fontSize: 11, color: TEXT_DIM }}>{formatDate(app.applied_at)}</span>
                  {app.status === 'pending' && (
                    <button onClick={() => handlePayNow(app)} className="px-3 py-1.5 text-white text-xs font-semibold rounded-lg transition-all" style={{ background: BRAND }} onMouseEnter={e => (e.currentTarget.style.background = '#D4690F')} onMouseLeave={e => (e.currentTarget.style.background = BRAND)}>Pay Now</button>
                  )}
                  <button onClick={() => handleRemove(app.id)} className="text-xs font-medium" style={{ color: '#DC2626' }}>Remove</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12" style={{ color: TEXT_DIM }}>
              <FileText className="w-12 h-12 mx-auto mb-3" style={{ opacity: 0.3 }} />
              <p className="text-lg font-medium">No Applications</p>
              <p className="text-sm">Start browsing and apply to opportunities!</p>
              <button onClick={() => handleTabClick('browse')} className="mt-3 text-white px-4 py-2 rounded-lg transition-all" style={{ background: BRAND }}>Browse Opportunities</button>
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
      <div className="rounded-2xl p-5" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold" style={{ fontSize: 15.5, color: isDarkMode ? '#fff' : '#1A1005' }}>Saved Opportunities</h2>
          <span style={{ fontSize: 13, color: TEXT_DIM }}>{savedOpportunities.length} saved</span>
        </div>

        {savedOpportunities.length > 0 ? (
          <div className="space-y-4">
            {savedOpportunities.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 rounded-xl transition-all" style={{ border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
                <div>
                  <p className="font-medium" style={{ fontSize: 13.5, color: isDarkMode ? '#fff' : '#1A1005' }}>{job.title}</p>
                  <p style={{ fontSize: 12, color: TEXT_DIM }}>{job.company_name} · {job.location}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-medium ${getTypeColor(job.type)}`}>{job.type}</span>
                    <span style={{ fontSize: 11, color: TEXT_DIM }}>Closes {formatDate(job.deadline)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/apply/${job.id}`} className="px-3.5 py-1.5 text-white text-sm font-medium rounded-lg transition-all" style={{ background: BRAND }}>Apply</Link>
                  <button onClick={() => handleRemoveSaved(job.id)} className="px-3.5 py-1.5 text-sm rounded-lg transition flex items-center gap-1 font-medium" style={{ background: '#FBEAE5', color: '#C0392B' }}>
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12" style={{ color: TEXT_DIM }}>
            <Bookmark className="w-12 h-12 mx-auto mb-3" style={{ opacity: 0.3 }} />
            <p className="text-lg font-medium">No Saved Opportunities</p>
            <p className="text-sm">Save opportunities you're interested in.</p>
            <button onClick={() => handleTabClick('browse')} className="mt-3 text-white px-4 py-2 rounded-lg transition-all" style={{ background: BRAND }}>Browse Opportunities</button>
          </div>
        )}
      </div>
    );
  }

  // ===== BROWSE =====
  function renderBrowse() {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl p-6" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
          <h2 className="font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: isDarkMode ? '#fff' : '#1A1005' }}>Browse Opportunities</h2>
          <p style={{ fontSize: 13, color: TEXT_DIM }}>Discover {opportunities.length} verified opportunities.</p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4" style={{ color: TEXT_DIM }} />
              <input type="text" placeholder="Search by title, company..." value={browseSearchTerm} onChange={(e) => setBrowseSearchTerm(e.target.value)} className="w-full px-4 py-2.5 pl-10 rounded-lg text-sm outline-none transition-all" style={{ background: isDarkMode ? '#242019' : '#F7F5F1', color: isDarkMode ? '#fff' : '#111', border: `1px solid ${isDarkMode ? '#2A2218' : 'transparent'}` }} onFocus={e => e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.10)`} onBlur={e => e.target.style.boxShadow = 'none'} />
            </div>
            <select value={browseType} onChange={(e) => setBrowseType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all" style={{ background: isDarkMode ? '#242019' : '#F7F5F1', color: isDarkMode ? '#fff' : '#111', border: `1px solid ${isDarkMode ? '#2A2218' : 'transparent'}` }}>
              <option value="All Types">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Attachment">Attachment</option>
              <option value="Graduate Trainee">Graduate Trainee</option>
            </select>
            <select value={browseLocation} onChange={(e) => setBrowseLocation(e.target.value)} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all" style={{ background: isDarkMode ? '#242019' : '#F7F5F1', color: isDarkMode ? '#fff' : '#111', border: `1px solid ${isDarkMode ? '#2A2218' : 'transparent'}` }}>
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
          <p style={{ fontSize: 13, color: TEXT_DIM }}>{filteredOpportunities.length} opportunities found</p>
          <p style={{ fontSize: 13, color: TEXT_DIM }}>{savedOpportunities.length} saved</p>
        </div>

        <div className="space-y-4">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opp) => {
              const isSaved = savedIds.has(opp.id);
              const isSaving = savingId === opp.id;

              return (
                <div key={opp.id} className="rounded-2xl p-5 transition-all" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-bold" style={{ fontSize: 15.5, color: isDarkMode ? '#fff' : '#1A1005' }}>{opp.title}</h3>
                      <p style={{ fontSize: 12.5, color: TEXT_DIM }}>{opp.company_name} · {opp.location}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-[11px] px-3 py-0.5 rounded-full font-medium ${getTypeColor(opp.type)}`}>{opp.type}</span>
                        <span style={{ fontSize: 11, color: TEXT_DIM }}>Closes {formatDate(opp.deadline)}</span>
                        {opp.stipend && <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 600 }}>{opp.stipend}</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleSave(opp.id)}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                      style={{
                        background: isSaved ? 'rgba(245,131,31,0.10)' : (isDarkMode ? '#242019' : '#F7F5F1'),
                        color: isSaved ? BRAND : TEXT_DIM,
                        border: `1.5px solid ${isSaved ? 'rgba(245,131,31,0.3)' : 'transparent'}`,
                      }}
                    >
                      <Bookmark style={{ width: 16, height: 16 }} fill={isSaved ? BRAND : 'none'} />
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>{isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
                    <Link to={`/opportunity/${opp.id}`} className="text-sm font-semibold hover:underline" style={{ color: BRAND }}>See more details →</Link>
                    <Link to={`/apply/${opp.id}`} className="px-6 py-1.5 text-white text-sm font-medium rounded-lg transition-all" style={{ background: BRAND }} onMouseEnter={e => (e.currentTarget.style.background = '#D4690F')} onMouseLeave={e => (e.currentTarget.style.background = BRAND)}>Apply</Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl p-12 text-center" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
              <Search className="w-12 h-12 mx-auto mb-3" style={{ opacity: 0.3, color: TEXT_DIM }} />
              <h3 className="font-bold mb-2" style={{ fontSize: 17, color: isDarkMode ? '#fff' : '#1A1005' }}>No opportunities found</h3>
              <p style={{ fontSize: 13, color: TEXT_DIM }}>Try adjusting your search or filters</p>
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
        <div className="rounded-2xl p-12 text-center" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent mx-auto" style={{ borderColor: `${BRAND} transparent ${BRAND} ${BRAND}` }}></div>
          <p className="mt-3" style={{ color: TEXT_DIM }}>Loading messages...</p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl p-5" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold" style={{ fontSize: 15.5, color: isDarkMode ? '#fff' : '#1A1005' }}>
            Messages {unreadCount > 0 && <span style={{ fontSize: 13, fontWeight: 500, color: BRAND }}>({unreadCount} unread)</span>}
          </h2>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="text-xs font-semibold hover:underline" style={{ color: BRAND }}>Mark all as read</button>
          )}
        </div>

        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl transition cursor-pointer"
                style={{
                  border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}`,
                  background: !msg.is_read ? 'rgba(245,131,31,0.04)' : 'transparent',
                  borderLeft: msg.is_important ? `3px solid ${BRAND}` : undefined,
                }}
                onClick={() => handleMessageClick(msg.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium" style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#1A1005' }}>{msg.sender_name || 'Admin'}</p>
                      {!msg.is_read && <span className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />}
                      {msg.is_important && (
                        <span className="text-[10.5px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(245,131,31,0.12)', color: BRAND }}>Important</span>
                      )}
                    </div>
                    {msg.subject && <p className="font-medium mt-1" style={{ fontSize: 13, color: isDarkMode ? '#D1D5DB' : '#374151' }}>{msg.subject}</p>}
                    <p className="mt-1 line-clamp-2" style={{ fontSize: 12.5, color: TEXT_DIM }}>{msg.message}</p>
                  </div>
                  <span style={{ fontSize: 11, color: TEXT_DIM, flexShrink: 0, marginLeft: 16 }}>{msg.time_ago || 'Just now'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12" style={{ color: TEXT_DIM }}>
            <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ opacity: 0.3 }} />
            <p className="text-lg font-medium">No Messages</p>
            <p className="text-sm">You don't have any messages yet.</p>
          </div>
        )}
      </div>
    );
  }

  // ===== NOTIFICATIONS =====
  function renderNotifications() {
    if (loadingNotifs) {
      return (
        <div className="rounded-2xl p-12 text-center" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent mx-auto" style={{ borderColor: `${BRAND} transparent ${BRAND} ${BRAND}` }}></div>
          <p className="mt-3" style={{ color: TEXT_DIM }}>Loading notifications...</p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl p-5" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold" style={{ fontSize: 15.5, color: isDarkMode ? '#fff' : '#1A1005' }}>
            Notifications
            {notifUnreadCount > 0 && <span style={{ fontSize: 13, fontWeight: 500, color: BRAND, marginLeft: 8 }}>({notifUnreadCount} unread)</span>}
          </h2>
          {notifUnreadCount > 0 && (
            <button onClick={handleMarkAllNotifsAsRead} className="text-xs font-semibold hover:underline" style={{ color: BRAND }}>
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-3 p-3 rounded-xl transition cursor-pointer"
                style={{
                  background: !notif.is_read ? 'rgba(245,131,31,0.06)' : 'transparent',
                  border: `1px solid ${!notif.is_read ? 'rgba(245,131,31,0.15)' : (isDarkMode ? '#2A2218' : '#F0EEE9')}`,
                }}
                onClick={() => handleMarkNotifAsRead(notif.id)}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium" style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#1A1005' }}>
                      {notif.title}
                    </p>
                    {!notif.is_read && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: BRAND }} />}
                  </div>
                  <p style={{ fontSize: 12.5, color: TEXT_DIM }}>{notif.message}</p>
                  <p style={{ fontSize: 11, color: TEXT_DIM, marginTop: 2 }}>{notif.time_ago || 'Just now'}</p>
                </div>
                {notif.link && (
                  <Link to={notif.link} className="text-xs font-semibold hover:underline flex-shrink-0" style={{ color: BRAND }}>
                    View
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12" style={{ color: TEXT_DIM }}>
            <Bell className="w-12 h-12 mx-auto mb-3" style={{ opacity: 0.3 }} />
            <p className="text-lg font-medium">No Notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        )}
      </div>
    );
  }

  // ===== RESUME =====
  function renderResume() {
    return (
      <div className="rounded-2xl p-5" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
        <h2 className="font-bold mb-4" style={{ fontSize: 15.5, color: isDarkMode ? '#fff' : '#1A1005' }}>Resume / CV</h2>
        <div className="text-center py-12" style={{ color: TEXT_DIM }}>
          <File className="w-16 h-16 mx-auto mb-4" style={{ opacity: 0.3 }} />
          <h3 className="font-bold mb-2" style={{ fontSize: 18, color: isDarkMode ? '#fff' : '#1A1005' }}>No CV Uploaded</h3>
          <p className="text-sm mb-6">Upload your CV to apply for opportunities</p>
          <label className="inline-block text-white px-6 py-2.5 rounded-xl cursor-pointer transition-all" style={{ background: BRAND }}>
            Upload CV
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
          </label>
          <p className="text-xs mt-4" style={{ color: TEXT_DIM }}>PDF, DOC, or DOCX (Max 5MB)</p>
        </div>
      </div>
    );
  }

  // ===== CAREER =====
  function renderCareer() {
    return (
      <div className="rounded-2xl p-5" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
        <h2 className="font-bold mb-4" style={{ fontSize: 15.5, color: isDarkMode ? '#fff' : '#1A1005' }}>Career Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl transition-all" style={{ border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
            <h3 className="font-bold" style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#1A1005' }}>CV Writing Guide</h3>
            <p className="mt-1" style={{ fontSize: 12.5, color: TEXT_DIM }}>Learn how to write a professional CV.</p>
            <button className="mt-2 text-sm font-semibold hover:underline" style={{ color: BRAND }}>Read More →</button>
          </div>
        </div>
      </div>
    );
  }

  // ===== EVENTS =====
  function renderEvents() {
    return (
      <div className="rounded-2xl p-5" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
        <h2 className="font-bold mb-4" style={{ fontSize: 15.5, color: isDarkMode ? '#fff' : '#1A1005' }}>Events & Webinars</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl transition-all" style={{ border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
            <div className="flex flex-col items-center justify-center rounded-xl flex-shrink-0" style={{ width: 56, height: 56, background: 'rgba(245,131,31,0.10)' }}>
              <span className="font-bold" style={{ fontSize: 18, color: BRAND }}>24</span>
              <span style={{ fontSize: 10, color: BRAND }}>MAY</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold" style={{ fontSize: 14, color: isDarkMode ? '#fff' : '#1A1005' }}>CV Writing Workshop</h3>
              <p style={{ fontSize: 12.5, color: TEXT_DIM }}>Online Webinar · 2:00 PM</p>
            </div>
            <button className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all" style={{ background: BRAND }}>Register</button>
          </div>
        </div>
      </div>
    );
  }

  // ===== SETTINGS =====
  function renderSettings() {
    const updateSetting = (key, value) => {
      const updated = { ...notificationSettings, [key]: value };
      setNotificationSettings(updated);
      localStorage.setItem('notificationSettings', JSON.stringify(updated));
    };

    return (
      <div className="rounded-2xl p-6" style={{ background: isDarkMode ? '#1E1810' : '#fff', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,131,31,0.10)' }}>
            <Settings className="w-5 h-5" style={{ color: BRAND }} />
          </div>
          <div>
            <h2 className="font-bold" style={{ fontSize: 18, color: isDarkMode ? '#fff' : '#1A1005' }}>Settings</h2>
            <p style={{ fontSize: 12.5, color: TEXT_DIM }}>Manage your notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl transition" style={{ border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,131,31,0.10)' }}>
                <Mail className="w-5 h-5" style={{ color: BRAND }} />
              </div>
              <div>
                <h3 className="font-medium" style={{ fontSize: 13.5, color: isDarkMode ? '#fff' : '#1A1005' }}>Email Notifications</h3>
                <p style={{ fontSize: 12, color: TEXT_DIM }}>
                  Receive email notifications when admin sends you a message
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: notificationSettings.emailNotifications ? '#DCFCE7' : (isDarkMode ? '#2A2218' : '#F0EEE9'), color: notificationSettings.emailNotifications ? '#15803D' : TEXT_DIM }}
                  >
                    {notificationSettings.emailNotifications ? 'On' : 'Off'}
                  </span>
                  {notificationSettings.emailNotifications && (
                    <span className="flex items-center gap-1" style={{ fontSize: 11, color: '#16A34A' }}>
                      <CheckCircle className="w-3 h-3" /> You'll receive email alerts
                    </span>
                  )}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => {
                  updateSetting('emailNotifications', e.target.checked);
                  setProfileMessage(e.target.checked ? 'Email notifications enabled' : 'Email notifications disabled');
                  setTimeout(() => setProfileMessage(''), 3000);
                }}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ background: notificationSettings.emailNotifications ? BRAND : (isDarkMode ? '#2A2218' : '#E5E7EB') }}
              />
            </label>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl transition" style={{ border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.10)' }}>
                <Bell className="w-5 h-5" style={{ color: '#6366F1' }} />
              </div>
              <div>
                <h3 className="font-medium" style={{ fontSize: 13.5, color: isDarkMode ? '#fff' : '#1A1005' }}>Push Notifications</h3>
                <p style={{ fontSize: 12, color: TEXT_DIM }}>
                  Receive browser notifications for new messages
                </p>
                <span
                  className="inline-block mt-1.5 text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: notificationSettings.pushNotifications ? '#DCFCE7' : (isDarkMode ? '#2A2218' : '#F0EEE9'), color: notificationSettings.pushNotifications ? '#15803D' : TEXT_DIM }}
                >
                  {notificationSettings.pushNotifications ? 'On' : 'Off'}
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={notificationSettings.pushNotifications}
                onChange={(e) => {
                  updateSetting('pushNotifications', e.target.checked);
                  if (e.target.checked && !('Notification' in window)) {
                    alert('Push notifications are not supported in this browser.');
                  } else if (e.target.checked) {
                    Notification.requestPermission();
                  }
                }}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ background: notificationSettings.pushNotifications ? '#6366F1' : (isDarkMode ? '#2A2218' : '#E5E7EB') }}
              />
            </label>
          </div>

          {/* Message Preview */}
          <div className="flex items-center justify-between p-4 rounded-xl transition" style={{ border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.10)' }}>
                <MessageSquare className="w-5 h-5" style={{ color: '#10B981' }} />
              </div>
              <div>
                <h3 className="font-medium" style={{ fontSize: 13.5, color: isDarkMode ? '#fff' : '#1A1005' }}>Message Preview</h3>
                <p style={{ fontSize: 12, color: TEXT_DIM }}>
                  Show message preview in email notifications
                </p>
                <span
                  className="inline-block mt-1.5 text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: notificationSettings.messagePreview ? '#DCFCE7' : (isDarkMode ? '#2A2218' : '#F0EEE9'), color: notificationSettings.messagePreview ? '#15803D' : TEXT_DIM }}
                >
                  {notificationSettings.messagePreview ? 'On' : 'Off'}
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={notificationSettings.messagePreview}
                onChange={(e) => updateSetting('messagePreview', e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ background: notificationSettings.messagePreview ? '#10B981' : (isDarkMode ? '#2A2218' : '#E5E7EB') }}
              />
            </label>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 rounded-xl transition" style={{ border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: isDarkMode ? 'rgba(245,131,31,0.10)' : '#F7F5F1' }}>
                <span style={{ fontSize: 16 }}>{isDarkMode ? '🌙' : '☀️'}</span>
              </div>
              <div>
                <h3 className="font-medium" style={{ fontSize: 13.5, color: isDarkMode ? '#fff' : '#1A1005' }}>Dark Mode</h3>
                <p style={{ fontSize: 12, color: TEXT_DIM }}>Switch between light and dark theme</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded-lg font-semibold transition-all flex-shrink-0"
              style={{ fontSize: 12.5, background: isDarkMode ? BRAND : (isDarkMode ? '#2A2218' : '#F0EEE9'), color: isDarkMode ? '#fff' : '#374151' }}
            >
              {isDarkMode ? 'On' : 'Off'}
            </button>
          </div>

          {/* Notification Summary */}
          <div className="p-4 rounded-xl" style={{ background: isDarkMode ? '#242019' : '#F7F5F1', border: `1px solid ${isDarkMode ? '#2A2218' : '#F0EEE9'}` }}>
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4.5 h-4.5" style={{ width: 18, height: 18, color: BRAND }} />
              <span className="font-semibold" style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#1A1005' }}>Notification Summary</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Email', on: notificationSettings.emailNotifications },
                { label: 'Push', on: notificationSettings.pushNotifications },
                { label: 'Preview', on: notificationSettings.messagePreview },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <div
                    className="w-8 h-8 mx-auto mb-1.5 rounded-full flex items-center justify-center"
                    style={{ background: item.on ? '#DCFCE7' : (isDarkMode ? '#2A2218' : '#F0EEE9') }}
                  >
                    {item.on ? <CheckCircle style={{ width: 16, height: 16, color: '#16A34A' }} /> : <X style={{ width: 16, height: 16, color: TEXT_DIM }} />}
                  </div>
                  <p style={{ fontSize: 11, color: TEXT_DIM }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default StudentDashboard;