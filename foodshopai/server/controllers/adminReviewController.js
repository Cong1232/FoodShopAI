const Review = require('../models/Review');

// GET /api/admin/reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'fullName email')
      .populate('product', 'name images')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
    }
    res.status(200).json({ success: true, message: 'Xóa đánh giá thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
