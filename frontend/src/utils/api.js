import axios from 'axios';
import { toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
let authToken = null;
let adminToken = null;
const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
};
const getAdminToken = () => {
  if (!adminToken) {
    adminToken = localStorage.getItem('adminToken');
  }
  return adminToken;
};
export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};
export const setAdminToken = (token) => {
  adminToken = token;
  if (token) {
    localStorage.setItem('adminToken', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('adminToken');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};
export const clearTokens = () => {
  authToken = null;
  adminToken = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminToken');
  delete apiClient.defaults.headers.common['Authorization'];
};
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken() || getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    

    if (error.response?.status === 401) {
      clearTokens();
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    

    if (error.response?.status === 403) {
      if (error.response?.data?.banned) {
        clearTokens();
        toast.error('Your account has been banned. Please contact support.');
        window.location.href = '/login';
        return Promise.reject(error);
      }
      toast.error('Access denied. Insufficient permissions.');
      return Promise.reject(error);
    }
    

    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.status >= 400) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);
export const authAPI = {

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  

  updateProfile: async (userData) => {
    const response = await apiClient.put('/auth/profile', userData);
    return response.data;
  },
  

  changePassword: async (passwordData) => {
    const response = await apiClient.put('/auth/change-password', passwordData);
    return response.data;
  },
  

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    clearTokens();
    return response.data;
  }
};
export const adminAPI = {

  login: async (credentials) => {
    const response = await apiClient.post('/admin/login', credentials);
    return response.data;
  },
  

  getUsers: async (page = 1, limit = 10, search = '', status = '') => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    
    const response = await apiClient.get(`/admin/users?${params.toString()}`);
    return response.data;
  },
  

  getUser: async (userId) => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },
  

  banUser: async (userId, reason = '') => {
    const response = await apiClient.post(`/admin/users/${userId}/ban`, { reason });
    return response.data;
  },
  

  unbanUser: async (userId) => {
    const response = await apiClient.post(`/admin/users/${userId}/unban`);
    return response.data;
  },
  

  forceLogout: async (userId) => {
    const response = await apiClient.post(`/admin/users/${userId}/force-logout`);
    return response.data;
  },
  

  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
  

  updateUserStatus: async (userId, status) => {
    const response = await apiClient.patch(`/admin/user/${userId}/status`, { status });
    return response.data;
  },
  

  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  },
  

  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  }
};
export const userAPI = {

  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
  

  updateProfile: async (userData) => {
    const response = await apiClient.put('/users/profile', userData);
    return response.data;
  }
};
const initializeAuth = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};
initializeAuth();

export default apiClient;