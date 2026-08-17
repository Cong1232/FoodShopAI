import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../../../components/product/ProductCard.jsx'
import productService from '../../../services/productService.js'
import './FeaturedProducts.css'

/**
 * FeaturedProducts - Section hiển thị các sản phẩm nổi bật / được đề xuất.
 * Dữ liệu lấy từ mock/productData.js (chưa gọi API).
 */
function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch featured products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await productService.getAllProducts()
        if (response) {
          const dataList = response.data ? response.data : (Array.isArray(response) ? response : [])
          // Lọc các sản phẩm có isHot = true (hoặc tuỳ điều kiện)
          const featured = dataList.filter(p => p.isHot)
          // Nếu không có sản phẩm nào isHot, lấy tạm 8 sản phẩm ngẫu nhiên/đầu tiên
          setProducts(featured.length > 0 ? featured.slice(0, 8) : dataList.slice(0, 8))
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải sản phẩm nổi bật.')
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <section className="featured-products">
      <div className="section-container">
        <div className="featured-products-header">
          <div>
            <h2 className="section-heading section-heading--left">Sản phẩm nổi bật</h2>
            <p className="section-subheading section-subheading--left">
              Những sản phẩm được khách hàng lựa chọn nhiều nhất
            </p>
          </div>
          <Link to="/products" className="featured-products-viewall">
            Xem tất cả →
          </Link>
        </div>

        <div className="product-grid">
          {loading && <div className="text-center py-4" style={{width: '100%'}}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Đang tải...</span></div></div>}
          {error && <div className="alert alert-danger" style={{width: '100%'}}>{error}</div>}
          
          {!loading && !error && products.length === 0 && (
            <div className="text-center text-muted py-4" style={{width: '100%'}}>Hiện không có sản phẩm nổi bật nào.</div>
          )}

          {!loading && !error && products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
