import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const Messages = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputText, setInputText] = useState('');
  
  const networkUsers = ['abhi', 'aditya', 'test', 'creator1'];
  const chatEndRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored && stored !== "undefined") {
        setUser(JSON.parse(stored));
      }
    } catch { }

    const syncMessages = async () => {
      try {
        const { data } = await api.get('/messages');
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) { }
    };
    syncMessages();
    const interval = setInterval(syncMessages, 4000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !selectedUser) return;
    try {
      await api.post('/messages', { senderId: user.name, receiverId: selectedUser, text: inputText.trim() });
      setInputText('');
      const { data } = await api.get('/messages');
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {}
  };

  if (!user) return <div className="empty-state">Authenticate to engage in Neural Nexus comms.</div>;

  const relevantMessages = messages
    .filter(m => (m.senderId === user.name && m.receiverId === selectedUser) || (m.senderId === selectedUser && m.receiverId === user.name))
    .sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-dark)', overflow: 'hidden' }}>
      
      {/* Encrypted Contacts List */}
      <div style={{ width: '320px', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', background: 'var(--glass-bg)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', fontSize: '20px', fontWeight: '800', fontFamily: 'Poppins' }}>Comms Hub</div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {networkUsers.filter(u => u !== user.name).map(u => (
            <div 
              key={u}
              onClick={() => setSelectedUser(u)}
              style={{ 
                padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px',
                background: selectedUser === u ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderLeft: selectedUser === u ? '4px solid var(--accent-blue)' : '4px solid transparent',
                transition: '0.2s ease'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '1px solid var(--glass-border)' }}>
                {u.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{u}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)' }}>
            <button className="btn" style={{ width: '100%' }} onClick={() => window.location.href='/'}>← Back to Nexus</button>
        </div>
      </div>

      {/* Main Encrypted Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
        {selectedUser ? (
          <>
            {/* Chat Target Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {selectedUser.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 style={{ fontFamily: 'Poppins', fontSize: '18px' }}>{selectedUser}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--accent-blue)' }}>Encrypted Channel Active</div>
                </div>
            </div>
            
            {/* Chat History Viewport */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {relevantMessages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', padding: '20px', borderRadius: '16px', background: 'var(--glass-bg)' }}>No transmissions established. Secure the channel.</div>
              ) : (
                relevantMessages.map(m => {
                  const isMine = m.senderId === user.name;
                  return (
                    <div key={m.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '65%' }}>
                      <div style={{ 
                        background: isMine ? 'var(--accent-blue)' : 'var(--glass-bg)', 
                        padding: '14px 20px', 
                        borderRadius: isMine ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        border: isMine ? 'none' : '1px solid var(--glass-border)',
                        color: '#fff', wordBreak: 'break-word', fontSize: '15px', lineHeight: '1.4',
                        boxShadow: isMine ? '0 8px 24px rgba(59,130,246,0.3)' : 'var(--glass-shadow)'
                      }}>
                        {m.text}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', textAlign: isMine ? 'right' : 'left' }}>
                        {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Encrypt/Send Payload Form */}
            <form onSubmit={handleSend} style={{ padding: '24px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '16px', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }}>
              <input 
                type="text" 
                className="form-control"
                style={{ flex: 1, borderRadius: '24px', padding: '16px 24px' }}
                placeholder={`Transmitting to ${selectedUser}...`}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '24px', padding: '0 32px' }} disabled={!inputText.trim()}>Send</button>
            </form>
          </>
        ) : (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📡</div>
            <h2>Neural Comms</h2>
            <p>Select a contact to establish transmission.</p>
            <button className="btn" style={{ marginTop: '24px' }} onClick={() => window.location.href='/'}>Return to Hub</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
