# FoodShopAI Backend

Backend API cho dự án FoodShopAI xây dựng với Node.js, Express.js và MongoDB.

## Cài đặt

1. Clone project và chạy `npm install` để cài đặt thư viện.
2. Tạo file `.env` từ `.env.example` và cấu hình thông số của bạn (MONGO_URI, JWT_SECRET...).
3. Chạy lệnh seed data: `npm run seed`
4. Khởi động server:
   - Dev mode: `npm run dev`
   - Prod mode: `npm start`

## Công nghệ sử dụng
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) cho authentication
- Bcryptjs cho password hashing
- Express Validator cho data validation
