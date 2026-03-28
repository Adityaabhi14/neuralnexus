import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored && stored !== "undefined") {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem('currentUser');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login'; 
  };

  return (
    <nav className="sidebar">
      <div style={{ marginBottom: '40px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '8px', boxShadow: '0 0 15px rgba(59,130,246,0.5)' }} />
        <h2 className="brand-font" style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', background: 'linear-gradient(to right, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Neural Nexus
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span style={{ fontSize: '20px' }}>🔮</span> <span>Nexus Feed</span>
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span style={{ fontSize: '20px' }}>🌍</span> <span>Discover</span>
        </NavLink>
        
        {user && (
          <>
            <NavLink to="/messages" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span style={{ fontSize: '20px' }}>💬</span> <span>Comms</span>
            </NavLink>
            <NavLink to={`/profile/${user.name}`} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span style={{ fontSize: '20px' }}>👤</span> <span>Identity</span>
            </NavLink>
            
            {user.role === 'creator' && (
              <NavLink to="/create" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={{ marginTop: '24px', border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.05)' }}>
                <span style={{ fontSize: '20px' }}>✨</span> <span>Broadcast</span>
              </NavLink>
            )}
          </>
        )}
      </div>

      {!user ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/login')}>Initialize Uplink</button>
        </div>
      ) : (
        <div className="card" style={{ padding: '16px', marginBottom: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#333' }}>
                <img src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=111&color=fff`} style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover' }} alt="Avatar" />
            </div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>{user.name}</div>
          </div>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#fca5a5', fontWeight: '600', cursor: 'pointer', textAlign: 'left', padding: '8px 0', fontSize: '13px' }}>Terminate Sector</button>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
