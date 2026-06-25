// src/components/opportunities/OpportunityCard.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';

const OpportunityCard = ({ opportunity, onSave, isSaved }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getDeadlineColor = (deadline) => {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 7) return 'text-red-600 bg-red-50';
    if (daysLeft < 14) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        
        {/* Company Logo */}
        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{opportunity.companyLogo}</span>
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
            
            {/* Match Percentage Badge */}
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                opportunity.matchPercentage >= 80 ? 'bg-green-100 text-green-700' :
                opportunity.matchPercentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {opportunity.matchPercentage}% Match
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>📍</span>
              <span>{opportunity.location}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>📋</span>
              <span>{opportunity.type}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>⏱️</span>
              <span>{opportunity.duration}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>💰</span>
              <span>{opportunity.stipend}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {opportunity.description}
          </p>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {opportunity.requiredSkills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
            {opportunity.requiredSkills.length > 3 && (
              <span className="text-xs text-gray-400">+{opportunity.requiredSkills.length - 3} more</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${getDeadlineColor(opportunity.deadline)}`}>
              <span>⏰</span>
              <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSave(opportunity.id)}
                className={`p-2 rounded-lg transition ${
                  isSaved ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              
              <Link
                to={`/opportunity/${opportunity.id}`}
                className="px-5 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition shadow-sm"
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