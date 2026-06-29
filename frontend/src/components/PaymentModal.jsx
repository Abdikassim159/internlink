import { useState } from 'react';
import axios from 'axios';
import { X, Phone, Lock, CheckCircle, AlertCircle, Clock, Sparkles, Shield } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const PaymentModal = ({ isOpen, onClose, application, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number (e.g., 0712345678)');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/mpesa/pay`,
        {
          application_id: application.id,
          phone_number: phoneNumber
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      setSuccess(`✅ Payment initiated! Check your phone (${phoneNumber}) for the M-Pesa prompt. Enter your PIN to complete payment.`);
      
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 3000);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Limit to 12 digits
    const limited = cleaned.slice(0, 12);
    setPhoneNumber(limited);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp">
        
        {/* ===== MODAL HEADER ===== */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#F5831F]/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#F5831F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 3v2m5-7a2 2 0 11-4 0 2 2 0 014 0zm-5 5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">M-Pesa Payment</h2>
              <p className="text-sm text-gray-500">Complete your application payment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== MODAL BODY ===== */}
        <div className="px-6 py-6 space-y-5">
          
          {/* Application Details */}
          <div className="bg-gradient-to-r from-[#F5831F]/5 to-[#F5831F]/10 rounded-xl p-4 border border-[#F5831F]/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Application Details</p>
                <p className="font-semibold text-gray-900 text-lg mt-0.5">
                  {application?.opportunity?.title || application?.title || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  {application?.opportunity?.company_name || application?.company_name || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-2xl font-bold text-[#F5831F]">KES 350</p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 flex items-start gap-2 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-xl border border-green-200 flex items-start gap-2 text-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Payment Form */}
          <form onSubmit={handlePayment} className="space-y-4">
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F5831F]" />
                M-Pesa Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-medium text-sm">+254</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => formatPhoneNumber(e.target.value)}
                  placeholder="712345678"
                  className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 text-sm"
                  required
                  disabled={loading || success}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Enter the phone number registered with M-Pesa
              </p>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between text-sm py-1.5">
                <span className="text-gray-500">Application Fee</span>
                <span className="text-gray-900 font-medium">KES 350.00</span>
              </div>
              <div className="flex justify-between text-sm py-1.5">
                <span className="text-gray-500">Processing Fee</span>
                <span className="text-gray-900 font-medium">KES 0.00</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-base font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-[#F5831F]">KES 350.00</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className={`flex-1 bg-[#F5831F] text-white py-3 rounded-xl hover:bg-[#e0731a] transition font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                  (loading || success) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Payment Successful
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    Pay KES 350
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Security & Trust Badges */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Lock className="w-4 h-4 text-[#F5831F]" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>24/7 Support</span>
            </div>
          </div>

          {/* M-Pesa Instructions */}
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                <span className="font-medium">How it works:</span> Enter your M-Pesa number, 
                click pay, and you'll receive a prompt on your phone. Enter your PIN to 
                complete the payment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CSS ANIMATIONS ===== */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.98);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentModal;