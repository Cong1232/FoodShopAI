const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');
const PdfPrinter = require('pdfmake');
const path = require('path');

const getReportData = async (query) => {
  const { startDate, endDate } = query;
  
  let orderMatchQuery = {};
  if (startDate || endDate) {
    orderMatchQuery.createdAt = {};
    if (startDate) orderMatchQuery.createdAt.$gte = new Date(startDate);
    if (endDate) orderMatchQuery.createdAt.$lte = new Date(endDate);
  }

  const orders = await Order.find(orderMatchQuery).populate('user', 'fullName email');

  let totalRevenue = 0;
  let totalOrders = orders.length;
  let successfulOrders = 0;
  let cancelledOrders = 0;

  orders.forEach(order => {
    if (order.orderStatus === 'Completed') {
      successfulOrders++;
      totalRevenue += order.totalPrice;
    } else if (order.orderStatus === 'Cancelled') {
      cancelledOrders++;
    }
  });

  const averageOrderValue = successfulOrders > 0 ? Math.round(totalRevenue / successfulOrders) : 0;
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const topProducts = await Order.aggregate([
    { $match: { ...orderMatchQuery, orderStatus: 'Completed' } },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        name: { $first: "$orderItems.name" },
        totalSold: { $sum: "$orderItems.quantity" },
        revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 }
  ]);

  const topCustomers = await Order.aggregate([
    { $match: { ...orderMatchQuery, orderStatus: 'Completed' } },
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
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        name: "$userInfo.fullName",
        email: "$userInfo.email",
        totalOrders: 1,
        totalSpent: 1
      }
    }
  ]);

  const revenueByMonth = await Order.aggregate([
    { $match: { ...orderMatchQuery, orderStatus: 'Completed' } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]).then(data => data.map(item => ({
    date: `${item._id.month}/${item._id.year}`,
    revenue: item.revenue,
    orders: item.orders
  })));

  const revenueByDay = await Order.aggregate([
    { $match: { ...orderMatchQuery, orderStatus: 'Completed' } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
  ]).then(data => data.map(item => ({
    date: `${String(item._id.day).padStart(2, '0')}/${String(item._id.month).padStart(2, '0')}/${item._id.year}`,
    revenue: item.revenue,
    orders: item.orders
  })));

  const orderStatusStats = await Order.aggregate([
    { $match: orderMatchQuery },
    {
      $group: { _id: "$orderStatus", count: { $sum: 1 } }
    }
  ]);

  return {
    summary: { totalRevenue, totalOrders, successfulOrders, cancelledOrders, averageOrderValue, totalUsers, totalProducts },
    topProducts,
    topCustomers,
    revenueByMonth,
    revenueByDay,
    orderStatusStats,
    ordersList: orders // Return full orders list for reports
  };
};

exports.getReports = async (req, res) => {
  try {
    const data = await getReportData(req.query);
    // Remove ordersList to save bandwidth for regular dashboard
    delete data.ordersList;
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportExcel = async (req, res) => {
  try {
    const data = await getReportData(req.query);
    const workbook = new ExcelJS.Workbook();
    
    // 1. Sheet Tổng quan
    const ws1 = workbook.addWorksheet('Tổng Quan');
    ws1.mergeCells('A1:B1');
    const titleCell = ws1.getCell('A1');
    titleCell.value = 'BÁO CÁO THỐNG KÊ FOODSHOPAI';
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00B050' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    ws1.getCell('A3').value = 'Ngày xuất báo cáo:';
    ws1.getCell('B3').value = new Date().toLocaleString('vi-VN');
    
    ws1.getCell('A5').value = 'CHỈ SỐ';
    ws1.getCell('B5').value = 'GIÁ TRỊ';
    ['A5','B5'].forEach(c => {
      ws1.getCell(c).font = { bold: true };
      ws1.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
      ws1.getCell(c).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });

    const summaryRows = [
      ['Tổng Doanh thu', data.summary.totalRevenue],
      ['Tổng Đơn hàng', data.summary.totalOrders],
      ['Đơn thành công', data.summary.successfulOrders],
      ['Đơn hủy', data.summary.cancelledOrders],
      ['Giá trị TB đơn', data.summary.averageOrderValue],
      ['Tổng Khách hàng', data.summary.totalUsers],
      ['Tổng Sản phẩm', data.summary.totalProducts],
    ];

    let rowStart = 6;
    summaryRows.forEach((row, idx) => {
      ws1.addRow(row);
      ['A','B'].forEach(col => {
        const cell = ws1.getCell(`${col}${rowStart + idx}`);
        cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        if(idx % 2 === 1) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
      });
      // Currency for row 1 and 5
      if (idx === 0 || idx === 4) {
        ws1.getCell(`B${rowStart + idx}`).numFmt = '#,##0" ₫"';
      }
    });
    ws1.getColumn(1).width = 25;
    ws1.getColumn(2).width = 25;

    // 2. Sheet Danh sách Đơn hàng
    const ws2 = workbook.addWorksheet('Danh sách Đơn hàng', { views: [{ state: 'frozen', ySplit: 1 }] });
    ws2.columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Mã đơn', key: 'id', width: 25 },
      { header: 'Khách hàng', key: 'customer', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Ngày đặt', key: 'date', width: 20 },
      { header: 'Tổng tiền', key: 'total', width: 15 },
      { header: 'PT Thanh toán', key: 'payment', width: 15 },
      { header: 'TT Thanh toán', key: 'paymentStatus', width: 15 },
      { header: 'Trạng thái', key: 'status', width: 15 }
    ];
    
    // Style header
    ws2.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00B050' } };
      cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });

    data.ordersList.forEach((o, index) => {
      const row = ws2.addRow({
        stt: index + 1,
        id: o._id.toString(),
        customer: o.user ? o.user.fullName : 'N/A',
        email: o.user ? o.user.email : 'N/A',
        date: new Date(o.createdAt).toLocaleString('vi-VN'),
        total: o.totalPrice,
        payment: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        status: o.orderStatus
      });
      if (index % 2 === 1) {
        row.eachCell(cell => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }; });
      }
      row.getCell('total').numFmt = '#,##0" ₫"';
      row.eachCell(cell => { cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }; });
    });

    // 3. Sheet Sản phẩm bán chạy
    const ws3 = workbook.addWorksheet('Top Sản phẩm');
    ws3.columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Tên sản phẩm', key: 'name', width: 35 },
      { header: 'Đã bán', key: 'sold', width: 10 },
      { header: 'Doanh thu', key: 'revenue', width: 20 }
    ];
    ws3.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00B050' } };
    });
    data.topProducts.forEach((p, index) => {
      const row = ws3.addRow({ stt: index + 1, name: p.name, sold: p.totalSold, revenue: p.revenue });
      row.getCell('revenue').numFmt = '#,##0" ₫"';
    });

    // 4. Sheet Top Khách hàng
    const ws4 = workbook.addWorksheet('Top Khách hàng');
    ws4.columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Tên', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Số đơn', key: 'orders', width: 10 },
      { header: 'Tổng chi tiêu', key: 'spent', width: 20 }
    ];
    ws4.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00B050' } };
    });
    data.topCustomers.forEach((c, index) => {
      const row = ws4.addRow({ stt: index + 1, name: c.name, email: c.email, orders: c.totalOrders, spent: c.totalSpent });
      row.getCell('spent').numFmt = '#,##0" ₫"';
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=FoodShopAI_Report.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportPdf = async (req, res) => {
  try {
    const data = await getReportData(req.query);
    
    const fonts = {
      Roboto: {
        normal: path.join(__dirname, '../node_modules/pdfmake/build/fonts/Roboto/Roboto-Regular.ttf'),
        bold: path.join(__dirname, '../node_modules/pdfmake/build/fonts/Roboto/Roboto-Medium.ttf'),
        italics: path.join(__dirname, '../node_modules/pdfmake/build/fonts/Roboto/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, '../node_modules/pdfmake/build/fonts/Roboto/Roboto-MediumItalic.ttf')
      }
    };
    
    const pdfmake = require('pdfmake');
    pdfmake.setFonts(fonts);
    
    const orderRows = data.ordersList.slice(0, 50).map((o, idx) => [
      idx + 1,
      o._id.toString().substring(0, 8) + '...',
      o.user ? o.user.fullName : 'N/A',
      new Date(o.createdAt).toLocaleDateString('vi-VN'),
      o.totalPrice.toLocaleString('vi-VN') + ' đ',
      o.orderStatus
    ]);

    const docDefinition = {
      defaultStyle: { font: 'Roboto' },
      content: [
        { text: 'FoodShopAI', style: 'headerLogo' },
        { text: 'BÁO CÁO THỐNG KÊ', style: 'headerTitle' },
        {
          columns: [
            { text: `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`, width: '*' },
            { text: 'Người xuất: Quản trị viên', width: '*' }
          ],
          margin: [0, 0, 0, 20]
        },
        { text: '1. TỔNG QUAN', style: 'sectionHeader' },
        {
          table: {
            widths: ['*', '*'],
            body: [
              ['Tổng doanh thu', `${data.summary.totalRevenue.toLocaleString('vi-VN')} đ`],
              ['Tổng đơn hàng', data.summary.totalOrders],
              ['Đơn thành công', data.summary.successfulOrders],
              ['Đơn hủy', data.summary.cancelledOrders],
              ['Khách hàng', data.summary.totalUsers],
              ['Sản phẩm', data.summary.totalProducts]
            ]
          },
          margin: [0, 0, 0, 20]
        },
        { text: '2. CHI TIẾT ĐƠN HÀNG (Tối đa 50 đơn gần nhất)', style: 'sectionHeader' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
            body: [
              [{ text: 'STT', bold: true, fillColor: '#00B050', color: 'white' }, { text: 'Mã', bold: true, fillColor: '#00B050', color: 'white' }, { text: 'Khách hàng', bold: true, fillColor: '#00B050', color: 'white' }, { text: 'Ngày', bold: true, fillColor: '#00B050', color: 'white' }, { text: 'Tổng tiền', bold: true, fillColor: '#00B050', color: 'white' }, { text: 'Trạng thái', bold: true, fillColor: '#00B050', color: 'white' }],
              ...orderRows
            ]
          },
          margin: [0, 0, 0, 40]
        },
        {
          columns: [
            { text: '' },
            { text: 'Người lập báo cáo\n(Ký và ghi rõ họ tên)\n\n\n\n__________________', alignment: 'center' }
          ]
        }
      ],
      styles: {
        headerLogo: { fontSize: 24, bold: true, color: '#00B050', margin: [0, 0, 0, 5] },
        headerTitle: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 10], color: '#333333' }
      }
    };

    const pdfDoc = pdfmake.createPdf(docDefinition);
    const buffer = await pdfDoc.getBuffer();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=FoodShopAI_Report.pdf');
    res.end(buffer);


  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
