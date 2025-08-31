import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';
import AdminProjects from './pages/AdminProjects';
import AdminPortfolio from './pages/AdminPortfolio';
import AdminContacts from './pages/AdminContacts';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import Messages from './pages/Messages';
import Billing from './pages/Billing';
import Notifications from './pages/Notifications';
import Feedback from './pages/Feedback';
import Testimonials from './pages/Testimonials';
import AdminMessages from './pages/AdminMessages';
import AdminNotifications from './pages/AdminNotifications';
import AdminFeedback from './pages/AdminFeedback';
import AdminBilling from './pages/AdminBilling';

// Policy Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import DataProtection from './pages/DataProtection';

function App() {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Check if current route is a dashboard/system route
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/projects') || 
                          location.pathname.startsWith('/profile') || 
                          location.pathname.startsWith('/admin-') || 
                          location.pathname.startsWith('/create-project') || 
                          location.pathname.startsWith('/edit-project') ||
                          location.pathname.startsWith('/messages') ||
                          location.pathname.startsWith('/billing') ||
                          location.pathname.startsWith('/notifications') ||
                          location.pathname.startsWith('/feedback') ||
                          location.pathname.startsWith('/admin-messages') ||
                          location.pathname.startsWith('/admin-notifications') ||
                          location.pathname.startsWith('/admin-feedback') ||
                          location.pathname.startsWith('/admin-billing');

  // Dashboard routes with dashboard layout
  if (isDashboardRoute && isAuthenticated) {
    return (
      <DashboardLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Client Tools routes */}
          <Route path="/messages" element={<Messages />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/feedback" element={<Feedback />} />
          
          {/* Admin routes */}
          <Route path="/admin-users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin-projects" element={<ProtectedRoute adminOnly><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin-portfolio" element={<ProtectedRoute adminOnly><AdminPortfolio /></ProtectedRoute>} />
                    <Route path="/admin-contacts" element={<ProtectedRoute adminOnly><AdminContacts /></ProtectedRoute>} />
          <Route path="/admin-messages" element={<ProtectedRoute adminOnly><AdminMessages /></ProtectedRoute>} />
          <Route path="/admin-notifications" element={<ProtectedRoute adminOnly><AdminNotifications /></ProtectedRoute>} />
          <Route path="/admin-feedback" element={<ProtectedRoute adminOnly><AdminFeedback /></ProtectedRoute>} />
          <Route path="/admin-billing" element={<ProtectedRoute adminOnly><AdminBilling /></ProtectedRoute>} />
          <Route path="/create-project" element={<ProtectedRoute adminOnly><CreateProject /></ProtectedRoute>} />
          <Route path="/edit-project/:id" element={<ProtectedRoute adminOnly><EditProject /></ProtectedRoute>} />
        </Routes>
      </DashboardLayout>
    );
  }

  // Website routes with normal layout
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/testimonials" element={<Testimonials />} />
          
          {/* Policy pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/data-protection" element={<DataProtection />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
            } 
          />
          
          {/* Redirect dashboard routes to login if not authenticated */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/projects/*" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/profile" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/admin-*" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
          
          {/* Catch all - redirect to home for unauthenticated, dashboard for authenticated */}
          <Route path="*" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;



