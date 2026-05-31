import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ghost_coach_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — redirect on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ghost_coach_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data);

export const loginUser = (data) => api.post('/auth/login', data);

export const getMe = () => api.get('/auth/me');

// ─── Session API ─────────────────────────────────────────
export const createSession = (formData) =>
  api.post('/sessions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getSessions = (page = 0, size = 6) =>
  api.get(`/sessions?page=${page}&size=${size}`);

export const getSessionById = (id) => api.get(`/sessions/${id}`);

export default api;
