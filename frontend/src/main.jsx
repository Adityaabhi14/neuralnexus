import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

console.log("main.jsx initialized");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("FATAL ERROR: Could not find <div id='root'></div> in your index.html!");
  document.body.innerHTML = "<h2 style='color:red; text-align:center; padding: 2rem;'>Fatal Error: div#root missing in index.html</h2>";
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
