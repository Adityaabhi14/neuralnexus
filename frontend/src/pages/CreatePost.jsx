import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview('');
    setUploadProgress(0);
  };

  const generateCaption = async () => {
    setAiLoading(true);
    try {
      const prompt = file
        ? `Generate a short, engaging social media caption for a post with a ${file.type.startsWith('video/') ? 'video' : 'photo'}. Keep it casual, trendy, and under 200 characters. Add 2-3 relevant emojis. Don't use quotes around it.`
        : `Generate a short, engaging social media caption for a general post. Keep it casual, trendy, and under 200 characters. Add 2-3 relevant emojis. Don't use quotes around it.`;

      const { data } = await api.post('/ai/chat', { message: prompt });
      if (data.reply) {
        setContent(data.reply.replace(/^["']|["']$/g, ''));
      }
    } catch {
      setError('AI is unavailable right now. Try again later.');
    } finally {
      setAiLoading(false);
    }
  };

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
      return setError('Please log in again.');
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      let finalMediaUrl = '';
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/upload/post', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        });
        finalMediaUrl = uploadRes.data.url;
      }

      await api.post('/posts', {
        title: "Creator Post",
        content: content.trim(),
        mediaUrl: finalMediaUrl,
        author: user.name
      });

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to share post. Ensure backend is online.');
    } finally {
      setLoading(false);
    }
  };

  const isVideo = file?.type?.startsWith('video/');

  return (
    <div className="pb-16">
      <h1 className="page-title">Create Post</h1>

      <div className="card p-6!">
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handlePost}>

          {/* Caption Input */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-sm">Caption</label>

              {/* AI Generate Button */}
              <motion.button
                type="button"
                onClick={generateCaption}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-linear-to-r from-accent to-[#8b5cf6] text-white border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.04, boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}
                whileTap={{ scale: 0.96 }}
              >
                <AnimatePresence mode="wait">
                  {aiLoading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, rotate: 0 }}
                      animate={{ opacity: 1, rotate: 360 }}
                      exit={{ opacity: 0 }}
                      transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.15 } }}
                      className="inline-block"
                    >
                      ⚡
                    </motion.span>
                  ) : (
                    <motion.span
                      key="sparkle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      ✨
                    </motion.span>
                  )}
                </AnimatePresence>
                {aiLoading ? 'Generating...' : 'AI Caption'}
              </motion.button>
            </div>

            <textarea
              className="form-control w-full"
              placeholder="What's happening?"
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{ minHeight: '120px', resize: 'vertical' }}
            />
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block font-semibold text-sm mb-2">Add Photo or Video</label>
            <label className="flex items-center justify-center gap-2 py-5 border-2 border-dashed border-card-border rounded-xl cursor-pointer text-text-muted text-sm transition-colors hover:border-accent hover:text-text-secondary bg-[rgba(255,255,255,0.02)]">
              📎 Click to select image or video
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*"
              />
            </label>
          </div>

          {/* Preview */}
          <AnimatePresence>
            {preview && (
              <motion.div
                className="mb-6 relative rounded-xl overflow-hidden border border-card-border"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isVideo ? (
                  <video src={preview} controls className="w-full max-h-[300px] object-cover block bg-black" />
                ) : (
                  <img src={preview} alt="Preview" className="w-full max-h-[300px] object-cover block" />
                )}
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[rgba(0,0,0,0.7)] text-white border-none cursor-pointer text-sm font-bold flex items-center justify-center hover:bg-[rgba(0,0,0,0.9)] transition-colors"
                >✕</button>
                <div className="px-3 py-2 text-xs text-text-muted bg-[rgba(0,0,0,0.3)]">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <div className="mb-4">
              <div className="h-1 bg-card-border rounded overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="text-xs text-text-muted mt-1 text-center">{uploadProgress}%</div>
            </div>
          )}

          <motion.button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? `Uploading${uploadProgress > 0 ? ` (${uploadProgress}%)` : '...'}` : 'Share Post'}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
