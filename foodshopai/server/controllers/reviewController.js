const Review = require('../models/Review');
const Order = require('../models/Order');

// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { product, order, rating, comment } = req.body;
    
    // Kiểm tra đơn hàng có tồn tại và thuộc về user không
    const orderDoc = await Order.findOne({ _id: order, user: req.user._id });
    if (!orderDoc) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    // Kiểm tra trạng thái đơn hàng (Cho phép cả Completed và paid để tiện demo)
    if (orderDoc.orderStatus !== 'Completed' && orderDoc.orderStatus !== 'paid') {
      return res.status(400).json({ success: false, message: 'Chỉ có thể đánh giá khi đơn hàng đã hoàn thành hoặc đã thanh toán' });
    }

    // Kiểm tra sản phẩm có trong đơn hàng không
    const hasProduct = orderDoc.orderItems.some(item => item.product.toString() === product);
    if (!hasProduct) {
      return res.status(400).json({ success: false, message: 'Sản phẩm không thuộc đơn hàng này' });
    }

    // Kiểm tra xem đã đánh giá chưa (chỉ 1 lần cho mỗi sản phẩm)
    let review = await Review.findOne({ user: req.user._id, product });
    
    if (review) {
      // Nếu đã đánh giá -> Cập nhật
      review.rating = rating;
      review.comment = comment;
      await review.save();
      return res.status(200).json({ success: true, message: 'Đã cập nhật đánh giá', data: review });
    } else {
      // Nếu chưa -> Tạo mới
      review = new Review({
        user: req.user._id,
        product,
        order,
        rating,
        comment
      });
      await review.save();
      return res.status(201).json({ success: true, message: 'Đánh giá sản phẩm thành công', data: review });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
    }
    
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Không có quyền cập nhật đánh giá này' });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();

    res.status(200).json({ success: true, message: 'Cập nhật đánh giá thành công', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Không có quyền xóa đánh giá này' });
    }

    await Review.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ success: true, message: 'Đã xóa đánh giá thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reviews/product/:productId
const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'fullName avatar')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reviews/my
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name images')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByProduct,
  getMyReviews
};
