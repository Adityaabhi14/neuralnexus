import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import FloatingAI from './components/FloatingAI';
import MobileNav from './components/MobileNav';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const AnimatedPage = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Full-screen routes */}
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
        <Route path="/profile/:username" element={<AnimatedPage><Profile /></AnimatedPage>} />
        <Route path="/messages" element={<AnimatedPage><Messages /></AnimatedPage>} />

        {/* Feed layout routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/explore" element={<AnimatedPage><Explore /></AnimatedPage>} />
          <Route path="/create" element={<AnimatedPage><CreatePost /></AnimatedPage>} />
          <Route path="*" element={
            <AnimatedPage>
              <div className="empty-state">
                <div className="text-5xl mb-4 opacity-50">🔗</div>
                <h2 className="text-xl font-bold mb-2">Page Not Found</h2>
                <p className="text-text-muted">The page you're looking for doesn't exist.</p>
              </div>
            </AnimatedPage>
          } />
        </Route>

      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <FloatingAI />
      <MobileNav />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
