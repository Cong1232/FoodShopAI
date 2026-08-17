import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  FiFilter, FiDownload, FiDollarSign, FiShoppingCart, 
  FiCheckCircle, FiXCircle, FiUsers, FiPackage 
} from 'react-icons/fi';
import adminService from '../../../services/adminService';
import PagePlaceholder from '../../../components/common/PagePlaceholder';
import { getImageUrl } from '../../../utils/getImageUrl';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a28bfe', '#ff6b81', '#2ed573'];

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterType, setFilterType] = useState('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchReports();
  }, [filterType, startDate, endDate]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let queryParams = {};
      
      const today = new Date();
      if (filterType === 'today') {
        const start = new Date(today.setHours(0,0,0,0));
        const end = new Date(today.setHours(23,59,59,999));
        queryParams = { startDate: start.toISOString(), endDate: end.toISOString() };
      } else if (filterType === '7days') {
        const start = new Date(today);
        start.setDate(today.getDate() - 7);
        queryParams = { startDate: start.toISOString(), endDate: new Date().toISOString() };
      } else if (filterType === '30days') {
        const start = new Date(today);
        start.setDate(today.getDate() - 30);
        queryParams = { startDate: start.toISOString(), endDate: new Date().toISOString() };
      } else if (filterType === 'month') {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        queryParams = { startDate: start.toISOString(), endDate: end.toISOString() };
      } else if (filterType === 'year') {
        const start = new Date(today.getFullYear(), 0, 1);
        const end = new Date(today.getFullYear(), 11, 31);
        queryParams = { startDate: start.toISOString(), endDate: end.toISOString() };
      } else if (filterType === 'custom' && startDate && endDate) {
        queryParams = { 
          startDate: new Date(startDate).toISOString(), 
          endDate: new Date(endDate).toISOString() 
        };
      }

      // Nếu chọn custom mà chưa điền đủ thì không fetch (chờ điền đủ)
      if (filterType === 'custom' && (!startDate || !endDate)) {
        setLoading(false);
        return;
      }

      const res = await adminService.getReports(queryParams);
      if (res && res.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi tải dữ liệu báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const getFilterParams = () => {
    let params = {};
    const today = new Date();
    if (filterType === 'today') {
      const start = new Date(today.setHours(0,0,0,0));
      const end = new Date(today.setHours(23,59,59,999));
      params = { startDate: start.toISOString(), endDate: end.toISOString() };
    } else if (filterType === '7days') {
      const start = new Date(today);
      start.setDate(today.getDate() - 7);
      params = { startDate: start.toISOString(), endDate: new Date().toISOString() };
    } else if (filterType === '30days') {
      const start = new Date(today);
      start.setDate(today.getDate() - 30);
      params = { startDate: start.toISOString(), endDate: new Date().toISOString() };
    } else if (filterType === 'month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      params = { startDate: start.toISOString(), endDate: end.toISOString() };
    } else if (filterType === 'year') {
      const start = new Date(today.getFullYear(), 0, 1);
      const end = new Date(today.getFullYear(), 11, 31);
      params = { startDate: start.toISOString(), endDate: end.toISOString() };
    } else if (filterType === 'custom' && startDate && endDate) {
      params = { 
        startDate: new Date(startDate).toISOString(), 
        endDate: new Date(endDate).toISOString() 
      };
    }
    return params;
  };

  const exportToExcel = async () => {
    if (!data) return;
    try {
      const res = await adminService.exportExcelReports(getFilterParams());
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FoodShopAI_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Lỗi xuất Excel:', err);
    }
  };

  const exportToPDF = async () => {
    if (!data) return;
    try {
      const res = await adminService.exportPdfReports(getFilterParams());
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FoodShopAI_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Lỗi xuất PDF:', err);
    }
  };

  if (loading && !data) return <PagePlaceholder title="Đang tính toán báo cáo..." />;
  if (error) return <PagePlaceholder title={error || 'Lỗi dữ liệu'} />;

  const pieData = data?.orderStatusStats?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const chartData = filterType === 'year' || filterType === 'month' || filterType === 'custom' 
    ? data?.revenueByDay || []
    : data?.revenueByDay || [];

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="h3 mb-1 text-gray-800 fw-bold">Thống kê & Báo cáo</h2>
          <p className="text-muted mb-0">Phân tích chuyên sâu dữ liệu bán hàng</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success d-flex align-items-center gap-2" onClick={exportToExcel}>
            <FiDownload /> Xuất Excel
          </button>
          <button className="btn btn-danger d-flex align-items-center gap-2" onClick={exportToPDF}>
            <FiDownload /> Xuất PDF
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body bg-white rounded d-flex flex-wrap gap-3 align-items-center">
          <div className="d-flex align-items-center gap-2">
            <FiFilter className="text-primary" /> <strong>Bộ lọc:</strong>
          </div>
          <select 
            className="form-select form-select-sm w-auto"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="today">Hôm nay</option>
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
            <option value="custom">Tùy chỉnh...</option>
          </select>

          {filterType === 'custom' && (
            <div className="d-flex align-items-center gap-2">
              <input 
                type="date" 
                className="form-control form-control-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span>đến</span>
              <input 
                type="date" 
                className="form-control form-control-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {data && (
        <>
          {/* Row 1: Thống kê tổng quan */}
          <div className="row g-4 mb-4">
            <div className="col-xl-3 col-md-6">
              <div className="card border-left-primary shadow-sm h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Tổng Doanh Thu
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {data.summary.totalRevenue?.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                    <div className="col-auto">
                      <FiDollarSign className="fs-2 text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card border-left-success shadow-sm h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Đơn thành công / Tổng đơn
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {data.summary.successfulOrders} / {data.summary.totalOrders}
                      </div>
                    </div>
                    <div className="col-auto">
                      <FiCheckCircle className="fs-2 text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card border-left-danger shadow-sm h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                        Đơn hủy
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {data.summary.cancelledOrders}
                      </div>
                    </div>
                    <div className="col-auto">
                      <FiXCircle className="fs-2 text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card border-left-warning shadow-sm h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                        Giá trị TB Đơn
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {data.summary.averageOrderValue?.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                    <div className="col-auto">
                      <FiShoppingCart className="fs-2 text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biểu đồ */}
          <div className="row g-4 mb-4">
            <div className="col-xl-8 col-lg-7">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Biểu đồ Doanh thu</h6>
                </div>
                <div className="card-body">
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(val) => new Intl.NumberFormat('vi-VN').format(val)} />
                        <Tooltip formatter={(val) => new Intl.NumberFormat('vi-VN').format(val) + 'đ'} />
                        <Legend />
                        <Line type="monotone" name="Doanh thu" dataKey="revenue" stroke="#4e73df" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-5">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Trạng thái đơn hàng</h6>
                </div>
                <div className="card-body">
                  <div style={{ height: '300px' }}>
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
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng Top */}
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3">
                  <h6 className="m-0 font-weight-bold text-warning">Top 10 Sản phẩm</h6>
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
                        {data.topProducts.map((prod, idx) => (
                          <tr key={idx}>
                            <td className="ps-4 py-2">
                              <div className="fw-bold text-truncate" style={{ maxWidth: '250px' }}>{prod.name}</div>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-success">{prod.totalSold}</span>
                            </td>
                            <td className="text-end pe-4 fw-bold text-danger">
                              {prod.revenue?.toLocaleString('vi-VN')}đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3">
                  <h6 className="m-0 font-weight-bold text-info">Top Khách hàng</h6>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-4">Khách hàng</th>
                          <th className="text-center">Số đơn</th>
                          <th className="text-end pe-4">Đã chi tiêu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topCustomers.map((user, idx) => (
                          <tr key={idx}>
                            <td className="ps-4 py-2">
                              <div className="fw-bold">{user.name}</div>
                              <small className="text-muted">{user.email}</small>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-primary">{user.totalOrders}</span>
                            </td>
                            <td className="text-end pe-4 fw-bold text-danger">
                              {user.totalSpent?.toLocaleString('vi-VN')}đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;
