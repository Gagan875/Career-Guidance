// API Configuration
// Uses environment variable in production, localhost in development

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? ''  // Use empty string in production so /api routes work correctly
    : 'http://localhost:5000');

export default API_BASE_URL;
