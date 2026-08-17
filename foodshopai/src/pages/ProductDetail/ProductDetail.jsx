import { useParams, Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import ImageGallery from './components/ImageGallery.jsx'
import ProductInfo from './components/ProductInfo.jsx'
import ProductTabs from './components/ProductTabs.jsx'
import RelatedProducts from './components/RelatedProducts.jsx'
import NotFound from '../NotFound/NotFound.jsx'
import productService from '../../services/productService.js'
import { useState, useEffect } from 'react'
import './ProductDetail.css'

/**
 * ProductDetail - Trang chi tiết sản phẩm.
 * Lấy :id từ URL, tìm sản phẩm tương ứng trong mock/products.js.
 * Bố cục: Breadcrumb -> (Gallery + Thông tin) -> Tabs -> Sản phẩm liên quan.
 *
 * Buổi 3: chưa gọi API thật, dữ liệu lấy từ mock cục bộ.
 */
function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await productService.getProductById(id)
      if (response) {
        const productData = response.data ? response.data : response
        setProduct(productData)
      } else {
        setError('Không tìm thấy sản phẩm')
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải sản phẩm.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const handleReviewUpdated = () => {
    fetchProduct()
  }

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Đang tải...</span></div></div>
  }

  // Trường hợp không tìm thấy sản phẩm (id sai / không tồn tại)
  if (error || !product) {
    return <NotFound />
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Sản phẩm', path: '/products' },
          { label: product.name },
        ]}
      />

      <div className="section-container product-detail-page">
        <div className="row g-4">
          {/* ===== Gallery ảnh ===== */}
          <div className="col-12 col-md-6 col-lg-5">
            <ImageGallery images={product.images} alt={product.name} />
          </div>

          {/* ===== Thông tin sản phẩm ===== */}
          <div className="col-12 col-md-6 col-lg-7">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* ===== Tabs: Mô tả / Thông số / Đánh giá ===== */}
        <ProductTabs product={product} onReviewUpdated={handleReviewUpdated} />

        {/* ===== Sản phẩm liên quan ===== */}
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </div>
    </>
  )
}

export default ProductDetail
