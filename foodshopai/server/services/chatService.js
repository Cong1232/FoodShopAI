const Groq = require("groq-sdk");
const Product = require('../models/Product');
const Category = require('../models/Category');

// Khởi tạo SDK (API Key lấy từ .env)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `Bạn là FoodShop AI - trợ lý mua sắm thực phẩm trực tuyến thông minh.

Nhiệm vụ của bạn:
- Tư vấn nguyên liệu, lên thực đơn bữa ăn theo ngân sách, số lượng người, và yêu cầu cụ thể.
- Phân bổ ngân sách hợp lý để tính toán lượng thực phẩm cần mua.
- Chỉ gợi ý các sản phẩm có thật trong danh sách MongoDB được cung cấp. Không bao giờ tự bịa ra sản phẩm không có trong danh sách.
- Trả lời tự nhiên, lịch sự, rõ ràng.

LUÔN LUÔN TRẢ VỀ KẾT QUẢ DƯỚI DẠNG JSON THEO ĐÚNG ĐỊNH DẠNG SAU (không trả về markdown, chỉ JSON thuần):
{
  "reply": "Câu trả lời tự nhiên của bạn dành cho khách hàng",
  "products": [
    { "_id": "ID", "name": "Tên", "image": "Link ảnh", "price": Giá, "quantity": Số lượng, "stock": Tồn kho }
  ]
}
QUY TẮC BẮT BUỘC VỀ SỐ LƯỢNG (quantity):
- Trường 'quantity' PHẢI luôn là một số nguyên dương (1, 2, 3, 4...).
- Tuyệt đối KHÔNG được sử dụng số thập phân (như 0.5, 0.2, 1.5).
- Nếu người dùng cần mua ít, hãy tính theo đơn vị đóng gói của sản phẩm (tối thiểu là 1).

QUY TẮC KIỂM TRA TỒN KHO (stock):
- Nếu người dùng hỏi về việc còn hàng không (VD: "Còn tôm không?", "Hết thịt bò chưa?"):
  - Nếu stock = 0, hãy trả lời: "Sản phẩm [tên] hiện đã hết hàng."
  - Nếu stock > 0, hãy trả lời: "Cửa hàng hiện còn [stock] sản phẩm [tên]." và tự động thêm sản phẩm đó vào danh sách products gợi ý.

