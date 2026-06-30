// src/components/HowInternlinkWorks.jsx
//
// Detailed "How Internlink Works" section — vertical timeline with
// numbered icon nodes on the left connected by a dashed line, and a
// supporting photo beside each step on the right.
//
// IMAGES: place your photos in /public as:
//   /process-1.jpg  (profile creation — tablet with form)
//   /process-2.jpg  (discover — phone with job listings)
//   /process-3.jpg  (apply — phone with success checkmark)
//   /process-4.jpg  (get selected — interview conversation)
//   /process-5.jpg  (grow — person working confidently)
// Each falls back to a styled Pexels photo if missing.

const STEPS = [
  {
    number: "01",
    title: "Create Your Profile",
    body: "Sign up and build your profile in minutes. Highlight your skills, education, interests, and career goals.",
    image: "/profileimage.png",
    fallback: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
    Icon: () => (
      <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
        <circle cx="14" cy="10" r="4.5" stroke="#8B5E3C" strokeWidth="2"/>
        <path d="M5 23c0-5 4-8.5 9-8.5s9 3.5 9 8.5" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: "02",
    title: "Discover Opportunities",
    body: "Browse internships, part-time jobs, and projects that match your skills and interests. Use filters to find the perfect fit.",
    image: "/opportunities.png",
    fallback: "https://images.pexels.com/photos/4549414/pexels-photo-4549414.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
    Icon: () => (
      <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
        <circle cx="12" cy="12" r="7.5" stroke="#8B5E3C" strokeWidth="2"/>
        <line x1="22" y1="22" x2="17.5" y2="17.5" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: "03",
    title: "Apply Easily",
    body: "Apply to opportunities with a single click. Track your applications and get notified about updates.",
    image: "/apply.png",
    fallback: "https://images.pexels.com/photos/3801428/pexels-photo-3801428.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
    Icon: () => (
      <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
        <path d="M3 14L25 4L17 25L13 16L3 14Z" stroke="#8B5E3C" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        <line x1="13" y1="16" x2="25" y2="4" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: "04",
    title: "Get Selected",
    body: "Companies review your application. If selected, you'll be invited for interviews and next steps.",
    image: "/selected.png",
    fallback: "https://images.pexels.com/photos/5439381/pexels-photo-5439381.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
    Icon: () => (
      <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
        <circle cx="14" cy="14" r="9.5" stroke="#8B5E3C" strokeWidth="2"/>
        <path d="M9.5 14.5l3 3 6.5-7" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: "05",
    title: "Learn, Grow & Succeed",
    body: "Gain real-world experience, build your skills, and grow your network. Your future starts with one opportunity.",
    image: "/learn.png",
    fallback: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
    Icon: () => (
      <svg viewBox="0 0 28 28" fill="none" width="20" height="20">
        <rect x="4"  y="17" width="5" height="7" rx="1.2" stroke="#8B5E3C" strokeWidth="2"/>
        <rect x="11.5" y="11" width="5" height="13" rx="1.2" stroke="#8B5E3C" strokeWidth="2"/>
        <rect x="19" y="5" width="5" height="19" rx="1.2" stroke="#8B5E3C" strokeWidth="2"/>
      </svg>
    ),
  },
];

export default function HowInternlinkWorks() {
  return (
    <section
      className="w-full bg-white"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", padding: "80px 0" }}
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12">

        {/* ── Section Header ── */}
        <div className="text-center mb-16">
          <span
            className="inline-block font-bold uppercase tracking-[0.18em] mb-3"
            style={{ fontSize: "11.5px", color: "#F5831F" }}
          >
            THE PROCESS
          </span>
          <h2
            className="text-[#0D0D0D] mb-3"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
            }}
          >
            How Internlink Works
          </h2>
          <p className="text-[#9CA3AF] mx-auto" style={{ fontSize: "13.5px", maxWidth: 460 }}>
            From creating your profile to growing your career — we're with you every step of the way.
          </p>
        </div>

        {/* ── Vertical Timeline ── */}
        <div className="relative">
          {/* Dashed connector line running through all icon nodes */}
          <div
            className="hidden md:block absolute"
            style={{
              left: 27,
              top: 28,
              bottom: 28,
              width: 0,
              borderLeft: "2px dashed #E8D0AC",
            }}
          />

          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="relative flex flex-col md:flex-row items-start gap-6 md:gap-10"
              style={{ marginBottom: i < STEPS.length - 1 ? 56 : 0 }}
            >
              {/* ── Icon node ── */}
              <div className="hidden md:flex flex-shrink-0 relative z-10" style={{ width: 56 }}>
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 56, height: 56,
                    background: "linear-gradient(145deg, #FDF0E4 0%, #FAE3C8 100%)",
                    border: "1.5px solid #EDD5B0",
                    boxShadow: "0 4px 14px rgba(139,94,60,0.10)",
                  }}
                >
                  <step.Icon />
                </div>
              </div>

              {/* ── Text content ── */}
              <div className="flex-1 flex flex-col" style={{ maxWidth: 320, paddingTop: 4 }}>
                {/* Mobile icon + number row */}
                <div className="flex md:hidden items-center gap-3 mb-2">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      width: 44, height: 44,
                      background: "linear-gradient(145deg, #FDF0E4 0%, #FAE3C8 100%)",
                      border: "1.5px solid #EDD5B0",
                    }}
                  >
                    <step.Icon />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#F5831F" }}>
                    {step.number}
                  </span>
                </div>

                <span
                  className="hidden md:inline-block font-bold mb-1.5"
                  style={{ fontSize: "12px", color: "#F5831F", letterSpacing: "0.04em" }}
                >
                  {step.number}
                </span>

                <h3
                  className="font-bold text-[#1A0E05] mb-2 leading-snug"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "1.2rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>
                <p className="text-[#6B7280] leading-[1.7]" style={{ fontSize: "13px" }}>
                  {step.body}
                </p>
              </div>

              {/* ── Supporting photo ── */}
              <div
                className="flex-shrink-0 w-full md:w-auto overflow-hidden"
                style={{
                  borderRadius: 14,
                  width: 280,
                  height: 150,
                  boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-500"
                  style={{ display: "block" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = step.fallback;
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
