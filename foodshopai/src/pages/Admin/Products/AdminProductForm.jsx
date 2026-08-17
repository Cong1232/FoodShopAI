import { useState, useEffect } from 'react';
import { FiX, FiUploadCloud, FiTrash2 } from 'react-icons/fi';
import productService from '../../../services/productService';
import { showToast } from '../../../utils/toast';
import './AdminProductForm.css';

function AdminProductForm({ product, categories, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    price: '',
    discountPrice: '0',
    stock: '',
    description: '',
    origin: '',
    nutrition: '',
    unit: 'kg',
    isHot: false,
    isSale: false,
    isNewProduct: true
  });
  
  const [existingImages, setExistingImages] = useState([]); // URLs
  const [newImages, setNewImages] = useState([]); // File objects
  const [previewImages, setPreviewImages] = useState([]); // Blob URLs
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        category: product.category?._id || product.category || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '0',
        stock: product.stock || '',
        description: product.description || '',
        origin: product.origin || '',
        nutrition: product.nutrition || '',
        unit: product.unit || 'kg',
        isHot: product.isHot || false,
        isSale: product.isSale || false,
        isNewProduct: product.isNewProduct || false
      });
      setExistingImages(product.images || []);
    }
  }, [product]);

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, name, slug });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
    
    // Create previews
    const filePreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...filePreviews]);
  };

  const removeExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const removeNewImage = (index) => {
    const updatedFiles = [...newImages];
    updatedFiles.splice(index, 1);
    setNewImages(updatedFiles);
    
    const updatedPreviews = [...previewImages];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.stock || !formData.description) {
      showToast('Vui lòng điền các trường bắt buộc', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      existingImages.forEach(img => {
        data.append('existingImages', img);
      });

      newImages.forEach(file => {
        data.append('images', file);
      });

      let res;
      if (product) {
        res = await productService.updateProduct(product._id, data);
      } else {
        res = await productService.createProduct(data);
      }

      if (res.success) {
        showToast(product ? 'Cập nhật thành công' : 'Thêm mới thành công', 'success');
        onSuccess();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content admin-product-form">
        <div className="admin-modal-header">
          <h3>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <button className="btn-close-modal" onClick={onClose}><FiX size={24} /></button>
        </div>
        
        <div className="admin-modal-body">
          <form id="productForm" onSubmit={handleSubmit}>
            <div className="row">
              {/* Cột trái */}
              <div className="col-12 col-lg-8">
                <div className="form-card">
                  <h5 className="mb-3">Thông tin cơ bản</h5>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Tên sản phẩm <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleNameChange} required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Slug <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" name="slug" value={formData.slug} onChange={handleChange} required />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">Giá <span className="text-danger">*</span></label>
                      <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required min="0" />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">Giá khuyến mãi</label>
                      <input type="number" className="form-control" name="discountPrice" value={formData.discountPrice} onChange={handleChange} min="0" />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">Tồn kho <span className="text-danger">*</span></label>
                      <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Mô tả chi tiết <span className="text-danger">*</span></label>
                      <textarea className="form-control" name="description" rows="5" value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                  </div>
                </div>

                <div className="form-card mt-3">
                  <h5 className="mb-3">Thông số khác</h5>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Xuất xứ</label>
                      <input type="text" className="form-control" name="origin" value={formData.origin} onChange={handleChange} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Đơn vị (kg, hộp...)</label>
                      <input type="text" className="form-control" name="unit" value={formData.unit} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Thông tin dinh dưỡng</label>
                      <textarea className="form-control" name="nutrition" rows="2" value={formData.nutrition} onChange={handleChange}></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột phải */}
              <div className="col-12 col-lg-4">
                <div className="form-card mb-3">
                  <h5 className="mb-3">Phân loại & Trạng thái</h5>
                  <div className="mb-3">
                    <label className="form-label">Danh mục <span className="text-danger">*</span></label>
                    <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
                      <option value="">Chọn danh mục</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-check form-switch mb-2">
                    <input className="form-check-input" type="checkbox" id="isHot" name="isHot" checked={formData.isHot} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="isHot">Sản phẩm Hot</label>
                  </div>
                  <div className="form-check form-switch mb-2">
                    <input className="form-check-input" type="checkbox" id="isSale" name="isSale" checked={formData.isSale} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="isSale">Đang Sale</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="isNewProduct" name="isNewProduct" checked={formData.isNewProduct} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="isNewProduct">Sản phẩm Mới</label>
                  </div>
                </div>

                <div className="form-card">
                  <h5 className="mb-3">Hình ảnh</h5>
                  <div className="upload-box mb-3">
                    <label className="upload-label">
                      <FiUploadCloud size={30} />
                      <span>Nhấn để chọn ảnh</span>
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} hidden />
                    </label>
                  </div>
                  
                  <div className="image-preview-container">
                    {/* Ảnh đã có (sửa) */}
                    {existingImages.map((imgUrl, index) => (
                      <div className="image-preview-item" key={`existing-${index}`}>
                        <img src={imgUrl.startsWith('http') ? imgUrl : `http://localhost:5000${imgUrl}`} alt="preview" />
                        <button type="button" className="btn-remove-img" onClick={() => removeExistingImage(index)}><FiTrash2 /></button>
                      </div>
                    ))}
                    {/* Ảnh mới chuẩn bị upload */}
                    {previewImages.map((blobUrl, index) => (
                      <div className="image-preview-item" key={`new-${index}`}>
                        <img src={blobUrl} alt="preview" />
                        <button type="button" className="btn-remove-img" onClick={() => removeNewImage(index)}><FiTrash2 /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className="admin-modal-footer">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>Hủy</button>
          <button type="submit" form="productForm" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminProductForm;
