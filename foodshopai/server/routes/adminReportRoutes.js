const express = require('express');
const router = express.Router();
const adminReportController = require('../controllers/adminReportController');

router.get('/', adminReportController.getReports);
router.get('/export/excel', adminReportController.exportExcel);
router.get('/export/pdf', adminReportController.exportPdf);

module.exports = router;
