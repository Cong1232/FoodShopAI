const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [] } });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Tìm sản phẩm để kiểm tra tồn kho và giá
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    if (product.stock < Number(quantity)) {
      return res.status(400).json({ success: false, message: `Sản phẩm ${product.name} chỉ còn ${product.stock} trong kho.` });
    }
    const price = product.discountPrice > 0 ? product.discountPrice : product.price;

    // 1. Thử tăng số lượng nếu sản phẩm đã có trong giỏ hàng (Atomic operation)
    // Nhưng trước tiên phải tìm xem sản phẩm đang có bao nhiêu trong giỏ để kiểm tra tổng quantity <= stock
    const existingCart = await Cart.findOne({ user: req.user._id, 'items.product': productId });
    if (existingCart) {
      const item = existingCart.items.find(i => i.product.toString() === productId);
      if (item.quantity + Number(quantity) > product.stock) {
        return res.status(400).json({ success: false, message: `Bạn chỉ có thể mua tối đa ${product.stock} sản phẩm này.` });
      }
    }

    let cart = await Cart.findOneAndUpdate(
      { user: req.user._id, 'items.product': productId },
      { 
        $inc: { 'items.$.quantity': Number(quantity) },
        $set: { 'items.$.price': price }
      },
      { new: true }
    );

    // 2. Nếu sản phẩm chưa có trong giỏ, dùng $push (có upsert để tự tạo giỏ nếu chưa có)
    if (!cart) {
      cart = await Cart.findOneAndUpdate(
        { user: req.user._id, 'items.product': { $ne: productId } },
        { 
          $push: { items: { product: productId, quantity: Number(quantity), price } }
        },
        { new: true, upsert: true }
      );
    }
    
    // Populate để lấy thông tin sản phẩm trả về frontend
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(200).json({ success: true, message: 'Đã thêm vào giỏ hàng', data: populatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/cart/update
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (Number(quantity) <= 0) {
      // Dùng $pull để xóa item thay vì save()
      const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { items: { product: productId } } },
        { new: true }
      ).populate('items.product');

      if (!cart) {
        return res.status(404).json({ success: false, message: 'Giỏ hàng không tồn tại' });
      }
      return res.status(200).json({ success: true, message: 'Cập nhật giỏ hàng thành công', data: cart });
    } else {
      // Kiểm tra stock trước khi cập nhật
      const Product = require('../models/Product');
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
      }
      if (product.stock < Number(quantity)) {
        return res.status(400).json({ success: false, message: `Bạn chỉ có thể mua tối đa ${product.stock} sản phẩm này.` });
      }

      // Dùng $set để cập nhật số lượng
      const cart = await Cart.findOneAndUpdate(
        { user: req.user._id, 'items.product': productId },
        { $set: { 'items.$.quantity': Number(quantity) } },
        { new: true }
      ).populate('items.product');

      if (!cart) {
        return res.status(404).json({ success: false, message: 'Sản phẩm không có trong giỏ hàng' });
      }
      return res.status(200).json({ success: true, message: 'Cập nhật giỏ hàng thành công', data: cart });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/cart/remove/:productId
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Dùng $pull để xóa phần tử một cách atomic, tránh VersionError
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { product: productId } } },
      { new: true }
    ).populate('items.product');

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Giỏ hàng không tồn tại' });
    }

    res.status(200).json({ success: true, message: 'Đã xóa sản phẩm', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ success: true, message: 'Đã làm sạch giỏ hàng', data: { items: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
