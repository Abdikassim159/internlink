
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorPage from '../components/Common/ErrorPage';

const API_URL = 'http://localhost:5000/api';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    interview: 0,
    accepted: 0,
    rejected: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/student-login');
      return;
    }
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/student-login');
        return;
      }

      const response = await axios.get(`${API_URL}/applications/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const apps = response.data.applications || [];
      setApplications(apps);

      const statsData = {
        total: apps.length,
        pending: apps.filter(a => a.status === 'pending').length,
        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        interview: apps.filter(a => a.status === 'interview').length,
        accepted: apps.filter(a => a.status === 'accepted').length,
        rejected: apps.filter(a => a.status === 'rejected').length
      };
      setStats(statsData);

    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('service_unavailable');
    } finally {
      setLoading(false);
    }
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

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorPage 
        title="Service Temporarily Unavailable"
        message="We're experiencing technical difficulties. Please try again later."
        showHomeButton={true}
        showRefreshButton={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-blue-700 text-xs font-semibold tracking-wider uppercase">My Applications</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Track Your <span className="text-blue-900">Applications</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Monitor the status of all your internship and attachment applications in one place
          </p>
        </div>

        {applications.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
                <p className="text-2xl font-bold text-blue-600">{stats.shortlisted}</p>
                <p className="text-xs text-gray-500">Shortlisted</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
                <p className="text-2xl font-bold text-purple-600">{stats.interview}</p>
                <p className="text-xs text-gray-500">Interview</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                <p className="text-xs text-gray-500">Accepted</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-xs text-gray-500">Rejected</p>
              </div>
            </div>

            <div className="space-y-4">
              {applications.map((app) => (
                <div 
                  key={app.id} 
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">💼</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/opportunity/${app.opportunity_id}`}
                          className="font-bold text-lg text-gray-900 hover:text-blue-600 transition"
                        >
                          {app.opportunity?.title || 'Opportunity'}
                        </Link>
                        <p className="text-sm text-gray-600">
                          {app.opportunity?.company_name || app.opportunity?.company || 'Company'}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">
                            📅 Applied: {new Date(app.applied_at).toLocaleDateString()}
                          </span>
                          {app.match_score && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              app.match_score >= 80 ? 'bg-green-100 text-green-700' :
                              app.match_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {app.match_score}% Match
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)} {getStatusLabel(app.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <div className="text-7xl mb-6">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Applications Yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              You haven't applied to any opportunities yet. Start browsing and apply today!
            </p>
            <Link 
              to="/opportunities" 
              className="inline-flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition shadow-sm"
            >
              <span>Browse Opportunities</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;