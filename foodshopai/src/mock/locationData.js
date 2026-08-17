/**
 * locationData.js
 * Mock data địa giới hành chính (Tỉnh/Thành -> Quận/Huyện -> Phường/Xã),
 * dùng cho 3 dropdown liên kết ở form Checkout.
 * Rút gọn quy mô cho phù hợp đồ án (không cần đầy đủ 63 tỉnh thành).
 */

const locationData = [
  {
    province: 'TP. Hồ Chí Minh',
    districts: [
      { district: 'Quận 1', wards: ['Bến Nghé', 'Bến Thành', 'Cầu Kho'] },
      { district: 'Quận 3', wards: ['Võ Thị Sáu', 'Phường 6', 'Phường 9'] },
      { district: 'TP. Thủ Đức', wards: ['Linh Trung', 'Bình Thọ', 'Hiệp Phú'] },
    ],
  },
  {
    province: 'Hà Nội',
    districts: [
      { district: 'Ba Đình', wards: ['Điện Biên', 'Ngọc Hà', 'Đội Cấn'] },
      { district: 'Cầu Giấy', wards: ['Dịch Vọng', 'Mai Dịch', 'Nghĩa Đô'] },
    ],
  },
  {
    province: 'Đà Nẵng',
    districts: [
      { district: 'Hải Châu', wards: ['Thạch Thang', 'Hải Châu 1', 'Nam Dương'] },
      { district: 'Thanh Khê', wards: ['Tam Thuận', 'Xuân Hà', 'Tân Chính'] },
    ],
  },
  { province: 'Tây Ninh', districts: [{ district: 'Hòa Thành', wards: ['Long Hoa'] }, { district: 'Trảng Bàng', wards: ['An Hòa'] }] },
  { province: 'Thái Bình', districts: [] },
  { province: 'Thái Nguyên', districts: [] },
  { province: 'Thanh Hóa', districts: [] },
]

export default locationData
