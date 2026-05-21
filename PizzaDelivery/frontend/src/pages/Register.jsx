import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user'); // default is user, but we can register as admin too!
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoadingLocal(true);

    const res = await register(name, email, password, phone, role);
    setLoadingLocal(false);

    if (res.success) {
      setSuccess(res.message);
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
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join Pizza Crafters for gourmet custom delivery</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success" style={{ lineHeight: '1.5' }}>
            <strong>Account Created!</strong>
            <br />
            {success}
            <br />
            <br />
            <small style={{ display: 'block', color: 'var(--text-secondary)' }}>
              <em>Check the Node.js backend console to copy the verification link instantly!</em>
            </small>
          </div>
        )}

        {!success && (
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
        )}

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
