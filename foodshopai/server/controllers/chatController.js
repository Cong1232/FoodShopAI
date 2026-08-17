const chatService = require('../services/chatService');
const { validationResult } = require('express-validator');

const createChat = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { message } = req.body;
    
    // Gọi service xử lý logic AI
    const aiResult = await chatService.generateReply(message);
    const reply = typeof aiResult === 'string' ? aiResult : aiResult.reply;
    const products = typeof aiResult === 'object' && aiResult.products ? aiResult.products : [];

    res.status(200).json({
      success: true,
      data: {
        reply,
        products
      }
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: {
        reply: "Xin lỗi, AI hiện đang bận. Vui lòng thử lại sau.",
        products: []
      }
    });
  }
};

module.exports = {
  createChat
};
