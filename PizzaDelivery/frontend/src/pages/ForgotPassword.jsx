import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(false);

    try {
      setLoading(true);
      const res = await api.post('/auth/forgotpassword', { email });
      setSuccess(res.data.message || 'Password reset link sent to email!');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password?</h2>
        <p className="auth-subtitle">Get a secure link to reset your account credentials</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success" style={{ lineHeight: '1.5' }}>
            <strong>Reset Request Sent!</strong>
            <br />
            {success}
            <br />
            <br />
            <small style={{ display: 'block', color: 'var(--text-secondary)' }}>
              <em>Check the Node.js backend console to copy the reset link instantly!</em>
            </small>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Registered Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Sending Request...' : 'Send Password Reset Link'}
            </button>
          </form>
        )}

        <p className="auth-footer-text">
          Remember password? <Link to="/login">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
