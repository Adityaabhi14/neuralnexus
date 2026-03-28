import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, errorInfo: error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif', background: '#fff', color: '#333', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#e74c3c' }}>Oops! Something went wrong rendering the UI.</h1>
          <p>We caught an unexpected error inside React. See the console for more details.</p>
          <pre style={{ marginTop: '1rem', padding: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', maxWidth: '800px', overflowX: 'auto', textAlign: 'left' }}>
            {this.state.errorInfo?.toString() || 'Unknown Error'}
          </pre>
          <button 
            onClick={() => {
              localStorage.removeItem('currentUser'); // Clear local storage in case corrupted state caused crash
              window.location.reload();
            }} 
            style={{ marginTop: '2rem', padding: '10px 20px', cursor: 'pointer', background: '#3498db', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            Clear State & Reload
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
