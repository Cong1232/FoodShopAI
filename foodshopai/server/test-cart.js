const axios = require('axios');
const mongoose = require('mongoose');

async function runTests() {
  const BASE_URL = 'http://localhost:5000/api';
  let token = '';

  try {
    // 1. Đăng nhập đ�?lấy token
    console.log('--- 1. Login ---');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@foodshopai.com', // Gi�?s�?user này tồn tại
      password: '123' // Mật khẩu mặc định trong nhiều repo
    }).catch(async (err) => {
      // Nếu không có admin, tạo mới user
      console.log('Login failed, registering new user...');
      const regRes = await axios.post(`${BASE_URL}/auth/register`, {
        fullName: 'Test User',
        email: 'testcart123@example.com',
        password: 'password123',
        phone: '0123456789'
      });
      return axios.post(`${BASE_URL}/auth/login`, {
        email: 'testcart123@example.com',
        password: 'password123'
      });
    });

    token = loginRes.data.token || loginRes.data.data.token;
    console.log('Logged in successfully. Token:', token.substring(0, 20) + '...');

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Lấy danh sách sản phẩm đ�?test
    console.log('--- 2. Lấy danh sách sản phẩm ---');
    const prodRes = await axios.get(`${BASE_URL}/products`);
    const products = prodRes.data.data;
    if (!products || products.length === 0) {
      console.log('Không có sản phẩm nào trong DB!');
      return;
    }
    const p1 = products[0]._id;
    const p2 = products[1] ? products[1]._id : p1;

    // Clear gi�?hàng trước khi test
    await axios.delete(`${BASE_URL}/cart/clear`, { headers });

    // 3. Test: Thêm sản phẩm mới vào gi�?    console.log('--- 3. Thêm sản phẩm mới vào gi�?---');
    let res = await axios.post(`${BASE_URL}/cart/add`, { productId: p1, quantity: 1 }, { headers });
    console.log('Add P1 Status:', res.status, res.data.success);

    // 4. Test: Thêm cùng sản phẩm lần 2
    console.log('--- 4. Thêm cùng sản phẩm lần 2 ---');
    res = await axios.post(`${BASE_URL}/cart/add`, { productId: p1, quantity: 2 }, { headers });
    console.log('Add P1 (x2) Status:', res.status, res.data.success);

    // 5. Test: Thêm nhiều sản phẩm khác nhau (Concurrent đ�?check race condition)
    console.log('--- 5. Thêm nhiều sản phẩm (Concurrent) ---');
    await axios.delete(`${BASE_URL}/cart/clear`, { headers }); // Clear again
    
    // Thêm đồng thời 2 request giống nhau đ�?check Duplicate Key Error / Version Error
    const req1 = axios.post(`${BASE_URL}/cart/add`, { productId: p1, quantity: 1 }, { headers });
    const req2 = axios.post(`${BASE_URL}/cart/add`, { productId: p2, quantity: 1 }, { headers });
    
    try {
      const results = await Promise.all([req1, req2]);
      console.log('Concurrent add results:', results.map(r => r.status));
    } catch (err) {
      console.error('Concurrent Add Error:', err.response?.status, err.response?.data);
    }

    // Lấy gi�?hàng
    res = await axios.get(`${BASE_URL}/cart`, { headers });
    console.log('Cart state sau khi test:', JSON.stringify(res.data.data.items, null, 2));

  } catch (error) {
    console.error('Test script crashed:');
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

runTests();
