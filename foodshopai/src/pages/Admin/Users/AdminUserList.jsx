import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminUserService from '../../../services/adminUserService';
import PagePlaceholder from '../../../components/common/PagePlaceholder';
import { FiSearch, FiEdit, FiFilter, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('createdAt_desc');
  
  // Search trigger
  const [searchTrigger, setSearchTrigger] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminUserService.getUsers({
        page,
        limit: 10,
        search: searchTrigger,
        role,
        status,
        sort
      });
      if (res && res.data) {
        setUsers(res.data.users);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role, status, sort, searchTrigger]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchTrigger(search);
  };

  const getRoleBadge = (r) => {
    if (r === 'admin') return <span className="badge bg-danger"><FiShield className="me-1" /> Admin</span>;
    return <span className="badge bg-secondary"><FiUserCheck className="me-1" /> User</span>;
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'active': return <span className="badge bg-success">Hoạt động</span>;
      case 'inactive': return <span className="badge bg-warning text-dark">Chưa kích hoạt</span>;
      case 'banned': return <span className="badge bg-dark"><FiUserX className="me-1" /> Khóa</span>;
      default: return <span className="badge bg-secondary">{s}</span>;
    }
  };

  if (error && !users.length) return <PagePlaceholder title={error} />;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0 text-gray-800">Quản lý Người dùng</h2>
      </div>

      <div className="card shadow mb-4 border-0">
        <div className="card-body">
          {/* Controls */}
          <div className="row mb-4 g-3">
            <div className="col-md-4">
              <form onSubmit={handleSearch} className="d-flex">
                <div className="input-group">
                  <span className="input-group-text bg-white"><FiSearch /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm tên hoặc email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">Tìm</button>
                </div>
              </form>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
                <option value="">Tất cả Quyền</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white"><FiFilter /></span>
                <select className="form-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                  <option value="">Tất cả Trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Chưa kích hoạt</option>
                  <option value="banned">Khóa (Banned)</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
                <option value="createdAt_desc">Mới nhất</option>
                <option value="createdAt_asc">Cũ nhất</option>
                <option value="name_asc">Tên (A-Z)</option>
                <option value="name_desc">Tên (Z-A)</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-5 text-muted">
              Không tìm thấy người dùng nào.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Người dùng</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    <th>Quyền</th>
                    <th>Trạng thái</th>
                    <th>Ngày tham gia</th>
                    <th className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {user.avatar ? (
                            <img src={user.avatar} alt="avatar" className="rounded-circle" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                          ) : (
                            <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="fw-bold">{user.fullName}</div>
                        </div>
                      </td>
                      <td className="text-muted">{user.email}</td>
                      <td>{user.phone || '--'}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="text-center">
                        <Link to={`/admin/users/${user._id}`} className="btn btn-sm btn-outline-primary">
                          <FiEdit /> Sửa
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(page - 1)}>Trước</button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(page + 1)}>Sau</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminUserList;
