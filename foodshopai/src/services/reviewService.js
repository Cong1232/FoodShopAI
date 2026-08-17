import axiosClient from './axiosClient';

const reviewService = {
  getReviewsByProductId: (productId) => {
    return axiosClient.get(`/reviews/product/${productId}`);
  },
  getMyReviews: () => {
    return axiosClient.get('/reviews/my');
  },
  createReview: (reviewData) => {
    return axiosClient.post('/reviews', reviewData);
  },
  updateReview: (id, reviewData) => {
    return axiosClient.put(`/reviews/${id}`, reviewData);
  },
  deleteReview: (id) => {
    return axiosClient.delete(`/reviews/${id}`);
  }
};

export default reviewService;
