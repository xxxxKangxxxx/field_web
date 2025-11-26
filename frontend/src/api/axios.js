import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4002';

const api = axios.create({
  baseURL,
  withCredentials: true,
  // 기본 헤더는 인터셉터에서 설정 (FormData인 경우 제외)
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // FormData인 경우 Content-Type 헤더를 완전히 제거 (브라우저가 자동으로 boundary 포함 multipart/form-data 설정)
    if (config.data instanceof FormData) {
      // FormData인 경우 Content-Type 헤더를 삭제하여 브라우저가 자동으로 설정하도록 함
      delete config.headers['Content-Type'];
    } else {
      // FormData가 아닌 경우에만 Content-Type 설정
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/json',
      };
    }

    // 토큰이 있는 경우에만 Authorization 헤더 추가
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
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