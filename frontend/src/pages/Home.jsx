import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import PostCard from '../components/PostCard';

const SkeletonCard = () => (
  <div className="card p-0! overflow-hidden">
    <div className="flex items-center gap-3 p-4">
      <div className="skeleton w-9 h-9 rounded-full" />
      <div className="flex-1">
        <div className="skeleton h-3 w-24 mb-2 rounded" />
        <div className="skeleton h-2 w-16 rounded" />
      </div>
    </div>
    <div className="skeleton w-full h-80" />
    <div className="p-4">
      <div className="skeleton h-3 w-20 mb-3 rounded" />
      <div className="skeleton h-3 w-full mb-2 rounded" />
      <div className="skeleton h-3 w-3/4 rounded" />
    </div>
  </div>
);

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load feed.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const handleLike = async (id) => {
    const str = localStorage.getItem('currentUser');
    if (!str || str === "undefined") return;
    try {
      const { data } = await api.patch(`/posts/${id}/like`);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: data.likes } : p));
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  return (
    <div>
      {/* Skeleton Loaders */}
      {loading && (
        <div className="flex flex-col gap-5">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && error && <div className="alert-error">{error}</div>}

      {!loading && posts.length === 0 && !error ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-5xl mb-4 opacity-50">📸</div>
          <h3 className="text-lg font-semibold mb-1">No Posts Yet</h3>
          <p className="text-text-muted text-sm">Follow creators to see their posts here.</p>
        </motion.div>
      ) : (
        !loading && posts.map((post, index) => (
          <PostCard key={post.id} post={post} onLike={handleLike} index={index} />
        ))
      )}
    </div>
  );
};

export default Home;
