const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User là bắt buộc'],
    },
    question: {
      type: String,
      required: [true, 'Câu hỏi là bắt buộc'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Câu trả lời là bắt buộc'],
      trim: true,
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  }
);

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