Nếu không có sản phẩm nào được gợi ý (hoặc câu hỏi không liên quan đến mua sắm), hãy để mảng products rỗng [].`;

// Mapping món ăn -> nguyên liệu cần thiết để search
const DISH_INGREDIENTS = {
  'lẩu': ['thịt', 'bò', 'rau', 'nấm', 'đậu hũ', 'mì', 'bún', 'gia vị', 'hải sản', 'tôm', 'mực', 'viên thả lẩu'],
  'nướng': ['thịt ba chỉ', 'bò', 'sườn', 'xúc xích', 'gia vị ướp', 'rau sống', 'xà lách', 'kim chi'],
  'canh': ['thịt băm', 'sườn', 'rau', 'cà chua', 'bí', 'đậu hũ'],
  'xào': ['thịt', 'bò', 'mực', 'rau muống', 'cải', 'mì', 'dầu ăn', 'tỏi'],
  'salad': ['xà lách', 'cà chua', 'dưa leo', 'sốt', 'thịt gà', 'trứng']
};

const MEAL_INGREDIENTS = {
  'sáng': ['bánh mì', 'trứng', 'sữa', 'ngũ cốc', 'xúc xích', 'bún', 'phở'],
  'trưa': ['gạo', 'thịt', 'cá', 'rau', 'trứng', 'đậu hũ'],
  'tối': ['gạo', 'thịt', 'cá', 'hải sản', 'rau', 'nấm', 'canh']
};

const DIET_INGREDIENTS = {
  'chay': ['đậu hũ', 'nấm', 'rau', 'củ', 'quả', 'mì chay', 'nước tương'],
  'giảm cân': ['ức gà', 'salad', 'rau', 'trứng', 'gạo lứt', 'cá hồi', 'trái cây', 'ít calo'],
  'eat clean': ['ức gà', 'salad', 'rau', 'trứng', 'gạo lứt', 'cá hồi', 'trái cây', 'ít calo']
};

const generateReply = async (message) => {
  try {
    const msgLower = message.toLowerCase();
    
    // 1. INTENT DETECTION
    let budget = null;
    let people = null;
    let searchKeywords = [];
    let isVagueRequest = false;

    // Detect Budget
    const budgetMatch = msgLower.match(/(?:dưới|khoảng|có|ngân sách)?\s*(\d{4,})(?:k|vnđ|đ)?/i) || msgLower.match(/(\d+)\s*k/i);
    if (budgetMatch) {
      budget = parseInt(budgetMatch[1]);
      if (msgLower.includes(`${budget}k`) || msgLower.includes(`${budget} k`)) budget *= 1000;
    }

    // Detect People
    const peopleMatch = msgLower.match(/(\d+)\s*người/i);
    if (peopleMatch) {
      people = parseInt(peopleMatch[1]);
    }

    // Detect Dish/Meal/Diet
    let hasSpecificRequirement = false;

    Object.keys(DISH_INGREDIENTS).forEach(dish => {
      if (msgLower.includes(dish)) {
        searchKeywords.push(...DISH_INGREDIENTS[dish]);
        hasSpecificRequirement = true;
      }
    });

    Object.keys(MEAL_INGREDIENTS).forEach(meal => {
      if (msgLower.includes(meal) || msgLower.includes(`bữa ${meal}`)) {
        searchKeywords.push(...MEAL_INGREDIENTS[meal]);
        hasSpecificRequirement = true;
      }
    });

    Object.keys(DIET_INGREDIENTS).forEach(diet => {
      if (msgLower.includes(diet)) {
        searchKeywords.push(...DIET_INGREDIENTS[diet]);
        hasSpecificRequirement = true;
      }
    });

    // Detect direct ingredients
    const directIngredients = ['thịt bò', 'gà', 'heo', 'cá', 'tôm', 'mực', 'rau', 'trái cây', 'đồ uống', 'bánh', 'sữa'];
    directIngredients.forEach(item => {
      if (msgLower.includes(item)) {
        searchKeywords.push(item);
        hasSpecificRequirement = true;
      }
    });

    if (!hasSpecificRequirement && (msgLower.includes('nấu ăn') || msgLower.includes('nấu món') || msgLower.includes('đi chợ'))) {
      isVagueRequest = true;
    }

    // 2. CHECK VAGUE REQUEST
    if (isVagueRequest && !budget && !people) {
      return {
        reply: "Bạn muốn nấu món gì?\n• Bữa sáng\n• Bữa trưa\n• Bữa tối\n• Lẩu\n• Nướng\n• Canh\n\nBạn cũng có thể cho tôi biết số người ăn hoặc ngân sách dự kiến để tôi lên thực đơn giúp bạn nhé!",
        products: []
      };
    }

    // 3. MONGODB QUERY
    let productContext = '';
    let foundProducts = [];
    if (hasSpecificRequirement || budget || people || msgLower.includes('mua')) {
      const query = { 
        isDeleted: { $ne: true },
        stock: { $gt: 0 }
      };

      if (budget) {
        query.price = { $lte: budget };
      }

      if (searchKeywords.length > 0) {
        searchKeywords = [...new Set(searchKeywords)];
        const regexStr = searchKeywords.join('|');
        query.$or = [
          { name: { $regex: regexStr, $options: 'i' } },
          { description: { $regex: regexStr, $options: 'i' } },
          { nutrition: { $regex: regexStr, $options: 'i' } }
        ];
      }

      foundProducts = await Product.find(query)
        .populate('category', 'name')
        .limit(15)
        .lean();

      if (foundProducts.length > 0) {
        productContext = foundProducts.map(p => 
          `- ID: ${p._id} | Tên: ${p.name} | Ảnh: ${p.images?.[0] || ''} | Giá: ${p.discountPrice || p.price}đ | Danh mục: ${p.category?.name || 'Khác'} | Đơn vị: ${p.unit || 'kg'} | Tồn kho: ${p.stock}`
        ).join('\n');
      }
    }

    // 4. GROQ PROMPT BUILDER
    let dynamicInstruction = SYSTEM_PROMPT;
    if (hasSpecificRequirement || budget || people) {
      dynamicInstruction += `\n\nNgười dùng đang yêu cầu lên thực đơn/đi chợ. \nNgân sách: ${budget ? budget + 'đ' : 'Không rõ'}\nSố người: ${people ? people + ' người' : 'Không rõ'}\n\nHãy phân tích và chọn các sản phẩm PHÙ HỢP NHẤT từ danh sách MongoDB dưới đây. Tự tính toán số lượng từng món sao cho tổng giá tiền phù hợp với ngân sách (nếu có).\n\n[DANH SÁCH SẢN PHẨM]\n${productContext}\n[KẾT THÚC DANH SÁCH]\n\nLưu ý quan trọng: Nếu danh sách sản phẩm trên trống rỗng HOẶC bạn thấy không đủ nguyên liệu để nấu món người dùng yêu cầu, hãy trả về reply: "Hiện cửa hàng chưa có đủ nguyên liệu phù hợp với yêu cầu của bạn." và products: []`;
    }

    // 5. CALL GROQ
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: dynamicInstruction,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const aiContent = completion.choices[0]?.message?.content || "{}";
    
    try {
      const parsed = JSON.parse(aiContent);
      return parsed; // { reply, products }
    } catch(err) {
      return { reply: aiContent, products: [] };
    }
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw new Error('Xin lỗi, AI hiện đang bận. Vui lòng thử lại sau.');
  }
};

module.exports = {
  generateReply
};
