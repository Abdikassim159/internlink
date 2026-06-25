
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ApplyNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    course: '',
    university: '',
    yearOfStudy: '',
    domain: '',
    coverLetter: '',
    agreed: false
  });

  useEffect(() => {
    // ✅ CHECK AUTHENTICATION FIRST
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('🔍 Checking authentication...');
    console.log('Token:', token ? 'Present' : 'Missing');
    console.log('User Data:', userData ? 'Present' : 'Missing');
    
    if (!token || !userData) {
      console.log('❌ No token or user data, redirecting to login...');
      navigate('/student-login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setCheckingAuth(false);
      
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        email: parsedUser.email || '',
        fullName: parsedUser.full_name || parsedUser.fullName || ''
      }));
      
      console.log('✅ User authenticated:', parsedUser.email);
      fetchOpportunity();
    } catch (e) {
      console.error('Error parsing user data:', e);
      navigate('/student-login');
    }
  }, [id, navigate]);

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/opportunities/${id}`);
      setOpportunity(response.data);
      console.log('✅ Opportunity loaded');
    } catch (err) {
      console.error('Error fetching opportunity:', err);
      setError('Failed to load opportunity details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        setError('Please fill in all required fields');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.domain) {
        setError('Please select a domain');
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.agreed) {
        setError('Please agree to the terms');
        return;
      }
    }
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        navigate('/student-login');
        return;
      }

      const applicationData = {
        opportunity_id: parseInt(id),
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        university: formData.university,
        year_of_study: formData.yearOfStudy,
        domain: formData.domain,
        cover_letter: formData.coverLetter,
        match_score: Math.floor(Math.random() * 30) + 70
      };

      console.log('Submitting application:', applicationData);

      const response = await axios.post(
        `${API_URL}/applications`,
        applicationData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Application response:', response.data);
      setSubmitted(true);
      
      setTimeout(() => {
        navigate('/applications');
      }, 2000);

    } catch (err) {
      console.error('Error submitting application:', err);
      if (err.response) {
        setError(err.response.data?.error || 'Failed to submit application');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure backend is running.');
      } else {
        setError('Failed to submit application. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: 'Enter your details' },
    { number: 2, label: 'Select your domain' },
    { number: 3, label: 'Pay application fee' },
    { number: 4, label: 'Submit your form' }
  ];

  // ✅ CHECKING AUTHENTICATION STATE
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ ERROR STATE
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-gray-100">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ SUCCESS STATE
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-lg border border-gray-100">
          <div className="text-7xl mb-6">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your application for <span className="font-semibold">{opportunity?.title}</span> at{' '}
            <span className="font-semibold">{opportunity?.company_name}</span> has been submitted successfully.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              You will be redirected to your applications page shortly.
            </p>
          </div>
          <Link to="/applications" className="inline-block bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
            View My Applications
          </Link>
        </div>
      </div>
    );
  }

  // ✅ MAIN FORM
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-t-2xl px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">in</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">InternLink - Application Form</h1>
              <p className="text-gray-500 text-sm">
                Welcome to InternLink! Please complete the following steps to apply.
              </p>
            </div>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="bg-white px-8 py-6 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep > step.number ? 'bg-green-500 text-white' :
                    currentStep === step.number ? 'bg-blue-900 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  <span className={`text-sm ${currentStep === step.number ? 'text-blue-900 font-medium' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <svg className="w-4 h-4 text-gray-300 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="bg-white rounded-b-2xl p-8 shadow-sm">
          
          {/* Email Header */}
          <div className="mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{formData.email || 'Not logged in'}</span>
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-sm">
                  {formData.fullName ? formData.fullName.charAt(0) : '?'}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              The name, email, and photo associated with your account will be recorded when you submit this form
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-900 rounded-full h-2 transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Enter your details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g., BSc Computer Science"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="Enter your university name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Study
                  </label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-900"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Select Domain */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select your domain <span className="text-red-500">*</span>
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Software Development', 'Data Science', 'Finance', 'Marketing', 'HR', 'Design', 'Engineering', 'Research'].map((domain) => (
                      <label key={domain} className="flex items-center gap-3 p-3 border rounded-lg hover:border-blue-400 cursor-pointer transition">
                        <input
                          type="radio"
                          name="domain"
                          value={domain}
                          checked={formData.domain === domain}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-900"
                        />
                        <span className="text-sm text-gray-700">{domain}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Pay Application Fee */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <p className="text-lg font-semibold text-gray-900">Application Fee</p>
                  <p className="text-4xl font-bold text-blue-900 mt-2">KES 49</p>
                  <p className="text-sm text-gray-500 mt-2">One-time payment for application processing</p>
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-900"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to pay the application fee and accept the terms and conditions
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Submit Form */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-green-700">Ready to Submit!</p>
                      <p className="text-sm text-green-600">
                        Please review your details before submitting
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                  <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {formData.fullName}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {formData.email}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Domain:</span> {formData.domain || 'Not selected'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    name="coverLetter"
                    rows="3"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    placeholder="Any additional information you'd like to share..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-900 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-2 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition ${currentStep === 1 ? 'invisible' : ''}`}
              >
                Back
              </button>
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyNow;
