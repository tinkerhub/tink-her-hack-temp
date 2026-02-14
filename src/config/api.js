import axios from 'axios';

// Use environment variable for production, localhost for development
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: baseURL
});

console.log('API Base URL:', baseURL);

export default api;
