const express = require('express');
const router = express.Router();
const adminReviewController = require('../controllers/adminReviewController');

router.route('/')
  .get(adminReviewController.getAllReviews);

router.route('/:id')
  .delete(adminReviewController.deleteReview);

module.exports = router;
