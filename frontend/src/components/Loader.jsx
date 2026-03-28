import React from 'react';

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-8 h-8 border-2 border-card-border border-t-accent rounded-full animate-spin" />
      <div className="text-sm text-text-muted font-medium">{message}</div>
    </div>
  );
};

export default Loader;
