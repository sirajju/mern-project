import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { adminAPI, setAdminToken, clearTokens } from '../utils/api';
import { toast } from 'react-toastify';


const initialState = {
  admin: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  users: [],
  stats: null,
  pagination: null,
};

const ADMIN_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USERS: 'SET_USERS',
  UPDATE_USER_STATUS: 'UPDATE_USER_STATUS',
  SET_STATS: 'SET_STATS',
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case ADMIN_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ADMIN_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        admin: action.payload.admin,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case ADMIN_ACTIONS.LOGOUT:
      return {
        ...state,
        admin: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        users: [],
        stats: null,
        pagination: null,
      };

    case ADMIN_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case ADMIN_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case ADMIN_ACTIONS.SET_USERS:
      return {
        ...state,
        users: action.payload.users || action.payload,
        pagination: action.payload.pagination,
        isLoading: false,
      };

    case ADMIN_ACTIONS.UPDATE_USER_STATUS:
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload.userId || user.id === action.payload.userId
            ? { ...user, status: action.payload.status }
            : user
        ),
      };

    case ADMIN_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };

    default:
      return state;
  }
};

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR });
    }
  }, [state.error]);

  const login = useCallback(async (credentials) => {
    try {
      dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR });

      const response = await adminAPI.login(credentials);
      
      setAdminToken(response.data.token);
      
      dispatch({
        type: ADMIN_ACTIONS.LOGIN_SUCCESS,
        payload: {
          token: response.data.token,
          admin: response.data.admin || response.data.user,
        },
      });

      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    dispatch({ type: ADMIN_ACTIONS.LOGOUT });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR });
  }, []);

  const getUsers = useCallback(async (page = 1, limit = 10, search = '', status = '') => {
    try {
      dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
      
      const response = await adminAPI.getUsers(page, limit, search, status);
      
      dispatch({
        type: ADMIN_ACTIONS.SET_USERS,
        payload: {
          users: response.users || response.data?.users || [],
          pagination: response.pagination || response.data?.pagination,
        },
      });

      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateUserStatus = useCallback(async (userId, status) => {
    try {
      const response = await adminAPI.updateUserStatus(userId, status);
      
      dispatch({
        type: ADMIN_ACTIONS.UPDATE_USER_STATUS,
        payload: { userId, status },
      });

      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const banUser = useCallback(async (userId, reason = '') => {
    try {
      const response = await adminAPI.banUser(userId, reason);
      
      dispatch({
        type: ADMIN_ACTIONS.UPDATE_USER_STATUS,
        payload: { userId, status: 'banned' },
      });

      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const unbanUser = useCallback(async (userId) => {
    try {
      const response = await adminAPI.unbanUser(userId);
      
      dispatch({
        type: ADMIN_ACTIONS.UPDATE_USER_STATUS,
        payload: { userId, status: 'active' },
      });

      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const getStats = useCallback(async () => {
    try {
      const response = await adminAPI.getStats();
      
      dispatch({
        type: ADMIN_ACTIONS.SET_STATS,
        payload: response.stats || response.data || response,
      });

      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    clearError,
    getUsers,
    updateUserStatus,
    banUser,
    unbanUser,
    getStats,
  }), [state, login, logout, clearError, getUsers, updateUserStatus, banUser, unbanUser, getStats]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};