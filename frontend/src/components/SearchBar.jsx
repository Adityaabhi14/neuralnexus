import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get(`/users/search?q=${encodeURIComponent(value.trim())}`);
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = (user) => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    navigate(`/profile/${user.name}`);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', padding: '0 12px', marginBottom: '16px' }}>
      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: '14px', pointerEvents: 'none' }}>🔍</div>
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => { if (query.trim() && results.length) setShowDropdown(true); }}
          style={{
            width: '100%',
            padding: '10px 14px 10px 38px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
            transition: 'all 0.2s',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Floating Dropdown */}
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '12px',
          right: '12px',
          marginTop: '6px',
          background: 'rgba(18, 18, 24, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          zIndex: 999,
          maxHeight: '320px',
          overflowY: 'auto',
          padding: '6px',
        }}>
          {/* Loading */}
          {loading && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              <div style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-blue)', borderRadius: '50%', animation: 'searchSpin 0.6s linear infinite', marginRight: '8px', verticalAlign: 'middle' }} />
              Searching...
              <style>{`@keyframes searchSpin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && results.map((user) => (
            <div
              key={user.id}
              onClick={() => handleSelect(user)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {/* Avatar */}
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#222' }}>
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.followersCount || 0} followers</div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {!loading && results.length === 0 && query.trim() && (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px', opacity: 0.4 }}>🔍</div>
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
