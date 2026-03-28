import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Safe parsing block 
  let user = null;
  try {
    const userStr = localStorage.getItem('currentUser');
    if (userStr && userStr !== "undefined") {
      user = JSON.parse(userStr);
    }
  } catch (error) {
    console.warn("Failed to parse currentUser from localStorage", error);
    localStorage.removeItem("currentUser"); 
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Nexus AI</Link>
      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>Feed</Link>
        <Link to="/explore" className={isActive('/explore')}>Explore Q&A</Link>
        
        {user ? (
          <>
            {user.role === 'creator' && (
              <Link to="/create" className={isActive('/create')} style={{ color: '#0ea5e9', fontWeight: '700' }}>+ Create</Link>
            )}
            <Link to={`/profile/${user.name}`} className={isActive(`/profile/${user.name}`)}>Profile</Link>
            
            <div className="nav-user" style={{ marginLeft: '1rem' }}>👋 {user.name}</div>
            <button 
              onClick={handleLogout} 
              style={{ background:'none', border:'none', color:'#ef4444', fontWeight:'600', cursor:'pointer' }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive('/login')}>Log In</Link>
            <Link to="/register" className={isActive('/register')} style={{ 
              background: '#0f172a', color: '#fff', padding: '0.4rem 1rem', borderRadius: '20px' 
            }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
