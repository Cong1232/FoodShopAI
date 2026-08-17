const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const cat = new Category({
      name: 'TEST CATEGORY',
      slug: 'test-category',
      status: 'active'
    });
    
    await cat.save();
    console.log('Created successfully');
    await Category.findByIdAndDelete(cat._id);
    console.log('Cleaned up');
    process.exit(0);
  } catch (error) {
    console.error('Error during save:', error);
    process.exit(1);
  }
}

run();
