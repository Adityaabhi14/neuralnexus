import React from 'react';

const RightPanel = () => {
  return (
    <aside className="right-panel">
      
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Trending Topics</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Technology</span>
            <span style={{ fontWeight: '600' }}>#ReactJS Optimization</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Artificial Intelligence</span>
            <span style={{ fontWeight: '600' }}>#AntigravityUI Framework</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Creator Economy</span>
            <span style={{ fontWeight: '600' }}>#Monetizing Audiences</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Suggested Creators</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #0f172a, #475569)' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>System Architect</div>
            </div>
            <button style={{ background: 'var(--text-primary)', color: 'var(--bg-dark)', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>Follow</button>
          </div>

        </div>
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
        © 2026 Antigravity Hub MVP
      </div>
      
    </aside>
  );
};

export default RightPanel;
