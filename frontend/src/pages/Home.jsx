import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import QuestionCard from '../components/QuestionCard';

const Home = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const [postsData, questionsData] = await Promise.all([
            api.get('/posts').catch(() => ({ data: [] })),
            api.get('/questions').catch(() => ({ data: [] }))
        ]);
        
        const rawP = Array.isArray(postsData.data) ? postsData.data.map(p => ({...p, type: 'post'})) : [];
        const rawQ = Array.isArray(questionsData.data) ? questionsData.data.map(q => ({...q, type: 'question'})) : [];
        
        setFeed([...rawP, ...rawQ].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        setError('Failed to load feed.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const handleLike = async (id) => {
    let userStr = localStorage.getItem('currentUser');
    if (!userStr || userStr === "undefined") return alert('Sign in to interact.');
    try { await api.patch(`/posts/${id}/like`); } catch (err) { console.error("Like transmission failed"); }
  };

  const handleUpvote = async (id) => {
    let userStr = localStorage.getItem('currentUser');
    if (!userStr || userStr === "undefined") return alert('Sign in to interact.');
    try { await api.patch(`/questions/${id}/upvote`); } catch (err) { console.error("Upvote failed"); }
  }

  return (
    <div>
      {/* Skeleton Feed loading state seamlessly matching standard background components */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[1,2].map(i => (
             <div key={i} className="card" style={{ height: '300px', opacity: 0.5, animation: 'pulse 1.5s infinite ease-in-out' }} />
          ))}
          <style>{`@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 0.2; } 100% { opacity: 0.5; } }`}</style>
        </div>
      )}
      
      {!loading && error && <div className="alert-error">{error}</div>}

      {!loading && feed.length === 0 && !error ? (
        <div className="empty-state">
          <h3>Your Feed is Empty</h3>
          <p>Posts and discussions will appear here.</p>
        </div>
      ) : (
        !loading && feed.map(item => (
            item.type === 'post' 
               ? <PostCard key={`post-${item.id}`} post={item} onLike={handleLike} />
               : <QuestionCard key={`q-${item.id}`} question={item} onClick={() => window.location.href=`/question/${item.id}`} onUpvote={handleUpvote} />
        ))
      )}
    </div>
  );
};

export default Home;
