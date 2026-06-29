// src/components/HowItWorks.jsx
//
// Google Fonts — already in your index.html:
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap" rel="stylesheet">

const STEPS = [
  {
    number: "01",
    title: "Create Profile",
    body: "Build your profile and showcase your skills.",
    Icon: () => (
      // Person + plus
      <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
        <circle cx="20" cy="16" r="7" stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M6 40c0-7.732 6.268-14 14-14" stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="35" y1="28" x2="35" y2="40" stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="29" y1="34" x2="41" y2="34" stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Discover Opportunities",
    body: "Find internships, jobs, and projects that fit you.",
    Icon: () => (
      // Search / magnifier
      <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
        <circle cx="21" cy="21" r="11" stroke="#8B5E3C" strokeWidth="2.2" />
        <line x1="29.5" y1="29.5" x2="42" y2="42" stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Apply Easily",
    body: "Submit applications and track in one place.",
    Icon: () => (
      // Paper plane
      <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
        <path
          d="M6 24L42 8L30 42L22 28L6 24Z"
          stroke="#8B5E3C" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"
        />
        <line x1="22" y1="28" x2="42" y2="8" stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Get Selected",
    body: "Companies review and select the right talent.",
    Icon: () => (
      // Circle check
      <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
        <circle cx="24" cy="24" r="16" stroke="#8B5E3C" strokeWidth="2.2" />
        <path d="M15 24.5l6 6 12-13" stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Grow Your Career",
    body: "Gain experience, learn, and build your future.",
    Icon: () => (
      // Bar chart with upward arrow
      <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
        <rect x="6"  y="28" width="7" height="12" rx="1.5" stroke="#8B5E3C" strokeWidth="2.2" />
        <rect x="17" y="20" width="7" height="20" rx="1.5" stroke="#8B5E3C" strokeWidth="2.2" />
        <rect x="28" y="14" width="7" height="26" rx="1.5" stroke="#8B5E3C" strokeWidth="2.2" />
        <path d="M36 8l5 5M41 8h-5v5" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// Dashed arrow connector — rendered between steps
function DashedArrow() {
  return (
    <div className="hidden lg:flex items-center justify-center flex-1" style={{ minWidth: 48, marginTop: "-28px" }}>
      <svg
        width="100%"
        height="18"
        viewBox="0 0 80 18"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Dashed line */}
        <line
          x1="0" y1="9" x2="66" y2="9"
          stroke="#C4956A"
          strokeWidth="1.8"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />
        {/* Arrow head */}
        <path
          d="M64 4L72 9L64 14"
          stroke="#C4956A"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      className="w-full bg-white"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        padding: "72px 0 84px",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* ── Section Title ── */}
        <div className="flex items-center justify-center gap-5 mb-16">
          {/* Left line + arrow */}
          <div className="flex items-center gap-1.5 flex-1 justify-end" style={{ maxWidth: 160 }}>
            <div style={{ flex: 1, height: 1.5, background: "linear-gradient(to left, #8B5E3C, transparent)" }} />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M2 5L5 2M2 5L5 8" stroke="#8B5E3C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2
            className="flex-shrink-0 text-center font-semibold uppercase tracking-[0.22em]"
            style={{ fontSize: "13px", color: "#8B5E3C", letterSpacing: "0.22em" }}
          >
            HOW INTERNLINK WORKS
          </h2>

          {/* Right line + arrow */}
          <div className="flex items-center gap-1.5 flex-1 justify-start" style={{ maxWidth: 160 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5H8M8 5L5 2M8 5L5 8" stroke="#8B5E3C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ flex: 1, height: 1.5, background: "linear-gradient(to right, #8B5E3C, transparent)" }} />
          </div>
        </div>

        {/* ── Steps row ── */}
        <div className="flex flex-col lg:flex-row items-start justify-between">
          {STEPS.map((step, i) => (
            <>
              {/* ── Single step ── */}
              <div
                key={step.number}
                className="flex flex-col items-center text-center"
                style={{ flex: "0 0 auto", width: 148 }}
              >
                {/* Circle icon */}
                <div
                  className="flex items-center justify-center mb-5"
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    background: "linear-gradient(145deg, #FDF0E4 0%, #FAE3C8 100%)",
                    border: "1.5px solid #EDD5B0",
                    flexShrink: 0,
                    transition: "transform 0.25s, box-shadow 0.25s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "scale(1.08)";
                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(139,94,60,0.18)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <step.Icon />
                </div>

                {/* Step number */}
                <span
                  className="font-bold mb-1.5"
                  style={{
                    fontSize: "13px",
                    color: "#F5831F",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.04em",
                  }}
                >
                  {step.number}
                </span>

                {/* Title */}
                <h3
                  className="font-bold mb-2 text-[#1A0E05] leading-snug"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "1rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>

                {/* Body */}
                <p
                  className="text-[#9CA3AF] leading-[1.65]"
                  style={{ fontSize: "12.5px", maxWidth: 130 }}
                >
                  {step.body}
                </p>
              </div>

              {/* Dashed arrow between steps (not after last) */}
              {i < STEPS.length - 1 && <DashedArrow key={`arrow-${i}`} />}
            </>
          ))}
        </div>

        {/* ── Mobile: vertical connector dots ── */}
        <style>{`
          @media (max-width: 1023px) {
            .hiw-step-wrap { width: 100% !important; flex-direction: row !important; text-align: left !important; align-items: flex-start !important; gap: 20px; padding: 12px 0; }
            .hiw-step-wrap .step-text { text-align: left; }
          }
        `}</style>
      </div>
    </section>
  );
}
