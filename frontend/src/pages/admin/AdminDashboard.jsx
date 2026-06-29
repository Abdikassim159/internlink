import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  UserPlus,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
  Plus,
  Search,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Mail,
  Eye,
  Edit2,
  Trash2,
  Filter,
  ChevronDown,
  ChevronRight,
  Send,
  X,
  AlertCircle
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // ===== MESSAGES STATE =====
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    type: 'Internship',
    location: '',
    duration: '',
    stipend: '',
    deadline: '',
    description: '',
    requirements: '',
    required_skills: ''
  });

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

  useEffect(() => {
    fetchData();
    fetchStudents();
    fetchSentMessages();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const oppRes = await axios.get(`${API_URL}/opportunities`);
      setOpportunities(oppRes.data.opportunities || []);
      
      try {
        const token = localStorage.getItem('token');
        const appRes = await axios.get(`${API_URL}/applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setApplications(appRes.data.applications || []);
      } catch (e) {
        console.log('Error loading applications:', e);
        setApplications([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  // ===== FETCH STUDENTS FOR MESSAGES =====
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/students`, getAuthHeaders());
      setStudents(response.data.students || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  // ===== FETCH SENT MESSAGES =====
  const fetchSentMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages`, getAuthHeaders());
      setSentMessages(response.data.messages || []);
    } catch (err) {
      console.error('Error fetching sent messages:', err);
    }
  };

  // ===== SEND MESSAGE =====
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      setErrorMsg('Please select a student');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    
    if (!messageText.trim()) {
      setErrorMsg('Please enter a message');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/messages/send`, {
        student_id: parseInt(selectedStudent),
        subject: subject.trim() || 'Message from Admin',
        message: messageText.trim(),
        is_important: isImportant,
        sender_name: 'Admin',
        sender_role: 'admin'
      }, getAuthHeaders());

      setSuccessMsg('✅ Message sent successfully!');
      setSubject('');
      setMessageText('');
      setIsImportant(false);
      setSelectedStudent('');
      fetchSentMessages();
      
      setTimeout(() => {
        setIsMessageModalOpen(false);
        setSuccessMsg('');
      }, 2000);
      
    } catch (err) {
      console.error('Error sending message:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to send message');
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setSending(false);
    }
  };

  const handleAddOpportunity = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('❌ Please login as admin first');
        return;
      }

      const deadlineDate = new Date(formData.deadline);
      if (isNaN(deadlineDate.getTime())) {
        setMessage('❌ Please select a valid deadline date');
        return;
      }

      const year = deadlineDate.getFullYear();
      const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
      const day = String(deadlineDate.getDate()).padStart(2, '0');
      const formattedDeadline = `${year}-${month}-${day}T00:00:00`;

      const opportunityData = {
        title: formData.title.trim(),
        company_name: formData.company_name.trim(),
        type: formData.type,
        location: formData.location.trim(),
        duration: formData.duration.trim(),
        stipend: formData.stipend.trim(),
        deadline: formattedDeadline,
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        required_skills: formData.required_skills.split(',').map(s => s.trim()).filter(s => s)
      };

      await axios.post(
        `${API_URL}/opportunities`,
        opportunityData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setMessage('✅ Opportunity added successfully!');
      setFormData({
        title: '',
        company_name: '',
        type: 'Internship',
        location: '',
        duration: '',
        stipend: '',
        deadline: '',
        description: '',
        requirements: '',
        required_skills: ''
      });
      setShowAddForm(false);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding opportunity:', error);
      let errorMsg = 'Failed to add opportunity';
      if (error.response) {
        errorMsg = error.response.data?.error || errorMsg;
      }
      setMessage(`❌ ${errorMsg}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/applications/${id}`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMessage(`✅ Status updated to ${newStatus}`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('❌ Failed to update status');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/opportunities/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage('✅ Deleted successfully!');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting:', error);
      setMessage('❌ Failed to delete');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'shortlisted': 'bg-blue-100 text-blue-700 border-blue-200',
      'interview': 'bg-purple-100 text-purple-700 border-purple-200',
      'accepted': 'bg-green-100 text-green-700 border-green-200',
      'rejected': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
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

  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'add', label: 'Add Opportunity', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Total Jobs', value: opportunities.length, icon: Briefcase, color: '#F5831F' },
    { label: 'Applications', value: applications.length, icon: FileText, color: '#6366F1' },
    { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: '#F59E0B' },
    { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, icon: CheckCircle, color: '#10B981' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F5831F] mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
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
          <p className="text-[10px] text-gray-400 mt-0.5 tracking-wider uppercase">Admin Panel</p>
        </div>

        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F5831F] flex items-center justify-center text-white font-bold text-lg">
              👑
            </div>
            <div>
              <p className="font-semibold text-sm text-white">Welcome,</p>
              <p className="font-bold text-sm text-[#F5831F]">Admin</p>
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
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'add') setShowAddForm(true);
                  else setShowAddForm(false);
                  if (item.id === 'messages') {
                    fetchStudents();
                    fetchSentMessages();
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#F5831F] text-white font-medium' 
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'applications' && applications.filter(a => a.status === 'pending').length > 0 && (
                  <span className="bg-[#F5831F] text-white text-xs px-2 py-0.5 rounded-full">
                    {applications.filter(a => a.status === 'pending').length}
                  </span>
                )}
                {item.id === 'messages' && sentMessages.filter(m => !m.is_read).length > 0 && (
                  <span className="bg-[#F5831F] text-white text-xs px-2 py-0.5 rounded-full">
                    {sentMessages.filter(m => !m.is_read).length}
                  </span>
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
                {menuItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Welcome back, Admin 👋
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
                👑
              </div>
            </div>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="p-6">
          {message && (
            <div className={`mb-4 p-4 rounded-xl text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          {/* ===== OVERVIEW ===== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => {
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

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-[#F5831F] to-[#e0731a] rounded-xl p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Post a New Opportunity</h3>
                      <p className="text-white/80 text-sm mt-1">Add a new internship or attachment opportunity</p>
                      <button
                        onClick={() => { setActiveTab('add'); setShowAddForm(true); }}
                        className="mt-4 bg-white text-[#F5831F] px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Opportunity
                      </button>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                      <Briefcase className="w-7 h-7" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#8B5E3C] to-[#6B4226] rounded-xl p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Manage Applications</h3>
                      <p className="text-white/80 text-sm mt-1">Review and update application statuses</p>
                      <button
                        onClick={() => setActiveTab('applications')}
                        className="mt-4 bg-white text-[#8B5E3C] px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        View Applications
                      </button>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-7 h-7" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Applications</h2>
                  <button onClick={() => setActiveTab('applications')} className="text-sm text-[#F5831F] font-medium hover:underline">View All →</button>
                </div>
                {applications.slice(0, 5).length > 0 ? (
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((app) => (
                      <div key={app.id} className={`flex items-center justify-between py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-50'} last:border-0`}>
                        <div>
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>{app.full_name}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{app.opportunity?.title || 'N/A'} · {app.course || 'N/A'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
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
                  <div className={`text-center py-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No applications yet.</div>
                )}
              </div>
            </div>
          )}

          {/* ===== OPPORTUNITIES ===== */}
          {activeTab === 'opportunities' && (
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border overflow-hidden`}>
              <div className={`px-5 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} flex justify-between items-center`}>
                <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>All Opportunities</h2>
                <button
                  onClick={() => { setActiveTab('add'); setShowAddForm(true); }}
                  className="bg-[#F5831F] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#e0731a] transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add New
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>ID</th>
                      <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Title</th>
                      <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Company</th>
                      <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Type</th>
                      <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Status</th>
                      <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                    {opportunities.map((opp) => (
                      <tr key={opp.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className={`px-4 py-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{opp.id}</td>
                        <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{opp.title}</td>
                        <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{opp.company_name}</td>
                        <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{opp.type}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${opp.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {opp.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(opp.id)}
                            className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== APPLICATIONS ===== */}
          {activeTab === 'applications' && (
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border overflow-hidden`}>
              <div className={`px-5 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} flex flex-wrap items-center justify-between gap-4`}>
                <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>All Applications</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className={`text-xs border rounded-lg px-3 py-1.5 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#F5831F]`}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="shortlisted">⭐ Shortlisted</option>
                    <option value="interview">📞 Interview</option>
                    <option value="accepted">✅ Accepted</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {filteredApplications.length} applications
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                {filteredApplications.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <tr>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>#</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Student</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Opportunity</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Match</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Status</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                      {filteredApplications.map((app, index) => (
                        <tr key={app.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                          <td className={`px-4 py-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{index + 1}</td>
                          <td className="px-4 py-3">
                            <div>
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{app.full_name}</p>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>{app.email}</p>
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {app.opportunity?.title || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                              {app.match_score || 0}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(app.status)}`}>
                              {getStatusIcon(app.status)} {app.status?.toUpperCase() || 'PENDING'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={app.status || 'pending'}
                              onChange={(e) => updateStatus(app.id, e.target.value)}
                              className={`text-xs border rounded-lg px-2 py-1 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#F5831F]`}
                            >
                              <option value="pending">⏳ Pending</option>
                              <option value="shortlisted">⭐ Shortlist</option>
                              <option value="interview">📞 Interview</option>
                              <option value="accepted">✅ Accept</option>
                              <option value="rejected">❌ Reject</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className={`px-6 py-12 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-sm">No applications yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Applications will appear here when students apply.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== STUDENTS ===== */}
          {activeTab === 'students' && (
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Students</h2>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage student accounts</span>
              </div>
              {students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <tr>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>#</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Name</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Email</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Unread</th>
                        <th className={`px-4 py-2 text-left text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>Registered</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                      {students.map((student, index) => (
                        <tr key={student.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                          <td className={`px-4 py-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{index + 1}</td>
                          <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{student.full_name}</td>
                          <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{student.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${student.unread_count > 0 ? 'bg-[#F5831F]/20 text-[#F5831F]' : 'bg-gray-100 text-gray-600'}`}>
                              {student.unread_count}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {student.registered_at ? new Date(student.registered_at).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Users className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                  <p className="text-lg font-medium">No Students</p>
                  <p className="text-sm">No students registered yet</p>
                </div>
              )}
            </div>
          )}

          {/* ===== MESSAGES ===== */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              {/* Send Message Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsMessageModalOpen(true)}
                  className="bg-[#F5831F] text-white px-6 py-2.5 rounded-xl hover:bg-[#e0731a] transition flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Send New Message
                </button>
              </div>

              {/* Sent Messages */}
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <MessageSquare className="w-5 h-5 text-[#F5831F]" />
                    Sent Messages
                  </h3>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{sentMessages.length} total</span>
                </div>
                
                {sentMessages.length > 0 ? (
                  <div className="space-y-3">
                    {sentMessages.slice(0, 10).map((msg) => (
                      <div key={msg.id} className={`flex items-center justify-between p-3 border rounded-lg transition ${msg.is_important ? 'border-l-4 border-l-[#F5831F]' : isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>
                              {msg.subject || 'No subject'}
                            </p>
                            {msg.is_important && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5831F]/20 text-[#F5831F] font-medium">⭐ Important</span>
                            )}
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            To: {msg.student_name || 'Student'}
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {msg.time_ago || 'Just now'}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${msg.is_read ? 'bg-gray-100 text-gray-600' : 'bg-[#F5831F]/20 text-[#F5831F]'}`}>
                          {msg.is_read ? '✅ Read' : '⏳ Unread'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} text-sm`}>
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    No messages sent yet
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== ADD OPPORTUNITY ===== */}
          {activeTab === 'add' && showAddForm && (
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#F5831F]/10 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-[#F5831F]" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add New Opportunity</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Create a new internship or attachment opportunity</p>
                </div>
              </div>
              <form onSubmit={handleAddOpportunity} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition text-sm`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Company *</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition text-sm`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition text-sm`}
                  >
                    <option value="Internship">Internship</option>
                    <option value="Attachment">Attachment</option>
                    <option value="Graduate Trainee">Graduate Trainee</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition text-sm`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g., 6 months"
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition text-sm`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Stipend</label>
                  <input
                    type="text"
                    value={formData.stipend}
                    onChange={(e) => setFormData({...formData, stipend: e.target.value})}
                    placeholder="e.g., KES 25,000/month"
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition text-sm`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Deadline *</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition text-sm`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Required Skills</label>
                  <input
                    type="text"
                    value={formData.required_skills}
                    onChange={(e) => setFormData({...formData, required_skills: e.target.value})}
                    placeholder="React, Python, SQL (comma separated)"
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition text-sm`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition text-sm resize-none`}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Requirements</label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                    rows="2"
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition text-sm resize-none`}
                  />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" className="bg-[#F5831F] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e0731a] transition shadow-md hover:shadow-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Opportunity
                  </button>
                  <button type="button" onClick={() => { setActiveTab('overview'); setShowAddForm(false); }} className={`border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} px-6 py-2.5 rounded-xl text-sm font-medium transition`}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===== SETTINGS ===== */}
          {activeTab === 'settings' && (
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Settings</h2>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} border rounded-lg`}>
                  <div>
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Switch between light and dark theme</p>
                  </div>
                  <button onClick={toggleDarkMode} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {isDarkMode ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===== SEND MESSAGE MODAL ===== */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            
            {/* Modal Header */}
            <div className={`sticky top-0 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} z-10 border-b px-6 py-4 flex items-center justify-between rounded-t-2xl`}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#F5831F]/10 rounded-xl flex items-center justify-center">
                  <Send className="w-5 h-5 text-[#F5831F]" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Send Message</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Send a message to a student</p>
                </div>
              </div>
              <button onClick={() => { setIsMessageModalOpen(false); setSuccessMsg(''); setErrorMsg(''); }} className={`p-2 hover:bg-gray-100 rounded-xl transition ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} text-gray-400 hover:text-gray-600`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {successMsg && (
                <div className="bg-green-50 text-green-700 p-3 rounded-xl border border-green-200 flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-4">
                {/* Select Student */}
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1.5 flex items-center gap-2`}>
                    <Users className="w-4 h-4 text-[#F5831F]" />
                    Select Student *
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition`}
                    required
                  >
                    <option value="">Select a student...</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.full_name} ({student.email}) - {student.unread_count} unread
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1.5 flex items-center gap-2`}>
                    <Mail className="w-4 h-4 text-[#F5831F]" />
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter message subject..."
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition`}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1.5`}>
                    Message *
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows="5"
                    placeholder="Write your message here..."
                    className={`w-full px-4 py-2.5 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition resize-none`}
                    required
                  />
                </div>

                {/* Important Toggle */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isImportant}
                      onChange={(e) => setIsImportant(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#F5831F] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F5831F]"></div>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <Star className={`w-4 h-4 ${isImportant ? 'text-[#F5831F]' : 'text-gray-400'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Mark as Important</span>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={sending}
                    className={`flex-1 bg-[#F5831F] text-white py-3 rounded-xl hover:bg-[#e0731a] transition font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                      sending ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsMessageModalOpen(false); setSuccessMsg(''); setErrorMsg(''); }}
                    className={`px-6 py-3 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-xl transition font-medium`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;