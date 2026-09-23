import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('befit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('befit_token');
      localStorage.removeItem('befit_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const googleLogin = (credential) => API.post('/auth/oauth2/google', { credential });

// Activities
export const getActivities = () => API.get('/activities');
export const trackActivity = (data) => API.post('/activities', data);

// Recommendations
export const getUserRecommendations = (userId) => API.get(`/recommendation/user/${userId}`);
export const getActivityRecommendations = (activityId) => API.get(`/recommendation/activity/${activityId}`);
export const generateRecommendation = (data) => API.post('/recommendation/generate', data);

// User Profile & Body Metrics
export const getUserProfile = () => API.get('/users/profile');
export const updateUserProfile = (data) => API.put('/users/profile', data);

export default API;
