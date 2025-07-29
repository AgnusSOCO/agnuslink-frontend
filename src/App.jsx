import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import LeadsPage from './components/leads/LeadsPage';
import ReferralsPage from './components/referrals/ReferralsPage';
import CommissionsPage from './components/commissions/CommissionsPage';
import SupportPage from './components/support/SupportPage';
import AdminDashboard from './components/admin/AdminDashboard';
import AIToolsPage from './components/ai/AIToolsPage';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Onboarding route - requires authentication but not full onboarding */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute requireOnboarding={false}>
                  <OnboardingFlow />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes - require full onboarding completion */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="referrals" element={<ReferralsPage />} />
              <Route path="commissions" element={<CommissionsPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="ai-tools" element={<AIToolsPage />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

