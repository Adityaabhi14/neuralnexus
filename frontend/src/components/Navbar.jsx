import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  let user = null;
  try {
    const userStr = localStorage.getItem('currentUser');
    if (userStr && userStr !== "undefined") {
      user = JSON.parse(userStr);
    }
  } catch (error) {
    localStorage.removeItem("currentUser"); 
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Neural Nexus</Link>
      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/explore" className={isActive('/explore')}>Explore</Link>
        
        {user ? (
          <>
            {user.role === 'creator' && (
              <Link to="/create" className={isActive('/create')} style={{ color: '#0ea5e9', fontWeight: '700' }}>+ Create</Link>
            )}
            <Link to={`/profile/${user.name}`} className={isActive(`/profile/${user.name}`)}>Profile</Link>
            
            <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', background: '#333' }}>
                <img src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=111&color=fff&size=28`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{user.name}</span>
            </div>
            <button 
              onClick={handleLogout} 
              style={{ background:'none', border:'none', color:'#ef4444', fontWeight:'600', cursor:'pointer' }}
            >
              Log Out
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
