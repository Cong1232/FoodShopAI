import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminOrderService from '../../../services/adminOrderService';
import PagePlaceholder from '../../../components/common/PagePlaceholder';
import { FiSearch, FiEye, FiFilter } from 'react-icons/fi';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('createdAt_desc');
  
  // Search state to trigger fetch
  const [searchTrigger, setSearchTrigger] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminOrderService.getOrders({
        page,
        limit: 10,
        search: searchTrigger,
        status,
        sort
      });
      if (res && res.data) {
        setOrders(res.data.orders);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, status, sort, searchTrigger]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on search
    setSearchTrigger(search);
  };

  const getStatusBadge = (statusStr) => {
    switch (statusStr) {
      case 'Pending':
        return <span className="badge bg-warning text-dark">Chờ xác nhận</span>;
      case 'Confirmed':
        return <span className="badge bg-info text-dark">Đã xác nhận</span>;
      case 'Shipping':
        return <span className="badge bg-primary">Đang giao</span>;
      case 'Completed':
        return <span className="badge bg-success">Hoàn thành</span>;
      case 'Cancelled':
        return <span className="badge bg-danger">Đã hủy</span>;
      default:
        return <span className="badge bg-secondary">{statusStr}</span>;
    }
  };

  if (error && !orders.length) {
    return <PagePlaceholder title={error} />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0 text-gray-800">Quản lý Đơn hàng</h2>
      </div>

      <div className="card shadow mb-4 border-0">
        <div className="card-body">
          {/* Controls: Search, Filter, Sort */}
          <div className="row mb-4 g-3">
            <div className="col-md-5">
              <form onSubmit={handleSearch} className="d-flex">
                <div className="input-group">
                  <span className="input-group-text bg-white"><FiSearch /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm theo Mã đơn hoặc Tên khách..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">Tìm</button>
                </div>
              </form>
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white"><FiFilter /></span>
                <select 
                  className="form-select" 
                  value={status} 
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="Pending">Chờ xác nhận</option>
                  <option value="Confirmed">Đã xác nhận</option>
                  <option value="Shipping">Đang giao</option>
                  <option value="Completed">Hoàn thành</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select" 
                value={sort} 
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="createdAt_desc">Ngày tạo (Mới nhất)</option>
                <option value="createdAt_asc">Ngày tạo (Cũ nhất)</option>
                <option value="totalPrice_desc">Tổng tiền (Cao đến thấp)</option>
                <option value="totalPrice_asc">Tổng tiền (Thấp đến cao)</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              Không tìm thấy đơn hàng nào.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Ngày tạo</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>
                        <small className="text-muted font-monospace">{order._id.substring(order._id.length - 8)}</small>
                      </td>
                      <td>
                        <div className="fw-bold">{order.fullName}</div>
                        <small className="text-muted">{order.user?.email}</small>
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute:'2-digit'
                        })}
                      </td>
                      <td className="fw-bold text-danger">
                        {order.totalPrice?.toLocaleString('vi-VN')}đ
                      </td>
                      <td>
                        <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-secondary'}`}>
                          {order.paymentMethod} - {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </td>
                      <td>
                        {getStatusBadge(order.orderStatus)}
                      </td>
                      <td className="text-center">
                        <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-outline-primary">
                          <FiEye /> Chi tiết
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
                    <button className="page-link" onClick={() => setPage(page - 1)}>
                      Trước
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(page + 1)}>
                      Sau
                    </button>
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

export default AdminOrderList;
