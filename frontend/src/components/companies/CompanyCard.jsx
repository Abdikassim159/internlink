
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CompanyCard = ({ company, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIndustryColor = (industry) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-700',
      'Finance': 'bg-green-100 text-green-700',
      'Banking': 'bg-yellow-100 text-yellow-700',
      'Agriculture': 'bg-emerald-100 text-emerald-700',
      'Energy': 'bg-orange-100 text-orange-700',
      'FinTech': 'bg-purple-100 text-purple-700',
    };
    return colors[industry] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer ${
        isHovered ? 'shadow-xl border-blue-200 -translate-y-1' : 'hover:shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(company)}
    >
      <div className="flex items-start gap-5">
        {/* Company Logo */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
          {company.name?.charAt(0) || '🏢'}
        </div>
        
        {/* Company Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition">
                {company.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getIndustryColor(company.industry)}`}>
                  {company.industry || 'General'}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-sm text-gray-500">{company.location || 'Nairobi'}</span>
              </div>
            </div>
            {company.is_verified && (
              <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {company.openings || 0} Open Positions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-500">4.8 ★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
