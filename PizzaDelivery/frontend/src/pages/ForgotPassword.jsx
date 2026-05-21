import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);
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
      setEmailSent(res.data.emailSent);
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
        {success ? (
          <div className="auth-success-state" style={{ textAlign: 'center', padding: '10px 0' }}>
            <div className="success-icon-wrapper" style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: emailSent
                ? 'linear-gradient(135deg, rgba(52, 211, 153, 0.15), rgba(52, 211, 153, 0.05))'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))',
              border: emailSent
                ? '1px solid rgba(52, 211, 153, 0.3)'
                : '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              boxShadow: emailSent
                ? '0 0 30px rgba(52, 211, 153, 0.15)'
                : '0 0 30px rgba(239, 68, 68, 0.15)',
              fontSize: '40px'
            }}>
              {emailSent ? '🔑' : '⚠️'}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-highlight)',
              marginBottom: '12px'
            }}>
              {emailSent ? 'Reset Email Sent!' : 'Reset Email Not Sent!'}
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '15px',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              {emailSent
                ? 'A secure password reset link has been successfully sent to your registered email address.'
                : 'The password reset request succeeded, but the email could NOT be sent. (Developer fallback active: check your server console for the link!)'}
            </p>
            
            <Link to="/login" className="btn btn-primary btn-block">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h2 className="auth-title">Forgot Password?</h2>
            <p className="auth-subtitle">Get a secure link to reset your account credentials</p>

            {error && <div className="alert alert-danger">{error}</div>}

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

            <p className="auth-footer-text">
              Remember password? <Link to="/login">Back to Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
