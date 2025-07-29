import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireOnboarding = true }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires onboarding completion, check user status
  if (requireOnboarding && user) {
    // Check if user has completed onboarding
    const onboardingComplete = user.onboarding_complete || user.can_access_dashboard;
    
    if (!onboardingComplete) {
      console.log('User onboarding not complete, redirecting to onboarding');
      console.log('User onboarding status:', user.onboarding_status);
      console.log('User KYC status:', user.kyc_status);
      console.log('User agreements complete:', user.agreements_complete);
      
      return <Navigate to="/onboarding" replace />;
    }
  }

  // If this is the onboarding route and user has completed onboarding, redirect to dashboard
  if (location.pathname === '/onboarding' && user?.onboarding_complete) {
    console.log('User onboarding complete, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

