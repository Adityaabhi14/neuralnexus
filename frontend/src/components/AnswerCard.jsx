import React from 'react';
import { timeAgo } from '../utils/formatTime';

const AnswerCard = ({ answer }) => {
  return (
    <div className="card" style={{ padding: '20px', borderLeft: (answer.author === "✨ AI Assistant") ? '4px solid var(--accent-blue)' : '1px solid var(--glass-border)' }}>
      <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#e5e7eb', marginBottom: '20px', whiteSpace: 'pre-line' }}>
        {answer.text}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%', 
            background: (answer.author === "✨ AI Assistant") ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '12px', fontWeight: 'bold', color: '#fff'
          }}>
            {answer.author?.charAt(0).toUpperCase() || '?'}
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'Poppins' }}>{answer.author}</span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{timeAgo(answer.createdAt)}</span>
      </div>
    </div>
  );
};

export default AnswerCard;
