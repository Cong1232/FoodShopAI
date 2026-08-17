import axios from 'axios';

// Lấy Base URL từ biến môi trường của Vite, nếu không có thì mặc định dùng localhost/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Tăng timeout lên 30s vì các API gửi email/xử lý nặng có thể phản hồi chậm
  timeout: 30000,
});

// Interceptor cho request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response (xử lý lỗi chung)
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp data bên trong response để dễ sử dụng
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Bắt lỗi chung
    console.error('Lỗi gọi API:', error);
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
