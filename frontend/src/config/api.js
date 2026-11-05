export const API_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:8000'
    : 'https://mrg-biblio-awp-api.onrender.com';
