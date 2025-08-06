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
    console.log('🔍 OnboardingFlow: Component mounted');
    console.log('🔍 OnboardingFlow: User data:', user);
    fetchOnboardingStatus();
  }, []);

  const fetchOnboardingStatus = async () => {
    try {
      console.log('🔍 OnboardingFlow: Starting fetchOnboardingStatus');
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      console.log('🔍 OnboardingFlow: Token exists:', !!token);
      console.log('🔍 OnboardingFlow: Token length:', token ? token.length : 0);
      
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('🔍 OnboardingFlow: API URL:', apiUrl);
      
      const fullUrl = `${apiUrl}/api/onboarding/status`;
      console.log('🔍 OnboardingFlow: Full URL:', fullUrl);
      
      console.log('🔍 OnboardingFlow: Making fetch request...');
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔍 OnboardingFlow: Response received');
      console.log('🔍 OnboardingFlow: Response status:', response.status);
      console.log('🔍 OnboardingFlow: Response ok:', response.ok);
      console.log('🔍 OnboardingFlow: Response headers:', [...response.headers.entries()]);
      
      if (response.ok) {
        console.log('🔍 OnboardingFlow: Response is OK, parsing JSON...');
        const data = await response.json();
        console.log('🔍 OnboardingFlow: JSON parsed successfully:', data);
        
        console.log('🔍 OnboardingFlow: Setting onboarding data...');
        setOnboardingData(data);
        
        console.log('🔍 OnboardingFlow: Setting current step:', data.current_step);
        setCurrentStep(data.current_step);
        
        // Pre-fill personal info if available
        if (data.first_name || data.last_name) {
          console.log('🔍 OnboardingFlow: Pre-filling personal info...');
          setPersonalInfo({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zip_code: data.zip_code || ''
          });
        }
        
        console.log('🔍 OnboardingFlow: All state updates completed successfully');
      } else {
        console.log('🔍 OnboardingFlow: Response not OK');
        const errorText = await response.text();
        console.log('🔍 OnboardingFlow: Error response text:', errorText);
        setError('Failed to load onboarding status');
      }
    } catch (err) {
      console.log('🔍 OnboardingFlow: Catch block triggered');
      console.log('🔍 OnboardingFlow: Error type:', err.constructor.name);
      console.log('🔍 OnboardingFlow: Error message:', err.message);
      console.log('🔍 OnboardingFlow: Error stack:', err.stack);
      setError('Connection error: ' + err.message);
    } finally {
      console.log('🔍 OnboardingFlow: Finally block - setting loading to false');
      setLoading(false);
    }
  };

  const updatePersonalInfo = async () => {
    try {
      console.log('🔍 OnboardingFlow: Starting updatePersonalInfo');
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
        console.log('🔍 OnboardingFlow: Personal info updated successfully');
        setCurrentStep(2);
        await fetchOnboardingStatus(); // Refresh data
      } else {
        console.log('🔍 OnboardingFlow: Failed to update personal info');
        setError('Failed to update personal information');
      }
    } catch (err) {
      console.log('🔍 OnboardingFlow: Error updating personal info:', err);
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateKycInfo = async () => {
    try {
      console.log('🔍 OnboardingFlow: Starting updateKycInfo');
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/onboarding/update-kyc`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(kycData)
      });

      if (response.ok) {
        console.log('🔍 OnboardingFlow: KYC info updated successfully');
        setCurrentStep(3);
        await fetchOnboardingStatus(); // Refresh data
      } else {
        console.log('🔍 OnboardingFlow: Failed to update KYC info');
        setError('Failed to update KYC information');
      }
    } catch (err) {
      console.log('🔍 OnboardingFlow: Error updating KYC info:', err);
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log('🔍 OnboardingFlow: Rendering component');
  console.log('🔍 OnboardingFlow: Current state - loading:', loading, 'error:', error, 'currentStep:', currentStep);

  if (loading && !onboardingData) {
    console.log('🔍 OnboardingFlow: Rendering loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your onboarding status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('🔍 OnboardingFlow: Rendering error state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => {
                console.log('🔍 OnboardingFlow: Retry button clicked');
                fetchOnboardingStatus();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('🔍 OnboardingFlow: Rendering main onboarding flow');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Onboarding</h1>
            <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.first_name}
                    onChange={(e) => setPersonalInfo({...personalInfo, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.last_name}
                    onChange={(e) => setPersonalInfo({...personalInfo, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={personalInfo.address}
                    onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={personalInfo.city}
                    onChange={(e) => setPersonalInfo({...personalInfo, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={personalInfo.state}
                    onChange={(e) => setPersonalInfo({...personalInfo, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={personalInfo.zip_code}
                    onChange={(e) => setPersonalInfo({...personalInfo, zip_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-8">
                <button
                  onClick={updatePersonalInfo}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Identity Verification</h2>
              <p className="text-gray-600 mb-6">
                Please select the type of identification document you will provide for verification.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="document_type"
                      value="drivers_license"
                      checked={kycData.document_type === 'drivers_license'}
                      onChange={(e) => setKycData({...kycData, document_type: e.target.value})}
                      className="mr-3"
                    />
                    <span>Driver's License</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="document_type"
                      value="passport"
                      checked={kycData.document_type === 'passport'}
                      onChange={(e) => setKycData({...kycData, document_type: e.target.value})}
                      className="mr-3"
                    />
                    <span>Passport</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="document_type"
                      value="state_id"
                      checked={kycData.document_type === 'state_id'}
                      onChange={(e) => setKycData({...kycData, document_type: e.target.value})}
                      className="mr-3"
                    />
                    <span>State ID</span>
                  </label>
                </div>
              </div>
              <div className="mt-8">
                <button
                  onClick={updateKycInfo}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Onboarding Complete!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for completing your onboarding. Our team will review your information and send you the affiliate agreement to sign via email within 1-2 business days.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Our team will review your application</li>
                    <li>• You'll receive an email with the affiliate agreement</li>
                    <li>• Once signed, you'll gain access to your affiliate dashboard</li>
                    <li>• Start earning commissions on successful referrals!</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500">
                  Questions? Contact our support team at support@agnuslink.com
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;

