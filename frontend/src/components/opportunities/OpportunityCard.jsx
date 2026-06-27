
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const OpportunityCard = ({ opportunity, onSave, isSaved, viewMode = 'list' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);
  
  const getDeadlineColor = (deadline) => {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 7) return { color: 'text-red-600', bg: 'bg-red-50', label: '🔴 Urgent' };
    if (daysLeft < 14) return { color: 'text-orange-600', bg: 'bg-orange-50', label: '🟠 Soon' };
    if (daysLeft < 30) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: '🟡 Available' };
    return { color: 'text-green-600', bg: 'bg-green-50', label: '🟢 Open' };
  };

  const deadlineInfo = getDeadlineColor(opportunity.deadline);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to save jobs');
      return;
    }

    setSaving(true);
    try {
      if (saved) {
        await axios.delete(`${API_URL}/saved/${opportunity.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSaved(false);
        if (onSave) onSave(opportunity.id, false);
      } else {
        await axios.post(`${API_URL}/saved/${opportunity.id}`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSaved(true);
        if (onSave) onSave(opportunity.id, true);
      }
    } catch (error) {
      console.error('Error saving opportunity:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 ${
        isHovered ? 'border-blue-200 shadow-lg' : ''
      } ${viewMode === 'grid' ? 'flex flex-col' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        
        {/* Company Logo */}
        <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-3xl">{opportunity.companyLogo || '🏢'}</span>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <Link to={`/opportunity/${opportunity.id}`}>
                <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition">
                  {opportunity.title}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm">{opportunity.company}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className={`p-2 rounded-lg transition ${
                  saved 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={saved ? 'Saved' : 'Save'}
              >
                <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              
              {/* Match Percentage */}
              {opportunity.matchPercentage && (
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  opportunity.matchPercentage >= 80 ? 'bg-green-100 text-green-700 border border-green-200' :
                  opportunity.matchPercentage >= 60 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                  'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {opportunity.matchPercentage}% Match
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>📍</span>
              <span>{opportunity.location || 'Remote'}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>📋</span>
              <span>{opportunity.type || 'Internship'}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>⏱️</span>
              <span>{opportunity.duration || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>💰</span>
              <span>{opportunity.stipend || 'Not specified'}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {opportunity.description || 'No description available'}
          </p>

          {/* Skills */}
          {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {opportunity.requiredSkills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
              {opportunity.requiredSkills.length > 3 && (
                <span className="text-xs text-gray-400">+{opportunity.requiredSkills.length - 3} more</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
            <div className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${deadlineInfo.bg} ${deadlineInfo.color}`}>
              <span>⏰</span>
              <span>{deadlineInfo.label} - {new Date(opportunity.deadline).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                to={`/opportunity/${opportunity.id}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Details →
              </Link>
              <Link
                to={`/apply/${opportunity.id}`}
                className="px-5 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition shadow-sm hover:shadow-md"
              >
                Apply Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
