
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ErrorPage from '../components/Common/ErrorPage';
import CompanyStats from '../components/companies/CompanyStats';
import CompanyCard from '../components/companies/CompanyCard';
import CompanyModal from '../components/companies/CompanyModal';

const API_URL = 'http://localhost:5000/api';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalJobs: 0,
    avgRating: 0
  });

  const industries = ['All', ...new Set(companies.map(c => c.industry))];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/companies`);
      
      if (response.data && response.data.companies) {
        setCompanies(response.data.companies);
        setFilteredCompanies(response.data.companies);
        
        const totalJobs = response.data.companies.reduce((sum, c) => sum + (c.openings || 0), 0);
        setStats({
          totalCompanies: response.data.companies.length,
          totalJobs: totalJobs,
          avgRating: 4.8
        });
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('service_unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...companies];
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedIndustry !== 'All') {
      filtered = filtered.filter(c => c.industry === selectedIndustry);
    }
    
    setFilteredCompanies(filtered);
  }, [searchTerm, selectedIndustry, companies]);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading companies...</p>
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
    <div className="min-h-screen bg-white">
      
      {/* ===== HERO SECTION ===== */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-white text-xs font-semibold tracking-wider uppercase">
              🌟 Top Companies in Kenya
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Discover Top <span className="text-blue-200">Companies</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
            Find your dream company and start your career journey with Kenya's leading employers
          </p>

          {/* Stats */}
          <CompanyStats stats={stats} />

          {/* Search */}
          <div className="max-w-2xl mx-auto mt-10">
            <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search companies by name or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-3.5 pl-12 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/95 text-gray-800 placeholder-gray-400"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-5 py-3.5 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/95 text-gray-800 min-w-[150px] cursor-pointer"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ===== COMPANIES LIST ===== */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-blue-900">{filteredCompanies.length}</span> companies
          </p>
          {filteredCompanies.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span>All verified companies</span>
            </div>
          )}
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={handleCompanyClick}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
