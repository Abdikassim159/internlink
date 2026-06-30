// src/components/OTPVerification.jsx

import { useState } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, Mail, Clock, RefreshCw } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const OTPVerification = ({ email, userId, onSuccess, onBack }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: email,
        otp_code: otp
      });

      setSuccess(response.data.message);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/auth/resend-otp`, {
        email: email
      });

      setSuccess('✅ New OTP sent to your email!');
      setCanResend(false);
      setTimer(120);
      
      // Start countdown
      const countdown = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#F5831F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-[#F5831F]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Account</h2>
          <p className="text-sm text-gray-500 mt-1">
            We've sent a 6-digit code to <strong className="text-gray-700">{email}</strong>
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 flex items-center gap-2 mb-4 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl border border-green-200 flex items-center gap-2 mb-4 text-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
          <Clock className="w-4 h-4" />
          <span>Code expires in: </span>
          <span className="font-bold text-[#F5831F]">
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </span>
        </div>

        {/* OTP Input */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-Digit OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter OTP"
              className="w-full px-4 py-3 text-center text-2xl tracking-[8px] font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white"
              maxLength="6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F5831F] text-white py-3 rounded-xl hover:bg-[#e0731a] transition font-medium shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Verifying...
              </span>
            ) : (
              'Verify Account'
            )}
          </button>
        </form>

        {/* Resend */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={resending || !canResend}
              className={`text-[#F5831F] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 mx-auto`}
            >
              {resending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#F5831F] border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend OTP
                </>
              )}
            </button>
          </p>
          {!canResend && timer > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Please wait {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')} before resending
            </p>
          )}
        </div>

        {/* Back to Login */}
        <div className="text-center mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;