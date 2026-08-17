const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const deletedCategories = await Category.find({ isDeleted: true });
    let count = 0;
    
    for (const cat of deletedCategories) {
      if (!cat.name.includes('_deleted_') && !cat.slug.includes('-deleted-')) {
        const timestamp = Date.now() + count;
        cat.name = `${cat.name}_deleted_${timestamp}`;
        cat.slug = `${cat.slug}-deleted-${timestamp}`;
        await cat.save();
        count++;
        console.log(`Renamed deleted category: ${cat._id}`);
      }
    }
    
    console.log(`Fixed ${count} previously deleted categories.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
