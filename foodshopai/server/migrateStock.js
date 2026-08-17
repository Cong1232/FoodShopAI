const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const migrateStock = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for migration.');

    // Cập nhật tất cả các product chưa có trường stock hoặc stock == null
    const result = await Product.updateMany(
      { stock: { $exists: false } },
      { $set: { stock: 0 } }
    );
    console.log(`Updated ${result.modifiedCount} products without stock field.`);
    
    const resultNull = await Product.updateMany(
      { stock: null },
      { $set: { stock: 0 } }
    );
    console.log(`Updated ${resultNull.modifiedCount} products with null stock.`);

    console.log('Migration completed.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateStock();
