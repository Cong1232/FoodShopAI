import axiosClient from './axiosClient';

const categoryService = {
  /**
   * Lấy danh sách danh mục
   */
  getAllCategories: (params) => {
    return axiosClient.get('/categories', { params });
  },

  /**
   * Lấy chi tiết 1 danh mục
   */
  getCategoryById: (id) => {
    return axiosClient.get(`/categories/${id}`);
  }
};

export default categoryService;
