import axiosClient from './axiosClient';

const productService = {
  /**
   * Lấy danh sách sản phẩm (có thể kèm query như page, limit, keyword, category...)
   */
  getAllProducts: (params) => {
    return axiosClient.get('/products', { params });
  },

  /**
   * Lấy chi tiết 1 sản phẩm
   */
  getProductById: (id) => {
    return axiosClient.get(`/products/${id}`);
  },

  /**
   * Tạo sản phẩm mới
   */
  createProduct: (formData) => {
    return axiosClient.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Cập nhật sản phẩm
   */
  updateProduct: (id, formData) => {
    return axiosClient.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Xóa sản phẩm
   */
  deleteProduct: (id) => {
    return axiosClient.delete(`/products/${id}`);
  },
};

export default productService;
