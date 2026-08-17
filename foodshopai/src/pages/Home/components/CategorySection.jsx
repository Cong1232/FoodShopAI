import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import categoryService from '../../../services/categoryService.js'
import { getImageUrl } from '../../../utils/getImageUrl.js'
import './CategorySection.css'

/**
 * CategorySection - Hiển thị lưới danh mục nổi bật ở Trang chủ.
 * Dữ liệu lấy từ mock/categoryData.js (chưa gọi API).
 */
function CategorySection() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await categoryService.getAllCategories()
        if (response) {
          const dataList = response.data ? response.data : (Array.isArray(response) ? response : [])
          setCategories(dataList)
        }
      } catch (err) {
        setError('Không thể tải danh mục')
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <section className="category-section">
      <div className="section-container">
        <h2 className="section-heading">Danh mục nổi bật</h2>
        <p className="section-subheading">Khám phá đa dạng thực phẩm theo từng nhóm sản phẩm</p>

        <div className="category-grid">
          {loading && <div className="text-center py-4 w-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Đang tải...</span></div></div>}
          {error && <div className="alert alert-danger w-100">{error}</div>}
          
          {!loading && !error && categories.length === 0 && (
            <div className="text-center text-muted py-4 w-100">Chưa có danh mục nào.</div>
          )}

          {!loading && !error && categories.map((category) => (
            <Link to={`/products?category=${category._id || category.id}`} key={category._id || category.id} className="category-card">
              <div style={{ width: '100%', height: '120px', overflow: 'hidden', borderRadius: '8px', marginBottom: '12px' }}>
                <img src={getImageUrl(category.image)} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="category-name">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
