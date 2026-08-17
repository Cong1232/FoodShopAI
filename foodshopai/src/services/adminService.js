import axiosClient from './axiosClient';

const adminService = {
  getDashboardStats: () => {
    return axiosClient.get('/admin/dashboard');
  },
  getAllReviews: () => {
    return axiosClient.get('/admin/reviews');
  },
  deleteReview: (id) => {
    return axiosClient.delete(`/admin/reviews/${id}`);
  },
  getReports: (params) => {
    return axiosClient.get('/admin/reports', { params });
  },
  exportExcelReports: (params) => {
    return axiosClient.get('/admin/reports/export/excel', { params, responseType: 'blob' });
  },
  exportPdfReports: (params) => {
    return axiosClient.get('/admin/reports/export/pdf', { params, responseType: 'blob' });
  }
};

export default adminService;
