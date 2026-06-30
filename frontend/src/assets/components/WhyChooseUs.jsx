// src/components/WhyChooseUs.jsx
//
// IMAGE: Uses /why-image.svg — the custom illustration (4 students + world map
// + floating badges). Place why-image.svg in your /public folder.

const FEATURES = [
  {
    title: "Verified Companies",
    body: "All companies are verified for quality.",
    Icon: () => (
      <svg viewBox="0 0 28 28" fill="none" width="18" height="18">
        <rect x="3" y="7" width="22" height="16" rx="2" stroke="#8B5E3C" strokeWidth="1.8"/>
        <path d="M9 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M10 14l3 3 5-5" stroke="#F5831F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Smart Matching",
    body: "Get opportunities that match your skills.",
    Icon: () => (
      <svg viewBox="0 0 28 28" fill="none" width="18" height="18">
        <circle cx="11" cy="11" r="7" stroke="#8B5E3C" strokeWidth="1.8"/>
        <path d="M16 16l6 6" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M8 11h6M11 8v6" stroke="#F5831F" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Career Resources",
    body: "Guides, tips and tools for your growth.",
    Icon: () => (
      <svg viewBox="0 0 28 28" fill="none" width="18" height="18">
        <path d="M5 6h18M5 10h18M5 14h12" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="5" stroke="#F5831F" strokeWidth="1.8"/>
        <path d="M18 20l1.5 1.5L22 18" stroke="#F5831F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Safe & Secure",
    body: "Your data and privacy are our priority.",
    Icon: () => (
      <svg viewBox="0 0 28 28" fill="none" width="18" height="18">
        <path d="M14 3L5 7v7c0 5 4 9 9 10 5-1 9-5 9-10V7L14 3z" stroke="#8B5E3C" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M10 14l3 3 5-5" stroke="#F5831F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Community Support",
    body: "Join a community that inspires you.",
    Icon: () => (
      <svg viewBox="0 0 28 28" fill="none" width="18" height="18">
        <circle cx="10" cy="10" r="4" stroke="#8B5E3C" strokeWidth="1.8"/>
        <circle cx="20" cy="10" r="4" stroke="#8B5E3C" strokeWidth="1.8"/>
        <path d="M4 22c0-3.3 2.7-6 6-6h8c3.3 0 6 2.7 6 6" stroke="#F5831F" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Global Opportunities",
    body: "Access opportunities across the world.",
    Icon: () => (
      <svg viewBox="0 0 28 28" fill="none" width="18" height="18">
        <circle cx="14" cy="14" r="10" stroke="#8B5E3C" strokeWidth="1.8"/>
        <path d="M4 14h20M14 4c-3 3-4 6-4 10s1 7 4 10M14 4c3 3 4 6 4 10s-1 7-4 10" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FDF6EE 55%, #FAEAD2 100%)",
        paddingTop: 72,
      }}
    >
      {/* ════════════════════════════════════════════════
          TOP — WHY CHOOSE INTERNLINK (image bleeds full width)
      ════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-4">

          {/* ── LEFT: Content ── */}
          <div
            className="flex-1 flex flex-col justify-center"
            style={{ maxWidth: 480, flexBasis: "42%" }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="font-bold uppercase tracking-[0.14em]"
                style={{ fontSize: "11.5px", color: "#8B5E3C" }}
              >
                WHY CHOOSE INTERNLINK?
              </span>
              <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
                <line x1="0" y1="5" x2="16" y2="5" stroke="#8B5E3C" strokeWidth="1.5"/>
                <path d="M13 1.5L17 5L13 8.5" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Headline */}
            <h2
              className="text-[#0D0D0D] mb-2 leading-[1.16]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.7rem, 2.6vw, 2.3rem)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
              }}
            >
              More Than a Platform.
            </h2>
            <h2
              className="mb-2 leading-[1.16]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.7rem, 2.6vw, 2.3rem)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: "#0D0D0D",
              }}
            >
              A Partner in Your Success.
            </h2>

            {/* Underline accent */}
            <div style={{ width: 56, height: 3, background: "#F5831F", borderRadius: 2, margin: "14px 0 18px" }} />

            {/* Body */}
            <p
              className="text-[#6B7280] leading-[1.7] mb-8"
              style={{ fontSize: "13.5px", maxWidth: 380 }}
            >
              We combine verified opportunities, smart matching, skill development resources, and community support to help you unlock your full potential.
            </p>

            {/* Feature grid — 2 columns × 3 rows */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {FEATURES.map(({ title, body, Icon }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="flex items-center justify-center flex-shrink-0 rounded-lg"
                    style={{
                      width: 34, height: 34,
                      background: "linear-gradient(145deg, #FDF0E4, #FAE3C8)",
                      border: "1px solid #EDD5B0",
                    }}
                  >
                    <Icon />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-[#1A0E05] leading-snug"
                      style={{ fontSize: "12.5px" }}
                    >
                      {title}
                    </p>
                    <p className="text-[#9CA3AF] leading-snug mt-0.5" style={{ fontSize: "11px" }}>
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Illustration — bleeds, no card border ── */}
          <div
            className="flex-1 flex items-center justify-center"
            style={{ flexBasis: "58%", minHeight: 380 }}
          >
            <img
              src="/why-image.svg"
              alt="Diverse students collaborating with laptops and tablets, connected to global opportunities through Internlink"
              className="w-full h-auto object-contain"
              style={{ maxHeight: 420 }}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          BOTTOM — CTA CARD (light, elevated, overlapping)
      ════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10" style={{ marginTop: 56, paddingBottom: 56 }}>
        <div
          className="relative overflow-hidden flex flex-col md:flex-row items-center"
          style={{
            borderRadius: 24,
            background: "linear-gradient(110deg, #F3E2C8 0%, #F6E9D4 45%, #FBF2E4 100%)",
            boxShadow: "0 20px 50px rgba(139,94,60,0.16)",
            minHeight: 168,
            padding: "0 48px",
          }}
        >
          {/* City skyline silhouette — bottom */}
          <svg
            className="absolute bottom-0 left-0 w-full pointer-events-none"
            height="64"
            viewBox="0 0 1200 64"
            preserveAspectRatio="none"
            style={{ opacity: 0.5 }}
          >
            <rect x="0"   y="30" width="40" height="34" fill="#D8B888"/>
            <rect x="44"  y="18" width="30" height="46" fill="#CDA878"/>
            <rect x="78"  y="36" width="26" height="28" fill="#D8B888"/>
            <rect x="108" y="24" width="34" height="40" fill="#CDA878"/>
            <rect x="146" y="40" width="22" height="24" fill="#D8B888"/>
            <rect x="172" y="12" width="28" height="52" fill="#C29C6C"/>
            <rect x="204" y="32" width="30" height="32" fill="#D8B888"/>
            <rect x="900" y="34" width="28" height="30" fill="#D8B888"/>
            <rect x="932" y="16" width="32" height="48" fill="#CDA878"/>
            <rect x="968" y="30" width="24" height="34" fill="#D8B888"/>
            <rect x="996" y="20" width="30" height="44" fill="#C29C6C"/>
            <rect x="1030" y="36" width="26" height="28" fill="#D8B888"/>
            <rect x="1060" y="26" width="30" height="38" fill="#CDA878"/>
            <rect x="1094" y="38" width="22" height="26" fill="#D8B888"/>
          </svg>

          {/* Globe statue graphic */}
          <div className="hidden md:flex items-end justify-center flex-shrink-0 relative z-10" style={{ width: 130, height: 140 }}>
            <svg viewBox="0 0 130 150" width="130" height="150">
              {/* Pedestal */}
              <rect x="38" y="118" width="54" height="14" rx="2" fill="#8B7355"/>
              <rect x="44" y="104" width="42" height="16" rx="2" fill="#A08A68"/>
              <rect x="50" y="86" width="30" height="20" rx="2" fill="#8B7355"/>
              {/* Globe sphere */}
              <circle cx="65" cy="56" r="34" fill="#B89868" opacity="0.95"/>
              <ellipse cx="65" cy="56" rx="34" ry="34" fill="none" stroke="#8B7355" strokeWidth="1.5"/>
              {/* Latitude lines */}
              <ellipse cx="65" cy="56" rx="34" ry="12" fill="none" stroke="#8B7355" strokeWidth="1" opacity="0.6"/>
              <ellipse cx="65" cy="40" rx="28" ry="8" fill="none" stroke="#8B7355" strokeWidth="0.8" opacity="0.5"/>
              <ellipse cx="65" cy="72" rx="28" ry="8" fill="none" stroke="#8B7355" strokeWidth="0.8" opacity="0.5"/>
              {/* Longitude lines */}
              <ellipse cx="65" cy="56" rx="12" ry="34" fill="none" stroke="#8B7355" strokeWidth="1" opacity="0.6"/>
              <ellipse cx="65" cy="56" rx="22" ry="34" fill="none" stroke="#8B7355" strokeWidth="0.8" opacity="0.4"/>
              <line x1="31" y1="56" x2="99" y2="56" stroke="#8B7355" strokeWidth="1" opacity="0.6"/>
              {/* Stand */}
              <line x1="65" y1="90" x2="65" y2="86" stroke="#8B7355" strokeWidth="3"/>
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 py-8 md:py-0 md:pl-10 relative z-10 text-center md:text-left">
            <h3
              className="text-[#1A0E05] leading-snug mb-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.3rem, 2.3vw, 1.85rem)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
              }}
            >
              Your future starts with
              <br />
              one opportunity.
            </h3>
            <p style={{ fontSize: "13px", color: "#7A6A52", lineHeight: 1.6, maxWidth: 360 }}>
              Join thousands of students and professionals building their future with Internlink.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0 py-8 md:py-0 relative z-10">
            <a
              href="/student-register"
              className="flex items-center gap-3 font-semibold text-white transition-all"
              style={{
                background: "#3D2A18",
                fontSize: "14px",
                padding: "15px 30px",
                borderRadius: 12,
                letterSpacing: "0.01em",
                boxShadow: "0 8px 24px rgba(61,42,24,0.3)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#F5831F";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(245,131,31,0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#3D2A18";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(61,42,24,0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Join Internlink Today
              <span
                className="flex items-center justify-center rounded-full"
                style={{ width: 26, height: 26, background: "rgba(255,255,255,0.18)" }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
