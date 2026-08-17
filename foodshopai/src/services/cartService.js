import axiosClient from './axiosClient';

const cartService = {
  getCart: () => {
    return axiosClient.get('/cart');
  },
  addToCart: (productId, quantity) => {
    return axiosClient.post('/cart/add', { productId, quantity });
  },
  updateCartItem: (productId, quantity) => {
    return axiosClient.put('/cart/update', { productId, quantity });
  },
  removeCartItem: (productId) => {
    return axiosClient.delete(`/cart/remove/${productId}`);
  },
  clearCart: () => {
    return axiosClient.delete('/cart/clear');
  }
};

export default cartService;
