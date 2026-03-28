import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Avatar = ({ name, image, size = 44 }) => (
  <div className="rounded-full overflow-hidden shrink-0 bg-[#222]" style={{ width: size, height: size }}>
    {image ? (
      <img src={image} alt={name} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-accent to-[#8b5cf6] text-white font-bold" style={{ fontSize: Math.round(size * 0.4) }}>
        {name?.charAt(0).toUpperCase()}
      </div>
    )}
  </div>
);

const Messages = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored && stored !== "undefined") setUser(JSON.parse(stored));
    } catch {}

    const fetchData = async () => {
      try {
        const [msgRes, usersRes] = await Promise.all([
          api.get('/messages').catch(() => ({ data: [] })),
          api.get('/users/suggestions').catch(() => ({ data: [] }))
        ]);
        setMessages(Array.isArray(msgRes.data) ? msgRes.data : []);
        setContacts(Array.isArray(usersRes.data) ? usersRes.data : []);
      } catch {}
    };
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !selectedUser) return;
    try {
      await api.post('/messages', { senderId: user.name, receiverId: selectedUser.name, text: inputText.trim() });
      setInputText('');
      const { data } = await api.get('/messages');
      setMessages(Array.isArray(data) ? data : []);
    } catch {}
  };

  if (!user) return (
    <div className="flex h-screen items-center justify-center bg-bg-dark">
      <div className="empty-state">
        <h3 className="text-lg font-semibold mb-3">Please log in to view messages</h3>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Log In</button>
      </div>
    </div>
  );

  const getLastMessage = (contactName) => {
    return messages
      .filter(m => (m.senderId === user.name && m.receiverId === contactName) || (m.senderId === contactName && m.receiverId === user.name))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  };

  const relevantMessages = selectedUser ? messages
    .filter(m => (m.senderId === user.name && m.receiverId === selectedUser.name) || (m.senderId === selectedUser.name && m.receiverId === user.name))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) : [];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-dark">

      {/* LEFT: Contacts */}
      <div className={`w-[340px] max-md:w-full border-r border-glass-border flex flex-col bg-[rgba(10,10,15,0.95)] ${selectedUser ? 'max-md:hidden' : ''}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-glass-border">
          <h2 className="text-xl font-bold">Messages</h2>
          <button onClick={() => navigate('/')} className="bg-transparent border-none text-text-muted cursor-pointer text-sm font-semibold hover:text-white transition-colors">← Home</button>
        </div>

        <div className="overflow-y-auto flex-1">
          {contacts.filter(c => c.name !== user.name).length === 0 ? (
            <div className="p-10 text-center text-text-muted text-sm">
              <div className="text-4xl mb-3 opacity-40">💬</div>
              No conversations yet
            </div>
          ) : (
            contacts.filter(c => c.name !== user.name).map(contact => {
              const lastMsg = getLastMessage(contact.name);
              const isSelected = selectedUser?.name === contact.name;
              return (
                <motion.div
                  key={contact.id}
                  onClick={() => setSelectedUser(contact)}
                  className={`flex items-center gap-3.5 px-5 py-3.5 cursor-pointer transition-all duration-150 border-l-3 ${
                    isSelected
                      ? 'bg-[rgba(59,130,246,0.08)] border-l-accent'
                      : 'border-l-transparent hover:bg-[rgba(255,255,255,0.03)]'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar name={contact.name} image={contact.profileImage} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[15px] mb-0.5">{contact.name}</div>
                    <div className="text-[13px] text-text-muted truncate">
                      {lastMsg ? lastMsg.text : 'Start a conversation'}
                    </div>
                  </div>
                  {lastMsg && (
                    <div className="text-[11px] text-text-muted shrink-0">
                      {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT: Chat */}
      <div className={`flex-1 flex flex-col bg-bg-dark ${!selectedUser ? 'max-md:hidden' : ''}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3.5 px-6 py-4 border-b border-glass-border bg-[rgba(10,10,15,0.9)] backdrop-blur-[10px]">
              <button onClick={() => setSelectedUser(null)} className="md:hidden bg-transparent border-none text-text-muted cursor-pointer text-lg mr-2">←</button>
              <Avatar name={selectedUser.name} image={selectedUser.profileImage} size={42} />
              <div>
                <h3 className="text-base font-semibold mb-0.5">{selectedUser.name}</h3>
                <div className="text-xs text-green-500 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Active now
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
              {relevantMessages.length === 0 ? (
                <div className="m-auto text-center text-text-muted p-5">
                  <div className="text-4xl mb-3 opacity-40">👋</div>
                  <p>No messages yet. Say hello!</p>
                </div>
              ) : (
                relevantMessages.map((m, i) => {
                  const isMine = m.senderId === user.name;
                  return (
                    <motion.div
                      key={m.id || i}
                      className={`max-w-[65%] ${isMine ? 'self-end' : 'self-start'}`}
                      initial={{ opacity: 0, x: isMine ? 16 : -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.02 }}
                    >
                      <div className={`px-4 py-3 text-[15px] leading-relaxed wrap-break-word ${
                        isMine
                          ? 'bg-accent rounded-[20px_20px_4px_20px] shadow-[0_4px_16px_var(--color-accent-glow)]'
                          : 'bg-glass-border rounded-[20px_20px_20px_4px] border border-glass-border'
                      }`}>
                        {m.text}
                      </div>
                      <div className={`text-[11px] text-text-muted mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex gap-3 px-6 py-4 border-t border-glass-border bg-[rgba(10,10,15,0.9)] backdrop-blur-[10px]">
              <input
                type="text"
                className="form-control flex-1 rounded-full! py-3! px-5!"
                placeholder={`Message ${selectedUser.name}...`}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <motion.button
                type="submit"
                className="btn btn-primary rounded-full! px-7!"
                disabled={!inputText.trim()}
                whileTap={{ scale: 0.95 }}
              >
                Send
              </motion.button>
            </form>
          </>
        ) : (
          <div className="m-auto text-center text-text-muted">
            <div className="text-6xl mb-4 opacity-40">💬</div>
            <h2 className="text-xl font-semibold mb-2 text-white">Your Messages</h2>
            <p className="text-sm">Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
