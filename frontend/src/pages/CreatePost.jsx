import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content && !file) return setError('Please add content or attach a file.');

    let user;
    try {
      const str = localStorage.getItem('currentUser');
      if (!str || str === "undefined") throw new Error();
      user = JSON.parse(str);
      if (user.role !== 'creator') return setError('Only creators can post to the feed.');
    } catch {
      return setError('Authentication corrupted. Please log in again.');
    }

    setLoading(true);
    setError('');

    try {
      let finalMediaUrl = '';

      // 1. Raw Multipart Form Data Upload
      if (file) {
          const formData = new FormData();
          formData.append('file', file);
          
          const uploadRes = await api.post('/upload', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          finalMediaUrl = `http://localhost:5000${uploadRes.data.url}`; // Construct static resolution path natively
      }

      // 2. Submit Core Post Payload
      await api.post('/posts', {
        title: "Creator Post", // Simple fallback parsing
        content: content.trim(),
        mediaUrl: finalMediaUrl,
        author: user.name
      });

      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to sync post natively. Ensure backend node is listening.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <h1 className="page-title">Broadcast Update</h1>
      
      <div className="card">
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handlePost}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Message</label>
            <textarea 
              className="form-control" 
              placeholder="What's happening?"
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{ minHeight: '120px', resize: 'vertical' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Attach File (Image/Video)</label>
            <input 
                type="file" 
                onChange={e => setFile(e.target.files[0])} 
                className="form-control"
                style={{ padding: '8px 12px' }}
                accept="image/*,video/*"
            />
            {file && <div style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-muted)' }}>Selected: {file.name}</div>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Uploading Binary...' : 'Launch Broadcast'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
