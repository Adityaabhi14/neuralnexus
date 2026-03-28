import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  // Traditional Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Email and Password are required.');
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('currentUser', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Callback
  const handleGoogleResponse = async (response) => {
    if (!response.credential) return setError('Google authentication failed.');
    
    setGoogleLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/google', { token: response.credential });
      localStorage.setItem('currentUser', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Initialize Google Identity Services
  useEffect(() => {
    const initGoogleSignIn = () => {
      if (!window.google || !GOOGLE_CLIENT_ID) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'pill',
        });
      }
    };

    // Wait for the GSI script to load
    if (window.google) {
      initGoogleSignIn();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogleSignIn();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Manual Google Popup Trigger (fallback if no GOOGLE_CLIENT_ID)
  const handleManualGoogleClick = () => {
    if (GOOGLE_CLIENT_ID && window.google) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Client ID not configured. Add VITE_GOOGLE_CLIENT_ID to your .env');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="brand-font" style={{ textAlign: 'center', marginBottom: '8px', fontSize: '28px' }}>Neural Nexus</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>Sign in to your account</p>
        
        {error && <div className="alert-error">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '16px', fontSize: '16px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
            <div style={{ margin: '0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>OR</div>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
        </div>

        {/* Real Google Sign-In Button */}
        {GOOGLE_CLIENT_ID ? (
          <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center' }} />
        ) : (
          <button 
            className="btn" 
            style={{ 
              width: '100%', padding: '12px', fontSize: '15px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '24px',
              cursor: 'pointer', color: '#fff'
            }} 
            onClick={handleManualGoogleClick}
            disabled={googleLoading}
          >
            <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            {googleLoading ? 'Connecting to Google...' : 'Sign in with Google'}
          </button>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
