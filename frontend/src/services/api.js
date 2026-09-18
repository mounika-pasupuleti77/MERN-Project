import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token to headers if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

export const dashboardAPI = {
  getDashboardData: () => api.get('/dashboard')
};

export const applianceAPI = {
  getAppliances: () => api.get('/appliances'),
  createAppliance: (data) => api.post('/appliances', data),
  updateAppliance: (id, data) => api.put(`/appliances/${id}`, data),
  toggleStatus: (id, status) => api.patch(`/appliances/${id}/status`, { status }),
  deleteAppliance: (id) => api.delete(`/appliances/${id}`)
};

export const energyAPI = {
  getCurrent: () => api.get('/energy/current'),
  getHistory: () => api.get('/energy/history')
};

export const solarAPI = {
  getCurrent: (weather = 'Sunny') => api.get(`/solar/current?weather=${weather}`),
  getHistory: () => api.get('/solar/history')
};

export const batteryAPI = {
  getStatus: () => api.get('/battery'),
  update: (data) => api.put('/battery', data),
  charge: (amount) => api.post('/battery/charge', { amount }),
  discharge: (amount) => api.post('/battery/discharge', { amount })
};

export const scheduleAPI = {
  getSchedules: () => api.get('/schedules'),
  createSchedule: (data) => api.post('/schedules', data),
  deleteSchedule: (id) => api.delete(`/schedules/${id}`)
};

export const rlAPI = {
  getDecision: (state) => api.post('/rl/decision', state)
};

export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
  getDaily: () => api.get('/analytics/daily'),
  getWeekly: () => api.get('/analytics/weekly'),
  getMonthly: () => api.get('/analytics/monthly')
};

export default api;
