const express = require('express');
const router = express.Router();
const { 
  createPaymentUrl, 
  paymentReturn, 
  createMockMomo, 
  mockMomoSuccess, 
  mockMomoCancel 
} = require('../controllers/paymentController');

// VNPay
router.post('/create', createPaymentUrl);
router.get('/return', paymentReturn);

// Momo Mock
router.post('/mock/create', createMockMomo);
router.post('/mock/success', mockMomoSuccess);
router.post('/mock/cancel', mockMomoCancel);

module.exports = router;
