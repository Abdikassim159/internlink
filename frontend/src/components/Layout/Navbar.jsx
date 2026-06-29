// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LayoutDashboard, FileText, User, Bookmark, LogOut } from "lucide-react";

// Google Font — add to your index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

const NAV_LINKS = [
  { label: "Home",         to: "/" },
  { label: "Opportunities",to: "/opportunities" },
  { label: "Companies",    to: "/consultancies" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "About Us",     to: "/about" },
];

const RESOURCES_LINKS = [
  { label: "Blog & Articles",  to: "/resources/blog" },
  { label: "CV Templates",     to: "/resources/cv-templates" },
  { label: "Interview Tips",   to: "/resources/interview-tips" },
  { label: "Career Guides",    to: "/resources/career-guides" },
];

const USER_MENU = [
  { label: "Dashboard",       to: "/student/dashboard", Icon: LayoutDashboard },
  { label: "My Applications", to: "/applications",      Icon: FileText },
  { label: "My Profile",      to: "/profile",           Icon: User },
  { label: "Saved Jobs",      to: "/saved-jobs",        Icon: Bookmark },
];

// ─── Brand colours (shared with HeroSection) ──────────────────────────────
const BRAND = "#F5831F";          // orange accent
const NAV_BG = "#1C1209";         // very dark brown — from the image
const NAV_BG_SCROLL = "#1C1209";
const LINK_IDLE = "#D6C9BA";      // warm off-white
const LINK_ACTIVE = "#FFFFFF";

