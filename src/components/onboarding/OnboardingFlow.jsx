import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const OnboardingFlow = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [personalInfo, setPersonalInfo] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });
  const [kycData, setKycData] = useState({
    document_type: 'drivers_license'
  });

  useEffect(() => {
    fetchOnboardingStatus();
  }, []);

  const fetchOnboardingStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/onboarding/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOnboardingData(data);
        setCurrentStep(data.current_step);
        
        // Pre-fill personal info if available
        setPersonalInfo({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || ''
        });
      } else {
        setError('Failed to load onboarding status');
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/onboarding/update-personal-info`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(personalInfo)
      });

      if (response.ok) {
        await fetchOnboardingStatus(); // Refresh status
        setCurrentStep(2); // Move to next step
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update personal information');
      }
    } catch (err) {
      setError('Failed to update personal information: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitKYC = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/onboarding/upload-kyc`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(kycData)
      });

      if (response.ok) {
        await fetchOnboardingStatus(); // Refresh status
        setCurrentStep(3); // Move to final step
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit KYC documents');
      }
    } catch (err) {
      setError('Failed to submit KYC documents: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/onboarding/complete-onboarding`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        await fetchOnboardingStatus(); // Refresh status
        alert('Onboarding completed! Our team will send you the agreement to sign shortly.');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to complete onboarding');
      }
    } catch (err) {
      setError('Failed to complete onboarding: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !onboardingData) {
    return (
      <div className=\"min-h-screen bg-gray-50 flex items-center justify-center\">
        <div className=\"text-center\">
          <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto\"></div>
          <p className=\"mt-4 text-gray-600\">Loading onboarding status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=\"min-h-screen bg-gray-50 flex items-center justify-center\">
        <div className=\"bg-white p-8 rounded-lg shadow-md max-w-md w-full\">
          <div className=\"text-red-600 text-center\">
            <h2 className=\"text-xl font-semibold mb-4\">Error</h2>
            <p className=\"mb-4\">{error}</p>
            <button 
              onClick={fetchOnboardingStatus}
              className=\"bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700\"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If onboarding is complete
  if (onboardingData?.is_complete) {
    return (
      <div className=\"min-h-screen bg-gray-50 flex items-center justify-center\">
        <div className=\"bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center\">
          <div className=\"text-green-600 mb-4\">
            <svg className=\"w-16 h-16 mx-auto\" fill=\"currentColor\" viewBox=\"0 0 20 20\">
              <path fillRule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z\" clipRule=\"evenodd\" />
            </svg>
          </div>
          <h2 className=\"text-2xl font-bold text-gray-900 mb-4\">Onboarding Complete!</h2>
          <p className=\"text-gray-600 mb-6\">
            Your onboarding has been completed successfully. Our team will send you the finder's fee agreement to sign shortly.
          </p>
          <div className=\"bg-blue-50 p-4 rounded-lg\">
            <p className=\"text-sm text-blue-800\">
              <strong>Next Step:</strong> Wait for our team to send you the agreement via email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=\"min-h-screen bg-gray-50 py-8\">
      <div className=\"max-w-2xl mx-auto px-4\">
        {/* Progress Bar */}
        <div className=\"mb-8\">
          <div className=\"flex items-center justify-between mb-4\">
            <h1 className=\"text-2xl font-bold text-gray-900\">Complete Your Onboarding</h1>
            <span className=\"text-sm text-gray-500\">Step {currentStep} of 3</span>
          </div>
          <div className=\"w-full bg-gray-200 rounded-full h-2\">
            <div 
              className=\"bg-blue-600 h-2 rounded-full transition-all duration-300\"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className=\"bg-white rounded-lg shadow-md p-6\">
          {currentStep === 1 && (
            <div>
              <h2 className=\"text-xl font-semibold mb-4\">Personal Information</h2>
              <p className=\"text-gray-600 mb-6\">Please provide your personal details to get started.</p>
              
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-6\">
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">First Name</label>
                  <input
                    type=\"text\"
                    value={personalInfo.first_name}
                    onChange={(e) => setPersonalInfo({...personalInfo, first_name: e.target.value})}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
                    required
                  />
                </div>
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Last Name</label>
                  <input
                    type=\"text\"
                    value={personalInfo.last_name}
                    onChange={(e) => setPersonalInfo({...personalInfo, last_name: e.target.value})}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
                    required
                  />
                </div>
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Phone Number</label>
                  <input
                    type=\"tel\"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
                  />
                </div>
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">Address</label>
                  <input
                    type=\"text\"
                    value={personalInfo.address}
                    onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
                  />
                </div>
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">City</label>
                  <input
                    type=\"text\"
                    value={personalInfo.city}
                    onChange={(e) => setPersonalInfo({...personalInfo, city: e.target.value})}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
                  />
                </div>
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">State</label>
                  <input
                    type=\"text\"
                    value={personalInfo.state}
                    onChange={(e) => setPersonalInfo({...personalInfo, state: e.target.value})}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
                  />
                </div>
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-2\">ZIP Code</label>
                  <input
                    type=\"text\"
                    value={personalInfo.zip_code}
                    onChange={(e) => setPersonalInfo({...personalInfo, zip_code: e.target.value})}
                    className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
                  />
                </div>
              </div>

              <button
                onClick={updatePersonalInfo}
                disabled={loading || !personalInfo.first_name || !personalInfo.last_name}
                className=\"w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed\"
              >
                {loading ? 'Saving...' : 'Continue to Identity Verification'}
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className=\"text-xl font-semibold mb-4\">Identity Verification</h2>
              <p className=\"text-gray-600 mb-6\">Please select your identification document type. Our team will contact you for document submission.</p>
              
              <div className=\"mb-6\">
                <label className=\"block text-sm font-medium text-gray-700 mb-2\">Document Type</label>
                <select
                  value={kycData.document_type}
                  onChange={(e) => setKycData({...kycData, document_type: e.target.value})}
                  className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
                >
                  <option value=\"drivers_license\">Driver's License</option>
                  <option value=\"passport\">Passport</option>
                  <option value=\"state_id\">State ID</option>
                  <option value=\"other\">Other Government ID</option>
                </select>
              </div>

              <div className=\"bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6\">
                <div className=\"flex\">
                  <div className=\"flex-shrink-0\">
                    <svg className=\"h-5 w-5 text-yellow-400\" viewBox=\"0 0 20 20\" fill=\"currentColor\">
                      <path fillRule=\"evenodd\" d=\"M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z\" clipRule=\"evenodd\" />
                    </svg>
                  </div>
                  <div className=\"ml-3\">
                    <h3 className=\"text-sm font-medium text-yellow-800\">Manual Review Process</h3>
                    <div className=\"mt-2 text-sm text-yellow-700\">
                      <p>Our team will contact you separately to collect your identification documents securely.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={submitKYC}
                disabled={loading}
                className=\"w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed\"
              >
                {loading ? 'Submitting...' : 'Continue to Final Step'}
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className=\"text-xl font-semibold mb-4\">Agreement Signing</h2>
              <p className=\"text-gray-600 mb-6\">You're almost done! Our team will send you the finder's fee agreement to sign.</p>
              
              <div className=\"bg-blue-50 border border-blue-200 rounded-md p-4 mb-6\">
                <div className=\"flex\">
                  <div className=\"flex-shrink-0\">
                    <svg className=\"h-5 w-5 text-blue-400\" viewBox=\"0 0 20 20\" fill=\"currentColor\">
                      <path fillRule=\"evenodd\" d=\"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\" clipRule=\"evenodd\" />
                    </svg>
                  </div>
                  <div className=\"ml-3\">
                    <h3 className=\"text-sm font-medium text-blue-800\">What happens next?</h3>
                    <div className=\"mt-2 text-sm text-blue-700\">
                      <ul className=\"list-disc list-inside space-y-1\">
                        <li>Our team will review your information</li>
                        <li>We'll send you the finder's fee agreement via email</li>
                        <li>You'll be able to sign the agreement electronically</li>
                        <li>Once signed, you'll have full access to the affiliate portal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={completeOnboarding}
                disabled={loading}
                className=\"w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed\"
              >
                {loading ? 'Completing...' : 'Complete Onboarding'}
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className=\"mt-4 bg-red-50 border border-red-200 rounded-md p-4\">
            <div className=\"flex\">
              <div className=\"flex-shrink-0\">
                <svg className=\"h-5 w-5 text-red-400\" viewBox=\"0 0 20 20\" fill=\"currentColor\">
                  <path fillRule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z\" clipRule=\"evenodd\" />
                </svg>
              </div>
              <div className=\"ml-3\">
                <h3 className=\"text-sm font-medium text-red-800\">Error</h3>
                <div className=\"mt-2 text-sm text-red-700\">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;

