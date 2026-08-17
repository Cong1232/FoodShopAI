import { useEffect, useState } from 'react'
import { FaBolt } from 'react-icons/fa'
import ProductCard from '../../../components/product/ProductCard.jsx'
import productService from '../../../services/productService.js'
import './FlashSale.css'

// Thời gian đếm ngược mặc định cho Flash Sale (giờ:phút:giây) - chỉ mang tính minh hoạ
const INITIAL_SECONDS = 3 * 60 * 60 // 3 giờ

/**
 * Định dạng số giây thành chuỗi giờ:phút:giây có đệm 0 phía trước.
 */
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (num) => String(num).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

/**
 * FlashSale - Section hiển thị các sản phẩm đang giảm giá kèm đồng hồ đếm ngược.
 * Dữ liệu lấy từ mock/productData.js (chưa gọi API).
 */
function FlashSale() {
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch flash sale products
  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await productService.getAllProducts()
        if (response) {
          const dataList = response.data ? response.data : (Array.isArray(response) ? response : [])
          // Lọc các sản phẩm có isSale = true
          const sales = dataList.filter(p => p.isSale)
          // Lấy 4 sản phẩm đầu tiên
          setProducts(sales.slice(0, 4))
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải sản phẩm flash sale.')
      } finally {
        setLoading(false)
      }
    }
    fetchFlashSale()
  }, [])

  // Cập nhật đồng hồ đếm ngược mỗi giây - minh hoạ hiệu ứng "Flash Sale có giới hạn thời gian"
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : INITIAL_SECONDS))
    }, 1000)

    // Dọn dẹp interval khi component bị unmount, tránh rò rỉ bộ nhớ
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="flash-sale">
      <div className="section-container">
        <div className="flash-sale-header">
          <h2 className="flash-sale-title">
            <FaBolt className="flash-sale-icon" /> Flash Sale
          </h2>
          <div className="flash-sale-countdown">
            <span>Kết thúc sau</span>
            <strong>{formatTime(secondsLeft)}</strong>
          </div>
        </div>

        <div className="row g-4 mt-1">
          {loading && <div className="col-12 text-center py-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Đang tải...</span></div></div>}
          {error && <div className="col-12"><div className="alert alert-danger">{error}</div></div>}
          
          {!loading && !error && products.length === 0 && (
            <div className="col-12 text-center text-muted py-4">Hiện không có sản phẩm Flash Sale nào.</div>
          )}

          {!loading && !error && products.map((product) => (
            <div className="col-12 col-sm-6 col-lg-3" key={product._id || product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FlashSale
