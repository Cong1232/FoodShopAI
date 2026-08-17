import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import ProductGrid from '../../components/product/ProductGrid.jsx'
import SearchBar from './components/SearchBar.jsx'
import SortDropdown from './components/SortDropdown.jsx'
import SidebarFilter from './components/SidebarFilter.jsx'
import { priceRanges, ratingOptions, sortOptions } from '../../mock/products.js'
import productService from '../../services/productService.js'
import categoryService from '../../services/categoryService.js'
import './Products.css'

// Số sản phẩm hiển thị trên mỗi trang
const PAGE_SIZE = 8

/**
 * Products - Trang danh sách sản phẩm.
 * Chịu trách nhiệm quản lý toàn bộ state của: tìm kiếm, bộ lọc, sắp xếp, phân trang.
 * Các component con (SearchBar, SidebarFilter, SortDropdown, ProductGrid, Pagination)
 * đều là component thuần (dumb component), chỉ nhận dữ liệu qua props và bắn callback,
 * giúp Products.jsx dễ kiểm soát luồng dữ liệu và dễ nối API thật ở các buổi sau.
 *
 * Buổi 3: toàn bộ dữ liệu lấy từ mock/products.js, chưa gọi API thật.
 */
function Products() {
  // ===== State tìm kiếm =====
  const [searchTerm, setSearchTerm] = useState('')

  // ===== State bộ lọc =====
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedPriceRange, setSelectedPriceRange] = useState(null)
  const [selectedRating, setSelectedRating] = useState(null)

  // ===== State dữ liệu API =====
  const [productsData, setProductsData] = useState([])
  const [categoriesData, setCategoriesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()

  // Fetch dữ liệu từ API và đồng bộ URL query
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const cat = params.get('category')
    const kw = params.get('keyword') || ''
    
    if (cat) {
      setSelectedCategories([cat])
    } else {
      setSelectedCategories([])
    }
    
    setSearchTerm(kw)

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getAllProducts({ keyword: kw }),
          categoryService.getAllCategories()
        ])
        
        if (productsRes) {
          const pList = productsRes.data ? productsRes.data : (Array.isArray(productsRes) ? productsRes : [])
          setProductsData(pList)
        }
        
        if (categoriesRes) {
          const cList = categoriesRes.data ? categoriesRes.data : (Array.isArray(categoriesRes) ? categoriesRes : [])
          setCategoriesData(cList)
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [location.search])

  // ===== State sắp xếp & phân trang =====
  const [sortValue, setSortValue] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  // Bật/tắt 1 danh mục trong danh sách danh mục đang chọn
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category],
    )
    setCurrentPage(1)
  }

  // Chọn / bỏ chọn khoảng giá (radio nhưng cho phép bấm lại để bỏ chọn)
  const handlePriceRangeChange = (rangeId) => {
    setSelectedPriceRange((prev) => (prev === rangeId ? null : rangeId))
    setCurrentPage(1)
  }

  // Chọn / bỏ chọn mức đánh giá tối thiểu
  const handleRatingChange = (star) => {
    setSelectedRating((prev) => (prev === star ? null : star))
    setCurrentPage(1)
  }

  // Xoá toàn bộ điều kiện lọc (không xoá từ khoá tìm kiếm)
  const handleResetFilter = () => {
    setSelectedCategories([])
    setSelectedPriceRange(null)
    setSelectedRating(null)
    setCurrentPage(1)
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    setSortValue(value)
    setCurrentPage(1)
  }

  /**
   * Danh sách sản phẩm sau khi áp dụng Tìm kiếm + Bộ lọc.
   * Dùng useMemo để chỉ tính toán lại khi 1 trong các điều kiện thay đổi,
   * tránh lọc lại toàn bộ mảng mỗi lần component re-render vì lý do khác.
   */
  const filteredProducts = useMemo(() => {
    const activeRange = priceRanges.find((range) => range.id === selectedPriceRange)

    return productsData.filter((product) => {
      // Giá hiệu lực (ưu tiên giá khuyến mãi nếu có) - dùng để lọc theo khoảng giá
      const effectivePrice = product.discountPrice ?? product.price

      // Điều kiện danh mục: nếu chưa chọn danh mục nào -> không lọc
      const prodCatId = product.category && typeof product.category === 'object' ? (product.category._id || product.category.id) : product.category
      const matchCategory =
        selectedCategories.length === 0 || selectedCategories.includes(prodCatId)

      // Điều kiện khoảng giá
      const matchPrice = !activeRange || (effectivePrice >= activeRange.min && effectivePrice < activeRange.max)

      // Điều kiện đánh giá tối thiểu
      const matchRating = !selectedRating || product.rating >= selectedRating

      return matchCategory && matchPrice && matchRating
    })
  }, [selectedCategories, selectedPriceRange, selectedRating, productsData])

  /**
   * Danh sách sản phẩm sau khi Sắp xếp - tách riêng khỏi bước lọc để dễ đọc,
   * đồng thời không làm thay đổi thứ tự mảng gốc (dùng [...array].sort()).
   */
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]

    switch (sortValue) {
      case 'price-asc':
        return list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price))
      case 'price-desc':
        return list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price))
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return list.sort((a, b) => b.name.localeCompare(a.name))
      case 'rating-desc':
        return list.sort((a, b) => b.rating - a.rating)
      case 'newest':
      default:
        // Backend trả về _id hoặc createdAt, dùng createdAt nếu có
        return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }
  }, [filteredProducts, sortValue])

  // Tổng số trang dựa trên số sản phẩm sau lọc + sắp xếp
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE))

  // Danh sách sản phẩm của riêng trang hiện tại
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return sortedProducts.slice(startIndex, startIndex + PAGE_SIZE)
  }, [sortedProducts, currentPage])

  return (
    <>
      <Breadcrumb items={[{ label: 'Sản phẩm' }]} />

      <div className="section-container products-page">
        <div className="row g-4">
          {/* ===== Sidebar Filter ===== */}
          <div className="col-12 col-lg-3">
            <SidebarFilter
              categories={categoriesData}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              priceRanges={priceRanges}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={handlePriceRangeChange}
              ratingOptions={ratingOptions}
              selectedRating={selectedRating}
              onRatingChange={handleRatingChange}
              onReset={handleResetFilter}
            />
          </div>

          {/* ===== Danh sách sản phẩm ===== */}
          <div className="col-12 col-lg-9">
            {/* Thanh công cụ: Tìm kiếm + Sắp xếp */}
            <div className="products-toolbar">
              <SearchBar 
                value={searchTerm} 
                onChange={handleSearchChange} 
                onSubmit={(val) => {
                  const currentParams = new URLSearchParams(location.search);
                  if (val.trim()) {
                    currentParams.set('keyword', val.trim());
                  } else {
                    currentParams.delete('keyword');
                  }
                  navigate(`/products?${currentParams.toString()}`);
                }} 
              />
              <SortDropdown value={sortValue} onChange={handleSortChange} options={sortOptions} />
            </div>

            {loading && <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Đang tải...</span></div></div>}
            
            {error && <div className="alert alert-danger my-4">{error}</div>}

            {!loading && !error && (
              <>
                {/* Số lượng kết quả tìm được */}
                <p className="products-result-count">
                  Tìm thấy <strong>{sortedProducts.length}</strong> sản phẩm
                </p>

                <ProductGrid products={paginatedProducts} />

                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Products
