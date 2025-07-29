import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { CheckCircle, Clock, Upload, FileText, AlertCircle } from 'lucide-react';

const OnboardingFlow = () => {
  const { user, apiRequest } = useAuth();
  const navigate = useNavigate();
  const [onboardingData, setOnboardingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentAction, setCurrentAction] = useState(null);

  useEffect(() => {
    fetchOnboardingStatus();
  }, []);

  const fetchOnboardingStatus = async () => {
    try {
      const response = await apiRequest('/api/onboarding/status');
      if (response && response.ok) {
        const data = await response.json();
        setOnboardingData(data);
        setCurrentAction(data.next_action);
        
        // If onboarding is complete, redirect to dashboard
        if (data.onboarding_complete) {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSigning = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/onboarding/start-signature', {
        method: 'POST'
      });
      
      if (response && response.ok) {
        const data = await response.json();
        
        if (data.signing_url) {
          // Open signing URL in new window/tab
          window.open(data.signing_url, '_blank', 'width=800,height=600');
          
          // Refresh status after a delay
          setTimeout(() => {
            fetchOnboardingStatus();
          }, 2000);
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error starting signature:', error);
      alert('Failed to start document signing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'government_id');

      const response = await apiRequest('/api/onboarding/upload-kyc', {
        method: 'POST',
        body: formData,
        headers: {} // Remove Content-Type to let browser set it for FormData
      });

      if (response && response.ok) {
        const data = await response.json();
        alert('Document uploaded successfully!');
        fetchOnboardingStatus();
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !onboardingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getProgressPercentage = () => {
    if (!onboardingData) return 0;
    
    const step = onboardingData.current_step || 1;
    return Math.min((step / 5) * 100, 100);
  };

  const getStepStatus = (stepNumber) => {
    if (!onboardingData) return 'pending';
    
    const currentStep = onboardingData.current_step || 1;
    
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'pending';
  };

  const renderStepContent = () => {
    if (!currentAction) return null;

    switch (currentAction.action) {
      case 'sign_contract':
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
              <Button 
                onClick={handleStartSigning} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Starting...' : 'Start Document Signing'}
              </Button>
            </CardContent>
          </Card>
        );

      case 'upload_kyc':
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
                  Accepted documents: Driver's License, Passport, State ID Card
                </p>
                <p className="text-sm text-yellow-800 mt-1">
                  File formats: PDF, JPG, PNG (Max 10MB)
                </p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                />
                <label htmlFor="kyc-upload">
                  <Button variant="outline" disabled={loading}>
                    {loading ? 'Uploading...' : 'Select File'}
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        );

      case 'wait':
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
              >
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        );

      case 'access_dashboard':
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
            <CardContent>
              <Button 
                onClick={fetchOnboardingStatus}
                className="w-full"
              >
                Start Onboarding
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
            { number: 1, title: 'Welcome', icon: CheckCircle },
            { number: 2, title: 'Sign Contract', icon: FileText },
            { number: 3, title: 'Upload ID', icon: Upload },
            { number: 4, title: 'Review', icon: Clock },
            { number: 5, title: 'Complete', icon: CheckCircle }
          ].map((step) => {
            const status = getStepStatus(step.number);
            const Icon = step.icon;
            
            return (
              <div 
                key={step.number}
                className={`p-4 rounded-lg text-center ${
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
                <p className="text-sm font-medium">{step.title}</p>
              </div>
            );
          })}
        </div>

        {/* Current Step Content */}
        <div className="flex justify-center">
          {renderStepContent()}
        </div>

        {/* Status Message */}
        {currentAction && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">{currentAction.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;

