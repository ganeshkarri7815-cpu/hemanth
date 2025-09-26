import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import SOSAlerts from './pages/SOSAlerts';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return user ? <Navigate to="/" /> : <>{children}</>;
};

// Placeholder components for other features
const PlaceholderPage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="max-w-4xl mx-auto text-center">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-600 mb-8">{description}</p>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
      <p className="text-blue-800">This feature is coming soon! The UI structure is ready for backend integration.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="sos" element={<SOSAlerts />} />
            <Route path="messages" element={
              <PlaceholderPage 
                title="Offline Messages" 
                description="Queue messages for when connectivity returns" 
              />
            } />
            <Route path="contacts" element={
              <PlaceholderPage 
                title="Emergency Contacts" 
                description="Manage your emergency contact list" 
              />
            } />
            <Route path="medical" element={
              <PlaceholderPage 
                title="Medical ID" 
                description="Store critical medical information" 
              />
            } />
            <Route path="tracking" element={
              <PlaceholderPage 
                title="Live Tracking" 
                description="Share your location with emergency contacts" 
              />
            } />
            <Route path="voice" element={
              <PlaceholderPage 
                title="Voice Commands" 
                description="Use voice commands for hands-free operation" 
              />
            } />
            <Route path="evidence" element={
              <PlaceholderPage 
                title="Photo Evidence" 
                description="Document and share visual evidence" 
              />
            } />
            <Route path="notifications" element={
              <PlaceholderPage 
                title="Notifications" 
                description="View system alerts and updates" 
              />
            } />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
