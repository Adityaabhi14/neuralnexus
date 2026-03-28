import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const GoogleIcon = () => (
  <svg style={{ width: '20px', height: '20px', marginRight: '10px' }} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return setError('Complete all matrix parameters.');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      localStorage.setItem('currentUser', JSON.stringify(data));
      navigate('/');
    } catch (err) { setError('Configuration failed natively.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h1 className="brand-font" style={{ textAlign: 'center', marginBottom: '8px', fontSize: '28px' }}>Neural Nexus</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>Construct your Identity</p>
        
        {error && <div className="alert-error">{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Alias Structure" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="form-group">
            <input type="email" className="form-control" placeholder="Email Core" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <input type="password" className="form-control" placeholder="Security Token" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <select className="form-control" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="user">Standard Node</option>
              <option value="creator">Nexus Creator</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '16px', fontSize: '16px' }} disabled={loading}>
            {loading ? 'Compiling...' : 'Construct Identity'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
            <div style={{ margin: '0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>OR</div>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
        </div>

        <button className="btn btn-google" style={{ width: '100%', padding: '12px', fontSize: '15px' }} onClick={() => alert("Google OAuth UI securely mocked natively.")}>
            <GoogleIcon /> Sign up with Google
        </button>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          Identity matrix active? <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>Initialize Uplink</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
