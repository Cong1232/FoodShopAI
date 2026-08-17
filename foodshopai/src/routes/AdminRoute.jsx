import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PagePlaceholder from '../components/common/PagePlaceholder';

const AdminRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <PagePlaceholder title="Đang kiểm tra quyền truy cập..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const role = currentUser?.role || currentUser?.user?.role;

  if (role !== 'admin' && role !== 'Admin' && role !== 'ADMIN') {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <h1 className="text-danger fw-bold" style={{ fontSize: '4rem' }}>403</h1>
        <h3 className="mb-3">Không có quyền truy cập</h3>
        <p className="text-muted mb-4">Bạn cần tài khoản quản trị để truy cập khu vực này.</p>
        <p className="text-muted mb-4">Debug User: {JSON.stringify(currentUser)}</p>
        <a href="/" className="btn btn-primary">Về trang chủ</a>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
