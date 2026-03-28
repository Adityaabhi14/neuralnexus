import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const HeartIcon = () => <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.174 2.369 1.174 3.208 0A4.21 4.21 0 0 1 16.792 3.904Z" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>;
const HeartFilledIcon = () => <svg color="#ff3040" fill="#ff3040" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>;
const CommentIcon = () => <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeWidth="2"></path></svg>;
const ShareIcon = () => <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeWidth="2"></polygon></svg>;

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
};

const PostCard = ({ post, onLike, index = 0 }) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(Array.isArray(post.comments) ? post.comments : []);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  let currentUser = null;
  try {
    const str = localStorage.getItem('currentUser');
    if (str && str !== "undefined") currentUser = JSON.parse(str);
  } catch {}

  const likes = Array.isArray(post.likes) ? post.likes : [];
  const isLiked = currentUser ? likes.includes(currentUser.id) : false;

  const handleLikeClick = () => {
    setLiked(true);
    setTimeout(() => setLiked(false), 600);
    if (onLike) onLike(post.id);
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    setCommenting(true);
    try {
      const { data } = await api.post(`/posts/${post.id}/comment`, { text: newComment.trim() });
      setComments(prev => [...prev, data]);
      setNewComment('');
      setShowComments(true);
    } catch {} finally {
      setCommenting(false);
    }
  };

  const getAiSuggestions = async () => {
    setLoadingSuggestions(true);
    setSuggestions([]);
    try {
      const prompt = `Suggest 3 short, distinct replies (under 5 words each, include an emoji) to this social media post: "${post.content || 'A cool photo/video'}". Format your response ONLY as a JSON array of strings: ["reply 1", "reply 2", "reply 3"]. Do not include markdown formatting or extra text.`;
      const { data } = await api.post('/ai/chat', { message: prompt });
      let output = data.reply.trim();
      if (output.startsWith('```json')) {
        output = output.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }
      const parsed = JSON.parse(output);
      setSuggestions(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error('Failed to get suggestions', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const renderMedia = () => {
    if (!post.mediaUrl) return null;
    const isVideo = post.mediaUrl.match(/\.(mp4|webm|mov)$/i) || post.mediaUrl.includes('video');
    if (isVideo) {
      return <video controls className="w-full max-h-[560px] object-cover bg-black"><source src={post.mediaUrl} type="video/mp4" /></video>;
    }
    return <img src={post.mediaUrl} alt="Post" loading="lazy" className="w-full max-h-[560px] object-cover bg-black" />;
  };

  const displayName = post.author || post.userId || 'Unknown';

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          onClick={() => navigate(`/profile/${displayName}`)}
          className="w-9 h-9 rounded-full overflow-hidden cursor-pointer shrink-0"
        >
          {post.profileImage ? (
            <img src={post.profileImage} className="w-full h-full object-cover" alt="" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-accent to-[#8b5cf6] text-white font-bold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div
            onClick={() => navigate(`/profile/${displayName}`)}
            className="font-semibold text-sm cursor-pointer hover:underline truncate"
          >
            {displayName}
          </div>
          <div className="text-xs text-text-muted">{timeAgo(post.createdAt)}</div>
        </div>
      </div>

      {/* Media */}
      {renderMedia()}

      {/* Actions */}
      <div className="flex gap-3 px-4 pt-3 pb-1">
        <motion.button
          className="action-btn"
          onClick={handleLikeClick}
          whileTap={{ scale: 0.7 }}
          animate={liked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {isLiked ? <HeartFilledIcon /> : <HeartIcon />}
        </motion.button>
        <button className="action-btn" onClick={() => setShowComments(!showComments)}><CommentIcon /></button>
        <button className="action-btn" onClick={() => navigator.clipboard?.writeText(window.location.origin + `/post/${post.id}`)}><ShareIcon /></button>
      </div>

      {/* Likes */}
      <div className="px-4 text-sm font-bold mb-1">
        {likes.length} {likes.length === 1 ? 'like' : 'likes'}
      </div>

      {/* Caption */}
      {post.content && (
        <div className="px-4 text-sm leading-relaxed mb-2">
          <span className="font-bold mr-1.5 cursor-pointer hover:underline" onClick={() => navigate(`/profile/${displayName}`)}>{displayName}</span>
          <span className="text-text-primary">{post.content}</span>
        </div>
      )}

      {/* Comments */}
      <div className="px-4">
        {comments.length > 0 && !showComments && (
          <div className="text-sm text-text-muted cursor-pointer mb-2 hover:text-text-secondary" onClick={() => setShowComments(true)}>
            View all {comments.length} comments
          </div>
        )}
        {showComments && comments.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-3">
            {comments.map((c, i) => (
              <motion.div
                key={i}
                className="text-sm"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="font-bold mr-1.5">{c.author || c.userId}</span>
                <span className="text-text-secondary">{c.text}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Input */}
      {currentUser && (
        <div>
          {/* AI Suggestions Row */}
          {showComments && (
            <div className="px-4 py-2 flex flex-wrap gap-2 items-center">
              {suggestions.length === 0 && !loadingSuggestions ? (
                <button
                  type="button"
                  onClick={getAiSuggestions}
                  className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-text-muted hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  ✨ Auto-Reply
                </button>
              ) : loadingSuggestions ? (
                <div className="px-2.5 py-1 text-xs text-accent animate-pulse">Thinking... ⚡</div>
              ) : (
                suggestions.map((s, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => setNewComment(s)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-linear-to-r from-[rgba(59,130,246,0.15)] to-[rgba(139,92,246,0.15)] border border-[rgba(59,130,246,0.3)] text-white hover:border-accent cursor-pointer transition-colors"
                  >
                    {s}
                  </motion.button>
                ))
              )}
            </div>
          )}

          <form onSubmit={handlePostComment} className="flex items-center px-4 py-3 border-t border-glass-border">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-white outline-none placeholder:text-text-muted"
          />
          {newComment.trim() && (
            <motion.button
              type="submit"
              disabled={commenting}
              className="text-accent font-bold text-sm pl-4 hover:text-accent-hover transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Post
            </motion.button>
          )}
        </form>
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;
