import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import adminUserService from '../../../services/adminUserService';
import PagePlaceholder from '../../../components/common/PagePlaceholder';
import { FiArrowLeft, FiUser, FiMapPin, FiPhone, FiMail, FiShield, FiUserCheck, FiUserX, FiUnlock, FiLock } from 'react-icons/fi';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    avatar: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await adminUserService.getUserById(id);
      if (res && res.data) {
        setUser(res.data);
        setFormData({
          fullName: res.data.fullName || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
          avatar: res.data.avatar || ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi tải chi tiết người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await adminUserService.updateUser(id, formData);
      if (res && res.data) {
        setUser(res.data);
        alert('Cập nhật thông tin thành công!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateRole = async (newRole) => {
    if (!window.confirm(`Bạn có chắc muốn cấp quyền ${newRole.toUpperCase()} cho người dùng này?`)) return;
    try {
      const res = await adminUserService.updateUserRole(id, newRole);
      if (res && res.data) {
        setUser(res.data);
        alert(`Cấp quyền ${newRole} thành công!`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Cấp quyền thất bại');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    let actionName = newStatus === 'banned' ? 'KHÓA' : newStatus === 'active' ? 'MỞ KHÓA' : 'VÔ HIỆU HÓA';
    if (!window.confirm(`Bạn có chắc muốn ${actionName} tài khoản này không?`)) return;
    try {
      const res = await adminUserService.updateUserStatus(id, newStatus);
      if (res && res.data) {
        setUser(res.data);
        alert(`Đã ${actionName} tài khoản thành công!`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Thao tác thất bại');
    }
  };

  if (loading) return <PagePlaceholder title="Đang tải thông tin..." />;
  if (error || !user) return <PagePlaceholder title={error || 'Không tìm thấy người dùng'} />;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center mb-4 gap-3">
        <Link to="/admin/users" className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
          <FiArrowLeft />
        </Link>
        <div>
          <h2 className="h3 mb-1 text-gray-800">Chi tiết Người dùng</h2>
          <span className="text-muted font-monospace">ID: {user._id}</span>
        </div>
      </div>

      <div className="row g-4">
        {/* Cột trái: Form thông tin cá nhân */}
        <div className="col-lg-8">
          <div className="card shadow border-0 mb-4">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold text-primary">Thông tin cá nhân</h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateInfo}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label"><FiUser className="me-1" /> Họ và tên</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label"><FiMail className="me-1" /> Email <small className="text-muted">(Không thể sửa)</small></label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={user.email}
                      disabled
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label"><FiPhone className="me-1" /> Số điện thoại</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Link Ảnh đại diện (Avatar)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label"><FiMapPin className="me-1" /> Địa chỉ</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary px-4" disabled={isUpdating}>
                  {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Cột phải: Quyền & Trạng thái */}
        <div className="col-lg-4">
          
          {/* Card: Tổng quan */}
          <div className="card shadow border-0 mb-4 text-center">
            <div className="card-body py-4">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="rounded-circle mb-3 shadow-sm" style={{ width: 100, height: 100, objectFit: 'cover' }} />
              ) : (
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 100, height: 100, fontSize: '2.5rem' }}>
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <h5 className="fw-bold mb-1">{user.fullName}</h5>
              <p className="text-muted mb-3">{user.email}</p>
              
              <div className="d-flex justify-content-center gap-2 mb-3">
                {user.role === 'admin' ? (
                  <span className="badge bg-danger fs-6 px-3"><FiShield className="me-1"/> Admin</span>
                ) : (
                  <span className="badge bg-secondary fs-6 px-3"><FiUserCheck className="me-1"/> User</span>
                )}

                {user.status === 'active' && <span className="badge bg-success fs-6 px-3">Active</span>}
                {user.status === 'inactive' && <span className="badge bg-warning text-dark fs-6 px-3">Inactive</span>}
                {user.status === 'banned' && <span className="badge bg-dark fs-6 px-3">Banned</span>}
              </div>

              <div className="text-start mt-4 pt-3 border-top small text-muted">
                <p className="mb-1"><strong>Ngày tạo:</strong> {new Date(user.createdAt).toLocaleString('vi-VN')}</p>
                <p className="mb-0"><strong>Cập nhật:</strong> {new Date(user.updatedAt).toLocaleString('vi-VN')}</p>
              </div>
            </div>
          </div>

          {/* Card: Quản trị Quyền */}
          <div className="card shadow border-0 mb-4">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold text-danger"><FiShield className="me-2"/> Quản trị Quyền</h6>
            </div>
            <div className="card-body">
              {user.role === 'user' ? (
                <button className="btn btn-outline-danger w-100" onClick={() => handleUpdateRole('admin')}>
                  Cấp quyền Admin
                </button>
              ) : (
                <button className="btn btn-outline-secondary w-100" onClick={() => handleUpdateRole('user')}>
                  Hạ quyền xuống User
                </button>
              )}
              <small className="d-block text-muted mt-2 text-center">Lưu ý: Không thể tự hạ quyền chính mình.</small>
            </div>
          </div>

          {/* Card: Quản trị Trạng thái */}
          <div className="card shadow border-0 mb-4">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold text-dark"><FiLock className="me-2"/> Quản trị Trạng thái</h6>
            </div>
            <div className="card-body">
              {user.status === 'banned' ? (
                <button className="btn btn-success w-100 mb-2" onClick={() => handleUpdateStatus('active')}>
                  <FiUnlock className="me-1"/> Mở khóa tài khoản (Active)
                </button>
              ) : (
                <button className="btn btn-dark w-100 mb-2" onClick={() => handleUpdateStatus('banned')}>
                  <FiLock className="me-1"/> Khóa tài khoản (Ban)
                </button>
              )}
              
              {user.status !== 'inactive' && (
                <button className="btn btn-warning w-100" onClick={() => handleUpdateStatus('inactive')}>
                  Chuyển Inactive
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
