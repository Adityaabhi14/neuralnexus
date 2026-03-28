import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import FloatingAI from './components/FloatingAI'; // Global native mounting

function App() {
  return (
    <BrowserRouter>
      {/* Global Features inherently mounted universally ensuring AI persists cleanly */}
      <FloatingAI />
      
      <Routes>
        
        {/* INDEPENDENT FULL-SCREEN ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />

        {/* FEED-BOUND PLATFORM ROUTES (Requires Standard Navigation Sidebar) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create" element={<CreatePost />} />
          
          <Route path="*" element={
            <div className="empty-state">
              <h2>Quantum Link Broken</h2>
              <p>The routing matrix failed to locate this endpoint.</p>
            </div>
          } />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
