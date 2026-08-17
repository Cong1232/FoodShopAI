/**
 * categoryData.js
 * Mock data cho section "Danh mục nổi bật" ở Trang chủ.
 * Sau này khi có Backend, dữ liệu này sẽ được thay bằng API GET /api/categories.
 */

const categoryData = [
  {
    id: 1,
    name: 'Thịt tươi sống',
    icon: '🥩',
    productCount: 42,
  },
  {
    id: 2,
    name: 'Rau củ quả',
    icon: '🥬',
    productCount: 68,
  },
  {
    id: 3,
    name: 'Trái cây',
    icon: '🍎',
    productCount: 35,
  },
  {
    id: 4,
    name: 'Sữa & Trứng',
    icon: '🥛',
    productCount: 27,
  },
  {
    id: 5,
    name: 'Đồ uống',
    icon: '🥤',
    productCount: 31,
  },
  {
    id: 6,
    name: 'Thực phẩm chế biến',
    icon: '🍜',
    productCount: 54,
  },
]

export default categoryData
