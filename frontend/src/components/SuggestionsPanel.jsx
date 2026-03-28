import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SuggestionsPanel = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored && stored !== "undefined") setUser(JSON.parse(stored));
    } catch {}

    const fetchSuggestions = async () => {
      try {
        const { data } = await api.get('/users/suggestions');
        setSuggestions(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch {}
    };
    fetchSuggestions();
  }, []);

  const handleFollow = async (targetName) => {
    if (!user) return;
    try {
      await api.patch('/users/follow', { currentUsername: user.name, targetUsername: targetName });
      setSuggestions(prev => prev.filter(s => s.name !== targetName));
    } catch {}
  };

  const Avatar = ({ name, image, size = 40 }) => (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#222' }}>
      {image ? (
        <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', fontWeight: 'bold', fontSize: Math.round(size * 0.4) }}>
          {name?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );

  if (!user) return null;

  return (
    <div className="sticky top-8">
      {/* Current User */}
      <div className="flex items-center gap-3 mb-7 px-1">
        <Avatar name={user.name} image={user.profileImage} size={44} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm cursor-pointer hover:underline" onClick={() => navigate(`/profile/${user.name}`)}>
            {user.name}
          </div>
          <div className="text-xs text-text-muted">{user.email}</div>
        </div>
      </div>

      {/* Suggestions Header */}
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-[13px] font-semibold text-text-muted tracking-wide">Suggested for you</span>
      </div>

      {/* Users List */}
      <div className="flex flex-col gap-3.5 relative z-10 pointer-events-auto">
        {suggestions.filter(s => s.name !== user.name).map(s => (
          <div 
            key={s.id || s.name} 
            className="flex items-center gap-3 px-1 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] p-1.5 rounded-lg -mx-1.5 transition-colors"
            onClick={() => navigate(`/profile/${s.name}`)}
          >
            <Avatar name={s.name} image={s.profileImage} size={36} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[13px] truncate">
                {s.name}
              </div>
              <div className="text-[11px] text-text-muted">
                {s.followers?.length || 0} followers
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFollow(s.name);
              }}
              className="bg-transparent border-none text-accent font-bold text-xs cursor-pointer py-1 shrink-0 hover:text-white transition-colors relative z-20 pointer-events-auto"
            >
              Follow
            </button>
          </div>
        ))}
        {suggestions.filter(s => s.name !== user.name).length === 0 && (
          <div className="text-[13px] text-text-muted px-1">No suggestions right now.</div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 px-1 text-[11px] text-[rgba(255,255,255,0.2)] leading-relaxed">
        Neural Nexus · 2026
      </div>
    </div>
  );
};

export default SuggestionsPanel;
