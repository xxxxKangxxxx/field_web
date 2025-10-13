import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // 기본 헤더 설정
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json',
    };

    // 토큰이 있는 경우에만 Authorization 헤더 추가
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // 로그인 페이지가 아닐 때만 리다이렉트
      if (!currentPath.includes('/login')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 