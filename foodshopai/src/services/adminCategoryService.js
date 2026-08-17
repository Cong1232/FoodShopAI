import axiosClient from './axiosClient';

const adminCategoryService = {
  /**
   * Lấy danh sách danh mục (có phân trang, filter)
   */
  getCategories: (params) => {
    return axiosClient.get('/admin/categories', { params });
  },

  /**
   * Lấy chi tiết 1 danh mục
   */
  getCategoryById: (id) => {
    return axiosClient.get(`/admin/categories/${id}`);
  },

  /**
   * Tạo danh mục mới
   */
  createCategory: (formData) => {
    return axiosClient.post('/admin/categories', formData);
  },

  /**
   * Cập nhật danh mục
   */
  updateCategory: (id, formData) => {
    return axiosClient.put(`/admin/categories/${id}`, formData);
  },

  /**
   * Xóa mềm danh mục
   */
  deleteCategory: (id) => {
    return axiosClient.delete(`/admin/categories/${id}`);
  }
};

export default adminCategoryService;
