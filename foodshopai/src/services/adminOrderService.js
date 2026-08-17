import axiosClient from './axiosClient';

const adminOrderService = {
  getOrders: (params) => {
    return axiosClient.get('/admin/orders', { params });
  },
  getOrderById: (id) => {
    return axiosClient.get(`/admin/orders/${id}`);
  },
  updateOrderStatus: (id, status) => {
    return axiosClient.put(`/admin/orders/${id}/status`, { status });
  }
};

export default adminOrderService;
