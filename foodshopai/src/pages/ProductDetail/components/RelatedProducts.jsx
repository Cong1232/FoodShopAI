import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ProductGrid from '../../../components/product/ProductGrid.jsx'
import productService from '../../../services/productService.js'
import './RelatedProducts.css'

// Số sản phẩm liên quan tối đa hiển thị
const RELATED_LIMIT = 4

/**
 * RelatedProducts - Hiển thị các sản phẩm cùng danh mục với sản phẩm đang xem.
 * Tái sử dụng ProductGrid + ProductCard đã có sẵn để tránh lặp code giao diện.
 *
 * Props:
 * - currentProductId: id sản phẩm đang xem (để loại trừ khỏi danh sách liên quan)
 * - category: danh mục dùng để tìm sản phẩm tương tự
 */
function RelatedProducts({ currentProductId, category }) {
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true)
        // Lấy tất cả sản phẩm và lọc cục bộ (tương tự logic cũ, chỉ thay bằng API)
        const response = await productService.getAllProducts()
        if (response) {
          const dataList = response.data ? response.data : (Array.isArray(response) ? response : [])
          const filtered = dataList
            .filter((product) => {
               // category trên DB có thể là object {_id, name} hoặc string id
               const catStr = typeof product.category === 'object' ? product.category._id : product.category
               const currentCatStr = typeof category === 'object' ? category._id : category
               
               // currentProductId có thể là số (từ mock) hoặc string (từ MongoDB _id)
               return catStr === currentCatStr && product._id !== String(currentProductId) && product.id !== currentProductId
            })
            .slice(0, RELATED_LIMIT)
          
          setRelatedProducts(filtered)
        }
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm liên quan:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (category) {
      fetchRelated()
    }
  }, [currentProductId, category])

  if (relatedProducts.length === 0) return null

  return (
      <div className="section-container">
        <h2 className="section-heading section-heading--left mb-4">Sản phẩm liên quan</h2>
        
        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Đang tải...</span></div></div>
        ) : (
          <ProductGrid products={relatedProducts} />
        )}
      </div>
  )
}

RelatedProducts.propTypes = {
  currentProductId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  category: PropTypes.string.isRequired,
}

export default RelatedProducts
