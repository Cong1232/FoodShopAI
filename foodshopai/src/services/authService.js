import axiosClient from './axiosClient';

const authService = {
  login: (email, password) => {
    return axiosClient.post('/auth/login', { email, password });
  },
  register: (userData) => {
    return axiosClient.post('/auth/register', userData);
  },
  getProfile: () => {
    return axiosClient.get('/auth/profile');
  }
};

export default authService;
