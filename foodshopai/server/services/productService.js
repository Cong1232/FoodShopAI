const Product = require('../models/Product');

/**
 * Lấy danh sách tất cả sản phẩm có filter và pagination
 */
const getAllProducts = async (query) => {
  const { keyword, category, minPrice, maxPrice, sort, page, limit } = query;

  // Filter cơ bản: Bỏ qua sản phẩm đã xóa
  let filter = { isDeleted: { $ne: true } };

  if (keyword) {
    // Hàm tạo regex bỏ qua dấu tiếng Việt
    const createDiacriticRegex = (str) => {
      const diacriticsMap = {
        a: 'aàáạảãâầấậẩẫăằắặẳẵAÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ',
        e: 'eèéẹẻẽêềếệểễEÈÉẸẺẼÊỀẾỆỂỄ',
        i: 'iìíịỉĩIÌÍỊỈĨ',
        o: 'oòóọỏõôồốộổỗơờớợởỡOÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ',
        u: 'uùúụủũưừứựửữUÙÚỤỦŨƯỪỨỰỬỮ',
        y: 'yỳýỵỷỹYỲÝỴỶỸ',
        d: 'dđDĐ'
      };
      return str.split('').map(char => {
        const lowerChar = char.toLowerCase();
        for (const key in diacriticsMap) {
          if (diacriticsMap[key].includes(lowerChar)) {
            return `[${diacriticsMap[key]}]`;
          }
        }
        return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }).join('');
    };

    const words = keyword.split(' ').filter(w => w.trim() !== '');
    
    if (words.length > 0) {
      const andConditions = words.map(word => {
        const regexStr = createDiacriticRegex(word);
        return {
          $or: [
            { name: { $regex: regexStr, $options: 'i' } },
            { description: { $regex: regexStr, $options: 'i' } }
          ]
        };
      });
      filter.$and = andConditions;
    }
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Sort
  let sortOption = { createdAt: -1 }; // Mặc định mới nhất
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'name_asc') sortOption = { name: 1 };
  if (sort === 'name_desc') sortOption = { name: -1 };

  let productQuery = Product.find(filter)
    .populate('category', 'name slug status isDeleted')
    .sort(sortOption);

  // Pagination if requested
  if (page && limit) {
    const skip = (Number(page) - 1) * Number(limit);
    productQuery = productQuery.skip(skip).limit(Number(limit));
  }

  const products = await productQuery;

  const total = await Product.countDocuments(filter);

  return {
    products,
    total,
    page: page ? Number(page) : 1,
    totalPages: limit ? Math.ceil(total / Number(limit)) : 1
  };
};

/**
 * Lấy chi tiết 1 sản phẩm theo ID
 */
const getProductById = async (id) => {
  return await Product.findOne({ _id: id, isDeleted: { $ne: true } }).populate('category', 'name');
};

/**
 * Tạo sản phẩm mới
 */
const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

/**
 * Cập nhật sản phẩm theo ID
 */
const updateProduct = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, {
    new: true, // Trả về document sau khi update
    runValidators: true, // Chạy lại validation trong model
  });
};

/**
 * Xóa sản phẩm theo ID (Soft Delete)
 */
const deleteProduct = async (id) => {
  return await Product.findByIdAndUpdate(id, {
    isDeleted: true,
    deletedAt: new Date()
  }, { new: true });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
