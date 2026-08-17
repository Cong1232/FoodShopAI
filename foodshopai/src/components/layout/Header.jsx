import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import categoryService from '../../services/categoryService.js'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiShoppingBag, FiSettings } from 'react-icons/fi'
import { BsRobot } from 'react-icons/bs'
import './Header.css'

/**
 * Header - Thanh điều hướng chính của website.
 * Gồm: Logo, menu điều hướng, ô tìm kiếm, icon Chatbot / Giỏ hàng / Người dùng.
 * Responsive: trên mobile, menu điều hướng thu gọn vào hamburger menu.
 *
 * Lưu ý (Buổi 1): chưa gắn logic tìm kiếm/giỏ hàng/đăng nhập thật,
 * chỉ dựng giao diện và điều hướng cơ bản.
 */
function Header() {
  const { currentUser, logout } = useAuth()
  const { cartItemCount } = useCart()
  const navigate = useNavigate()

  // Trạng thái đóng/mở menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')

  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const kw = params.get('keyword')
    if (kw !== null) {
      setSearchKeyword(kw)
    } else {
      setSearchKeyword('')
    }
  }, [location.search])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories()
        if (response) {
          const dataList = response.data ? response.data : (Array.isArray(response) ? response : [])
          setCategories(dataList.slice(0, 5)) // Lấy 5 danh mục đầu tiên cho Header
        }
      } catch (error) {
        console.error('Lỗi khi tải danh mục Header:', error)
      }
    }
    fetchCategories()
  }, [])

  // Danh sách menu điều hướng chính cố định
  const fixedNavLinks = [
    { path: '/', label: 'Trang chủ', end: true },
    { path: '/products', label: 'Sản phẩm' },
    { path: '/about', label: 'Giới thiệu' },
    { path: '/contact', label: 'Liên hệ' }
  ]

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    closeMenu()
  }

  return (
    <header className="site-header">
      <div className="section-container">
        <div className="header-inner">
          {/* ===== Logo ===== */}
          <Link to="/" className="header-logo" onClick={closeMenu}>
            <span className="logo-food">Food</span>
            <span className="logo-shop">Shop</span>
            <span className="logo-ai">AI</span>
          </Link>

          {/* ===== Menu điều hướng (desktop) ===== */}
          <nav className={`header-nav ${isMenuOpen ? 'header-nav--open' : ''}`}>
            <ul className="header-nav-list">
              {fixedNavLinks.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.path}
                    end={link.end}
                    className={({ isActive }) =>
                      `header-nav-link ${isActive ? 'header-nav-link--active' : ''}`
                    }
                    onClick={closeMenu}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              
              {/* Dropdown danh mục */}
              <li className="header-nav-dropdown-container">
                <span className="header-nav-link" style={{cursor: 'pointer'}}>Danh mục ▾</span>
                {categories.length > 0 && (
                  <ul className="header-nav-dropdown">
                    {categories.map(cat => (
                      <li key={cat._id || cat.id}>
                        <Link to={`/products?category=${cat._id || cat.id}`} onClick={closeMenu} className="header-dropdown-item">
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>


            </ul>

            {/* Ô tìm kiếm hiển thị trong menu mobile khi mở */}
            <form className="header-search header-search--mobile" onSubmit={(e) => {
              e.preventDefault();
              if (searchKeyword.trim()) {
                navigate(`/products?keyword=${encodeURIComponent(searchKeyword.trim())}`);
              } else {
                navigate(`/products`);
              }
              closeMenu();
            }}>
              <input
                type="text"
                placeholder="Tìm món ăn, nguyên liệu..."
                className="header-search-input"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button type="submit" className="header-search-btn" aria-label="Tìm kiếm">
                <FiSearch />
              </button>
            </form>
          </nav>

          {/* ===== Ô tìm kiếm (desktop) ===== */}
          <form className="header-search header-search--desktop" onSubmit={(e) => {
              e.preventDefault();
              if (searchKeyword.trim()) {
                navigate(`/products?keyword=${encodeURIComponent(searchKeyword.trim())}`);
              } else {
                navigate(`/products`);
              }
              closeMenu();
            }}>
              <input
                type="text"
                placeholder="Tìm món ăn, nguyên liệu..."
                className="header-search-input"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button type="submit" className="header-search-btn" aria-label="Tìm kiếm">
                <FiSearch />
              </button>
            </form>

          {/* ===== Icon chức năng ===== */}
          <div className="header-actions">
            <Link to="/" className="header-icon-btn" title="Trợ lý AI">
              <BsRobot />
            </Link>
            <Link to="/cart" className="header-icon-btn" title="Giỏ hàng">
              <FiShoppingCart />
              {cartItemCount > 0 && <span className="header-badge">{cartItemCount}</span>}
            </Link>
            {!currentUser ? (
              <div className="header-auth-links d-none d-md-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary btn-sm">Đăng nhập</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
              </div>
            ) : (
              <div className="header-nav-dropdown-container">
                <div className="header-icon-btn" style={{cursor: 'pointer'}}>
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" style={{width: 32, height: 32, borderRadius: '50%', objectFit: 'cover'}} />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <ul className="header-nav-dropdown" style={{minWidth: 150, right: 0, left: 'auto'}}>
                  <li className="px-3 py-2 fw-bold border-bottom">{currentUser.fullName}</li>
                  <li>
                    <Link to="/profile" className="header-dropdown-item d-flex align-items-center gap-2">
                      <FiUser /> Hồ sơ
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-orders" className="header-dropdown-item d-flex align-items-center gap-2">
                      <FiShoppingBag /> Đơn hàng của tôi
                    </Link>
                  </li>
                  {(currentUser.role === 'admin' || currentUser.role === 'Admin' || currentUser.role === 'ADMIN' || currentUser.user?.role?.toLowerCase() === 'admin') && (
                    <li>
                      <Link to="/admin" className="header-dropdown-item d-flex align-items-center gap-2 text-primary">
                        <FiSettings /> Quản trị Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="header-dropdown-item w-100 text-start border-0 bg-transparent text-danger d-flex align-items-center gap-2">
                      <FiLogOut /> Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* Nút mở/đóng menu - chỉ hiện trên mobile */}
            <button
              className="header-icon-btn header-menu-toggle"
              onClick={toggleMenu}
              aria-label="Mở menu"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
