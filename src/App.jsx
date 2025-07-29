import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

// Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import LeadsPage from './components/leads/LeadsPage'
import ReferralsPage from './components/referrals/ReferralsPage'
import CommissionsPage from './components/commissions/CommissionsPage'
import SupportPage from './components/support/SupportPage'
import AdminDashboard from './components/admin/AdminDashboard'
import AIToolsPage from './components/ai/AIToolsPage'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Context
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/leads" element={
              <ProtectedRoute>
                <Layout>
                  <LeadsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/referrals" element={
              <ProtectedRoute>
                <Layout>
                  <ReferralsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/commissions" element={
              <ProtectedRoute>
                <Layout>
                  <CommissionsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/ai-tools" element={
              <ProtectedRoute>
                <Layout>
                  <AIToolsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/support" element={
              <ProtectedRoute>
                <Layout>
                  <SupportPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect to dashboard by default */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
