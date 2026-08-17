import { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import { formatCurrency } from '../../../utils/formatCurrency';
import { showToast } from '../../../utils/toast';
import PagePlaceholder from '../../../components/common/PagePlaceholder';
import AdminProductForm from './AdminProductForm';
import './AdminProductList.css';

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Params
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('createdAt'); // 'price_asc', 'price_desc', 'name_asc', 'name_desc'

  // Modal form
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, category, sort]); // Refresh when page, category or sort changes

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAllProducts({
        page,
        limit,
        keyword,
        category,
        sort
      });
      if (res.success) {
        setProducts(res.data || res.products || []);
        setTotal(res.pagination?.total || 0);
      }
    } catch (error) {
      showToast('Lỗi tải danh sách sản phẩm', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        const res = await productService.deleteProduct(id);
        if (res.success) {
          showToast('Xóa sản phẩm thành công', 'success');
          fetchProducts();
        }
      } catch (error) {
        showToast(error.response?.data?.message || 'Có lỗi khi xóa', 'error');
      }
    }
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchProducts();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="admin-product-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý sản phẩm</h2>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openAddForm}>
          <FiPlus /> Thêm sản phẩm
        </button>
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
              value={category} 
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <select 
            className="form-select" 
            value={sort} 
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
          >
            <option value="createdAt">Mới nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
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
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Đã bán</th>
                  <th>Đánh giá</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan="9" className="text-center py-4">Không tìm thấy sản phẩm nào</td></tr>
                ) : (
                  products.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img 
                          src={product.images && product.images.length > 0 ? (product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000${product.images[0]}`) : 'https://via.placeholder.com/50'} 
                          alt={product.name} 
                          className="admin-product-img" 
                        />
                      </td>
                      <td className="fw-medium">{product.name}</td>
                      <td>{product.category?.name}</td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="text-danger fw-bold">{formatCurrency(product.price)}</span>
                          {product.discountPrice > 0 && <small className="text-muted text-decoration-line-through">{formatCurrency(product.discountPrice)}</small>}
                        </div>
                      </td>
                      <td>{product.stock}</td>
                      <td>{product.sold}</td>
                      <td>{product.rating.toFixed(1)} <small>({product.reviewCount})</small></td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          {product.isHot && <span className="badge bg-danger">Hot</span>}
                          {product.isSale && <span className="badge bg-warning text-dark">Sale</span>}
                          {product.isNewProduct && <span className="badge bg-success">New</span>}
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditForm(product)}>
                          <FiEdit />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product._id)}>
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

      {showForm && (
        <AdminProductForm 
          product={editingProduct} 
          categories={categories}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default AdminProductList;
