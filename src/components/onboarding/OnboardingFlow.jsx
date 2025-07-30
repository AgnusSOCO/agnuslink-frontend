import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { CheckCircle, Clock, Upload, FileText, AlertCircle, RefreshCw } from 'lucide-react';

const OnboardingFlow = () => {
  const { user, apiRequest } = useAuth();
  const navigate = useNavigate();
  const [onboardingData, setOnboardingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOnboardingStatus();
  }, []);

  const fetchOnboardingStatus = async () => {
    try {
      setError(null);
      console.log('Fetching onboarding status...');
      
      const response = await apiRequest('/api/onboarding/status');
      console.log('Onboarding status response:', response);
      
      if (response && response.ok) {
        const data = await response.json();
        console.log('Onboarding data:', data);
        setOnboardingData(data);
        
        // If onboarding is complete, redirect to dashboard
        if (data.onboarding_complete) {
          navigate('/dashboard', { replace: true });
        }
      } else {
        const errorData = await response.json();
        console.error('Onboarding status error:', errorData);
        setError(errorData.error || 'Failed to fetch onboarding status');
      }
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
      setError('Unable to connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSigning = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting document signing...');
      const response = await apiRequest('/api/onboarding/start-signature', {
        method: 'POST'
      });
      
      if (response && response.ok) {
        const data = await response.json();
        console.log('Signing response:', data);
        
        if (data.signing_link) {
          // Open signing URL in new window/tab
          const signingWindow = window.open(
            data.signing_link, 
            '_blank', 
            'width=900,height=700,scrollbars=yes,resizable=yes'
          );
          
          // Check if window was blocked
          if (!signingWindow) {
            alert('Please allow popups for this site to open the signing window.');
            return;
          }
          
          // Monitor window and refresh status when closed
          const checkClosed = setInterval(() => {
            if (signingWindow.closed) {
              clearInterval(checkClosed);
              console.log('Signing window closed, refreshing status...');
              setTimeout(() => {
                fetchOnboardingStatus();
              }, 2000);
            }
          }, 1000);
          
        } else {
          setError('No signing link received from server');
        }
      } else {
        const errorData = await response.json();
        console.error('Signing error:', errorData);
        setError(errorData.error || 'Failed to start document signing');
      }
    } catch (error) {
      console.error('Error starting signature:', error);
      setError('Failed to start document signing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, JPG, or PNG file');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'government_id');

      console.log('Uploading KYC document...');
      const response = await apiRequest('/api/onboarding/upload-kyc', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData
      });

      if (response && response.ok) {
        const data = await response.json();
        console.log('Upload response:', data);
        alert('Document uploaded successfully! It will be reviewed by our team.');
        fetchOnboardingStatus();
      } else {
        const errorData = await response.json();
        console.error('Upload error:', errorData);
        setError(errorData.error || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  if (loading && !onboardingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading onboarding status...</p>
        </div>
      </div>
    );
  }

  if (error && !onboardingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{error}</p>
            <Button onClick={fetchOnboardingStatus} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getProgressPercentage = () => {
    if (!onboardingData) return 0;
    return onboardingData.progress || 0;
  };

  const getCurrentStep = () => {
    if (!onboardingData) return 'welcome';
    return onboardingData.current_step || 'welcome';
  };

  const getStepStatus = (stepName) => {
    const currentStep = getCurrentStep();
    const steps = ['welcome', 'signature', 'kyc_upload', 'review', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(stepName);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const renderStepContent = () => {
    const currentStep = getCurrentStep();

    switch (currentStep) {
      case 'signature':
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Sign Finder's Fee Contract
              </CardTitle>
              <CardDescription>
                Please review and sign the Finder's Fee Contract to continue with your onboarding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  This contract outlines the terms of your affiliate relationship and commission structure.
                  Please read it carefully before signing.
                </p>
              </div>
              {error && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <Button 
                onClick={handleStartSigning} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  'Start Document Signing'
                )}
              </Button>
            </CardContent>
          </Card>
        );

      case 'kyc_upload':
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-6 w-6" />
                Upload Government ID
              </CardTitle>
              <CardDescription>
                Please upload a clear photo of your government-issued ID for verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Accepted documents:</strong> Driver's License, Passport, State ID Card
                </p>
                <p className="text-sm text-yellow-800 mt-1">
                  <strong>File formats:</strong> PDF, JPG, PNG (Max 10MB)
                </p>
              </div>
              {error && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Click to select your government ID document
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="kyc-upload"
                  disabled={loading}
                />
                <label htmlFor="kyc-upload">
                  <Button variant="outline" disabled={loading} className="cursor-pointer">
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Select File'
                    )}
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        );

      case 'review':
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Under Review
              </CardTitle>
              <CardDescription>
                Your documents are being reviewed by our team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  We're reviewing your submitted documents. This process typically takes 1-2 business days.
                  You'll receive an email notification once the review is complete.
                </p>
              </div>
              <Button 
                onClick={fetchOnboardingStatus}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Status
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        );

      case 'complete':
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Onboarding Complete!
              </CardTitle>
              <CardDescription>
                Welcome to Agnus Link! You can now access your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Welcome to Agnus Link!</CardTitle>
              <CardDescription>
                Let's get you set up with our affiliate program.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <Button 
                onClick={fetchOnboardingStatus}
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Start Onboarding'
                )}
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Onboarding
          </h1>
          <p className="text-gray-600">
            Follow these steps to get full access to your affiliate dashboard
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { step: 'welcome', title: 'Welcome', icon: CheckCircle },
            { step: 'signature', title: 'Sign Contract', icon: FileText },
            { step: 'kyc_upload', title: 'Upload ID', icon: Upload },
            { step: 'review', title: 'Review', icon: Clock },
            { step: 'complete', title: 'Complete', icon: CheckCircle }
          ].map((stepInfo) => {
            const status = getStepStatus(stepInfo.step);
            const Icon = stepInfo.icon;
            
            return (
              <div 
                key={stepInfo.step}
                className={`p-4 rounded-lg text-center transition-colors ${
                  status === 'completed' ? 'bg-green-100 text-green-800' :
                  status === 'current' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-600'
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${
                  status === 'completed' ? 'text-green-600' :
                  status === 'current' ? 'text-blue-600' :
                  'text-gray-400'
                }`} />
                <p className="text-sm font-medium">{stepInfo.title}</p>
              </div>
            );
          })}
        </div>

        {/* Current Step Content */}
        <div className="flex justify-center">
          {renderStepContent()}
        </div>

        {/* Next Action Message */}
        {onboardingData && onboardingData.next_action && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">{onboardingData.next_action}</p>
          </div>
        )}

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && onboardingData && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(onboardingData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;

