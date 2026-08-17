import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import adminOrderService from '../../../services/adminOrderService';
import PagePlaceholder from '../../../components/common/PagePlaceholder';
import { FiArrowLeft, FiUser, FiMapPin, FiPhone, FiCheckCircle, FiTruck, FiXCircle, FiPackage } from 'react-icons/fi';
import { getImageUrl } from '../../../utils/getImageUrl';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await adminOrderService.getOrderById(id);
      if (res && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus, actionName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionName} đơn hàng này không?`)) {
      return;
    }

    setIsUpdating(true);
    try {
      const res = await adminOrderService.updateOrderStatus(id, newStatus);
      if (res && res.data) {
        setOrder(res.data);
        alert(`Đã cập nhật trạng thái đơn hàng: ${newStatus}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (statusStr) => {
    switch (statusStr) {
      case 'Pending':
      case 'pending':
        return <span className="badge bg-warning text-dark fs-6 px-3 py-2">Chờ xác nhận</span>;
      case 'Confirmed':
        return <span className="badge bg-info text-dark fs-6 px-3 py-2">Đã xác nhận</span>;
      case 'Shipping':
        return <span className="badge bg-primary fs-6 px-3 py-2">Đang giao</span>;
      case 'Completed':
        return <span className="badge bg-success fs-6 px-3 py-2">Hoàn thành</span>;
      case 'Cancelled':
        return <span className="badge bg-danger fs-6 px-3 py-2">Đã hủy</span>;
      case 'paid':
        return <span className="badge bg-success fs-6 px-3 py-2">Đã thanh toán</span>;
      default:
        return <span className="badge bg-secondary fs-6 px-3 py-2">{statusStr}</span>;
    }
  };

  if (loading) return <PagePlaceholder title="Đang tải chi tiết đơn hàng..." />;
  if (error || !order) return <PagePlaceholder title={error || 'Đơn hàng không tồn tại'} />;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center mb-4 gap-3">
        <Link to="/admin/orders" className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
          <FiArrowLeft />
        </Link>
        <div>
          <h2 className="h3 mb-1 text-gray-800">Chi tiết đơn hàng</h2>
          <span className="text-muted font-monospace">Mã đơn: {order._id}</span>
        </div>
        <div className="ms-auto">
          {getStatusBadge(order.orderStatus)}
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Thông tin khách hàng */}
        <div className="col-md-6">
          <div className="card shadow border-0 h-100">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold text-primary">Thông tin Khách hàng</h6>
            </div>
            <div className="card-body">
              <p className="mb-2"><FiUser className="me-2 text-muted" /> <strong>Họ tên:</strong> {order.fullName}</p>
              <p className="mb-2"><FiPhone className="me-2 text-muted" /> <strong>SĐT:</strong> {order.phone}</p>
              <p className="mb-0"><FiMapPin className="me-2 text-muted" /> <strong>Địa chỉ:</strong> {order.address}</p>
              {order.note && (
                <div className="alert alert-warning mt-3 mb-0 p-2 border-0 bg-light">
                  <strong>Ghi chú:</strong> {order.note}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cập nhật Trạng thái */}
        <div className="col-md-6">
          <div className="card shadow border-0 h-100">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold text-primary">Thao tác Đơn hàng</h6>
            </div>
            <div className="card-body d-flex flex-column justify-content-center gap-3">
              {/* Hành động khả dụng dựa trên trạng thái hiện tại */}
              {order.orderStatus === 'Pending' && (
                <button 
                  className="btn btn-info text-white btn-lg" 
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('Confirmed', 'Xác nhận')}
                >
                  <FiCheckCircle className="me-2" /> Xác nhận đơn hàng
                </button>
              )}

              {order.orderStatus === 'Confirmed' && (
                <button 
                  className="btn btn-primary btn-lg" 
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('Shipping', 'Chuyển sang Giao hàng')}
                >
                  <FiTruck className="me-2" /> Chuyển đi Giao hàng
                </button>
              )}

              {order.orderStatus === 'Shipping' && (
                <button 
                  className="btn btn-success btn-lg" 
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('Completed', 'Hoàn thành')}
                >
                  <FiPackage className="me-2" /> Đã giao thành công (Hoàn thành)
                </button>
              )}

              {['Pending', 'Confirmed', 'Shipping'].includes(order.orderStatus) && (
                <button 
                  className="btn btn-outline-danger" 
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('Cancelled', 'Hủy')}
                >
                  <FiXCircle className="me-2" /> Hủy đơn hàng này
                </button>
              )}

              {['Completed', 'Cancelled'].includes(order.orderStatus) && (
                <div className="text-center text-muted">
                  <p className="mb-0">Đơn hàng ở trạng thái cuối cùng, không thể thao tác thêm.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 mb-4">
        <div className="card-header bg-white py-3">
          <h6 className="m-0 font-weight-bold text-primary">Danh sách sản phẩm</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Sản phẩm</th>
                  <th className="text-end">Đơn giá</th>
                  <th className="text-center">Số lượng</th>
                  <th className="text-end pe-4">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={getImageUrl(item.image || item.product?.images?.[0])} 
                          alt={item.name} 
                          className="rounded"
                          style={{ width: 60, height: 60, objectFit: 'cover' }}
                        />
                        <div className="fw-bold">{item.name}</div>
                      </div>
                    </td>
                    <td className="text-end text-muted">{item.price?.toLocaleString('vi-VN')}đ</td>
                    <td className="text-center fw-bold">{item.quantity}</td>
                    <td className="text-end pe-4 text-danger fw-bold">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white p-4">
          <div className="row justify-content-end">
            <div className="col-md-5 col-lg-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tạm tính:</span>
                <span className="fw-bold">{order.subtotal?.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Phí ship:</span>
                <span className="fw-bold">{order.shippingFee?.toLocaleString('vi-VN')}đ</span>
              </div>
              {order.discount > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Giảm giá:</span>
                  <span className="fw-bold text-success">-{order.discount?.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fs-5 fw-bold text-dark">Tổng tiền:</span>
                <span className="fs-4 fw-bold text-danger">{order.totalPrice?.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="d-flex justify-content-between mt-3 text-muted small">
                <span>Thanh toán:</span>
                <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-secondary'}`}>
                  {order.paymentMethod} {order.isPaid ? '(Đã thanh toán)' : '(Chưa thanh toán)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
