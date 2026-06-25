// src/components/Home/DiscoverSection.jsx - Dotted Border

const DiscoverSection = () => {
  const features = [
    { title: "Time Saving", icon: "⏱️" },
    { title: "Safe & Reliable", icon: "🛡️" },
    { title: "Free to Use", icon: "💰" },
    { title: "A FutureSpace Product", icon: "🚀" }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SIDE - CONTENT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 mb-6">
              <span className="text-blue-900 text-sm">✨</span>
              <span className="text-blue-700 text-xs font-semibold tracking-wider uppercase">Discover</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Discover <span className="text-blue-900">InternLink</span>
              <sup className="text-sm text-blue-900">™</sup>
            </h2>

            <p className="text-gray-600 leading-relaxed">
              InternLink aims to streamline the journey for students to secure internships and attachments. 
              We also empower employers to effortlessly discover and recruit top talent. With InternLink, 
              connecting the potential of tomorrow with the innovations of today just got easier.
            </p>
          </div>

          {/* RIGHT SIDE - WHITE CIRCLES WITH DOTTED BORDER */}
          <div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* White Circle with Dotted Border */}
                  <div className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 bg-white flex items-center justify-center hover:border-blue-400 transition-all duration-300">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                      <span className="text-3xl">{feature.icon}</span>
                    </div>
                  </div>
                  <p className="text-center text-gray-700 font-medium mt-3 text-sm">
                    {feature.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;