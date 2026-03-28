import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import PostCard from '../components/PostCard';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch posts.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLike = async (id) => {
    const str = localStorage.getItem('currentUser');
    if (!str || str === "undefined") return;
    try {
      const { data } = await api.patch(`/posts/${id}/like`);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: data.likes } : p));
    } catch {}
  };

  const filteredPosts = useMemo(() => {
    const lower = (search || '').trim().toLowerCase();
    if (!lower) return posts;
    return posts.filter(p => (p.content || '').toLowerCase().includes(lower));
  }, [posts, search]);

  return (
    <div className="max-w-[800px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Explore</h1>
          <p className="text-sm text-text-muted">Discover new posts and creators.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/create')}>New Post</button>
      </div>

      {/* Search */}
      <div className="relative mb-10">
        <input
          type="text"
          className="form-control rounded-full! py-3.5! pl-14! text-base!"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 opacity-50 text-xl">🔍</div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-0! overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <div className="skeleton w-9 h-9 rounded-full" />
                <div className="flex-1"><div className="skeleton h-3 w-24 rounded" /></div>
              </div>
              <div className="skeleton w-full h-64" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && <div className="alert-error"><strong>Error:</strong> {error}</div>}

      {!loading && filteredPosts.length === 0 && !error ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-5xl mb-4 opacity-50">📡</div>
          <h3 className="text-lg font-semibold mb-1">No posts found.</h3>
          <p className="text-sm text-text-muted">Be the first to share something!</p>
        </motion.div>
      ) : (
        !loading && filteredPosts.map((post, index) => (
          <PostCard key={post.id} post={post} onLike={handleLike} index={index} />
        ))
      )}
    </div>
  );
};

export default Explore;
