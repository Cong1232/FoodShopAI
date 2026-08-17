import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import adminCategoryService from '../../../services/adminCategoryService';
import { showToast } from '../../../utils/toast';
import PagePlaceholder from '../../../components/common/PagePlaceholder';
import './AdminCategoryList.css';

function AdminCategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Params
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('createdAt'); // 'name_asc', 'name_desc'

  useEffect(() => {
    fetchCategories();
  }, [page, status, sort]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminCategoryService.getCategories({
        page,
        limit,
        keyword,
        status,
        sort
      });
      if (res.success) {
        setCategories(res.data || []);
        setTotal(res.pagination?.total || 0);
      }
    } catch (error) {
      showToast('Lỗi tải danh sách danh mục', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        const res = await adminCategoryService.deleteCategory(id);
        if (res.success) {
          showToast('Xóa danh mục thành công', 'success');
          fetchCategories();
        }
      } catch (error) {
        showToast(error.response?.data?.message || 'Có lỗi khi xóa', 'error');
      }
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="admin-category-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Danh mục</h2>
        <Link to="/admin/categories/create" className="btn btn-primary d-flex align-items-center gap-2">
          <FiPlus /> Thêm danh mục
        </Link>
      </div>

      <div className="admin-filter-bar mb-4">
        <form onSubmit={handleSearch} className="admin-search-form">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Tìm kiếm theo tên..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary"><FiSearch /></button>
        </form>

        <div className="admin-filter-selects">
          <div className="input-group">
            <span className="input-group-text"><FiFilter /></span>
            <select 
              className="form-select" 
              value={status} 
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <select 
            className="form-select" 
            value={sort} 
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
          >
            <option value="createdAt">Mới nhất</option>
            <option value="name_asc">Tên A-Z</option>
            <option value="name_desc">Tên Z-A</option>
          </select>
        </div>
      </div>

      {loading ? (
        <PagePlaceholder title="Đang tải dữ liệu..." />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table admin-table table-hover align-middle">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên danh mục</th>
                  <th>Slug</th>
                  <th>Số sản phẩm</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-4">Không tìm thấy danh mục nào</td></tr>
                ) : (
                  categories.map(category => (
                    <tr key={category._id}>
                      <td>
                        <img 
                          src={category.image ? (category.image.startsWith('http') ? category.image : `http://localhost:5000${category.image}`) : 'https://via.placeholder.com/50'} 
                          alt={category.name} 
                          className="admin-category-img" 
                        />
                      </td>
                      <td className="fw-medium">{category.name}</td>
                      <td><span className="text-muted">{category.slug}</span></td>
                      <td>{category.productCount || 0}</td>
                      <td>
                        {category.status === 'active' 
                          ? <span className="badge bg-success">Active</span> 
                          : <span className="badge bg-secondary">Inactive</span>}
                      </td>
                      <td>{new Date(category.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <Link to={`/admin/categories/${category._id}/edit`} className="btn btn-sm btn-outline-primary me-2">
                          <FiEdit />
                        </Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(category._id)}>
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>Trước</button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>Sau</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default AdminCategoryList;
