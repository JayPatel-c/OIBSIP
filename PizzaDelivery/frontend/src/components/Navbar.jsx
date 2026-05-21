import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          🍕 Pizza Crafters
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <Link
                    to="/admin"
                    className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}
                  >
                    Admin Hub
                  </Link>
                  <Link
                    to="/admin/inventory"
                    className={`navbar-link ${isActive('/admin/inventory') ? 'active' : ''}`}
                  >
                    Inventory
                  </Link>
                  <Link
                    to="/admin/orders"
                    className={`navbar-link ${isActive('/admin/orders') ? 'active' : ''}`}
                  >
                    Orders Panel
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
                  >
                    Varieties
                  </Link>
                  <Link
                    to="/build"
                    className={`navbar-link ${isActive('/build') ? 'active' : ''}`}
                  >
                    Build Pizza
                  </Link>
                  <Link
                    to="/my-orders"
                    className={`navbar-link ${isActive('/my-orders') ? 'active' : ''}`}
                  >
                    My Orders
                  </Link>
                </>
              )}

              <div className="navbar-user-section">
                <span className="navbar-username">
                  {user.role === 'admin' ? (
                    <span className="badge badge-admin">Admin</span>
                  ) : (
                    <span className="badge badge-user">Guest</span>
                  )}
                  Hi, <strong>{user.name.split(' ')[0]}</strong>
                </span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
