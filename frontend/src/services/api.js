import axios from 'axios';

console.log("API Service Initialized pointing to: http://localhost:5000/api");

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a global interceptor to catch any failing network requests gracefully
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Global Axios Error Caught:", error?.message || error);
    
    // Instead of completely crashing, let the promise rejection propagate safely
    // so try/catch blocks in UI components handle it cleanly.
    return Promise.reject(error);
  }
);

export default api;
