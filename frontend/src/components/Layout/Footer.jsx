// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

// Brand colours — shared with Navbar / Hero
const BRAND      = "#F5831F";
const FOOTER_BG  = "#1C1209";
const TEXT_MUTED = "#B8A088";
const TEXT_DIM   = "#8A7560";

const PLATFORM_LINKS = [
  { label: "Opportunities", to: "/opportunities" },
  { label: "Companies",     to: "/consultancies" },
  { label: "Resources",     to: "/resources" },
  { label: "How It Works",  to: "/how-it-works" },
];

const COMPANY_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Careers",  to: "/careers" },
  { label: "Blog",     to: "/resources/blog" },
  { label: "Contact",  to: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "Help Center",    to: "/help" },
  { label: "Terms of Use",   to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "FAQs",           to: "/faqs" },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    Icon: () => (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.5 10.27h-3v-4.5c0-1.07-.02-2.45-1.49-2.45-1.5 0-1.73 1.17-1.73 2.37v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z"/>
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    Icon: () => (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path d="M23 4.5c-.85.38-1.76.63-2.72.75 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.52-3.51-1.52-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.74.13 1.09-4-.2-7.54-2.11-9.92-5.02-.41.71-.65 1.55-.65 2.44 0 1.67.85 3.14 2.14 4-.79-.02-1.53-.24-2.18-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.61-.03-.91-.08.62 1.91 2.39 3.31 4.5 3.35-1.65 1.29-3.73 2.06-5.99 2.06-.39 0-.78-.02-1.16-.07 2.14 1.37 4.67 2.17 7.4 2.17 8.88 0 13.74-7.36 13.74-13.74 0-.21 0-.42-.01-.62.94-.68 1.76-1.53 2.4-2.5z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    Icon: () => (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.51 3.55 12 3.55 12 3.55s-7.51 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.87.51 9.38.51 9.38.51s7.51 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14c.5-1.88.5-5.8.5-5.8s0-3.92-.5-5.8zM9.6 15.6V8.4l6.27 3.6-6.27 3.6z"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    Icon: () => (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z"/>
      </svg>
    ),
  },
];

function FooterColumn({ title, links }) {
  return (
    <div className="flex flex-col">
      <h4
        className="font-semibold mb-4 text-white"
        style={{ fontSize: "13.5px", letterSpacing: "0.01em" }}
      >
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link
              to={to}
              className="transition-colors"
              style={{ fontSize: "13px", color: TEXT_MUTED }}
              onMouseEnter={e => (e.currentTarget.style.color = BRAND)}
              onMouseLeave={e => (e.currentTarget.style.color = TEXT_MUTED)}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire up to your newsletter API
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail("");
  };

  return (
    <footer
      style={{
        background: FOOTER_BG,
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* ── Main footer content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12" style={{ paddingTop: 56, paddingBottom: 36 }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">

          {/* ── Logo + tagline + socials ── */}
          <div className="md:col-span-4 flex flex-col">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div
                className="relative overflow-hidden rounded-xl flex-shrink-0"
                style={{
                  width: 38, height: 38,
                  background: "#2C1A07",
                  boxShadow: "0 0 0 1.5px rgba(245,131,31,0.35)",
                }}
              >
                <img
                  src="/logo.jpeg"
                  alt="Intern Link"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML =
                      `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:18px;">🎓</div>`;
                  }}
                />
              </div>
              <span
                className="font-bold text-white text-[16px] leading-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.01em" }}
              >
                Intern <span style={{ color: BRAND }}>Link</span>
              </span>
            </Link>

            <p
              className="leading-relaxed mb-6"
              style={{ fontSize: "12.5px", color: TEXT_MUTED, maxWidth: 260 }}
            >
              Connecting talent worldwide. Building futures, one opportunity at a time.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center rounded-full transition-all"
                  style={{
                    width: 34, height: 34,
                    background: "rgba(255,255,255,0.06)",
                    color: TEXT_MUTED,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = BRAND;
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = BRAND;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = TEXT_MUTED;
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ── Platform ── */}
          <div className="md:col-span-2">
            <FooterColumn title="Platform" links={PLATFORM_LINKS} />
          </div>

          {/* ── Company ── */}
          <div className="md:col-span-2">
            <FooterColumn title="Company" links={COMPANY_LINKS} />
          </div>

          {/* ── Support ── */}
          <div className="md:col-span-2">
            <FooterColumn title="Support" links={SUPPORT_LINKS} />
          </div>

          {/* ── Newsletter ── */}
          <div className="md:col-span-2">
            <h4
              className="font-semibold mb-4 text-white"
              style={{ fontSize: "13.5px", letterSpacing: "0.01em" }}
            >
              Newsletter
            </h4>
            <p
              className="leading-relaxed mb-4"
              style={{ fontSize: "12px", color: TEXT_MUTED }}
            >
              Subscribe to get the latest opportunities and updates.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <div
                className="flex items-center overflow-hidden"
                style={{
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-white placeholder-[#8A7560]"
                  style={{ fontSize: "12px", padding: "10px 12px", minWidth: 0 }}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    width: 38, height: 38,
                    background: BRAND,
                    margin: 3,
                    borderRadius: 7,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7.5 2.5L12 7l-4.5 4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Success message */}
              {subscribed && (
                <p
                  className="absolute mt-1.5"
                  style={{ fontSize: "11px", color: "#6BCB77" }}
                >
                  ✓ Subscribed successfully!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ paddingTop: 22, paddingBottom: 22 }}
        >
          <p style={{ fontSize: "12px", color: TEXT_DIM }}>
            © {new Date().getFullYear()} Internlink. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/terms"
              style={{ fontSize: "12px", color: TEXT_DIM }}
              onMouseEnter={e => (e.currentTarget.style.color = BRAND)}
              onMouseLeave={e => (e.currentTarget.style.color = TEXT_DIM)}
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              style={{ fontSize: "12px", color: TEXT_DIM }}
              onMouseEnter={e => (e.currentTarget.style.color = BRAND)}
              onMouseLeave={e => (e.currentTarget.style.color = TEXT_DIM)}
            >
              Privacy
            </Link>
            <Link
              to="/cookies"
              style={{ fontSize: "12px", color: TEXT_DIM }}
              onMouseEnter={e => (e.currentTarget.style.color = BRAND)}
              onMouseLeave={e => (e.currentTarget.style.color = TEXT_DIM)}
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
