
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OpportunityCard from '../components/opportunities/OpportunityCard';
import ErrorPage from '../components/Common/ErrorPage';

const API_URL = 'http://localhost:5000/api';

const FindOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [savedJobs, setSavedJobs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const filterOptions = {
    types: ["All", "Attachment", "Internship", "Graduate Trainee"],
    locations: ["All", "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Remote"],
    industries: ["All", "Technology", "Finance", "Marketing", "Engineering", "Healthcare"],
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/opportunities`);
      
      if (response.data && response.data.opportunities) {
        setOpportunities(response.data.opportunities);
        setFilteredOpportunities(response.data.opportunities);
      } else {
        setOpportunities([]);
        setFilteredOpportunities([]);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      
      // Don't expose technical details to user
      setError('service_unavailable');
      
      setOpportunities([]);
      setFilteredOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...opportunities];
    
    if (searchTerm) {
      filtered = filtered.filter(opp => 
        opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedType !== 'All') {
      filtered = filtered.filter(opp => opp.type === selectedType);
    }
    if (selectedLocation !== 'All') {
      filtered = filtered.filter(opp => opp.location === selectedLocation);
    }
    if (selectedIndustry !== 'All') {
      filtered = filtered.filter(opp => opp.industry === selectedIndustry);
    }
    setFilteredOpportunities(filtered);
  }, [searchTerm, selectedType, selectedLocation, selectedIndustry, opportunities]);

  const handleSaveJob = (id) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter(jobId => jobId !== id));
    } else {
      setSavedJobs([...savedJobs, id]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const clearFilters = () => {
    setSelectedType('All');
    setSelectedLocation('All');
    setSelectedIndustry('All');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  // Professional error page - NO technical details!
  if (error) {
    return (
      <ErrorPage 
        title="Service Temporarily Unavailable"
        message="We're currently experiencing high traffic. Please refresh the page or try again later."
        showHomeButton={true}
        showRefreshButton={true}
      />
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-gray-100">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Opportunities Available</h2>
          <p className="text-gray-600 mb-6">There are currently no opportunities available. Please check back later.</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Rest of the component...
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white text-gray-800 transition-all duration-300 h-full shadow-xl z-40 border-r border-gray-200 flex-shrink-0 sticky top-0 self-start max-h-screen overflow-y-auto`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">in</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-bold text-lg text-gray-900 leading-tight">InternLink</p>
                <p className="text-xs text-blue-600">Find Opportunities</p>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        {user && sidebarOpen && (
          <div className="px-4 py-2 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-900 text-xs font-bold">👤</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 truncate">{user.email?.split('@')[0]}</p>
                <p className="text-xs text-blue-600 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </h3>
            <button 
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition"
            >
              Clear all
            </button>
          </div>

          {/* Opportunity Type */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
              <span className="text-blue-900">📋</span> Type
            </h4>
            <div className="space-y-1.5">
              {filterOptions.types.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer group text-sm">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={selectedType === type}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-3.5 h-3.5 text-blue-900 focus:ring-blue-900 focus:ring-2"
                  />
                  <span className={`${selectedType === type ? 'text-blue-900 font-medium' : 'text-gray-600 group-hover:text-gray-800'} transition text-sm`}>
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
              <span className="text-blue-900">📍</span> Location
            </h4>
            <div className="space-y-1.5">
              {filterOptions.locations.map(location => (
                <label key={location} className="flex items-center gap-2 cursor-pointer group text-sm">
                  <input
                    type="radio"
                    name="location"
                    value={location}
                    checked={selectedLocation === location}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-3.5 h-3.5 text-blue-900 focus:ring-blue-900 focus:ring-2"
                  />
                  <span className={`${selectedLocation === location ? 'text-blue-900 font-medium' : 'text-gray-600 group-hover:text-gray-800'} transition text-sm`}>
                    {location}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
              <span className="text-blue-900">🏢</span> Industry
            </h4>
            <div className="space-y-1.5">
              {filterOptions.industries.map(industry => (
                <label key={industry} className="flex items-center gap-2 cursor-pointer group text-sm">
                  <input
                    type="radio"
                    name="industry"
                    value={industry}
                    checked={selectedIndustry === industry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-3.5 h-3.5 text-blue-900 focus:ring-blue-900 focus:ring-2"
                  />
                  <span className={`${selectedIndustry === industry ? 'text-blue-900 font-medium' : 'text-gray-600 group-hover:text-gray-800'} transition text-sm`}>
                    {industry}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Found <span className="font-semibold text-blue-900">{filteredOpportunities.length}</span> opportunities
            </p>
          </div>
        </div>

        {/* Toggle Sidebar Button */}
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
      <div className={`flex-1 transition-all duration-300`}>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Attachment</h1>
            <p className="text-gray-500">Browse hundreds of internship and attachment opportunities</p>
          </div>

          <div className="max-w-3xl mb-6">
            <div className="relative group">
              <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 group-hover:border-blue-200 transition duration-300">
                <input
                  type="text"
                  placeholder="Search by title, company, or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-3.5 pl-12 rounded-xl focus:outline-none bg-transparent text-gray-800 placeholder-gray-400"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Showing <span className="font-semibold text-blue-900">{filteredOpportunities.length}</span> opportunities
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opportunity) => {
                const cardData = {
                  id: opportunity.id,
                  title: opportunity.title,
                  company: opportunity.company_name || opportunity.company || 'Company',
                  companyLogo: opportunity.companyLogo || '🏢',
                  location: opportunity.location || 'Remote',
                  type: opportunity.type || 'Internship',
                  duration: opportunity.duration || 'Not specified',
                  deadline: opportunity.deadline || new Date().toISOString(),
                  stipend: opportunity.stipend || 'Not specified',
                  description: opportunity.description || 'No description available',
                  requiredSkills: opportunity.required_skills ? 
                    (Array.isArray(opportunity.required_skills) ? opportunity.required_skills : JSON.parse(opportunity.required_skills || '[]')) :
                    [],
                  matchPercentage: opportunity.matchPercentage || Math.floor(Math.random() * 30) + 70,
                  isSaved: savedJobs.includes(opportunity.id)
                };
                return (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={cardData}
                    onSave={handleSaveJob}
                    isSaved={savedJobs.includes(opportunity.id)}
                    viewMode="list"
                  />
                );
              })
            ) : (
              <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No opportunities found</h3>
                <p className="text-gray-500 max-w-sm mx-auto text-sm">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 pt-4 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              © 2026 InternLink by FutureSpace. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindOpportunities;
