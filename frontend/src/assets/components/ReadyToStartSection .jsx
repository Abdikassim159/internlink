// src/components/Home/ReadyToStartSection.jsx - With Dashboard Image

import { Link } from 'react-router-dom';

const ReadyToStartSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SIDE - CONTENT */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 mb-6">
              <span className="text-blue-900 text-sm">✨</span>
              <span className="text-blue-700 text-xs font-semibold tracking-wider uppercase">
                KC AM BK
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Ready to get <span className="text-blue-900">started</span>?
            </h2>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8">
              Create your profile in minutes and start applying to internships across Kenya - completely free.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/register" 
                className="bg-blue-900 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-800 transition shadow-sm"
              >
                Create Your Profile
              </Link>
              <Link 
                to="/post-internship" 
                className="border-2 border-blue-900 text-blue-900 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition"
              >
                Post an Internship
              </Link>
            </div>

            <p className="text-gray-400 text-xs mt-6">
              Free for students. No credit card required.
            </p>
          </div>

          {/* RIGHT SIDE - IMAGE */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <img 
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Student using laptop for internships"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating Join Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-2 flex items-center gap-2">
              <span className="text-blue-900 text-xl">👥</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">Join 10,000+</p>
                <p className="text-xs text-gray-500">students today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadyToStartSection;