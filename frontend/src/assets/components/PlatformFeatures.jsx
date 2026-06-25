// src/components/Home/PlatformFeatures.jsx

import { Link } from 'react-router-dom';

const PlatformFeatures = () => {
  const features = [
    {
      title: "Browse All Listings",
      description: "Explore hundreds of vetted internship and attachment listings across every industry",
      icon: (
        <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      title: "Discover Insights",
      description: "Get valuable insights about companies, salaries, and industry trends",
      icon: (
        <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Apply in One Click",
      description: "Your profile is your application. Submit to any listing instantly",
      icon: (
        <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Smart Notifications",
      description: "Get notified when new internships matching your skills are posted",
      icon: (
        <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      title: "Track Applications",
      description: "Monitor your application status in real-time from your dashboard",
      icon: (
        <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      title: "Company Reviews",
      description: "Read reviews from past interns about their experience",
      icon: (
        <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Find, Apply, and Land
          </h2>
          <p className="text-xl text-gray-600">
            Your Perfect Internship - Built for East African Students
          </p>
          <div className="mt-6">
            <Link 
              to="/opportunities" 
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-900 text-white text-base font-semibold rounded-lg hover:bg-blue-800 transition shadow-sm"
            >
              Browse All Listings
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-8 mb-16 pb-8 border-b border-gray-200">
          <Link to="/" className="text-gray-600 hover:text-blue-900 transition font-medium">Home</Link>
          <Link to="/opportunities" className="text-gray-600 hover:text-blue-900 transition font-medium">Browse</Link>
          <Link to="/companies" className="text-gray-600 hover:text-blue-900 transition font-medium">Companies</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-900 transition font-medium">About</Link>
        </div>

        {/* Two Column Layout - Left Content + Right Cards */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Main Content */}
          <div className="sticky top-24">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Discover Insights
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Explore hundreds of vetted internship and attachment listings across 
                every industry and location in Kenya.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-blue-900">500+</div>
                  <div className="text-xs text-gray-500">Active Listings</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-blue-900">50+</div>
                  <div className="text-xs text-gray-500">Companies</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-blue-900 font-semibold hover:text-blue-700 transition">
                  Log in
                </Link>
                <span className="text-gray-300">|</span>
                <Link to="/register" className="text-blue-900 font-semibold hover:text-blue-700 transition">
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - 6 Cards Grid */}
          <div>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900 transition">
                    <div className="text-blue-900 group-hover:text-white transition">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PlatformFeatures;