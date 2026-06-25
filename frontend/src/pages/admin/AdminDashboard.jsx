
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  useEffect(() => {
    fetchData();
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
        console.log('Applications loaded:', appRes.data.applications);
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

  const handleAddOpportunity = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('❌ Please login as admin first');
        return;
      }

      // ✅ FIX: Format deadline correctly - YYYY-MM-DDTHH:MM:SS
      const deadlineDate = new Date(formData.deadline);
      if (isNaN(deadlineDate.getTime())) {
        setMessage('❌ Please select a valid deadline date');
        return;
      }

      // Format as YYYY-MM-DDTHH:MM:SS (without milliseconds)
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

      console.log('Sending data:', opportunityData);

      const response = await axios.post(
        `${API_URL}/opportunities`,
        opportunityData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Response:', response.data);
      
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
        console.error('Response data:', error.response.data);
        errorMsg = error.response.data?.error || errorMsg;
      } else if (error.message) {
        errorMsg = error.message;
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
    { id: 'overview', label: '📊 Overview' },
    { id: 'opportunities', label: '💼 Opportunities' },
    { id: 'applications', label: '📝 Applications' },
    { id: 'add', label: '➕ Add Opportunity' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-900 text-white transition-all duration-300 shadow-xl z-40 flex-shrink-0 sticky top-0 self-start h-screen overflow-y-auto`}>
        <div className="p-5 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-900 font-bold text-lg">in</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-bold text-lg text-white leading-tight">InternLink</p>
                <p className="text-xs text-blue-300">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'add') setShowAddForm(true);
                else setShowAddForm(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                activeTab === item.id 
                  ? 'bg-white/20 text-white font-medium' 
                  : 'hover:bg-white/10 text-blue-200'
              }`}
            >
              {sidebarOpen && <span>{item.label}</span>}
              {!sidebarOpen && <span className="text-xs">{item.label.charAt(0)}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-blue-800 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-500/20 text-blue-200 hover:text-white transition-all duration-200 text-sm"
          >
            {sidebarOpen ? <span>Logout</span> : <span>🚪</span>}
          </button>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-white text-blue-900 rounded-full p-1 shadow-lg hover:shadow-xl transition border border-gray-200 z-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7" : "M13 5l7 7-7 7"} />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {menuItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">Welcome back, Admin</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-900 text-sm font-semibold">👑</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <p className="text-sm text-gray-500">Total Jobs</p>
                  <p className="text-2xl font-bold text-blue-900">{opportunities.length}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <p className="text-sm text-gray-500">Applications</p>
                  <p className="text-2xl font-bold text-blue-900">{applications.length}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {applications.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <p className="text-sm text-gray-500">Accepted</p>
                  <p className="text-2xl font-bold text-green-600">
                    {applications.filter(a => a.status === 'accepted').length}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">Post a New Opportunity</h3>
                  <p className="text-blue-200 text-sm mb-4">Add a new internship or attachment opportunity</p>
                  <button
                    onClick={() => { setActiveTab('add'); setShowAddForm(true); }}
                    className="bg-white text-blue-900 px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition"
                  >
                    + Add Opportunity
                  </button>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">Manage Applications</h3>
                  <p className="text-green-200 text-sm mb-4">Review and update application statuses</p>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="bg-white text-green-700 px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition"
                  >
                    View Applications
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Opportunities Tab */}
          {activeTab === 'opportunities' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-base font-bold text-gray-900">All Opportunities</h2>
                <button
                  onClick={() => { setActiveTab('add'); setShowAddForm(true); }}
                  className="bg-blue-900 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-800 transition"
                >
                  + Add New
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {opportunities.map((opp) => (
                      <tr key={opp.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-gray-500">{opp.id}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{opp.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{opp.company_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{opp.type}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${opp.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {opp.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(opp.id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-base font-bold text-gray-900">All Applications</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="text-xs border rounded px-3 py-1.5 bg-white focus:outline-none focus:border-blue-900"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview">Interview</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <span className="text-xs text-gray-500">
                    {filteredApplications.length} applications
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                {filteredApplications.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Opportunity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Match</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredApplications.map((app, index) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-xs text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{app.full_name}</p>
                              <p className="text-xs text-gray-400">{app.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {app.opportunity?.title || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{app.course || 'N/A'}</td>
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
                              className="text-xs border rounded px-2 py-1 bg-white focus:outline-none focus:border-blue-900"
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
                  <div className="px-6 py-12 text-center text-gray-500">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-sm">No applications yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Applications will appear here when students apply.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add Opportunity Form */}
          {activeTab === 'add' && showAddForm && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Opportunity</h2>
              <form onSubmit={handleAddOpportunity} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 text-sm"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Attachment">Attachment</option>
                    <option value="Graduate Trainee">Graduate Trainee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g., 6 months"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stipend</label>
                  <input
                    type="text"
                    value={formData.stipend}
                    onChange={(e) => setFormData({...formData, stipend: e.target.value})}
                    placeholder="e.g., KES 25,000/month"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                  <input
                    type="text"
                    value={formData.required_skills}
                    onChange={(e) => setFormData({...formData, required_skills: e.target.value})}
                    placeholder="React, Python, SQL"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 text-sm"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-900 text-sm"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
                    Add Opportunity
                  </button>
                  <button type="button" onClick={() => { setActiveTab('overview'); setShowAddForm(false); }} className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              © 2026 InternLink by FutureSpace. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
