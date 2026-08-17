const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Logic tính "Hôm nay"
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const orders = await Order.find();
    
    let totalRevenue = 0;
    let pendingOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;
    
    let todayOrdersCount = 0;
    let todayRevenue = 0;

    orders.forEach(order => {
      // Đếm trạng thái
      if (order.orderStatus === 'Completed') {
        completedOrders++;
        totalRevenue += order.totalPrice; // Doanh thu tổng từ tất cả đơn hoàn thành
      } else if (order.orderStatus === 'Pending') {
        pendingOrders++;
      } else if (order.orderStatus === 'Cancelled') {
        cancelledOrders++;
      }

      // Đếm cho "Hôm nay"
      const orderDate = new Date(order.createdAt);
      if (orderDate >= startOfToday && orderDate <= endOfToday) {
        todayOrdersCount++;
        if (order.orderStatus === 'Completed') {
          todayRevenue += order.totalPrice;
        }
      }
    });

    const outOfStockCount = await Product.countDocuments({ stock: 0 });
    const lowStockCount = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategories,
        totalRevenue,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        todayOrdersCount,
        todayRevenue,
        outOfStockCount,
        lowStockCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/dashboard/charts
const getDashboardCharts = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    // 1. Doanh thu và Đơn hàng theo tháng (12 tháng của năm hiện tại)
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          ordersCount: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "Completed"] }, "$totalPrice", 0]
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Chuẩn hóa array 12 tháng
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthIndex = i + 1;
      const found = monthlyStats.find(m => m._id === monthIndex);
      return {
        month: `Tháng ${monthIndex}`,
        revenue: found ? found.revenue : 0,
        orders: found ? found.ordersCount : 0
      };
    });

    // 2. Trạng thái đơn hàng (Dành cho Pie Chart)
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    // 3. Top 10 sản phẩm bán chạy nhất (Dựa trên số lượng đã mua trong đơn Completed)
    const topProducts = await Order.aggregate([
      { $match: { orderStatus: 'Completed' } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          image: { $first: "$orderItems.image" },
          totalSold: { $sum: "$orderItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // 4. Top 10 khách hàng mua nhiều nhất
    const topCustomers = await Order.aggregate([
      { $match: { orderStatus: 'Completed' } },
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 1,
          totalOrders: 1,
          totalSpent: 1,
          fullName: "$userInfo.fullName",
          email: "$userInfo.email"
        }
      }
    ]);

    // 5. Sản phẩm sắp hết (Top 10, stock > 0 && stock <= 10)
    const lowStockProducts = await Product.find({ stock: { $gt: 0, $lte: 10 } })
      .select('name image stock price')
      .sort({ stock: 1 })
      .limit(10);

    // 6. Sản phẩm hết hàng (Top 10, stock = 0)
    const outOfStockProducts = await Product.find({ stock: 0 })
      .select('name image stock price')
      .sort({ updatedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        monthlyData,
        orderStatusStats,
        topProducts,
        topCustomers,
        lowStockProducts,
        outOfStockProducts
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getDashboardCharts
};
