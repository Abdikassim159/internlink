import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

// Brand palette — shared with Navbar / Hero / Footer
const BRAND     = '#F5831F';
const DARK_BG   = '#1C1209';
const TEXT_DIM  = '#A08060';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.fullName.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setSuccess(`Account created successfully! We've sent a verification email to ${formData.email}. Please check your inbox (and spam folder).`);

      setTimeout(() => {
        navigate('/student-login');
      }, 5000);
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
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
            top: -80, left: -60, width: 320, height: 320, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,131,31,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -100, right: -60, width: 360, height: 360, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,162,74,0.14) 0%, transparent 70%)',
          }}
        />
        {/* Subtle dot-grid world map texture */}
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
        <div className="relative z-10 flex items-center gap-3 mb-12">
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
        <div className="relative z-10 mb-10">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 200, height: 200,
              background: 'linear-gradient(145deg, rgba(245,131,31,0.12), rgba(212,162,74,0.08))',
              border: '1px solid rgba(245,131,31,0.18)',
            }}
          >
            <svg viewBox="0 0 64 64" width="92" height="92" fill="none">
              <circle cx="32" cy="22" r="11" stroke={BRAND} strokeWidth="2"/>
              <path d="M14 54c0-10 8-17 18-17s18 7 18 17" stroke={BRAND} strokeWidth="2" strokeLinecap="round"/>
              <path d="M44 22l8 8M52 22l-8 8" stroke="#D4A24A" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="52" cy="14" r="3" fill="#D4A24A"/>
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
            Join Internlink
          </h2>
          <p style={{ fontSize: '14px', color: TEXT_DIM, lineHeight: 1.7 }}>
            Create your account and start your journey to finding the perfect internship.
          </p>
        </div>

        {/* Trust strip */}
        <div className="relative z-10 flex items-center gap-6 mt-10">
          {[
            { value: '10K+', label: 'Students' },
            { value: '500+', label: 'Companies' },
            { value: '95%',  label: 'Satisfaction' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p
                className="font-bold text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem' }}
              >
                {s.value}
              </p>
              <p style={{ fontSize: '10.5px', color: TEXT_DIM }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT — Register form
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
                Get Started
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
              Create Your Account
            </h2>
            <p className="text-[#6B7280]" style={{ fontSize: '13.5px' }}>
              Start your journey to a meaningful internship today.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div
              className="flex items-start gap-3 p-3.5 mb-6 rounded-xl text-sm"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}
            >
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: '13px' }}>{error}</span>
            </div>
          )}

          {success && (
            <div
              className="flex items-start gap-3 p-3.5 mb-6 rounded-xl text-sm"
              style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D' }}
            >
              <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: '13px' }}>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block font-medium text-[#374151] mb-1.5" style={{ fontSize: '13px' }}>
                Full Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ width: 17, height: 17, color: '#9CA3AF' }}
                />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    fontSize: '13.5px',
                    border: '1.5px solid #E5E7EB',
                    background: '#FAFAF9',
                  }}
                  placeholder="Enter your full name"
                  onFocus={e => { e.target.style.borderColor = BRAND; e.target.style.background = '#fff'; e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.10)`; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAF9'; e.target.style.boxShadow = 'none'; }}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium text-[#374151] mb-1.5" style={{ fontSize: '13px' }}>
                Email Address <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ width: 17, height: 17, color: '#9CA3AF' }}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    fontSize: '13.5px',
                    border: '1.5px solid #E5E7EB',
                    background: '#FAFAF9',
                  }}
                  placeholder="your@email.com"
                  onFocus={e => { e.target.style.borderColor = BRAND; e.target.style.background = '#fff'; e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.10)`; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAF9'; e.target.style.boxShadow = 'none'; }}
                  required
                />
              </div>
              <p className="text-[#9CA3AF] mt-1.5" style={{ fontSize: '11px' }}>
                We'll send a verification link to this email
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium text-[#374151] mb-1.5" style={{ fontSize: '13px' }}>
                Password <span style={{ color: '#EF4444' }}>*</span>
                <span className="font-normal text-[#9CA3AF]" style={{ fontSize: '11.5px' }}> (min 6 characters)</span>
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ width: 17, height: 17, color: '#9CA3AF' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-11 py-3 rounded-xl outline-none transition-all"
                  style={{
                    fontSize: '13.5px',
                    border: '1.5px solid #E5E7EB',
                    background: '#FAFAF9',
                  }}
                  placeholder="Create a strong password"
                  onFocus={e => { e.target.style.borderColor = BRAND; e.target.style.background = '#fff'; e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.10)`; }}
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

            {/* Confirm Password */}
            <div>
              <label className="block font-medium text-[#374151] mb-1.5" style={{ fontSize: '13px' }}>
                Confirm Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="relative">
                <ShieldCheck
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ width: 17, height: 17, color: '#9CA3AF' }}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-11 py-3 rounded-xl outline-none transition-all"
                  style={{
                    fontSize: '13.5px',
                    border: '1.5px solid #E5E7EB',
                    background: '#FAFAF9',
                  }}
                  placeholder="Confirm your password"
                  onFocus={e => { e.target.style.borderColor = BRAND; e.target.style.background = '#fff'; e.target.style.boxShadow = `0 0 0 3px rgba(245,131,31,0.10)`; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAF9'; e.target.style.boxShadow = 'none'; }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#9CA3AF' }}
                  onMouseEnter={e => (e.currentTarget.style.color = BRAND)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
                >
                  {showConfirmPassword ? <EyeOff style={{ width: 17, height: 17 }} /> : <Eye style={{ width: 17, height: 17 }} />}
                </button>
              </div>
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
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

          {/* Footer link */}
          <div className="mt-7 text-center">
            <p className="text-[#6B7280]" style={{ fontSize: '13px' }}>
              Already have an account?{' '}
              <Link
                to="/student-login"
                className="font-semibold transition-colors"
                style={{ color: BRAND }}
                onMouseEnter={e => (e.currentTarget.style.color = '#3D2A18')}
                onMouseLeave={e => (e.currentTarget.style.color = BRAND)}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
