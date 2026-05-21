import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingLocal(true);

    const res = await login(email, password);
    setLoadingLocal(false);

    if (res.success) {
      // Re-route based on role
      const token = localStorage.getItem('token');
      // The context loads user, so we check token existence and navigate
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleQuickLogin = async (role) => {
    setError('');
    setLoadingLocal(true);

    const testEmail = role === 'admin' ? 'admin@pizzashop.com' : 'user@pizzashop.com';
    const testPassword = role === 'admin' ? 'adminpassword123' : 'userpassword123';

    setEmail(testEmail);
    setPassword(testPassword);

    const res = await login(testEmail, testPassword);
    setLoadingLocal(false);

    if (res.success) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your Pizza Crafters account</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="flex-between">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '14px', color: 'var(--accent)' }}>
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loadingLocal}>
            {loadingLocal ? 'Signing you in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-text">
          New to Pizza Crafters? <Link to="/register">Create an account</Link>
        </p>

        <div className="auth-divider">
          <span>Demo Accounts</span>
        </div>

        <div className="demo-accounts-grid">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickLogin('user')}
            disabled={loadingLocal}
          >
            Quick User Login
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickLogin('admin')}
            disabled={loadingLocal}
          >
            Quick Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
