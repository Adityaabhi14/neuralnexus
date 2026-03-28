import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch (err) {
        setError('Post not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="empty-state">Loading specific broadcast...</div>;
  
  if (error || !post) return (
    <div className="empty-state">
      <h3>Broadcast Missing</h3>
      <p>{error}</p>
      <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Return to Feed</button>
    </div>
  );

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', paddingTop: '24px' }}>
        <button 
            className="btn mb-6" 
            onClick={() => navigate(-1)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
            ← Back
        </button>
        <PostCard post={post} />
    </div>
  );
};

export default PostDetail;
