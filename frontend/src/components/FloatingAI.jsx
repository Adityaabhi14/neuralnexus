import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const FloatingAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { text: data.reply || "Something went wrong. Please try again.", isBot: true }]);
    } catch {
      setMessages(prev => [...prev, { text: "AI is currently unavailable. Please try again later.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-window"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-card-border">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
                <span className="font-bold text-sm">AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="bg-transparent border-none text-text-muted cursor-pointer text-lg hover:text-white transition-colors">✕</button>
            </div>

            {/* Messages */}
            <div className="h-[350px] overflow-y-auto p-5 flex flex-col gap-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.isBot ? -12 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                  className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                    m.isBot
                      ? 'self-start rounded-[4px_16px_16px_16px] bg-bg-deeper border border-card-border'
                      : 'self-end rounded-[16px_16px_4px_16px] bg-accent shadow-[0_4px_12px_var(--color-accent-glow)]'
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
              {loading && (
                <div className="self-start text-accent text-xs bg-card px-4 py-2 rounded-2xl border border-card-border animate-pulse">
                  Thinking...
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form className="flex p-4 border-t border-card-border bg-[rgba(0,0,0,0.15)]" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Ask me anything..."
                className="flex-1 bg-bg-deeper border border-card-border px-4 py-3 text-white rounded-l-full outline-none text-sm placeholder:text-text-muted"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()} className="bg-accent border-none text-white px-5 rounded-r-full cursor-pointer font-bold text-sm hover:bg-accent-hover transition-colors disabled:opacity-40">
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          className="ai-toggle-btn"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          ✨
        </motion.button>
      )}
    </div>
  );
};

export default FloatingAI;
