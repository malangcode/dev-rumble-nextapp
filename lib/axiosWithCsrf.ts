// lib/axiosWithCsrf.ts
import axios from 'axios';

// Util to get csrf token from cookies
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

// CSRF-safe axios instance
export const axiosWithCsrf = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

// Interceptor to add CSRF token automatically
axiosWithCsrf.interceptors.request.use(config => {
  const method = config.method?.toUpperCase();

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '')) {
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
  }

  return config;
});
