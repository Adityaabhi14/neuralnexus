import React from 'react';

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="spinner-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div className="spinner"></div>
        <div style={{ color: '#64748b', fontWeight: '500' }}>{message}</div>
      </div>
    </div>
  );
};

export default Loader;
