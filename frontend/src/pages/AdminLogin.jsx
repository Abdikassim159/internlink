import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, ShieldCheck, BadgeCheck, Lock as LockIcon, ShieldAlert } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

// Brand palette — shared with Navbar / Hero / Footer / StudentLogin / StudentRegister
const BRAND     = '#F5831F';
const DARK_BG   = '#1C1209';
const TEXT_DIM  = '#A08060';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      console.log('Login response:', response.data);

      // Check if user is admin
      if (response.data.user.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      console.log('Admin logged in:', response.data.user);
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
    >
      {/* ══════════════════════════════════════════════
          LEFT — Branding panel (darker, more restrained
          than student pages, to signal elevated/admin access)
      ══════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center items-center text-center p-12"
        style={{ background: `linear-gradient(160deg, #100A05 0%, ${DARK_BG} 100%)` }}
      >
        {/* Decorative glows — cooler/dimmer than student pages for an "admin" tone */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: -80, left: -60, width: 320, height: 320, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,162,74,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -100, right: -60, width: 360, height: 360, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,131,31,0.10) 0%, transparent 70%)',
          }}
        />
        {/* Subtle dot-grid texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 90 }).map((_, i) => (
            <circle key={i} cx={(i % 10) * 56 + 20} cy={Math.floor(i / 10) * 56 + 20} r="1.6" fill="#D4A24A" />
          ))}
        </svg>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 mb-10">
          <div
            className="flex items-center justify-center rounded-2xl flex-shrink-0"
            style={{ width: 52, height: 52, background: '#2C1A07', boxShadow: '0 0 0 1.5px rgba(212,162,74,0.4)' }}
          >
            <img
              src="/logo.jpeg"
              alt="Intern Link"
              className="w-full h-full object-contain rounded-2xl"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML =
                  `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:26px;">🎓</div>`;
              }}
            />
          </div>
          <div className="text-left">
            <p
              className="font-bold text-white text-2xl leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Intern <span style={{ color: '#D4A24A' }}>Link</span>
            </p>
            <p className="text-[11px] mt-1 tracking-[0.12em] uppercase" style={{ color: TEXT_DIM }}>
              Admin Portal
            </p>
          </div>
        </div>

        {/* Illustration — shield mark for admin/security tone */}
        <div className="relative z-10 mb-9">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 190, height: 190,
              background: 'linear-gradient(145deg, rgba(212,162,74,0.10), rgba(245,131,31,0.06))',
              border: '1px solid rgba(212,162,74,0.2)',
            }}
          >
            <svg viewBox="0 0 64 64" width="84" height="84" fill="none">
              <path
                d="M32 8L52 15V29C52 41 43.5 50 32 56C20.5 50 12 41 12 29V15L32 8Z"
                stroke="#D4A24A" strokeWidth="2.2" strokeLinejoin="round"
              />
              <path d="M23 31l6 6 13-14" stroke="#D4A24A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 max-w-sm">
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.1rem',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            Welcome Back, Admin
          </h2>
          <p style={{ fontSize: '14px', color: TEXT_DIM, lineHeight: 1.7 }}>
            Manage your platform, review applications, and oversee all opportunities from one central dashboard.
          </p>
        </div>

        {/* Secure access footer note */}
        <div className="relative z-10 flex items-center gap-2 mt-12" style={{ color: TEXT_DIM }}>
          <ShieldCheck style={{ width: 14, height: 14 }} />
          <span style={{ fontSize: '11.5px', letterSpacing: '0.02em' }}>
            Secure Admin Access · Internlink {new Date().getFullYear()}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT — Admin login form
      ══════════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="max-w-md w-full">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width: 40, height: 40, background: DARK_BG, boxShadow: '0 0 0 1.5px rgba(212,162,74,0.4)' }}
            >
              <img
                src="/logo.jpeg"
                alt="Intern Link"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML =
                    `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:18px;">🎓</div>`;
                }}
              />
            </div>
            <p className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Intern <span style={{ color: '#D4A24A' }}>Link</span>
            </p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert style={{ width: 14, height: 14, color: '#D4A24A' }} />
              <span
                className="text-xs font-semibold tracking-[0.14em] uppercase"
                style={{ color: '#D4A24A' }}
              >
                Restricted Access
              </span>
            </div>
            <h2
              className="text-[#0D0D0D] mb-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.6rem, 2.6vw, 2rem)',
                fontWeight: 800,
                letterSpacing: '-0.01em',
              }}
            >
              Admin Login
            </h2>
            <p className="text-[#6B7280]" style={{ fontSize: '13.5px' }}>
              Access the admin dashboard to manage Internlink.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div
              className="flex items-start gap-3 p-3.5 mb-6 rounded-xl text-sm"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}
            >
              <AlertCircle style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: '13px' }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block font-medium text-[#374151] mb-1.5" style={{ fontSize: '13px' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ width: 17, height: 17, color: '#9CA3AF' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                  style={{ fontSize: '13.5px', border: '1.5px solid #E5E7EB', background: '#FAFAF9' }}
                  placeholder="admin@internlink.com"
                  onFocus={e => { e.target.style.borderColor = '#D4A24A'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(212,162,74,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAF9'; e.target.style.boxShadow = 'none'; }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium text-[#374151] mb-1.5" style={{ fontSize: '13px' }}>
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ width: 17, height: 17, color: '#9CA3AF' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl outline-none transition-all"
                  style={{ fontSize: '13.5px', border: '1.5px solid #E5E7EB', background: '#FAFAF9' }}
                  placeholder="Enter your password"
                  onFocus={e => { e.target.style.borderColor = '#D4A24A'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(212,162,74,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAF9'; e.target.style.boxShadow = 'none'; }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#9CA3AF' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#D4A24A')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
                >
                  {showPassword ? <EyeOff style={{ width: 17, height: 17 }} /> : <Eye style={{ width: 17, height: 17 }} />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="cursor-pointer"
                  style={{ width: 15, height: 15, accentColor: '#D4A24A' }}
                />
                <span className="text-[#6B7280]" style={{ fontSize: '12.5px' }}>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="font-medium transition-colors"
                style={{ fontSize: '12.5px', color: '#D4A24A' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#3D2A18')}
                onMouseLeave={e => (e.currentTarget.style.color = '#D4A24A')}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit — darker, more "secure action" tone than student CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 font-semibold text-white transition-all"
              style={{
                background: loading ? '#5A4530' : '#1C1209',
                fontSize: '14px',
                padding: '13.5px 24px',
                borderRadius: 12,
                boxShadow: '0 6px 18px rgba(28,18,9,0.3)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#D4A24A'; e.currentTarget.style.color = '#1C1209'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(212,162,74,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#1C1209'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(28,18,9,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" style={{ width: 18, height: 18 }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In as Admin
                  <span
                    className="flex items-center justify-center rounded-full"
                    style={{ width: 22, height: 22, background: 'rgba(255,255,255,0.15)' }}
                  >
                    <ArrowRight style={{ width: 12, height: 12 }} />
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Return to student login */}
          <div className="mt-7 text-center">
            <p className="text-[#6B7280]" style={{ fontSize: '13px' }}>
              Return to{' '}
              <Link
                to="/student-login"
                className="font-semibold transition-colors"
                style={{ color: '#D4A24A' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#3D2A18')}
                onMouseLeave={e => (e.currentTarget.style.color = '#D4A24A')}
              >
                Student Login
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-5">
            <span className="flex items-center gap-1.5" style={{ fontSize: '11px', color: '#9CA3AF' }}>
              <LockIcon style={{ width: 13, height: 13 }} /> 256-bit SSL
            </span>
            <span className="flex items-center gap-1.5" style={{ fontSize: '11px', color: '#9CA3AF' }}>
              <ShieldCheck style={{ width: 13, height: 13 }} /> Secure
            </span>
            <span className="flex items-center gap-1.5" style={{ fontSize: '11px', color: '#9CA3AF' }}>
              <BadgeCheck style={{ width: 13, height: 13 }} /> Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
