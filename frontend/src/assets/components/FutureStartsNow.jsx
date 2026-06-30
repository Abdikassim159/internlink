// src/components/FutureStartsNow.jsx
//
// Final CTA strip — "Your Future Starts Now"
// Uses the same graduation-cap logo mark as the Navbar/Footer for brand consistency.

import { Link } from "react-router-dom";

export default function FutureStartsNow() {
  return (
    <section
      className="w-full"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", padding: "20px 24px 32px" }}
    >
      <div
        className="max-w-7xl mx-auto relative overflow-hidden flex flex-col sm:flex-row items-center"
        style={{
          borderRadius: 20,
          background: "linear-gradient(110deg, #F0D9B8 0%, #F3E2C8 40%, #FAEFDD 100%)",
          padding: "28px 36px",
          gap: 24,
        }}
      >
        {/* ── Logo badge ── */}
        <div
          className="flex items-center justify-center flex-shrink-0 rounded-full"
          style={{
            width: 64, height: 64,
            background: "#1C1209",
            boxShadow: "0 6px 18px rgba(28,18,9,0.25)",
          }}
        >
          {/* Graduation cap icon — matches navbar/footer logo mark */}
          <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
            <path
              d="M20 9L36 16L20 23L4 16L20 9Z"
              fill="#D4A24A"
            />
            <path
              d="M11 19.5V27c0 2.5 4 4.5 9 4.5s9-2 9-4.5v-7.5"
              stroke="#D4A24A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M36 16v8"
              stroke="#D4A24A"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="36" cy="26" r="1.6" fill="#D4A24A"/>
          </svg>
        </div>

        {/* ── Text ── */}
        <div className="flex-1 text-center sm:text-left">
          <h3
            className="text-[#1A0E05] leading-snug mb-1"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.15rem, 2vw, 1.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
            }}
          >
            Your Future Starts Now
          </h3>
          <p style={{ fontSize: "12.5px", color: "#7A6A52", lineHeight: 1.55 }}>
            Join thousands of students and professionals who are building their success with Intern Link.
          </p>
        </div>

        {/* ── CTA Button ── */}
        <div className="flex-shrink-0">
          <Link
            to="/student-register"
            className="flex items-center gap-2.5 font-semibold text-white transition-all"
            style={{
              background: "#3D2A18",
              fontSize: "13.5px",
              padding: "13px 24px",
              borderRadius: 10,
              letterSpacing: "0.01em",
              boxShadow: "0 6px 18px rgba(61,42,24,0.28)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#F5831F";
              e.currentTarget.style.boxShadow = "0 6px 22px rgba(245,131,31,0.38)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#3D2A18";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(61,42,24,0.28)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Get Started Today
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: 22, height: 22, background: "rgba(255,255,255,0.18)" }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
