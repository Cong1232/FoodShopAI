import axiosClient from './axiosClient';

const adminUserService = {
  getUsers: (params) => {
    return axiosClient.get('/admin/users', { params });
  },
  getUserById: (id) => {
    return axiosClient.get(`/admin/users/${id}`);
  },
  updateUser: (id, data) => {
    return axiosClient.put(`/admin/users/${id}`, data);
  },
  updateUserRole: (id, role) => {
    return axiosClient.put(`/admin/users/${id}/role`, { role });
  },
  updateUserStatus: (id, status) => {
    return axiosClient.put(`/admin/users/${id}/status`, { status });
  }
};

export default adminUserService;
