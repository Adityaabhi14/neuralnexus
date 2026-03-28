import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SuggestionsPanel from './SuggestionsPanel';

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="feed-container">
        <Outlet />
      </main>
      <aside className="suggestions-panel">
        <SuggestionsPanel />
      </aside>
    </div>
  );
};

export default Layout;
