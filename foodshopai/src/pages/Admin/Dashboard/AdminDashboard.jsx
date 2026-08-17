import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  FiPackage, FiUsers, FiShoppingCart, FiDollarSign, 
  FiTrendingUp, FiActivity, FiArrowUpRight, FiClock 
} from 'react-icons/fi';
import adminDashboardService from '../../../services/adminDashboardService';
import PagePlaceholder from '../../../components/common/PagePlaceholder';
import { getImageUrl } from '../../../utils/getImageUrl';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a28bfe'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, chartsRes] = await Promise.all([
        adminDashboardService.getStats(),
        adminDashboardService.getCharts()
      ]);

      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }
      if (chartsRes && chartsRes.data) {
        setCharts(chartsRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi tải dữ liệu Dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PagePlaceholder title="Đang tải dữ liệu Dashboard..." />;
  if (error || !stats || !charts) return <PagePlaceholder title={error || 'Lỗi dữ liệu'} />;

  // Chuẩn bị dữ liệu cho Pie Chart (Trạng thái đơn hàng)
  const pieData = charts.orderStatusStats.map(item => ({
    name: item._id,
    value: item.count
  }));

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1 text-gray-800 fw-bold">Tổng quan hệ thống</h2>
          <p className="text-muted mb-0">Cập nhật số liệu hoạt động của FoodShop AI</p>
        </div>
        <button className="btn btn-outline-primary" onClick={fetchDashboardData}>
          <FiActivity className="me-2" /> Làm mới
        </button>
      </div>

      {/* Row 1: Thống kê tổng */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0 h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Tổng Doanh Thu
                  </div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">
                    {stats.totalRevenue?.toLocaleString('vi-VN')}đ
                  </div>
                </div>
                <div className="col-auto">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                    <FiDollarSign className="fs-3 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0 h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Tổng Đơn Hàng
                  </div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">
                    {stats.totalOrders}
                  </div>
                </div>
                <div className="col-auto">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                    <FiShoppingCart className="fs-3 text-success" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0 h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Khách Hàng
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h4 mb-0 mr-3 font-weight-bold text-gray-800">
                        {stats.totalUsers}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                    <FiUsers className="fs-3 text-info" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0 h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Sản Phẩm
                  </div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">
                    {stats.totalProducts}
                  </div>
                </div>
                <div className="col-auto">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                    <FiPackage className="fs-3 text-warning" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0 h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    Sản Phẩm Hết Hàng
                  </div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">
                    {stats.outOfStockCount || 0}
                  </div>
                </div>
                <div className="col-auto">
                  <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                    <FiPackage className="fs-3 text-danger" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0 h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-orange text-uppercase mb-1" style={{ color: '#fd7e14' }}>
                    Sản Phẩm Sắp Hết (≤10)
                  </div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">
                    {stats.lowStockCount || 0}
                  </div>
                </div>
                <div className="col-auto">
                  <div className="bg-orange bg-opacity-10 p-3 rounded-circle" style={{ backgroundColor: 'rgba(253, 126, 20, 0.1)' }}>
                    <FiPackage className="fs-3" style={{ color: '#fd7e14' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Hôm nay */}
      <div className="row g-4 mb-4">
        <div className="col-xl-6 col-md-12">
          <div className="card border-0 bg-primary text-white h-100 shadow-sm overflow-hidden position-relative">
            <div className="card-body d-flex flex-column justify-content-center p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-normal opacity-75">Doanh thu Hôm nay</h5>
                <FiTrendingUp className="fs-4 opacity-50" />
              </div>
              <h2 className="display-6 fw-bold mb-0">
                {stats.todayRevenue?.toLocaleString('vi-VN')} <small className="fs-5 opacity-75">VND</small>
              </h2>
            </div>
            <div className="position-absolute end-0 bottom-0 opacity-10 p-3">
              <FiDollarSign style={{ fontSize: '120px', marginRight: '-20px', marginBottom: '-30px' }} />
            </div>
          </div>
        </div>

        <div className="col-xl-6 col-md-12">
          <div className="card border-0 bg-success text-white h-100 shadow-sm overflow-hidden position-relative">
            <div className="card-body d-flex flex-column justify-content-center p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-normal opacity-75">Đơn hàng Hôm nay</h5>
                <FiClock className="fs-4 opacity-50" />
              </div>
              <h2 className="display-6 fw-bold mb-0">
                {stats.todayOrdersCount} <small className="fs-5 opacity-75">đơn</small>
              </h2>
            </div>
            <div className="position-absolute end-0 bottom-0 opacity-10 p-3">
              <FiShoppingCart style={{ fontSize: '120px', marginRight: '-20px', marginBottom: '-30px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Biểu đồ Doanh thu (Line) & Trạng thái đơn (Pie) */}
      <div className="row g-4 mb-4">
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Biểu đồ Doanh Thu Năm (VND)</h6>
            </div>
            <div className="card-body">
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => new Intl.NumberFormat('vi-VN').format(value)} />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(value) + 'đ'} />
                    <Legend />
                    <Line type="monotone" name="Doanh thu" dataKey="revenue" stroke="#4e73df" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Tỉ lệ Trạng thái Đơn hàng</h6>
            </div>
            <div className="card-body">
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Biểu đồ Lượng đơn hàng (Bar) */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-success">Lượng Đơn hàng Theo Tháng (Năm nay)</h6>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Số lượng Đơn" dataKey="orders" fill="#1cc88a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Top Products & Top Customers */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold text-warning">Top 10 Sản phẩm Bán chạy</h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Sản phẩm</th>
                      <th className="text-center">Đã bán</th>
                      <th className="text-end pe-4">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charts.topProducts.map((prod, idx) => (
                      <tr key={prod._id || idx}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img 
                              src={getImageUrl(prod.image)} 
                              alt={prod.name} 
                              className="rounded"
                              style={{ width: 40, height: 40, objectFit: 'cover' }}
                            /><div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>{prod.name}</div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-warning text-dark px-2 py-1">{prod.totalSold}</span>
                        </td>
                        <td className="text-end pe-4 fw-bold text-success">
                          {prod.totalRevenue?.toLocaleString('vi-VN')}đ
                        </td>
                      </tr>
                    ))}
                    {charts.topProducts.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">Chưa có dữ liệu</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold text-info">Top 10 Khách hàng VIP</h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Khách hàng</th>
                      <th className="text-center">Số đơn</th>
                      <th className="text-end pe-4">Tổng chi tiêu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charts.topCustomers.map((cus, idx) => (
                      <tr key={cus._id || idx}>
                        <td className="ps-4 py-3">
                          <div className="fw-bold">{cus.fullName}</div>
                          <small className="text-muted">{cus.email}</small>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-info text-white px-2 py-1">{cus.totalOrders}</span>
                        </td>
                        <td className="text-end pe-4 fw-bold text-danger">
                          {cus.totalSpent?.toLocaleString('vi-VN')}đ
                        </td>
                      </tr>
                    ))}
                    {charts.topCustomers.length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">Chưa có dữ liệu</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 6: Tồn kho */}
      <div className="row g-4 mt-2 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold" style={{ color: '#fd7e14' }}>Top 10 Sản phẩm Sắp hết</h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Sản phẩm</th>
                      <th className="text-center">Tồn kho</th>
                      <th className="text-end pe-4">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charts.lowStockProducts?.map((prod, idx) => (
                      <tr key={prod._id || idx}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img 
                              src={getImageUrl(prod.image)} 
                              alt={prod.name} 
                              className="rounded"
                              style={{ width: 40, height: 40, objectFit: 'cover' }}
                            /><div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>{prod.name}</div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="badge text-white px-2 py-1" style={{ backgroundColor: '#fd7e14' }}>{prod.stock}</span>
                        </td>
                        <td className="text-end pe-4 text-muted">
                          {prod.price?.toLocaleString('vi-VN')}đ
                        </td>
                      </tr>
                    ))}
                    {(!charts.lowStockProducts || charts.lowStockProducts.length === 0) && (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">Không có sản phẩm nào sắp hết</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h6 className="m-0 font-weight-bold text-danger">Top 10 Sản phẩm Hết hàng</h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Sản phẩm</th>
                      <th className="text-center">Tồn kho</th>
                      <th className="text-end pe-4">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charts.outOfStockProducts?.map((prod, idx) => (
                      <tr key={prod._id || idx}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img 
                              src={getImageUrl(prod.image)} 
                              alt={prod.name} 
                              className="rounded"
                              style={{ width: 40, height: 40, objectFit: 'cover' }}
                            /><div className="fw-bold text-truncate" style={{ maxWidth: '200px', color: '#999' }}>{prod.name}</div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-danger text-white px-2 py-1">0</span>
                        </td>
                        <td className="text-end pe-4 text-muted">
                          {prod.price?.toLocaleString('vi-VN')}đ
                        </td>
                      </tr>
                    ))}
                    {(!charts.outOfStockProducts || charts.outOfStockProducts.length === 0) && (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">Không có sản phẩm nào hết hàng</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
