// src/components/Home/HireTalentSection.jsx

import { Link } from 'react-router-dom';

const HireTalentSection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SIDE - IMAGE */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Hiring student talent"
                className="w-full h-auto object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 hidden lg:block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Success Rate</p>
                  <p className="font-bold text-gray-900 text-xl">94%</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - CONTENT */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-blue-700 text-xs font-semibold tracking-wider uppercase">For Employers</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Hire the best student talent,
              <span className="text-blue-900"> faster.</span>
            </h2>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8">
              Post internship listings, receive verified applications from motivated students, 
              and manage your entire recruitment pipeline - all from one simple dashboard.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-white rounded-xl border border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">48</div>
                <div className="text-xs text-gray-500">Applied</div>
              </div>
              <div className="text-center border-l border-r border-gray-100">
                <div className="text-2xl font-bold text-blue-900">12</div>
                <div className="text-xs text-gray-500">Shortlisted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">4</div>
                <div className="text-xs text-gray-500">Interview</div>
              </div>
            </div>

            {/* Growth Indicator */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-green-600 font-semibold text-sm">+23%</span>
              <span className="text-gray-500 text-sm">vs last posting</span>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Post internships for free in under 5 minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Access a verified pool of student talent</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Manage your entire pipeline in one dashboard</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/register/employer" 
                className="bg-blue-900 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-800 transition shadow-sm hover:shadow-md"
              >
                Post a Job →
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-blue-900 text-blue-900 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HireTalentSection;