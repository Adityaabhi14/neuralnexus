import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored && stored !== "undefined") setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem('currentUser');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? 'active' : ''}`;

  return (
    <nav className="sidebar">
      {/* Brand */}
      <div className="brand-section flex items-center gap-3 px-4 py-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent to-[#8b5cf6] shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
        <h2 className="text-xl font-extrabold tracking-tight bg-linear-to-r from-white to-text-secondary bg-clip-text text-transparent">
          Neural Nexus
        </h2>
      </div>

      <SearchBar />

      {/* Navigation */}
      <div className="flex flex-col gap-1 flex-1 mt-2">
        <NavLink to="/" className={linkClass}>
          <span className="text-xl">🏠</span> <span>Home</span>
        </NavLink>
        <NavLink to="/explore" className={linkClass}>
          <span className="text-xl">🔍</span> <span>Explore</span>
        </NavLink>

        {user && (
          <>
            <NavLink to="/messages" className={linkClass}>
              <span className="text-xl">💬</span> <span>Messages</span>
            </NavLink>
            <NavLink to={`/profile/${user.name}`} className={linkClass}>
              <span className="text-xl">👤</span> <span>Profile</span>
            </NavLink>
            <NavLink
              to="/create"
              className={linkClass}
              style={{ marginTop: '8px' }}
            >
              <span className="text-xl">➕</span> <span>Create Post</span>
            </NavLink>
          </>
        )}
      </div>

      {/* Footer */}
      {!user ? (
        <button className="btn btn-primary w-full" onClick={() => navigate('/login')}>Log In</button>
      ) : (
        <div className="card mb-0! p-4!">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#333] shrink-0">
              <img src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=111&color=fff`} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="font-semibold text-sm truncate">{user.name}</div>
          </div>
          <button onClick={handleLogout} className="text-red-400 font-semibold text-xs cursor-pointer bg-transparent border-none hover:text-red-300 transition-colors">
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
