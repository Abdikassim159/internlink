// src/components/OurPurpose.jsx

// Google Fonts — already added from HeroSection:
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap" rel="stylesheet">

const CARDS = [
  {
    title: "Our Mission",
    body: "To connect talented individuals with meaningful opportunities that accelerate their growth.",
    // Target / crosshair icon
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <circle cx="24" cy="24" r="10" stroke="#8B5E3C" strokeWidth="2.2" />
        <circle cx="24" cy="24" r="3.5" fill="#8B5E3C" />
        <line x1="24" y1="4"  x2="24" y2="14" stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="24" y1="34" x2="24" y2="44" stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="4"  y1="24" x2="14" y2="24" stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="34" y1="24" x2="44" y2="24" stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Our Vision",
    body: "To become the most trusted platform for talent discovery and career growth worldwide.",
    // Eye icon
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <path
          d="M4 24C4 24 10 12 24 12C38 12 44 24 44 24C44 24 38 36 24 36C10 36 4 24 4 24Z"
          stroke="#8B5E3C" strokeWidth="2.2" strokeLinejoin="round"
        />
        <circle cx="24" cy="24" r="5.5" stroke="#8B5E3C" strokeWidth="2.2" />
        <circle cx="24" cy="24" r="2"   fill="#8B5E3C" />
      </svg>
    ),
  },
  {
    title: "Our Promise",
    body: "To provide a safe, reliable, and empowering environment for every career journey.",
    // Handshake icon
    Icon: () => (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
        <path
          d="M4 28l8-8 6 2 6-4h6l8 6"
          stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M4 28l5 6 5-2 10 6 14-10-8-6"
          stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M24 18l4-4 12 6"
          stroke="#8B5E3C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M13 34l4 4M19 37l4 4M25 38l3 4"
          stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function OurPurpose() {
  return (
    <section
      className="w-full bg-white"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        padding: "72px 0 80px",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* ── Section Title ── */}
        <div className="flex items-center justify-center gap-5 mb-14">
          {/* Left decorative line + arrow */}
          <div className="flex items-center gap-1.5 flex-1 justify-end" style={{ maxWidth: 160 }}>
            <div style={{ flex: 1, height: 1.5, background: "linear-gradient(to left, #8B5E3C, transparent)" }} />
            {/* Arrow head pointing left */}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 5H2M2 5L5 2M2 5L5 8" stroke="#8B5E3C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2
            className="text-center flex-shrink-0 tracking-[0.22em] font-semibold uppercase"
            style={{
              fontSize: "13px",
              color: "#8B5E3C",
              letterSpacing: "0.22em",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            OUR PURPOSE
          </h2>

          {/* Right decorative line + arrow */}
          <div className="flex items-center gap-1.5 flex-1 justify-start" style={{ maxWidth: 160 }}>
            {/* Arrow head pointing right */}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5H8M8 5L5 2M8 5L5 8" stroke="#8B5E3C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ flex: 1, height: 1.5, background: "linear-gradient(to right, #8B5E3C, transparent)" }} />
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map(({ title, body, Icon }, i) => (
            <div
              key={i}
              className="flex flex-col items-start p-8 rounded-2xl transition-all duration-300 group cursor-default"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #F0EAE0",
                boxShadow: "0 2px 16px rgba(139,94,60,0.06)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,94,60,0.14)";
                e.currentTarget.style.borderColor = "#D4A878";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 2px 16px rgba(139,94,60,0.06)";
                e.currentTarget.style.borderColor = "#F0EAE0";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Icon circle */}
              <div
                className="flex items-center justify-center mb-6 flex-shrink-0"
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  background: "linear-gradient(145deg, #FDF0E4 0%, #FAE3C8 100%)",
                  border: "1.5px solid #F0D8BE",
                }}
              >
                <Icon />
              </div>

              {/* Title */}
              <h3
                className="font-bold mb-3 text-[#1A0E05]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.15rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h3>

              {/* Body */}
              <p
                className="text-[#6B7280] leading-[1.75]"
                style={{ fontSize: "13.5px" }}
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
