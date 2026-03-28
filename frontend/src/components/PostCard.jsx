import React, { useState } from 'react';
import { timeAgo } from '../utils/formatTime';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const HeartIcon = () => <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.174 2.369 1.174 3.208 0A4.21 4.21 0 0 1 16.792 3.904Z" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>;
const HeartFilledIcon = () => <svg color="#ff3040" fill="#ff3040" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>;
const CommentIcon = () => <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>;
const ShareIcon = () => <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeWidth="2"></polygon></svg>;

const PostCard = ({ post, onLike }) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => { setIsLiked(!isLiked); if(onLike) onLike(post.id); }

  const handlePostComment = async (e) => {
      e.preventDefault();
      if (!newComment.trim()) return;
      const str = localStorage.getItem('currentUser');
      if (!str || str === "undefined") return alert("Authenticate to engage.");
      setCommenting(true);
      try {
          const { data } = await api.post(`/posts/${post.id}/comment`, { text: newComment.trim(), author: JSON.parse(str).name });
          setComments(prev => [...prev, data]);
          setNewComment(''); setShowComments(true);
      } catch { alert('Transmission failed.'); } 
      finally { setCommenting(false); }
  };

  const renderMedia = () => {
    if (!post.mediaUrl) return null;
    const isVideo = post.mediaUrl.match(/\.(mp4|webm)$/i);
    if (isVideo) {
      return (
        <video controls style={{ width: '100%', maxHeight: '600px', objectFit: 'cover', background: '#000' }}>
            <source src={post.mediaUrl} type="video/mp4" />
        </video>
      );
    }
    return <img src={post.mediaUrl} alt="Post media" style={{ width: '100%', objectFit: 'cover', maxHeight: '600px', background: '#000' }} />;
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div onClick={() => navigate(`/profile/${post.author}`)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--glass-border)', overflow: 'hidden', cursor: 'pointer' }}>
            {post.profileImage ? <img src={post.profileImage} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="avatar"/> : 
            <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:'14px'}}>{post.author?.charAt(0).toUpperCase()}</div>}
        </div>
        <div>
          <div onClick={() => navigate(`/profile/${post.author}`)} style={{ fontWeight: '600', fontSize: '15px', cursor: 'pointer', fontFamily: 'Poppins' }}>{post.author}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{timeAgo(post.createdAt)}</div>
        </div>
      </div>
      
      {/* Media or Pure Content */}
      {renderMedia()}
      
      {/* Actions (Like/Comment/Share) */}
      <div style={{ padding: '16px 20px 8px 20px', display: 'flex', gap: '16px' }}>
          <button className="action-btn" onClick={handleLikeClick}>
            {isLiked ? <HeartFilledIcon /> : <HeartIcon />}
          </button>
          <button className="action-btn" onClick={() => setShowComments(!showComments)}><CommentIcon /></button>
          <button className="action-btn" onClick={() => alert("Copied broadcast link!")}><ShareIcon /></button>
      </div>

      {/* Likes Count */}
      <div style={{ padding: '0 20px', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
          {post.likes + (isLiked ? 1 : 0)} likes
      </div>

      {/* Caption */}
      <div style={{ padding: '0 20px', fontSize: '14px', lineHeight: '1.5', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '6px', cursor: 'pointer', fontFamily: 'Poppins' }} onClick={() => navigate(`/profile/${post.author}`)}>{post.author}</span>
          <span style={{ color: 'var(--text-primary)' }}>{post.content || post.title}</span>
      </div>

      {/* Comments */}
      <div style={{ padding: '0 20px' }}>
          {comments.length > 0 && !showComments && (
              <div style={{ color: 'var(--text-muted)', fontSize: '14px', cursor: 'pointer', marginBottom: '8px' }} onClick={() => setShowComments(true)}>
                  View all {comments.length} comments
              </div>
          )}
          {showComments && comments.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                  {comments.map((c, i) => (
                      <div key={i} style={{ fontSize: '14px', lineHeight: '1.4' }}>
                          <span style={{ fontWeight: 'bold', marginRight: '6px' }}>{c.author}</span>
                          <span style={{ color: '#ccc' }}>{c.text}</span>
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* Inline Comment Input Form */}
      <form onSubmit={handlePostComment} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)' }}>
          <input 
              type="text" 
              placeholder="Add a comment..." 
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '14px' }}
          />
          {newComment.trim() && (
              <button 
                  type="submit" 
                  disabled={commenting}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', paddingLeft: '16px', transition: '0.2s' }}
              >
                  Post
              </button>
          )}
      </form>
    </div>
  );
};

export default PostCard;
