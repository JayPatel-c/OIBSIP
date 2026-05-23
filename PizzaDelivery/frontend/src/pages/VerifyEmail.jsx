import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useScrollReveal from '../hooks/useScrollReveal';

const VerifyEmail = () => {
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const verificationStarted = useRef(false);
  useScrollReveal();

  useEffect(() => {
    // Prevent double-fetching in React StrictMode development environments
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const performVerification = async () => {
      if (!token) {
        setStatus('error');
        setErrorMsg('Invalid verification token.');
        return;
      }

      const res = await verifyEmail(token);
      if (res.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(res.message);
      }
    };

    performVerification();
  }, [token, verifyEmail]);

  return (
    <div className="auth-container">
      <div className="auth-card scroll-reveal-scale text-center" style={{ padding: '40px' }}>
        {status === 'verifying' && (
          <div className="flex-center" style={{ flexDirection: 'column', gap: '20px' }}>
            <div className="spinner"></div>
            <h3>Verifying Email Address</h3>
            <p className="text-muted">Please wait while we validate your activation token...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--success)' }}>Verification Successful!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.6' }}>
              Your account has been fully activated. You are now logged in and can start making custom pizzas!
            </p>
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Varieties
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--danger)' }}>Verification Failed</h3>
            <p className="alert alert-danger" style={{ marginBottom: '30px' }}>
              {errorMsg}
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
              The token might be expired, or already used. Try logging in or requesting a new registration.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary">
                Log In
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register Again
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
