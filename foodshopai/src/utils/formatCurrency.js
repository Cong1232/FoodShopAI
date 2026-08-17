/**
 * formatCurrency.js
 * Hàm tiện ích dùng chung để định dạng giá tiền theo chuẩn VNĐ.
 * Tách riêng ra utils để mọi component (ProductCard, Cart, Checkout...)
 * đều dùng chung 1 cách format duy nhất, tránh lặp code.
 */
export function formatCurrency(value) {
  if (typeof value !== 'number') return ''
  return value.toLocaleString('vi-VN') + '₫'
}
