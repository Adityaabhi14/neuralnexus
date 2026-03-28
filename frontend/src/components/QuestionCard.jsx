import React from 'react';
import { timeAgo } from '../utils/formatTime';

const QuestionCard = ({ question, onClick, onUpvote }) => {
  return (
    <div className={`card ${onClick ? 'clickable' : ''}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <h2 className="card-title">{question.title}</h2>
      
      <div className="card-body">
        {question.body?.length > 180 ? question.body.substring(0, 180) + '...' : question.body}
      </div>

      <div className="card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', 
            background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-primary)'
          }}>
            {question.author?.charAt(0).toUpperCase() || '?'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.9rem' }}>{question.author}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{timeAgo(question.createdAt)} • Discussion</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {onUpvote && (
            <button 
              className="action-btn" 
              onClick={(e) => { e.stopPropagation(); onUpvote(question.id); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: (question.upvotes > 0) ? '#ff3040' : 'var(--text-muted)' }}
            >
              <svg fill={(question.upvotes > 0) ? "#ff3040" : "none"} height="20" viewBox="0 0 24 24" width="20" stroke="currentColor" strokeWidth="2">
                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.174 2.369 1.174 3.208 0A4.21 4.21 0 0 1 16.792 3.904Z"></path>
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{question.upvotes || 0}</span>
            </button>
          )}
          {question.answerCount !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
              <svg fill="none" height="20" viewBox="0 0 24 24" width="20" stroke="currentColor" strokeWidth="2">
                <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"></path>
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{question.answerCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
