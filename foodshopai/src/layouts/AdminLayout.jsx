import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiGrid, 
  FiShoppingCart, 
  FiUsers, 
  FiStar, 
  FiPieChart, 
  FiLogOut,
  FiMenu
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import './AdminLayout.css';

function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: <FiHome />, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: <FiPackage />, label: 'Sản phẩm' },
    { path: '/admin/categories', icon: <FiGrid />, label: 'Danh mục' },
    { path: '/admin/orders', icon: <FiShoppingCart />, label: 'Đơn hàng' },
    { path: '/admin/users', icon: <FiUsers />, label: 'Người dùng' },
    { path: '/admin/reviews', icon: <FiStar />, label: 'Đánh giá' },
    { path: '/admin/reports', icon: <FiPieChart />, label: 'Thống kê' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-brand">
            <span className="text-primary fw-bold">Food</span>Shop AI
          </Link>
          <span className="admin-badge">ADMIN</span>
        </div>
        
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <FiLogOut /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <button 
            className="admin-menu-toggle d-md-none" 
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          
          <div className="admin-header-right ms-auto d-flex align-items-center gap-3">
            <Link to="/" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2">
              <FiHome /> Trang chủ
            </Link>
            <div className="admin-user-info">
              <span className="admin-user-name">{currentUser?.fullName}</span>
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="Admin" className="admin-avatar" />
              ) : (
                <div className="admin-avatar-placeholder">
                  {currentUser?.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