export default function Navbar() {
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [userMenuOpen,  setUserMenuOpen]  = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [user,          setUser]          = useState(null);

  const location  = useLocation();
  const navigate  = useNavigate();
  const resRef    = useRef(null);
  const userRef   = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Read user from localStorage whenever route changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch { setUser(null); }
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (resRef.current  && !resRef.current.contains(e.target))  setResourcesOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  const getInitials = (name = "") =>
    name.includes("@")
      ? name.slice(0, 2).toUpperCase()
      : name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const isResourcesActive = RESOURCES_LINKS.some(r => location.pathname.startsWith(r.to));

  return (
    <nav
      style={{
        background: NAV_BG,
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.35)" : "none",
        transition: "box-shadow 0.3s",
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[68px]">

          {/* ══ LOGO ══════════════════════════════════════════════ */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div
              className="relative overflow-hidden rounded-xl flex-shrink-0"
              style={{
                width: 42, height: 42,
                background: "#2C1A07",
                boxShadow: "0 0 0 1.5px rgba(245,131,31,0.35)",
              }}
            >
              <img
                src="/logo.jpeg"
                alt="Intern Link"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback: mortar board emoji
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:22px;">🎓</div>`;
                }}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className="font-bold text-white text-[17px] leading-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.01em" }}
              >
                Intern{" "}
                <span style={{ color: BRAND }}>Link</span>
              </span>
              <span
                className="text-[9.5px] font-medium tracking-[0.13em] uppercase mt-0.5"
                style={{ color: "#A08060" }}
              >
                Linking Talent, Building Futures
              </span>
            </div>
          </Link>

          {/* ══ DESKTOP NAV ═══════════════════════════════════════ */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="relative px-3.5 py-2 text-[13.5px] font-medium transition-colors rounded-md"
                style={{
                  color: isActive(to) ? LINK_ACTIVE : LINK_IDLE,
                  letterSpacing: "0.005em",
                }}
              >
                {label}
                {/* Active underline */}
                {isActive(to) && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      width: "60%", height: 2,
                      background: BRAND,
                      display: "block",
                    }}
                  />
                )}
              </Link>
            ))}

            {/* Resources dropdown */}
            <div className="relative" ref={resRef}>
              <button
                onClick={() => setResourcesOpen(v => !v)}
                className="flex items-center gap-1 px-3.5 py-2 text-[13.5px] font-medium transition-colors rounded-md"
                style={{ color: isResourcesActive ? LINK_ACTIVE : LINK_IDLE }}
              >
                Resources
                <ChevronDown
                  className="w-3.5 h-3.5 transition-transform duration-200"
                  style={{ transform: resourcesOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
                {isResourcesActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                    style={{ width: "60%", height: 2, background: BRAND }}
                  />
                )}
              </button>

              {resourcesOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 py-1.5 min-w-[188px] rounded-xl overflow-hidden"
                  style={{
                    background: "#261608",
                    border: "1px solid rgba(245,131,31,0.18)",
                    boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
                  }}
                >
                  {RESOURCES_LINKS.map(({ label, to }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setResourcesOpen(false)}
                      className="block px-4 py-2.5 text-[13px] transition-colors"
                      style={{ color: LINK_IDLE }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(245,131,31,0.12)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = LINK_IDLE; e.currentTarget.style.background = "transparent"; }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ══ AUTH / USER ═══════════════════════════════════════ */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {!user ? (
              <>
                {/* Login — ghost outline */}
                <Link
                  to="/student-login"
                  className="text-[13px] font-semibold px-5 py-2 rounded-lg transition-all"
                  style={{
                    color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.28)",
                    background: "transparent",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,131,31,0.7)"; e.currentTarget.style.color = BRAND; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; e.currentTarget.style.color = "#fff"; }}
                >
                  Login
                </Link>

                {/* Sign Up — solid orange-brown */}
                <Link
                  to="/student-register"
                  className="text-[13px] font-semibold px-5 py-2 rounded-lg transition-all text-white"
                  style={{
                    background: "#8B5E3C",
                    letterSpacing: "0.01em",
                    boxShadow: "0 2px 12px rgba(139,94,60,0.45)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = BRAND; e.currentTarget.style.boxShadow = `0 2px 16px rgba(245,131,31,0.5)`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#8B5E3C"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(139,94,60,0.45)"; }}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: BRAND, boxShadow: `0 0 0 2px rgba(245,131,31,0.3)` }}
                  >
                    {getInitials(user.full_name || user.email)}
                  </div>
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{ color: LINK_IDLE, transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-60 rounded-xl py-1 overflow-hidden"
                    style={{
                      background: "#261608",
                      border: "1px solid rgba(245,131,31,0.18)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* User info header */}
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <p className="text-white text-[13.5px] font-semibold leading-tight">
                        {user.full_name || user.email?.split("@")[0] || "User"}
                      </p>
                      <p className="text-[11.5px] mt-0.5" style={{ color: "#A08060" }}>{user.email}</p>
                      <span
                        className="inline-block mt-1.5 text-[10.5px] font-semibold px-2 py-0.5 rounded-full capitalize"
                        style={{ background: "rgba(245,131,31,0.18)", color: BRAND }}
                      >
                        {user.role || "Student"}
                      </span>
                    </div>

                    {USER_MENU.map(({ label, to, Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors"
                        style={{ color: LINK_IDLE }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(245,131,31,0.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = LINK_IDLE; e.currentTarget.style.background = "transparent"; }}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: BRAND }} />
                        {label}
                      </Link>
                    ))}

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} className="mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] transition-colors"
                        style={{ color: "#F87171" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <LogOut className="w-4 h-4 flex-shrink-0" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ══ MOBILE HAMBURGER ══════════════════════════════════ */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 focus:outline-none"
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="block h-[1.5px] rounded-full transition-all duration-300"
                style={{
                  width: i === 1 ? (mobileOpen ? 20 : 14) : 20,
                  background: mobileOpen ? BRAND : LINK_IDLE,
                  transform:
                    mobileOpen && i === 0 ? "translateY(6px) rotate(45deg)" :
                    mobileOpen && i === 2 ? "translateY(-6px) rotate(-45deg)" :
                    mobileOpen && i === 1 ? "scaleX(0)" : "none",
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* ══ MOBILE MENU ═══════════════════════════════════════════ */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: mobileOpen ? 600 : 0,
          background: "#1C1209",
          borderTop: mobileOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div className="px-6 py-5 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors"
              style={{
                color: isActive(to) ? "#fff" : LINK_IDLE,
                background: isActive(to) ? "rgba(245,131,31,0.12)" : "transparent",
              }}
            >
              {label}
              {isActive(to) && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
              )}
            </Link>
          ))}

          {/* Resources accordion on mobile */}
          <div>
            <button
              onClick={() => setResourcesOpen(v => !v)}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-[14px] font-medium"
              style={{ color: LINK_IDLE }}
            >
              Resources
              <ChevronDown
                className="w-4 h-4 transition-transform"
                style={{ transform: resourcesOpen ? "rotate(180deg)" : "none", color: BRAND }}
              />
            </button>
            {resourcesOpen && (
              <div className="pl-4 mt-0.5 flex flex-col gap-0.5">
                {RESOURCES_LINKS.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => { setMobileOpen(false); setResourcesOpen(false); }}
                    className="px-3 py-2 rounded-lg text-[13px]"
                    style={{ color: "#9A8070" }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="h-px my-2" style={{ background: "rgba(255,255,255,0.08)" }} />

          {!user ? (
            <div className="flex flex-col gap-2.5 mt-1">
              <Link
                to="/student-login"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 rounded-lg text-[14px] font-semibold text-white"
                style={{ border: "1.5px solid rgba(255,255,255,0.2)" }}
              >
                Login
              </Link>
              <Link
                to="/student-register"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 rounded-lg text-[14px] font-semibold text-white"
                style={{ background: "#8B5E3C" }}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-3 px-3 py-3 mb-1">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: BRAND }}
                >
                  {getInitials(user.full_name || user.email)}
                </div>
                <div>
                  <p className="text-white text-[13px] font-semibold">{user.full_name || user.email?.split("@")[0]}</p>
                  <p className="text-[11px]" style={{ color: "#A08060" }}>{user.email}</p>
                </div>
              </div>
              {USER_MENU.map(({ label, to, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px]"
                  style={{ color: LINK_IDLE }}
                >
                  <Icon className="w-4 h-4" style={{ color: BRAND }} />
                  {label}
                </Link>
              ))}
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] mt-1"
                style={{ color: "#F87171" }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
