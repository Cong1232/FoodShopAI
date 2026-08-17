const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for setup');

    // 1. Create a dummy admin user directly in DB
    const adminEmail = 'testadmin' + Date.now() + '@example.com';
    const adminUser = new User({
      fullName: 'Test Admin',
      email: adminEmail,
      password: 'password123', 
      role: 'admin',
      status: 'active'
    });
    await adminUser.save();
    console.log('Created dummy admin');

    // 2. Login via HTTP
    const BASE_URL = 'http://localhost:5000/api';
    
    const loginRes = await globalThis.fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login status:', loginRes.status);
    
    // 3. Test CREATE
    console.log('\n--- CREATE ---');
    const formData = new FormData();
    formData.append('name', 'API TEST');
    formData.append('slug', 'api-test');
    formData.append('status', 'active');
    
    const createRes = await globalThis.fetch(`${BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData // Using FormData for multipart/form-data
    });
    const createData = await createRes.json();
    console.log('Create Status:', createRes.status, createData);
    
    let catId = createData.data?._id;

    if (catId) {
      // 4. Test UPDATE
      console.log('\n--- UPDATE ---');
      const formDataUpdate = new FormData();
      formDataUpdate.append('name', 'API TEST UPDATED');
      formDataUpdate.append('slug', 'api-test-updated');
      
      const updateRes = await globalThis.fetch(`${BASE_URL}/admin/categories/${catId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpdate
      });
      const updateData = await updateRes.json();
      console.log('Update Status:', updateRes.status, updateData);

      // 5. Test DELETE
      console.log('\n--- DELETE ---');
      const deleteRes = await globalThis.fetch(`${BASE_URL}/admin/categories/${catId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const deleteData = await deleteRes.json();
      console.log('Delete Status:', deleteRes.status, deleteData);
    }
    
    // Cleanup
    await User.findByIdAndDelete(adminUser._id);
    if (catId) {
      await Category.findByIdAndDelete(catId);
    }
    
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

run();
