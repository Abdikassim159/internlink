import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, ShieldCheck, BadgeCheck, Lock as LockIcon } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

// Brand palette — shared with Navbar / Hero / Footer / StudentRegister
const BRAND     = '#F5831F';
const DARK_BG   = '#1C1209';
const TEXT_DIM  = '#A08060';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔑 Attempting login for:', email);

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      console.log('✅ Login response:', response.data);

      if (response.data.user.role === 'admin') {
        setError('This is a student login page. Please use admin login.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      navigate('/student/dashboard');
    } catch (error) {
      console.error('❌ Login error:', error);

      if (error.response?.data?.requires_verification) {
        setError('Please verify your email before logging in.');
      } else {
        setError(error.response?.data?.error || 'Login failed. Please try again.');
      }
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
          LEFT — Branding panel (dark, matches Navbar/Footer)
      ══════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center items-center text-center p-12"
        style={{ background: `linear-gradient(160deg, ${DARK_BG} 0%, #2A1C0F 100%)` }}
      >
        {/* Decorative warm glows */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: -80, right: -60, width: 340, height: 340, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,131,31,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -100, left: -60, width: 360, height: 360, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,162,74,0.14) 0%, transparent 70%)',
          }}
        />
        {/* Subtle dot-grid texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 90 }).map((_, i) => (
            <circle
              key={i}
              cx={(i % 10) * 56 + 20}
              cy={Math.floor(i / 10) * 56 + 20}
              r="1.6"
              fill="#F5831F"
            />
          ))}
        </svg>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 mb-10">
          <div
            className="flex items-center justify-center rounded-2xl flex-shrink-0"
            style={{
              width: 52, height: 52,
              background: '#2C1A07',
              boxShadow: '0 0 0 1.5px rgba(245,131,31,0.35)',
            }}
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
              Intern <span style={{ color: BRAND }}>Link</span>
            </p>
            <p className="text-[11px] mt-1 tracking-[0.12em] uppercase" style={{ color: TEXT_DIM }}>
              Student Portal
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className="relative z-10 mb-9">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 190, height: 190,
              background: 'linear-gradient(145deg, rgba(245,131,31,0.12), rgba(212,162,74,0.08))',
              border: '1px solid rgba(245,131,31,0.18)',
            }}
          >
            {/* Graduation cap — "welcome back" mark */}
            <svg viewBox="0 0 64 64" width="86" height="86" fill="none">
              <path d="M32 14L56 23L32 32L8 23L32 14Z" fill={BRAND}/>
              <path
                d="M18 27.5V37c0 4 6 7 14 7s14-3 14-7v-9.5"
                stroke={BRAND} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              />
              <path d="M56 23v12" stroke="#D4A24A" strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx="56" cy="38" r="2.4" fill="#D4A24A"/>
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
            Welcome Back, Student
          </h2>
          <p style={{ fontSize: '14px', color: TEXT_DIM, lineHeight: 1.7 }}>
            Find your perfect internship and attachment opportunities. Start your career journey today.
          </p>
        </div>

        {/* Trust strip */}
        <div className="relative z-10 flex items-center gap-7 mt-10">
          {[
            { value: '500+',  label: 'Active Jobs' },
            { value: '200+',  label: 'Companies' },
            { value: '1000+', label: 'Students' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p
                className="font-bold text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.15rem' }}
              >
                {s.value}
              </p>
              <p style={{ fontSize: '10.5px', color: TEXT_DIM, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT — Login form
      ══════════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="max-w-md w-full">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width: 40, height: 40, background: DARK_BG, boxShadow: '0 0 0 1.5px rgba(245,131,31,0.35)' }}
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
              Intern <span style={{ color: BRAND }}>Link</span>
            </p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
              <span
                className="text-xs font-semibold tracking-[0.14em] uppercase"
                style={{ color: BRAND }}
              >
                Welcome Back
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
              Sign In to Your Account
            </h2>
            <p className="text-[#6B7280]" style={{ fontSize: '13.5px' }}>
              Continue your journey to the perfect opportunity.
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
                  placeholder="your@email.com"
                  onFocus={e => { e.target.style.borderColor = BRAND; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(245,131,31,0.10)'; }}
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
                  onFocus={e => { e.target.style.borderColor = BRAND; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(245,131,31,0.10)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAF9'; e.target.style.boxShadow = 'none'; }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#9CA3AF' }}
                  onMouseEnter={e => (e.currentTarget.style.color = BRAND)}
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
                  style={{ width: 15, height: 15, accentColor: BRAND }}
                />
                <span className="text-[#6B7280]" style={{ fontSize: '12.5px' }}>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="font-medium transition-colors"
                style={{ fontSize: '12.5px', color: BRAND }}
                onMouseEnter={e => (e.currentTarget.style.color = '#3D2A18')}
                onMouseLeave={e => (e.currentTarget.style.color = BRAND)}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 font-semibold text-white transition-all"
              style={{
                background: loading ? '#C49050' : '#3D2A18',
                fontSize: '14px',
                padding: '13.5px 24px',
                borderRadius: 12,
                boxShadow: '0 6px 18px rgba(61,42,24,0.28)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = BRAND; e.currentTarget.style.boxShadow = '0 6px 22px rgba(245,131,31,0.38)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#3D2A18'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(61,42,24,0.28)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" style={{ width: 18, height: 18 }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span
                    className="flex items-center justify-center rounded-full"
                    style={{ width: 22, height: 22, background: 'rgba(255,255,255,0.18)' }}
                  >
                    <ArrowRight style={{ width: 12, height: 12 }} />
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-7 text-center">
            <p className="text-[#6B7280]" style={{ fontSize: '13px' }}>
              Don't have an account?{' '}
              <Link
                to="/student-register"
                className="font-semibold transition-colors"
                style={{ color: BRAND }}
                onMouseEnter={e => (e.currentTarget.style.color = '#3D2A18')}
                onMouseLeave={e => (e.currentTarget.style.color = BRAND)}
              >
                Create one now
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative mt-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid #E5E7EB' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-[#9CA3AF]" style={{ fontSize: '12px' }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all"
              style={{ border: '1.5px solid #E5E7EB' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FAFAF9'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span style={{ fontSize: '12.5px', color: '#374151' }}>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all"
              style={{ border: '1.5px solid #E5E7EB' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FAFAF9'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span style={{ fontSize: '12.5px', color: '#374151' }}>Facebook</span>
            </button>
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

export default StudentLogin;
