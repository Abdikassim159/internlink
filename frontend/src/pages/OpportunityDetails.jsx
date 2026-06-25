import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { mockOpportunities } from '../data/mockOpportunities';

const OpportunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const found = mockOpportunities.find(opp => opp.id === parseInt(id));
      if (found) {
        setOpportunity(found);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h2>
          <p className="text-gray-500 mb-6">The opportunity you're looking for doesn't exist.</p>
          <Link to="/opportunities" className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
            Browse Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white py-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Back Button */}
        <Link to="/opportunities" className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-700 text-sm mb-6 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Opportunities
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  {opportunity.companyLogo}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {opportunity.title}
                  </h1>
                  <p className="text-gray-600">{opportunity.company}</p>
                </div>
              </div>
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
          <div className="grid md:grid-cols-2 gap-6 p-8 border-b border-gray-100">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-5">📍</span>
                <span className="font-medium">Location:</span>
                <span>{opportunity.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-5">📋</span>
                <span className="font-medium">Type:</span>
                <span>{opportunity.type}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-5">⏱️</span>
                <span className="font-medium">Duration:</span>
                <span>{opportunity.duration}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-5">💰</span>
                <span className="font-medium">Stipend:</span>
                <span>{opportunity.stipend}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-5">🏢</span>
                <span className="font-medium">Industry:</span>
                <span>{opportunity.industry}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-5">📅</span>
                <span className="font-medium">Deadline:</span>
                <span>{new Date(opportunity.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About This Opportunity</h2>
            <p className="text-gray-600 leading-relaxed">
              {opportunity.description}
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Requirements:</span> {opportunity.requirements}
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {opportunity.requiredSkills.map((skill, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-8 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Ready to apply?</span> Submit your application today.
              </p>
            </div>
            <Link
              to={`/apply/${opportunity.id}`}
              className="px-8 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition shadow-sm"
            >
              Apply Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;
