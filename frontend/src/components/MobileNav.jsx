import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const MobileNav = () => {
  const navigate = useNavigate();
  let user = null;
  try {
    const s = localStorage.getItem('currentUser');
    if (s && s !== "undefined") user = JSON.parse(s);
  } catch {}

  const navItems = [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/explore', icon: '🔍', label: 'Explore' },
  ];

  if (user) {
    navItems.push(
      { to: '/create', icon: '➕', label: 'Create' },
      { to: '/messages', icon: '💬', label: 'Chat' },
      { to: `/profile/${user.name}`, icon: '👤', label: 'Profile' }
    );
  }

  return (
    <nav className="mobile-nav">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-3 text-xs transition-colors duration-200 ${
              isActive ? 'text-accent' : 'text-text-muted'
            }`
          }
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
