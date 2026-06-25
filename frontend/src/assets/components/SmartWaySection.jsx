// src/components/Home/SmartWaySection.jsx

import { Link } from 'react-router-dom';

const SmartWaySection = () => {
  const applications = [
    { role: 'Software Intern', company: 'Safaricom', status: 'Interview', statusColor: 'text-amber-600', statusBg: 'bg-amber-50' },
    { role: 'Finance Intern', company: 'Equity Bank', status: 'Shortlisted', statusColor: 'text-green-600', statusBg: 'bg-green-50' },
    { role: 'Data Intern', company: 'Twiga Foods', status: 'Pending', statusColor: 'text-gray-500', statusBg: 'bg-gray-50' },
  ];

  const features = [
    { icon: '⚡', text: 'One-click applications using your saved profile' },
    { icon: '📊', text: 'Real-time application status tracking' },
    { icon: '🎯', text: 'Personalised listing recommendations' },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SIDE - CONTENT */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-blue-700 text-xs font-semibold tracking-wider uppercase">Launch your career</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              The <span className="text-blue-900">Smart Way</span>
              <br />
              to Internships
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Create your intern profile once and apply to hundreds of opportunities in minutes. 
              No cover letter templates, no long forms — just you and the role.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm">{feature.icon}</span>
                  </div>
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/register" 
                className="bg-blue-900 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-800 transition shadow-sm hover:shadow-md"
              >
                Create Your Profile →
              </Link>
              <Link 
                to="/opportunities" 
                className="border-2 border-blue-900 text-blue-900 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition"
              >
                Browse Opportunities
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE - APPLICATIONS CARD */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Card Header */}
              <div className="bg-blue-900 px-6 py-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  My Applications
                </h3>
              </div>

              {/* Applications List */}
              <div className="divide-y divide-gray-100">
                {applications.map((app, idx) => (
                  <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{app.role}</h4>
                        <p className="text-sm text-gray-500 mt-1">{app.company}</p>
                      </div>
                      <span className={`${app.statusBg} ${app.statusColor} text-xs font-semibold px-3 py-1 rounded-full`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <Link to="/applications" className="text-blue-900 text-sm font-medium hover:text-blue-700 transition flex items-center gap-1">
                  View all applications 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Stats Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Success Rate</p>
                <p className="font-bold text-blue-900">94%</p>
              </div>
            </div>

            {/* Rating Badge */}
            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-900 text-xl">⭐</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Rating</p>
                <p className="font-bold text-blue-900">4.9/5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartWaySection;