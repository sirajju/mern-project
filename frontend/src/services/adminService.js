import makeRequest from '../utils/apiClient';

export const adminAPI = {

  login: async (credentials) => {
    return makeRequest({
      method: 'POST',
      url: '/admin/login',
      data: credentials
    });
  },
  getUsers: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      role = ''
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    if (search) queryParams.append('search', search);
    if (status) queryParams.append('status', status);
    if (role) queryParams.append('role', role);

    return makeRequest({
      method: 'GET',
      url: `/admin/users?${queryParams.toString()}`
    });
  },
  getUser: async (userId) => {
    return makeRequest({
      method: 'GET',
      url: `/admin/users/${userId}`
    });
  },
  updateUser: async (userId, userData) => {
    return makeRequest({
      method: 'PUT',
      url: `/admin/users/${userId}`,
      data: userData
    });
  },
  deleteUser: async (userId) => {
    return makeRequest({
      method: 'DELETE',
      url: `/admin/users/${userId}`
    });
  },
  banUser: async (userId, reason = '') => {
    return makeRequest({
      method: 'POST',
      url: `/admin/users/${userId}/ban`,
      data: { reason }
    });
  },
  unbanUser: async (userId) => {
    return makeRequest({
      method: 'POST',
      url: `/admin/users/${userId}/unban`
    });
  },
  updateUserStatus: async (userId, status) => {
    return makeRequest({
      method: 'PATCH',
      url: `/admin/user/${userId}/status`,
      data: { status }
    });
  },
  forceLogoutUser: async (userId) => {
    return makeRequest({
      method: 'POST',
      url: `/admin/users/${userId}/force-logout`
    });
  },
  getStats: async () => {
    return makeRequest({
      method: 'GET',
      url: '/admin/stats'
    });
  }
};