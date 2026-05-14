import axios from 'axios';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to match the API_CALL signature used in the codebase
export const API_CALL = async ({ method, url, body, data, params }: any) => {
  try {
    const response = await api.request({
      method,
      url,
      data: body || data,
      params,
    });
    return {
      response: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      response: error.response?.data || { error: error.message },
      status: error.response?.status || 500,
    };
  }
};

export default api;
