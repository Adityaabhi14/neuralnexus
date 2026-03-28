import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AskQuestion = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return setError('Please provide both a title and details.');
    
    let user;
    try {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr || userStr === "undefined") {
        throw new Error('You must be signed in to initialize a new topic.');
      }
      user = JSON.parse(userStr);
    } catch (err) {
      setError('You must be signed in to initialize a new topic.');
      localStorage.removeItem('currentUser'); // purge corrupted tokens
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/questions', {
        title: title.trim(),
        body: body.trim(),
        author: user.name || "Anonymous User"
      });
      // Ensure backend gave us an ID
      if (data && data.id) {
        navigate(`/question/${data.id}`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Failed to post:", err);
      setError(err.response?.data?.message || 'Failed to publish your question. Please ensure the backend server is running.');
    } finally {
      // Must separate setLoading because navigate() runs instantly but if it fails we need to unlock.
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: 'auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', fontWeight:'600', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.4rem' }}
      >
        ← Cancel
      </button>

      <h1 className="page-title" style={{ borderBottom: 'none', paddingBottom: 0 }}>Start a Discussion</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Frame your challenge clearly to get the best insights from the community.
      </p>

      {error && <div className="alert-error"><strong>Error: </strong>{error}</div>}

      <form onSubmit={handleSumbit} className="card" style={{ padding: '2.5rem 2rem' }}>
        <div className="form-group">
          <label>Topic Title</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g. Best architecture for a real-time chat application?"
            value={title} 
            onChange={e => setTitle(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Context & Details</label>
          <textarea 
            className="form-control" 
            placeholder="Provide context, constraints, and what you have already tried..."
            value={body} 
            onChange={e => setBody(e.target.value)} 
            style={{ minHeight: '180px' }}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn" disabled={loading || !title.trim() || !body.trim()}>
            {loading ? 'Publishing...' : 'Publish Discussion'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestion;
