
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      setStatus('verifying');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
      
      setStatus('success');
      setMessage(response.data.message || 'Email verified successfully!');
      
    } catch (error) {
      setStatus('error');
      setError(error.response?.data?.error || 'Verification failed. Please try again.');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h2>
          <p className="text-gray-500">Please wait while we verify your account...</p>
          
          <div className="mt-6 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100 animate-fadeIn">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-75"></div>
            <div className="relative w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Email Verified! ✅</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              Your account is now active. You can login with your credentials.
            </p>
          </div>
          
          <Link
            to="/student-login"
            className="inline-block w-full bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition shadow-sm font-medium"
          >
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-xl border border-gray-100">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Verification Failed</h2>
        <p className="text-gray-600 mb-6">{error || 'Something went wrong. Please try again.'}</p>
        
        <div className="flex flex-col gap-3">
          <Link
            to="/student-login"
            className="w-full bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition shadow-sm font-medium"
          >
            Go to Login
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="w-full border border-gray-200 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
