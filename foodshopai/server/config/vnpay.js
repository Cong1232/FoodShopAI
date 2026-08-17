module.exports = {
  vnp_TmnCode: process.env.VNP_TMN_CODE || 'H927R4C0',
  vnp_HashSecret: process.env.VNP_HASH_SECRET || 'ZUSOKGEXVROXYFOKMVKUSYJNSIPXAJXY',
  vnp_Url: process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_Api: process.env.VNP_API || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
  vnp_ReturnUrl: process.env.VNP_RETURN_URL || 'http://localhost:5000/api/payment/return'
};
