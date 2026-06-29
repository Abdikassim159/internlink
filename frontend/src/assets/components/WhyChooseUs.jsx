// src/components/WhyChooseUs.jsx
//
// RIGHT SIDE IMAGE: place your illustration at /why-image.png or /why-image.jpeg
// It should be a group of diverse students (warm tones, illustrated style).
// If the file is missing, a styled placeholder is shown automatically.

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

// Floating icon badges shown over the illustration
const BADGES = [
  { top: "8%",  right: "18%", Icon: () => (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <rect x="2" y="6" width="20" height="14" rx="2" stroke="#8B5E3C" strokeWidth="1.8"/>
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#8B5E3C" strokeWidth="1.8"/>
    </svg>
  )},
  { top: "12%", right: "4%",  Icon: () => (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <path d="M3 3h18M3 8h18M3 13h10" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="18" cy="18" r="4" stroke="#F5831F" strokeWidth="1.8"/>
      <path d="M16 18l1.5 1.5L20 16" stroke="#F5831F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { top: "38%", right: "3%",  Icon: () => (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <circle cx="9"  cy="8"  r="4" stroke="#8B5E3C" strokeWidth="1.8"/>
      <circle cx="17" cy="8"  r="4" stroke="#8B5E3C" strokeWidth="1.8"/>
      <path d="M3 20c0-3 2.7-5 6-5h6c3.3 0 6 2 6 5" stroke="#F5831F" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )},
];

