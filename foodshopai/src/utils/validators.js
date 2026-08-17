/**
 * validators.js
 * Tập hợp các hàm kiểm tra dữ liệu (validation) dùng chung cho các form:
 * Login, Register, ForgotPassword, Profile, Checkout...
 * Tách riêng để tránh lặp lại cùng regex/logic ở nhiều component.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email.trim())
}

export function isValidPhone(phone) {
  return PHONE_REGEX.test(phone.trim())
}

export function isValidPassword(password) {
  // Yêu cầu tối thiểu 6 ký tự - đủ đơn giản cho phạm vi đồ án
  return password.length >= 6
}
