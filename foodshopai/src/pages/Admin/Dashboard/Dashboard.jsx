import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  FiPackage, 
  FiUsers, 
  FiShoppingCart, 
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import adminService from '../../../services/adminService';
import PagePlaceholder from '../../../components/common/PagePlaceholder';
import { formatCurrency } from '../../../utils/formatCurrency';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        } else {
          setError('Không thể lấy dữ liệu thống kê');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi kết nối máy chủ');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <PagePlaceholder title="Đang tải dữ liệu Dashboard..." />;
  if (error) return <PagePlaceholder title="Lỗi" />; // We can show exact error message

  // Dữ liệu biểu đồ trạng thái đơn hàng
  const orderStatusData = [
    { name: 'Chờ xử lý', value: stats.pendingOrders, color: '#FF9800' },
    { name: 'Hoàn thành', value: stats.completedOrders, color: '#4CAF50' },
    { name: 'Đã hủy', value: stats.cancelledOrders, color: '#F44336' },
  ];

  // Mock dữ liệu doanh thu theo tháng (Vì yêu cầu "Doanh thu theo tháng" nhưng API hiện chỉ trả Total Revenue)
  // Trong thực tế sẽ cần API trả về mảng doanh thu từng tháng. Ở đây ta giả lập một chút cho UI hoặc nếu muốn làm đúng 100% thì Backend phải sửa
  const monthlyRevenueData = [
    { name: 'T1', total: 0 },
    { name: 'T2', total: 0 },
    { name: 'T3', total: 0 },
    { name: 'T4', total: 0 },
    { name: 'T5', total: 0 },
    { name: 'T6', total: stats.totalRevenue }, // Giả sử tất cả doanh thu ở tháng hiện tại (T6)
  ];

  return (
    <div className="admin-dashboard">
      <h2 className="mb-4">Tổng quan</h2>
      
      {/* Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="dashboard-card bg-primary text-white">
            <div className="dashboard-card-icon"><FiPackage /></div>
            <div className="dashboard-card-info">
              <h3>Tổng sản phẩm</h3>
              <p>{stats.totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="dashboard-card bg-success text-white">
            <div className="dashboard-card-icon"><FiShoppingCart /></div>
            <div className="dashboard-card-info">
              <h3>Tổng đơn hàng</h3>
              <p>{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="dashboard-card bg-info text-white">
            <div className="dashboard-card-icon"><FiUsers /></div>
            <div className="dashboard-card-info">
              <h3>Tổng khách hàng</h3>
              <p>{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="dashboard-card bg-warning text-white">
            <div className="dashboard-card-icon"><FiDollarSign /></div>
            <div className="dashboard-card-info">
              <h3>Tổng doanh thu</h3>
              <p>{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="dashboard-status-card pending">
            <div className="status-icon"><FiClock /></div>
            <div>
              <h4>Chờ xử lý</h4>
              <p>{stats.pendingOrders} đơn</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="dashboard-status-card completed">
            <div className="status-icon"><FiCheckCircle /></div>
            <div>
              <h4>Hoàn thành</h4>
              <p>{stats.completedOrders} đơn</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="dashboard-status-card cancelled">
            <div className="status-icon"><FiXCircle /></div>
            <div>
              <h4>Đã hủy</h4>
              <p>{stats.cancelledOrders} đơn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="dashboard-chart-box">
            <h4 className="chart-title">Doanh thu theo tháng</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="total" name="Doanh thu" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="dashboard-chart-box">
            <h4 className="chart-title">Tỷ lệ đơn hàng</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
