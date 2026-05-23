import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import useScrollReveal from '../hooks/useScrollReveal';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loadUser } = useAuth();
  const navigate = useNavigate();
  useScrollReveal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      const res = await api.put(`/auth/resetpassword/${token}`, { password });
      localStorage.setItem('token', res.data.token);
      await loadUser(); // refresh user context
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired password reset token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card scroll-reveal-scale">
        <h2 className="auth-title">Set New Password</h2>
        <p className="auth-subtitle">Choose a strong, secure password for your account</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success text-center">
            <strong>Password Reset Complete!</strong>
            <p style={{ margin: '10px 0 20px', color: 'var(--text-secondary)' }}>
              Your password has been changed successfully. You are now logged in!
            </p>
            <Link to="/dashboard" className="btn btn-primary">
              Go to Varieties
            </Link>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">New Password (min 6 characters)</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Updating Password...' : 'Save & Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
