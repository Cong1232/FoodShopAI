const Review = require('../models/Review');

/**
 * Lấy danh sách tất cả review
 */
const getAllReviews = async () => {
  return await Review.find({})
    .populate('user', 'fullName avatar')
    .populate('product', 'name images');
};

/**
 * Lấy review theo ID
 */
const getReviewById = async (id) => {
  return await Review.findById(id)
    .populate('user', 'fullName avatar')
    .populate('product', 'name images');
};

/**
 * Lấy danh sách review của 1 sản phẩm
 */
const getReviewsByProductId = async (productId) => {
  return await Review.find({ product: productId })
    .populate('user', 'fullName avatar');
};

/**
 * Tạo review mới
 */
const createReview = async (reviewData) => {
  const review = new Review(reviewData);
  return await review.save(); // pre-save hook sẽ chạy và cập nhật avg rating
};

/**
 * Cập nhật review
 */
const updateReview = async (id, updateData) => {
  const review = await Review.findById(id);
  if (!review) return null;
  
  review.rating = updateData.rating || review.rating;
  review.comment = updateData.comment || review.comment;
  
  // Dùng .save() thay vì findByIdAndUpdate để trigger được pre/post save hook tính lại avg rating
  return await review.save(); 
};

/**
 * Xóa review
 */
const deleteReview = async (id) => {
  // Dùng findOneAndDelete để trigger post hook tính lại avg rating
  return await Review.findOneAndDelete({ _id: id });
};

module.exports = {
  getAllReviews,
  getReviewById,
  getReviewsByProductId,
  createReview,
  updateReview,
  deleteReview,
};
