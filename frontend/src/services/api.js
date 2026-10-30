import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const defaultConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Shared interceptors for all API instances
const attachInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      if (error.response?.status === 403) {
        window.location.href = '/404';
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Auth uses /auth/... paths against /api
export const authAPI = attachInterceptors(
  axios.create({
    baseURL: API_BASE_URL,
    ...defaultConfig,
  })
);

// Resource-specific clients match how pages call them (e.g. get('/'), get('/:id'))
export const collegesAPI = attachInterceptors(
  axios.create({
    baseURL: `${API_BASE_URL}/colleges`,
    ...defaultConfig,
  })
);

export const reviewsAPI = attachInterceptors(
  axios.create({
    baseURL: `${API_BASE_URL}/reviews`,
    ...defaultConfig,
  })
);

export const adminAPI = attachInterceptors(
  axios.create({
    baseURL: `${API_BASE_URL}/admin`,
    ...defaultConfig,
  })
);

// Utility functions
export const setAuthToken = (token) => {
  const instances = [authAPI, collegesAPI, reviewsAPI, adminAPI];
  instances.forEach((instance) => {
    if (token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common['Authorization'];
    }
  });
};

export default authAPI;
