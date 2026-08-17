import axiosClient from './axiosClient';

const orderService = {
  createOrder: (orderData) => {
    return axiosClient.post('/orders', orderData);
  },
  getMyOrders: () => {
    return axiosClient.get('/orders/my-orders');
  },
  getOrderById: (id) => {
    return axiosClient.get(`/orders/${id}`);
  },
  cancelOrder: (id) => {
    return axiosClient.put(`/orders/${id}/cancel`);
  }
};

export default orderService;
