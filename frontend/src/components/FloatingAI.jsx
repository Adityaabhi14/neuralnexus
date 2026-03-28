import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const FloatingAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Welcome to Neural Nexus. How can I augment your experience today?", isBot: true }
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
      // 1. CALL REAL AI HUB API
      const { data } = await api.post('/ai/chat', { message: userMsg });
      
      // 2. MAP REAL AI RESPONSE
      setMessages(prev => [...prev, { 
          text: data.reply || "Connection fragmented. AI Uplink error.", 
          isBot: true 
      }]);
    } catch (error) {
      console.error("AI Node offline.");
      setMessages(prev => [...prev, { 
          text: "Protocol Error: Nexus AI neural handshake failed. Ensure API key is persistent.", 
          isBot: true 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chatbot-container">
      {isOpen && (
        <div className="ai-window">
          {/* Header */}
          <div style={{ padding: '16px 20px', background: 'rgba(59, 130, 246, 0.1)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} />
                <span style={{ fontWeight: '700', fontFamily: 'Poppins', fontSize: '15px' }}>Nexus AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          </div>
          
          {/* Chat Readout */}
          <div style={{ height: '350px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.isBot ? 'flex-start' : 'flex-end',
                background: m.isBot ? 'rgba(255,255,255,0.05)' : 'var(--accent-blue)',
                padding: '12px 16px',
                borderRadius: m.isBot ? '4px 16px 16px 16px' : '16px 16px 4px 16px',
                maxWidth: '85%',
                fontSize: '14px',
                border: m.isBot ? '1px solid var(--glass-border)' : 'none',
                boxShadow: m.isBot ? 'none' : '0 4px 15px rgba(59,130,246,0.3)',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                {m.text}
              </div>
            ))}
            {loading && (
                <div style={{ alignSelf: 'flex-start', color: 'var(--accent-blue)', fontSize: '12px', background: 'var(--glass-bg)', padding: '8px 16px', borderRadius: '16px', border: '1px solid var(--glass-border)', animation: 'pulse 1.5s infinite' }}>
                    Thinking...
                </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input Form */}
          <form style={{ display: 'flex', padding: '16px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }} onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask the Nexus AI..." 
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px 16px', color: '#fff', borderRadius: '20px 0 0 20px', outline: 'none' }}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} style={{ background: 'var(--accent-blue)', border: 'none', color: '#fff', padding: '0 20px', borderRadius: '0 20px 20px 0', cursor: 'pointer', fontWeight: 'bold' }}>
              Send
            </button>
          </form>
        </div>
      )}
      {!isOpen && (
          <button className="ai-toggle-btn" onClick={() => setIsOpen(true)}>
            <div style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>✨</div>
          </button>
      )}
    </div>
  );
};

export default FloatingAI;
