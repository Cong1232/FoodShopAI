import axiosClient from './axiosClient';

const adminDashboardService = {
  getStats: () => {
    return axiosClient.get('/admin/dashboard');
  },
  getCharts: () => {
    return axiosClient.get('/admin/dashboard/charts');
  }
};

export default adminDashboardService;
