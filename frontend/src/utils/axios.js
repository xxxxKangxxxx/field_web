import axios from 'axios';
import store from '../redux/store';

const instance = axios.create({
  baseURL: 'http://localhost:4001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

instance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token || localStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error:', error.response.data);
      const { logout } = require('../redux/authSlice');
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default instance; 