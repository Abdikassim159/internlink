// src/components/Home/TestimonialsSection.jsx

const TestimonialsSection = () => {
  const testimonials = [
    {
      rating: 5,
      text: "The profile builder is super easy. I uploaded my CV, filled in my skills, and my profile was ready in minutes. Already got two internship offers.",
      name: "Carol Wanjiku",
      initials: "CW",
      title: "BSc Software Engineering, JKUAT"
    },
    {
      rating: 5,
      text: "We've sourced 12 interns through InternLink this year alone. The candidate quality is consistently high, and the dashboard makes shortlisting effortless.",
      name: "David Kariuki",
      initials: "DK",
      title: "HR Manager, Twiga Foods"
    },
    {
      rating: 5,
      text: "InternLink has become our go-to platform for intern recruitment. The students are motivated and come prepared. We couldn't ask for a better pipeline.",
      name: "Grace Muthoni",
      initials: "GM",
      title: "Talent Lead, Cellulant"
    },
    {
      rating: 5,
      text: "InternLink made finding internships so much easier. I landed at a tech startup in Nairobi within weeks. Completely sold!",
      name: "Amina Odhiambo",
      initials: "AO",
      title: "BSc Computer Science"
    }
  ];

  // Duplicate for seamless scrolling
  const allTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="bg-gray-50 py-20 overflow-hidden">
      <div className="text-center mb-12">
        {/* Bigger Title */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3">
          Loved by <span className="text-blue-900">thousands</span>
        </h2>
        
        {/* Subtitle with dash like image */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="text-gray-400 text-sm">—</span>
          <p className="text-gray-500 text-base">
            Based on 3,000+ reviews across students and companies
          </p>
          <span className="text-gray-400 text-sm">—</span>
        </div>
      </div>

      {/* Row 1 - Right to Left */}
      <div className="relative overflow-hidden mb-6">
        <div className="animate-scroll-right flex">
          {allTestimonials.map((testimonial, index) => (
            <div
              key={`r1-${index}`}
              className="flex-shrink-0 w-80 mx-4 bg-white rounded-lg p-5 shadow-sm border border-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                {testimonial.text}
              </p>

              {/* Avatar Circle + Name Section */}
              <div className="flex items-center gap-3">
                {/* Avatar Circle with Initials */}
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-900 text-sm font-semibold">
                    {testimonial.initials}
                  </span>
                </div>
                
                {/* Name and Title */}
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Left to Right */}
      <div className="relative overflow-hidden">
        <div className="animate-scroll-left flex">
          {[...allTestimonials].reverse().map((testimonial, index) => (
            <div
              key={`r2-${index}`}
              className="flex-shrink-0 w-80 mx-4 bg-white rounded-lg p-5 shadow-sm border border-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                {testimonial.text}
              </p>

              {/* Avatar Circle + Name Section */}
              <div className="flex items-center gap-3">
                {/* Avatar Circle with Initials */}
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-900 text-sm font-semibold">
                    {testimonial.initials}
                  </span>
                </div>
                
                {/* Name and Title */}
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollRight {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        @keyframes scrollLeft {
          0% {
            transform: translateX(-33.33%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-scroll-right {
          animation: scrollRight 35s linear infinite;
          width: fit-content;
          display: flex;
        }
        
        .animate-scroll-left {
          animation: scrollLeft 35s linear infinite;
          width: fit-content;
          display: flex;
        }
        
        .animate-scroll-right:hover,
        .animate-scroll-left:hover {
          animation-play-state: ;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;