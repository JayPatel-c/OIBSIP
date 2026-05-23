import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useScrollReveal from '../hooks/useScrollReveal';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user'); // default is user, but we can register as admin too!
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const { register } = useAuth();
  useScrollReveal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoadingLocal(true);

    const res = await register(name, email, password, phone, role);
    setLoadingLocal(false);

    if (res.success) {
      setSuccess(res.message);
      setEmailSent(res.emailSent);
      // Clear fields
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card scroll-reveal-scale">
        {success ? (
          <div className="auth-success-state" style={{ textAlign: 'center', padding: '10px 0' }}>
            <div className="success-icon-wrapper animate-float" style={{
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
              {emailSent ? '🍕' : '⚠️'}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-highlight)',
              marginBottom: '12px'
            }}>
              {emailSent ? 'Verification Email Sent!' : 'Verification Email Not Sent!'}
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '15px',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              {emailSent
                ? 'Registration successful! The verification link has been successfully sent to your email inbox. Please verify your account before logging in.'
                : 'Registration successful, but the verification link could NOT be sent to your email. (Developer fallback active: check your server console for the link!)'}
            </p>
            
            <Link to="/login" className="btn btn-primary btn-block">
              Proceed to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join Pizza Crafters for gourmet custom delivery</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="10 digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password (min 6 characters)</label>
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
                <label htmlFor="role">Account Type</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">User Account (Order Pizzas)</option>
                  <option value="admin">Store Owner (Admin Dashboard)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loadingLocal}>
                {loadingLocal ? 'Creating your account...' : 'Sign Up'}
              </button>
            </form>

            <p className="auth-footer-text">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
