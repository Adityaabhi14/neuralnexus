import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import Loader from '../components/Loader';

const Explore = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await api.get('/questions');
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.warn("API did not return an array. Creating empty safely.", data);
          setQuestions([]);
        }
      } catch (err) {
        console.error("Explore Page Fetch Error:", err);
        setError(err.response?.data?.message || 'We could not fetch the latest questions at this time.');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleUpvote = async (id) => {
    try {
      let userStr = localStorage.getItem('currentUser');
      if (!userStr || userStr === "undefined") {
        alert('You must sign in to upvote questions.');
        return;
      }

      setQuestions(prev => Array.isArray(prev) ? prev.map(q => q.id === id ? { ...q, upvotes: (q.upvotes || 0) + 1 } : q) : []);
      await api.patch(`/questions/${id}/upvote`);
    } catch (err) {
      console.error('Failed to upvote', err);
      setQuestions(prev => Array.isArray(prev) ? prev.map(q => q.id === id ? { ...q, upvotes: Math.max((q.upvotes || 0) - 1, 0) } : q) : []);
    }
  };

  const filteredQuestions = useMemo(() => {
    const safeQuestions = Array.isArray(questions) ? questions : [];
    const lowerSearch = (search || '').trim().toLowerCase();
    
    if (!lowerSearch) return safeQuestions;
    
    return safeQuestions.filter(q => {
      const qTitle = (q.title || '').toLowerCase();
      const qBody = (q.body || '').toLowerCase();
      return qTitle.includes(lowerSearch) || qBody.includes(lowerSearch);
    });
  }, [questions, search]);

  return (
    <div>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
            <h1 className="brand-font" style={{ fontSize: '28px', marginBottom: '8px' }}>Neural Discover</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Explore the collective intelligence of the Nexus.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/ask')}>Start Discussion</button>
      </div>

      <div style={{ position: 'relative', marginBottom: '48px' }}>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Filter the neural grid..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
              borderRadius: '24px', 
              padding: '16px 24px 16px 56px', 
              fontSize: '16px', 
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)'
          }}
        />
        <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '20px' }}>🔍</div>
      </div>

      {loading && <Loader message="Fetching community discussions..." />}
      
      {!loading && error && (
        <div className="alert-error">
          <strong>Backend Connection Error:</strong> {error}
        </div>
      )}

      {!loading && filteredQuestions.length === 0 && !error ? (
        <div className="empty-state">
          <h3>No insights found.</h3>
          <p style={{ marginTop: '0.5rem' }}>Be the first to initiate a topic and share knowledge!</p>
        </div>
      ) : (
        !loading && filteredQuestions.map(q => (
          <QuestionCard 
            key={q.id} 
            question={q || {}} 
            onClick={() => navigate(`/question/${q.id}`)}
            onUpvote={handleUpvote}
          />
        ))
      )}
    </div>
  </div>
  );
};

export default Explore;
