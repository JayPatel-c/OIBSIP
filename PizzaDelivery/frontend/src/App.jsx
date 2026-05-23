import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Global Motion Components
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

// Protected User Pages
import Dashboard from './pages/Dashboard';
import BuildPizza from './pages/BuildPizza';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';

// Protected Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageInventory from './pages/admin/ManageInventory';
import ManageOrders from './pages/admin/ManageOrders';

import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const authRoutes = ['/login', '/register', '/forgot-password'];
  const isAuthRoute = authRoutes.includes(location.pathname) || 
                      location.pathname.startsWith('/reset-password') || 
                      location.pathname.startsWith('/verify-email');

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-wrapper">
      <Navbar />
      {!isHome && (
        <>
          <div className={isAuthRoute ? "auth-page-bg" : "inner-page-bg"} />
          <div className="inner-page-grain" />
        </>
      )}
      <main className={`main-content ${!isHome ? 'main-content--inner' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/build"
            element={
              <ProtectedRoute>
                <BuildPizza />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute adminOnly={true}>
                <ManageInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly={true}>
                <ManageOrders />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SmoothScroll>
          <CustomCursor />
          <AppContent />
        </SmoothScroll>
      </AuthProvider>
    </Router>
  );
}

export default App;
