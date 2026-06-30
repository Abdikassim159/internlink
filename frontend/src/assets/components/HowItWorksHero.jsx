// src/components/HowItWorksHero.jsx
//
// PAGE HERO for the "How It Works" page.
// Matches the homepage HeroSection typography exactly (same font sizes,
// same weight, same Playfair Display headline treatment) — just condensed,
// no search bar, no stats row, since this is an inner page.
//
// IMAGE: place your photo at /how-it-works-hero.jpeg (or .png) —
// students walking on campus. Falls back to a Pexels stock photo if missing.

export default function HowItWorksHero() {
  return (
    <section
      className="relative w-full bg-white overflow-hidden"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        // No top padding/margin — sits flush under the navbar, exactly like the homepage hero
        paddingTop: 0,
        marginTop: 0,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center" style={{ minHeight: 420 }}>

          {/* ── LEFT: Content ── */}
          <div
            className="flex-1 flex flex-col justify-center py-12 lg:py-0 relative z-10"
            style={{ maxWidth: 520 }}
          >
            {/* Eyebrow — identical pattern to homepage hero */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F5831F]" />
              <span className="text-xs font-semibold text-[#F5831F] tracking-[0.12em] uppercase">
                How It Works
              </span>
            </div>

            {/* Headline — SAME size/weight scale as homepage hero (clamp 2.4–3.4rem, weight 800) */}
            <h1
              className="mb-5 text-[#0D0D0D] leading-[1.1]"
              style={{ fontSize: "clamp(2.4rem, 4vw, 3.4rem)" }}
            >
              <span
                className="block font-extrabold"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800 }}
              >
                A Simple Process.
              </span>
              <span
                className="block font-extrabold"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800 }}
              >
                Limitless{" "}
                <span style={{ color: "#F5831F", fontStyle: "italic", fontWeight: 700 }}>
                  Opportunities.
                </span>
              </span>
            </h1>

            {/* Underline accent */}
            <div style={{ width: 56, height: 3, background: "#F5831F", borderRadius: 2, margin: "4px 0 22px" }} />

            {/* Body — same size/color as homepage hero subheading */}
            <p className="text-[14.5px] text-[#6B7280] leading-[1.7]" style={{ maxWidth: 420 }}>
              Internlink makes it easy for students and young professionals to discover opportunities, build skills, and grow their careers.
            </p>
          </div>

          {/* ── RIGHT: Image with organic curved white blend ── */}
          <div
            className="flex-1 relative w-full lg:w-auto self-stretch flex items-center"
            style={{ minHeight: 380 }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ height: 380, borderRadius: 24 }}
            >
              <img
                src="/howitworksheroimage.png"
                alt="Students walking together on campus, discussing internship opportunities"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop";
                }}
              />

              {/* Organic curved white blend — matches the soft S-curve cut from the reference image */}
              <svg
                className="hidden lg:block absolute top-0 left-0 h-full pointer-events-none"
                width="160"
                height="380"
                viewBox="0 0 160 380"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 0
                     H90
                     C40 60, 70 130, 30 190
                     C-5 250, 50 320, 90 380
                     H0
                     Z"
                  fill="white"
                />
              </svg>

              {/* Soft secondary fade for extra blend smoothness */}
              <div
                className="hidden lg:block absolute top-0 left-0 h-full pointer-events-none"
                style={{
                  width: 70,
                  background: "linear-gradient(to right, rgba(255,255,255,0.55), transparent)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