export default function WhyChooseUs() {
  return (
    <>
      {/* ════════════════════════════════════════════════
          SECTION 1 — WHY CHOOSE INTERNLINK
      ════════════════════════════════════════════════ */}
      <section
        className="w-full bg-white overflow-hidden"
        style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", padding: "72px 0 0" }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-stretch gap-0">

          {/* ── LEFT: Content ── */}
          <div
            className="flex-1 flex flex-col justify-center py-10 pr-0 lg:pr-14"
            style={{ maxWidth: 520 }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="font-semibold uppercase tracking-[0.18em]"
                style={{ fontSize: "11px", color: "#8B5E3C" }}
              >
                WHY CHOOSE INTERNLINK
              </span>
              <div style={{ flex: 1, maxWidth: 48, height: 1.5, background: "linear-gradient(to right, #8B5E3C, transparent)" }} />
            </div>

            {/* Headline */}
            <h2
              className="text-[#0D0D0D] mb-5 leading-[1.18]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
              }}
            >
              More Than a Platform.
              <br />
              A Partner in Your Success.
            </h2>

            {/* Body */}
            <p
              className="text-[#6B7280] leading-[1.75] mb-10"
              style={{ fontSize: "13.5px", maxWidth: 420 }}
            >
              We combine verified opportunities, smart matching, skill development resources, and community support to help you unlock your full potential.
            </p>

            {/* Feature grid — 2 columns × 3 rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {FEATURES.map(({ title, body, Icon }, i) => (
                <div key={i} className="flex items-start gap-3">
                  {/* Icon box */}
                  <div
                    className="flex items-center justify-center flex-shrink-0 rounded-lg"
                    style={{
                      width: 38, height: 38,
                      background: "linear-gradient(145deg, #FDF0E4, #FAE3C8)",
                      border: "1px solid #EDD5B0",
                    }}
                  >
                    <Icon />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-[#1A0E05] leading-snug mb-0.5"
                      style={{ fontSize: "13px" }}
                    >
                      {title}
                    </p>
                    <p className="text-[#9CA3AF] leading-snug" style={{ fontSize: "12px" }}>
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Illustration panel ── */}
          <div
            className="hidden lg:flex flex-1 relative items-end justify-center overflow-hidden rounded-3xl"
            style={{
              background: "linear-gradient(145deg, #FDF6EE 0%, #FAE8D0 50%, #F5D9B0 100%)",
              minHeight: 480,
              maxWidth: 520,
            }}
          >
            {/* World map dot pattern (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full opacity-30"
              viewBox="0 0 520 480"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Simplified dot-grid representing a world map shape */}
              {[
                // North America rough dots
                [60,80],[80,70],[100,75],[120,80],[140,85],[100,95],[80,100],[60,105],[120,100],[140,95],
                [160,90],[80,115],[100,115],[120,110],[140,110],[160,100],[180,95],[100,130],[120,125],[140,120],
                // Europe
                [240,70],[260,65],[280,70],[300,75],[260,80],[280,80],[300,80],[240,90],[260,90],[280,90],
                [300,90],[260,100],[280,100],[300,100],
                // Africa
                [260,130],[280,130],[300,130],[260,145],[280,145],[300,145],[260,160],[280,160],[300,160],
                [280,175],[260,175],[300,175],[280,190],
                // Asia
                [320,70],[340,65],[360,70],[380,75],[400,80],[420,85],[340,80],[360,80],[380,80],[400,85],
                [340,95],[360,95],[380,95],[400,95],[420,95],[360,110],[380,110],[400,110],[380,125],[400,125],
                // Australia
                [400,200],[420,195],[440,200],[400,215],[420,210],[440,215],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="2.5" fill="#8B5E3C" />
              ))}
            </svg>

            {/* Location pin dots */}
            {[[200, 110], [320, 80], [380, 130], [430, 80]].map(([x, y], i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${(x / 520) * 100}%`,
                  top: `${(y / 480) * 100}%`,
                  width: 10, height: 10,
                  borderRadius: "50% 50% 50% 0",
                  transform: "rotate(-45deg)",
                  background: i % 2 === 0 ? "#F5831F" : "#8B5E3C",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                }}
              />
            ))}

            {/* Floating icon badges */}
            {BADGES.map(({ top, right, Icon }, i) => (
              <div
                key={i}
                className="absolute flex items-center justify-center rounded-xl bg-white"
                style={{
                  top, right,
                  width: 44, height: 44,
                  boxShadow: "0 4px 16px rgba(139,94,60,0.18)",
                  border: "1px solid #F0E0CC",
                }}
              >
                <Icon />
              </div>
            ))}

            {/* Main illustration image */}
            <div
              className="relative z-10 w-full"
              style={{ maxWidth: 420, padding: "0 16px" }}
            >
              <img
                src="/why-image.png"
                alt="Diverse students using Internlink"
                className="w-full object-contain object-bottom"
                style={{ maxHeight: 400 }}
                onError={(e) => {
                  // Elegant illustrated placeholder when image is missing
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `
                    <div style="
                      width:100%; height:360px;
                      display:flex; flex-direction:column;
                      align-items:center; justify-content:flex-end;
                      gap:12px; padding-bottom:8px;
                    ">
                      <!-- 4 person silhouettes -->
                      ${[
                        { x: 60,  h: 180, color: "#8B5E3C", skin: "#C4956A" },
                        { x: 140, h: 210, color: "#2C1A07", skin: "#8B6040" },
                        { x: 220, h: 195, color: "#C4956A", skin: "#D4A878" },
                        { x: 300, h: 165, color: "#6B4226", skin: "#B07848" },
                      ].map(p => `
                        <div style="
                          position:absolute; bottom:0; left:${p.x}px;
                          display:flex; flex-direction:column; align-items:center;
                        ">
                          <div style="width:32px;height:32px;border-radius:50%;background:${p.skin};margin-bottom:4px;"></div>
                          <div style="width:28px;height:${p.h * 0.55}px;background:${p.color};border-radius:8px 8px 0 0;"></div>
                          <div style="display:flex;gap:2px;">
                            <div style="width:12px;height:${p.h * 0.32}px;background:${p.color};filter:brightness(0.8);"></div>
                            <div style="width:12px;height:${p.h * 0.32}px;background:${p.color};filter:brightness(0.8);"></div>
                          </div>
                        </div>
                      `).join('')}
                      <p style="
                        position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
                        font-size:11px; color:#8B5E3C; font-family:Inter,sans-serif;
                        text-align:center; opacity:0.7; pointer-events:none;
                      ">Add /why-image.png</p>
                    </div>
                  `;
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 2 — BOTTOM CTA STRIP
      ════════════════════════════════════════════════ */}
      <section
        className="w-full"
        style={{
          background: "#1C1209",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div
          className="max-w-6xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-8 md:gap-0"
          style={{ padding: "48px 48px" }}
        >
          {/* Globe icon */}
          <div
            className="flex items-center justify-center flex-shrink-0 rounded-2xl"
            style={{
              width: 72, height: 72,
              background: "rgba(245,131,31,0.12)",
              border: "1px solid rgba(245,131,31,0.25)",
              marginRight: 32,
            }}
          >
            <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
              <circle cx="20" cy="20" r="15" stroke="#F5831F" strokeWidth="2"/>
              <path d="M5 20h30M20 5c-5 4-7 9-7 15s2 11 7 15M20 5c5 4 7 9 7 15s-2 11-7 15" stroke="#F5831F" strokeWidth="2" strokeLinecap="round"/>
              {/* city skyline at bottom */}
              <rect x="12" y="30" width="4" height="6" rx="0.5" fill="#F5831F" opacity="0.6"/>
              <rect x="18" y="27" width="4" height="9" rx="0.5" fill="#F5831F" opacity="0.8"/>
              <rect x="24" y="29" width="4" height="7" rx="0.5" fill="#F5831F" opacity="0.6"/>
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1">
            <h3
              className="text-white leading-snug mb-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
              }}
            >
              Your future starts with
              <br />
              one opportunity.
            </h3>
            <p style={{ fontSize: "13.5px", color: "#A08060", lineHeight: 1.65 }}>
              Join thousands of students and professionals building their future with Internlink.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0 md:ml-12">
            <a
              href="/student-register"
              className="flex items-center gap-3 font-semibold text-white transition-all group"
              style={{
                background: "#8B5E3C",
                fontSize: "14px",
                padding: "14px 28px",
                borderRadius: 10,
                letterSpacing: "0.01em",
                boxShadow: "0 4px 20px rgba(139,94,60,0.4)",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#F5831F";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(245,131,31,0.45)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#8B5E3C";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(139,94,60,0.4)";
              }}
            >
              Join Internlink Today
              <span
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 28, height: 28,
                  background: "rgba(255,255,255,0.15)",
                  transition: "transform 0.2s",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
