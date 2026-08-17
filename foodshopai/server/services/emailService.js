const nodemailer = require('nodemailer');

const sendOrderConfirmationEmail = async ({ customerName, customerEmail, orderId, paymentMethod, paymentStatus, totalAmount, items, orderDate }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString('vi-VN')}đ</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"FoodShopAI" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: 'FoodShopAI - Xác nhận đơn hàng',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #2E7D32; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">FoodShopAI</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Xác nhận đơn hàng của bạn</p>
          </div>
          
          <div style="padding: 20px;">
            <p style="font-size: 16px;">Xin chào <strong>${customerName}</strong>,</p>
            <p style="font-size: 15px; color: #555;">Cảm ơn bạn đã mua hàng tại FoodShopAI. Dưới đây là thông tin chi tiết về đơn hàng của bạn:</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> #${orderId}</p>
              <p style="margin: 5px 0;"><strong>Ngày đặt:</strong> ${new Date(orderDate).toLocaleDateString('vi-VN')}</p>
              <p style="margin: 5px 0;"><strong>Phương thức thanh toán:</strong> ${paymentMethod}</p>
              <p style="margin: 5px 0;"><strong>Trạng thái:</strong> ${paymentStatus}</p>
            </div>

            <h3 style="color: #2E7D32; margin-bottom: 10px;">Danh sách sản phẩm</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f1f1f1;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Tên sản phẩm</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Số lượng</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Tổng tiền:</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; color: #D32F2F;">${totalAmount.toLocaleString('vi-VN')}đ</td>
                </tr>
              </tfoot>
            </table>

            <p style="font-size: 15px; color: #555;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email này.</p>
            <p style="font-size: 15px; color: #555;">Trân trọng,<br/><strong>Đội ngũ FoodShopAI</strong></p>
          </div>
          
          <div style="background-color: #f1f1f1; color: #777; padding: 15px; text-align: center; font-size: 12px;">
            &copy; ${new Date().getFullYear()} FoodShopAI. Tất cả các quyền được bảo lưu.
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email xác nhận đơn hàng ${orderId} đã được gửi.`);
    return true;
  } catch (error) {
    console.error(`Lỗi gửi email xác nhận đơn hàng ${orderId}:`, error.message);
    return false; // Trả về false để không break luồng thanh toán
  }
};

const sendResetPasswordEmail = async ({ customerName, customerEmail, resetUrl }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"FoodShopAI" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: 'FoodShopAI - Đặt lại mật khẩu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #2E7D32; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">FoodShopAI</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Đặt lại mật khẩu của bạn</p>
          </div>
          
          <div style="padding: 20px; text-align: center;">
            <p style="font-size: 16px; text-align: left;">Xin chào <strong>${customerName}</strong>,</p>
            <p style="font-size: 15px; color: #555; text-align: left;">Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn nút bên dưới để tiếp tục.</p>
            
            <div style="margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #2E7D32; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">ĐẶT LẠI MẬT KHẨU</a>
            </div>
            
            <p style="font-size: 14px; color: #888; text-align: left;">Hoặc copy đường link này vào trình duyệt:</p>
            <p style="font-size: 14px; color: #2E7D32; word-break: break-all; text-align: left;">${resetUrl}</p>

            <p style="font-size: 14px; color: #D32F2F; text-align: left; margin-top: 20px;">Link có hiệu lực trong 15 phút. Nếu bạn không yêu cầu, hãy bỏ qua Email này.</p>
          </div>
          
          <div style="background-color: #f1f1f1; color: #777; padding: 15px; text-align: center; font-size: 12px;">
            &copy; ${new Date().getFullYear()} FoodShopAI. Tất cả các quyền được bảo lưu.
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email đặt lại mật khẩu cho ${customerEmail} đã được gửi.`);
    return true;
  } catch (error) {
    console.error(`Lỗi gửi email đặt lại mật khẩu cho ${customerEmail}:`, error.message);
    return false;
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendResetPasswordEmail
};
