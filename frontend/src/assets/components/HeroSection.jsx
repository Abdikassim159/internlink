// src/components/Home/HeroSection.jsx

import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-64px)]">
          
          {/* LEFT COLUMN - CONTENT */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-blue-700 text-xs font-semibold tracking-wider uppercase">
                🚀 500+ Jobs Available
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Find Your
              <span className="text-blue-900"> Perfect</span>
              <br />
              <span className="text-blue-900">Attachment</span>
              <span className="text-gray-900"> & Internship</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              Connect with top employers, fulfill your course requirements, 
              and launch your career. Join thousands of students who found 
              their ideal attachment through InternLink.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link 
                to="/student-register" 
                className="bg-blue-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-800 transition shadow-sm hover:shadow-md flex items-center gap-2"
              >
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                to="/opportunities" 
                className="border-2 border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl font-semibold hover:border-blue-900 hover:text-blue-900 transition"
              >
                Browse Jobs
              </Link>
            </div>

            {/* Trust Section */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700">JK</div>
                <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs font-bold text-green-700">MW</div>
                <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-bold text-purple-700">PO</div>
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">+</div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">10,000+ Students</p>
                <p className="text-xs text-gray-500">Already using InternLink</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-gray-400">4.9/5</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - IMAGE */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Students working together"
                className="w-full h-auto object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
            </div>

            {/* Floating Card 1 - Success */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-3 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">94% Success Rate</p>
                  <p className="text-xs text-gray-500">Students placed</p>
                </div>
              </div>
            </div>

            {/* Floating Card 2 - Jobs */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-3 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">500+ Jobs</p>
                  <p className="text-xs text-gray-500">Active listings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;