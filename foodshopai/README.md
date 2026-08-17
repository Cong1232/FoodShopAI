# FoodShopAI - Frontend (Buổi 1)

Website bán thực phẩm trực tuyến tích hợp Chatbot AI - Đồ án tốt nghiệp.

## Công nghệ sử dụng
- ReactJS (Vite)
- React Router DOM
- Bootstrap 5
- Axios (chưa dùng ở Buổi 1)
- React Icons

## Cài đặt & chạy dự án

```bash
npm install
npm run dev
```

Sau đó mở trình duyệt tại: http://localhost:5173

## Nội dung đã hoàn thành (Buổi 1)
- [x] Chuẩn hóa cấu trúc thư mục
- [x] Cấu hình React Router (đầy đủ các route)
- [x] Layout tổng (Header + Outlet + Footer)
- [x] Header responsive (desktop + mobile)
- [x] Footer
- [x] Trang chủ (banner tĩnh)
- [x] Các trang còn lại: khung rỗng (placeholder)

## Cấu trúc thư mục

```
src/
├── assets/            # Ảnh, icon, style dùng chung
│   └── styles/
│       ├── variables.css   # Biến màu sắc, font, bo góc...
│       └── global.css      # Style toàn cục
├── components/
│   ├── common/        # Component dùng chung nhiều nơi (PagePlaceholder...)
│   ├── layout/         # Header, Footer
│   ├── product/        # (để dành cho các buổi sau)
│   ├── cart/            # (để dành cho các buổi sau)
│   └── chatbot/         # (để dành cho các buổi sau)
├── layouts/
│   └── MainLayout.jsx  # Layout tổng: Header + Outlet + Footer
├── pages/               # Mỗi trang 1 thư mục riêng
├── routes/
│   └── AppRoutes.jsx    # Khai báo toàn bộ route
├── services/            # (để dành gọi API - Buổi sau)
├── hooks/               # (để dành custom hook - Buổi sau)
├── context/             # (để dành Context API - Buổi sau)
├── utils/               # (để dành hàm tiện ích - Buổi sau)
├── App.jsx
└── main.jsx
```

## Ghi chú quan trọng
- Chưa gọi API, chưa có dữ liệu thật (tất cả là UI tĩnh).
- Chưa xây dựng Chatbot, chưa xây dựng Admin.
- Các thư mục `services/`, `hooks/`, `context/`, `utils/` được tạo sẵn
  để khi kết nối Backend Node.js + Express + MongoDB ở các buổi sau,
  ta chỉ cần thêm file vào đúng vị trí mà không phải đảo lại cấu trúc dự án.
