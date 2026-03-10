import axios from 'axios';

// 백엔드 기본 주소 설정
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 💡 요청(Request)을 보내기 직전에 가로채서 헤더에 토큰을 심어줍니다!
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    // 백엔드의 JwtFilter가 요구하는 "Bearer " 형식에 맞춰서 삽입
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;