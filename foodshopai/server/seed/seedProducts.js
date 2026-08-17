require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding Products');

    // Xóa toàn bộ Products cũ
    await Product.deleteMany({});
    console.log('Old Products deleted');

    // Lấy các Category
    const traiCay = await Category.findOne({ name: 'Trái cây' });
    const rauCu = await Category.findOne({ name: 'Rau củ' });
    const thit = await Category.findOne({ name: 'Thịt' });
    const haiSan = await Category.findOne({ name: 'Hải sản' });
    const doUong = await Category.findOne({ name: 'Đồ uống' });
    const thucPhamKho = await Category.findOne({ name: 'Thực phẩm khô' });

    if (!traiCay || !rauCu || !thit || !haiSan || !doUong || !thucPhamKho) {
      console.log('Vui lòng chạy npm run seed:categories trước khi seed products!');
      process.exit(1);
    }

    const products = [
      // Trái cây
      { name: 'Táo Mỹ', slug: 'tao-my', category: traiCay._id, price: 90000, discountPrice: 85000, description: 'Táo Mỹ giòn ngọt, nhập khẩu 100%.', images: ['/images/products/tao-my.jpg'], stock: 50, rating: 4.8, sold: 120, origin: 'Mỹ', nutrition: 'Vitamin C, Chất xơ', unit: 'kg', isSale: true, isHot: true, isNewProduct: false },
      { name: 'Cam Úc', slug: 'cam-uc', category: traiCay._id, price: 120000, discountPrice: 110000, description: 'Cam vàng chuẩn Úc, nhiều nước.', images: ['/images/products/cam-uc.jpg'], stock: 40, rating: 4.7, sold: 95, origin: 'Úc', nutrition: 'Vitamin C cao', unit: 'kg', isSale: true, isHot: false, isNewProduct: true },
      { name: 'Chuối', slug: 'chuoi', category: traiCay._id, price: 30000, discountPrice: 0, description: 'Chuối già hương tươi ngon bổ dưỡng.', images: ['/images/products/chuoi.jpg'], stock: 100, rating: 4.5, sold: 210, origin: 'Việt Nam', nutrition: 'Kali, Vitamin B6', unit: 'nải', isSale: false, isHot: true, isNewProduct: false },
      { name: 'Nho Mỹ', slug: 'nho-my', category: traiCay._id, price: 200000, discountPrice: 180000, description: 'Nho không hạt ngọt lịm.', images: ['/images/products/nho.jpg'], stock: 30, rating: 4.9, sold: 60, origin: 'Mỹ', nutrition: 'Chất chống oxi hóa', unit: 'kg', isSale: true, isHot: true, isNewProduct: true },
      { name: 'Dưa hấu', slug: 'dua-hau', category: traiCay._id, price: 15000, discountPrice: 0, description: 'Dưa hấu đỏ không hạt ngọt mát.', images: ['/images/products/dua-hau.jpg'], stock: 80, rating: 4.6, sold: 150, origin: 'Việt Nam', nutrition: 'Nước, Vitamin A', unit: 'kg', isSale: false, isHot: false, isNewProduct: false },
      
      // Rau củ
      { name: 'Khoai tây', slug: 'khoai-tay', category: rauCu._id, price: 25000, discountPrice: 0, description: 'Khoai tây Đà Lạt bùi bở.', images: ['/images/products/khoai-tay.jpg'], stock: 150, rating: 4.5, sold: 300, origin: 'Đà Lạt', nutrition: 'Tinh bột', unit: 'kg', isSale: false, isHot: false, isNewProduct: false },
      { name: 'Cà rốt', slug: 'ca-rot', category: rauCu._id, price: 20000, discountPrice: 18000, description: 'Cà rốt tươi sạch an toàn.', images: ['/images/products/ca-rot.jpg'], stock: 120, rating: 4.4, sold: 250, origin: 'Đà Lạt', nutrition: 'Vitamin A, Beta-carotene', unit: 'kg', isSale: true, isHot: false, isNewProduct: false },
      { name: 'Bông cải xanh', slug: 'bong-cai-xanh', category: rauCu._id, price: 45000, discountPrice: 40000, description: 'Bông cải xanh giòn ngon.', images: ['/images/products/bong-cai.jpg'], stock: 60, rating: 4.8, sold: 180, origin: 'Đà Lạt', nutrition: 'Vitamin C, Sắt', unit: 'kg', isSale: true, isHot: true, isNewProduct: true },
      { name: 'Cải thìa', slug: 'cai-thia', category: rauCu._id, price: 18000, discountPrice: 0, description: 'Rau cải xanh mướt an toàn.', images: ['/images/products/cai-thia.jpg'], stock: 80, rating: 4.3, sold: 110, origin: 'Việt Nam', nutrition: 'Chất xơ', unit: 'kg', isSale: false, isHot: false, isNewProduct: false },
      { name: 'Cà chua', slug: 'ca-chua', category: rauCu._id, price: 30000, discountPrice: 25000, description: 'Cà chua mọng nước tươi đỏ.', images: ['/images/products/ca-chua.jpg'], stock: 90, rating: 4.6, sold: 200, origin: 'Đà Lạt', nutrition: 'Lycopene', unit: 'kg', isSale: true, isHot: true, isNewProduct: false },

      // Thịt
      { name: 'Thịt bò Úc', slug: 'thit-bo-uc', category: thit._id, price: 350000, discountPrice: 330000, description: 'Bò Úc nhập khẩu 100% cực mềm.', images: ['/images/products/thit-bo.jpg'], stock: 40, rating: 4.9, sold: 80, origin: 'Úc', nutrition: 'Protein, Sắt', unit: 'kg', isSale: true, isHot: true, isNewProduct: true },
      { name: 'Thịt gà', slug: 'thit-ga', category: thit._id, price: 110000, discountPrice: 0, description: 'Thịt gà ta thả vườn chắc thịt.', images: ['/images/products/thit-ga.jpg'], stock: 50, rating: 4.5, sold: 120, origin: 'Việt Nam', nutrition: 'Protein', unit: 'kg', isSale: false, isHot: false, isNewProduct: false },
      { name: 'Ba rọi heo', slug: 'ba-roi-heo', category: thit._id, price: 160000, discountPrice: 150000, description: 'Thịt heo sạch nạc mỡ đan xen.', images: ['/images/products/ba-roi.jpg'], stock: 70, rating: 4.6, sold: 180, origin: 'Việt Nam', nutrition: 'Protein, Lipid', unit: 'kg', isSale: true, isHot: true, isNewProduct: false },
      { name: 'Sườn non', slug: 'suon-non', category: thit._id, price: 180000, discountPrice: 0, description: 'Sườn non nhiều thịt sụn mềm.', images: ['/images/products/suon-non.jpg'], stock: 35, rating: 4.7, sold: 90, origin: 'Việt Nam', nutrition: 'Canxi, Protein', unit: 'kg', isSale: false, isHot: true, isNewProduct: true },
      { name: 'Thịt thăn', slug: 'thit-than', category: thit._id, price: 140000, discountPrice: 0, description: 'Thịt thăn nạc 100% mềm ngon.', images: ['/images/products/thit-than.jpg'], stock: 50, rating: 4.4, sold: 60, origin: 'Việt Nam', nutrition: 'Protein', unit: 'kg', isSale: false, isHot: false, isNewProduct: false },

      // Hải sản
      { name: 'Cá hồi', slug: 'ca-hoi', category: haiSan._id, price: 450000, discountPrice: 420000, description: 'Cá hồi tươi NaUy sashimi chuẩn.', images: ['/images/products/ca-hoi.jpg'], stock: 20, rating: 5.0, sold: 40, origin: 'Na Uy', nutrition: 'Omega-3', unit: 'kg', isSale: true, isHot: true, isNewProduct: true },
      { name: 'Tôm sú', slug: 'tom-su', category: haiSan._id, price: 280000, discountPrice: 0, description: 'Tôm sú to tươi sống bắt tại hồ.', images: ['/images/products/tom-su.jpg'], stock: 30, rating: 4.8, sold: 100, origin: 'Cà Mau', nutrition: 'Protein, Canxi', unit: 'kg', isSale: false, isHot: true, isNewProduct: false },
      { name: 'Mực ống', slug: 'muc-ong', category: haiSan._id, price: 250000, discountPrice: 230000, description: 'Mực ống câu tươi ngon nháy mi nơ.', images: ['/images/products/muc-ong.jpg'], stock: 25, rating: 4.7, sold: 70, origin: 'Nha Trang', nutrition: 'Protein, Kẽm', unit: 'kg', isSale: true, isHot: false, isNewProduct: true },
      { name: 'Cua biển', slug: 'cua-bien', category: haiSan._id, price: 650000, discountPrice: 0, description: 'Cua gạch Cà Mau chắc gạch.', images: ['/images/products/cua-bien.jpg'], stock: 15, rating: 4.9, sold: 25, origin: 'Cà Mau', nutrition: 'Protein cao, Canxi', unit: 'kg', isSale: false, isHot: true, isNewProduct: false },
      { name: 'Bạch tuộc', slug: 'bach-tuoc', category: haiSan._id, price: 210000, discountPrice: 200000, description: 'Bạch tuộc nướng đá giòn sần sật.', images: ['/images/products/bach-tuoc.jpg'], stock: 40, rating: 4.5, sold: 80, origin: 'Phan Thiết', nutrition: 'Protein', unit: 'kg', isSale: true, isHot: false, isNewProduct: false },

      // Đồ uống
      { name: 'Nước cam ép', slug: 'nuoc-cam-ep', category: doUong._id, price: 40000, discountPrice: 0, description: 'Nước cam ép tươi nguyên chất.', images: ['/images/products/nuoc-cam.jpg'], stock: 50, rating: 4.6, sold: 140, origin: 'Việt Nam', nutrition: 'Vitamin C', unit: 'chai', isSale: false, isHot: true, isNewProduct: false },
      { name: 'Sữa tươi TH', slug: 'sua-tuoi-th', category: doUong._id, price: 35000, discountPrice: 32000, description: 'Sữa tươi 100% nguyên chất.', images: ['/images/products/sua-tuoi.jpg'], stock: 200, rating: 4.8, sold: 500, origin: 'Việt Nam', nutrition: 'Canxi, Vitamin D', unit: 'lốc', isSale: true, isHot: true, isNewProduct: false },
      { name: 'Trà đào', slug: 'tra-dao', category: doUong._id, price: 30000, discountPrice: 0, description: 'Trà đào thanh mát giải nhiệt mùa hè.', images: ['/images/products/tra-dao.jpg'], stock: 60, rating: 4.4, sold: 90, origin: 'Việt Nam', nutrition: 'Đường, Vitamin C', unit: 'ly', isSale: false, isHot: false, isNewProduct: true },
      { name: 'Coca Cola', slug: 'coca-cola', category: doUong._id, price: 10000, discountPrice: 0, description: 'Nước giải khát có ga sảng khoái.', images: ['/images/products/coca.jpg'], stock: 500, rating: 4.5, sold: 1200, origin: 'Mỹ', nutrition: 'Carbohydrate', unit: 'lon', isSale: false, isHot: false, isNewProduct: false },
      { name: 'Nước suối Aquafina', slug: 'nuoc-suoi', category: doUong._id, price: 5000, discountPrice: 0, description: 'Nước tinh khiết bảo vệ sức khỏe.', images: ['/images/products/nuoc-suoi.jpg'], stock: 1000, rating: 4.9, sold: 3000, origin: 'Việt Nam', nutrition: 'Khoáng chất', unit: 'chai', isSale: false, isHot: true, isNewProduct: false },

      // Thực phẩm khô
      { name: 'Gạo ST25', slug: 'gao-st25', category: thucPhamKho._id, price: 180000, discountPrice: 170000, description: 'Gạo ngon nhất thế giới ST25 dẻo thơm.', images: ['/images/products/gao-st25.jpg'], stock: 80, rating: 5.0, sold: 300, origin: 'Sóc Trăng', nutrition: 'Tinh bột', unit: 'bao 5kg', isSale: true, isHot: true, isNewProduct: false },
      { name: 'Mì tôm Hảo Hảo', slug: 'mi-hao-hao', category: thucPhamKho._id, price: 110000, discountPrice: 100000, description: 'Mì tôm chua cay quốc dân.', images: ['/images/products/mi-tom.jpg'], stock: 100, rating: 4.8, sold: 800, origin: 'Việt Nam', nutrition: 'Carbohydrate', unit: 'thùng', isSale: true, isHot: true, isNewProduct: false },
      { name: 'Miến dong', slug: 'mien-dong', category: thucPhamKho._id, price: 50000, discountPrice: 0, description: 'Miến dong mộc sợi trong dai.', images: ['/images/products/mien-dong.jpg'], stock: 40, rating: 4.5, sold: 60, origin: 'Việt Nam', nutrition: 'Carbohydrate ít calo', unit: 'kg', isSale: false, isHot: false, isNewProduct: true },
      { name: 'Bún khô', slug: 'bun-kho', category: thucPhamKho._id, price: 30000, discountPrice: 0, description: 'Bún khô tiện dụng dễ bảo quản.', images: ['/images/products/bun-kho.jpg'], stock: 50, rating: 4.4, sold: 45, origin: 'Việt Nam', nutrition: 'Tinh bột', unit: 'kg', isSale: false, isHot: false, isNewProduct: false },
      { name: 'Hạt điều rang muối', slug: 'hat-dieu', category: thucPhamKho._id, price: 220000, discountPrice: 200000, description: 'Hạt điều rang củi Bình Phước giòn rụm.', images: ['/images/products/hat-dieu.jpg'], stock: 30, rating: 4.9, sold: 110, origin: 'Bình Phước', nutrition: 'Chất béo tốt, Protein', unit: 'hộp 500g', isSale: true, isHot: true, isNewProduct: true }
    ];

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} Products Successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
