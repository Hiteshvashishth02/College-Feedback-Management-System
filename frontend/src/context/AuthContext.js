import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI, setAuthToken as applyAuthToken } from '../services/api';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_START = 'AUTH_START';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAILURE = 'AUTH_FAILURE';
const LOGOUT = 'LOGOUT';
const CLEAR_ERROR = 'CLEAR_ERROR';
const LOAD_USER = 'LOAD_USER';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case AUTH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case LOAD_USER:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in headers (all API clients)
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    applyAuthToken(token);
  };

  // Load user from token
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setAuthToken(token);
      try {
        dispatch({ type: AUTH_START });
        const response = await authAPI.get('/auth/me');
        dispatch({
          type: LOAD_USER,
          payload: response.data.data,
        });
      } catch (error) {
        console.error('Error loading user:', error);
        setAuthToken(null);
        dispatch({
          type: AUTH_FAILURE,
          payload: 'Session expired. Please login again.',
        });
      }
    } else {
      dispatch({ type: AUTH_FAILURE, payload: null });
    }
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_START });
      const response = await authAPI.post('/auth/register', userData);
      
      const { token, user } = response.data;
      
      setAuthToken(token);
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: { user, token },
      });
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: message,
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      dispatch({ type: AUTH_START });
      const response = await authAPI.post('/auth/login', userData);
      
      const { token, user } = response.data;
      
      setAuthToken(token);
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: { user, token },
      });
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: message,
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authAPI.get('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setAuthToken(null);
    dispatch({ type: LOGOUT });
    toast.success('Logged out successfully');
  };

  // Update user details
  const updateDetails = async (userData) => {
    try {
      const response = await authAPI.put('/auth/updatedetails', userData);
      dispatch({
        type: LOAD_USER,
        payload: response.data.data,
      });
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      await authAPI.put('/auth/updatepassword', passwordData);
      toast.success('Password updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.role === 'admin';
  };

  // Check if user is student
  const isStudent = () => {
    return state.user?.role === 'student';
  };

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = {
    ...state,
    register,
    login,
    logout,
    loadUser,
    updateDetails,
    updatePassword,
    clearError,
    isAdmin,
    isStudent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
