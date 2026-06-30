// src/components/BuiltForGrowth.jsx
//
// "Built For Your Growth" — dark feature strip with 5 columns.
// Designed with NO vertical margin so it sits flush against the
// section above it (e.g. HowInternlinkWorks) — control spacing from
// the parent page if you want a gap, not from this component.

const FEATURES = [
  {
    title: "Trusted & Verified",
    body: "All companies and opportunities are thoroughly verified for quality and authenticity.",
    Icon: () => (
      <svg viewBox="0 0 40 40" fill="none" width="30" height="30">
        <path d="M20 4 L34 9 V19 C34 28 28 34.5 20 37 C12 34.5 6 28 6 19 V9 Z" stroke="#D4A24A" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M14 20l4 4 8-9" stroke="#D4A24A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Resource Access",
    body: "Access guides, learning materials, and tools to upgrade your skills and stay ahead.",
    Icon: () => (
      <svg viewBox="0 0 40 40" fill="none" width="30" height="30">
        <path d="M20 11c-3-2.5-7-3.5-11-3v22c4-0.5 8 0.5 11 3 3-2.5 7-3.5 11-3V8c-4-0.5-8 0.5-11 3Z" stroke="#D4A24A" strokeWidth="1.6" strokeLinejoin="round"/>
        <line x1="20" y1="11" x2="20" y2="33" stroke="#D4A24A" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    title: "Community Support",
    body: "Join a community of learners and professionals who support and inspire your journey.",
    Icon: () => (
      <svg viewBox="0 0 40 40" fill="none" width="30" height="30">
        <ellipse cx="16" cy="17" rx="10" ry="8" stroke="#D4A24A" strokeWidth="1.6"/>
        <path d="M10 24l-2 5 6-3" stroke="#D4A24A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="28" cy="13" r="6" stroke="#D4A24A" strokeWidth="1.6"/>
        <circle cx="13" cy="16" r="1.4" fill="#D4A24A"/>
        <circle cx="17" cy="16" r="1.4" fill="#D4A24A"/>
        <circle cx="21" cy="16" r="1.4" fill="#D4A24A"/>
      </svg>
    ),
  },
  {
    title: "Career Guidance",
    body: "Get expert tips, career advice, and mentorship to help you make smart career moves.",
    Icon: () => (
      <svg viewBox="0 0 40 40" fill="none" width="30" height="30">
        <circle cx="20" cy="14" r="9" stroke="#D4A24A" strokeWidth="1.6"/>
        <path d="M20 9.5l2 4 4.5 0.6-3.3 3.1 0.8 4.4L20 19.5l-4 2.1 0.8-4.4-3.3-3.1L18 13.5z" stroke="#D4A24A" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M14 22l-3 13 9-4 9 4-3-13" stroke="#D4A24A" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Safe & Secure",
    body: "Your data and privacy are protected with industry-standard security.",
    Icon: () => (
      <svg viewBox="0 0 40 40" fill="none" width="30" height="30">
        <rect x="9" y="18" width="22" height="15" rx="3" stroke="#D4A24A" strokeWidth="1.6"/>
        <path d="M14 18v-4a6 6 0 0 1 12 0v4" stroke="#D4A24A" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="20" cy="25" r="2.2" fill="#D4A24A"/>
        <line x1="20" y1="27" x2="20" y2="29.5" stroke="#D4A24A" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function BuiltForGrowth() {
  return (
    <section
      className="w-full"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        // No vertical margin/padding around the section itself —
        // control spacing from the page layout if a gap is desired.
        padding: "40px 24px",
      }}
    >
      <div
        className="max-w-7xl mx-auto relative overflow-hidden"
        style={{
          borderRadius: 28,
          background: "linear-gradient(160deg, #241A10 0%, #1C140C 100%)",
          padding: "52px 48px 48px",
        }}
      >
        {/* Subtle decorative glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: -120, left: "50%", transform: "translateX(-50%)",
            width: 500, height: 300,
            background: "radial-gradient(ellipse, rgba(212,162,74,0.10) 0%, transparent 70%)",
          }}
        />

        {/* ── Header ── */}
        <div className="text-center mb-12 relative z-10">
          <span
            className="inline-block font-bold uppercase tracking-[0.18em] mb-3"
            style={{ fontSize: "11.5px", color: "#D4A24A" }}
          >
            BUILT FOR YOUR GROWTH
          </span>
          <h2
            className="text-white"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.6rem, 2.8vw, 2.1rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            More Than Just a Platform
          </h2>
        </div>

        {/* ── Feature columns ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 relative z-10">
          {FEATURES.map(({ title, body, Icon }, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center px-5 py-4 lg:py-0"
              style={{
                borderRight:
                  i < FEATURES.length - 1 ? "1px solid rgba(255,255,255,0.10)" : "none",
              }}
            >
              {/* Icon */}
              <div className="mb-4 flex items-center justify-center" style={{ height: 36 }}>
                <Icon />
              </div>

              {/* Title */}
              <h3
                className="font-semibold text-white mb-2"
                style={{ fontSize: "13.5px", letterSpacing: "0.01em" }}
              >
                {title}
              </h3>

              {/* Body */}
              <p
                className="leading-[1.65]"
                style={{ fontSize: "11.5px", color: "#A89880", maxWidth: 168 }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
