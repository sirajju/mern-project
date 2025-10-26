import makeRequest from '../utils/apiClient';

export const authAPI = {
  register: async (userData) => {
    return makeRequest({
      method: 'POST',
      url: '/auth/register',
      data: userData
    });
  },

  login: async (credentials) => {
    return makeRequest({
      method: 'POST',
      url: '/auth/login',
      data: credentials
    });
  },

  getProfile: async () => {
    return makeRequest({
      method: 'GET',
      url: '/auth/me'
    });
  },

  updateProfile: async (profileData) => {
    return makeRequest({
      method: 'PUT',
      url: '/auth/profile',
      data: profileData
    });
  },

  changePassword: async (passwordData) => {
    return makeRequest({
      method: 'PUT',
      url: '/auth/change-password',
      data: passwordData
    });
  },

  logout: async () => {
    return makeRequest({
      method: 'POST',
      url: '/auth/logout'
    });
  }
};

export const userAPI = {
  getProfile: async () => {
    return makeRequest({
      method: 'GET',
      url: '/users/profile'
    });
  },

  updateProfile: async (profileData) => {
    return makeRequest({
      method: 'PUT',
      url: '/users/profile',
      data: profileData
    });
  }
};