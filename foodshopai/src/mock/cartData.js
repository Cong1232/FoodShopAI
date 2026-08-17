/**
 * cartData.js
 * Mock data giỏ hàng ban đầu - dùng để CartContext có sẵn dữ liệu minh hoạ
 * khi mới load ứng dụng, giúp demo trang Cart/Checkout dễ dàng hơn.
 *
 * Mỗi cart item tham chiếu lại thông tin từ mock/products.js (dùng productId)
 * để đảm bảo dữ liệu đồng nhất (ảnh, giá...) với trang Products/ProductDetail.
 *
 * Buổi 4: chưa có Backend, giỏ hàng chỉ tồn tại trong bộ nhớ (state) của trình duyệt.
 */
import products from './products.js'

// Lấy nhanh 1 sản phẩm theo id từ mock/products.js để dựng cart item mẫu
const findProduct = (id) => products.find((product) => product.id === id)

const cartData = [
  {
    cartItemId: 'cart-1',
    productId: 1, // Thịt ba chỉ heo tươi
    quantity: 2,
  },
  {
    cartItemId: 'cart-2',
    productId: 17, // Táo Envy nhập khẩu
    quantity: 1,
  },
  {
    cartItemId: 'cart-3',
    productId: 23, // Sữa tươi tiệt trùng
    quantity: 3,
  },
]
  // Ghép thêm thông tin chi tiết sản phẩm (tên, ảnh, giá, tồn kho...) vào từng cart item
  .map((item) => {
    const product = findProduct(item.productId)
    return {
      ...item,
      name: product?.name ?? 'Sản phẩm không xác định',
      image: product?.images?.[0] ?? 'https://placehold.co/300x300?text=No+Image',
      price: product?.price ?? 0,
      discountPrice: product?.discountPrice ?? null,
      stock: product?.stock ?? 0,
    }
  })

export default cartData
