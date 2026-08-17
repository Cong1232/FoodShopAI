const mongoose = require('mongoose');
const Product = require('./Product');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User là bắt buộc'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product là bắt buộc'],
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order là bắt buộc'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating là bắt buộc'],
      min: [1, 'Rating tối thiểu là 1'],
      max: [5, 'Rating tối đa là 5'],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, 'Nội dung review là bắt buộc'],
    },
  },
  {
    timestamps: true,
  }
);

// Một user chỉ được review 1 product 1 lần duy nhất (không phụ thuộc số lần mua)
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method tính toán rating trung bình cho Product
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    if (result.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(result[0].averageRating * 10) / 10,
        reviewCount: result[0].numOfReviews,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        reviewCount: 0,
      });
    }
  } catch (error) {
    console.error('Lỗi khi tính toán average rating:', error);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.product);
  }
});

reviewSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.product);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
