// API Configuration
// Uses environment variable in production, localhost in development

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? '/api'  // Use relative path in production (Vercel will handle routing)
    : '${API_BASE_URL}');

export default API_BASE_URL;
