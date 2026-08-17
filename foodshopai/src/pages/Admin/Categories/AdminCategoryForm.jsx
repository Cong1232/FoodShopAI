import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiUploadCloud, FiTrash2 } from 'react-icons/fi';
import adminCategoryService from '../../../services/adminCategoryService';
import { showToast } from '../../../utils/toast';
import PagePlaceholder from '../../../components/common/PagePlaceholder';
import './AdminCategoryForm.css';

function AdminCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'active'
  });
  
  const [existingImage, setExistingImage] = useState(null); // URL
  const [newImage, setNewImage] = useState(null); // File object
  const [previewImage, setPreviewImage] = useState(null); // Blob URL
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await adminCategoryService.getCategoryById(id);
      if (res.success) {
        const cat = res.data;
        setFormData({
          name: cat.name || '',
          slug: cat.slug || '',
          description: cat.description || '',
          status: cat.status || 'active'
        });
        if (cat.image) {
          setExistingImage(cat.image);
        }
      }
    } catch (error) {
      showToast('Không tìm thấy danh mục', 'error');
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, name, slug });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setExistingImage(null); // Xóa ảnh cũ trên UI (nhưng backend sẽ ghi đè)
    }
  };

  const removeImage = () => {
    setNewImage(null);
    setPreviewImage(null);
    setExistingImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      showToast('Vui lòng điền tên và slug', 'error');
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (newImage) {
        data.append('image', newImage);
      } else if (existingImage === null) {
        // Có thể cần truyền cờ để backend biết là xóa ảnh, nhưng trong yêu cầu không bắt buộc
        data.append('image', '');
      }

      let res;
      if (isEditMode) {
        res = await adminCategoryService.updateCategory(id, data);
      } else {
        res = await adminCategoryService.createCategory(data);
      }

      if (res.success) {
        showToast(isEditMode ? 'Cập nhật thành công' : 'Thêm mới thành công', 'success');
        navigate('/admin/categories');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PagePlaceholder title="Đang tải dữ liệu..." />;

  return (
    <div className="admin-category-form-page">
      <div className="d-flex align-items-center mb-4">
        <Link to="/admin/categories" className="btn btn-outline-secondary me-3">
          <FiArrowLeft /> Quay lại
        </Link>
        <h2 className="mb-0">{isEditMode ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}</h2>
      </div>

      <div className="admin-form-container">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="form-card">
                <h5 className="mb-3">Thông tin danh mục</h5>
                <div className="mb-3">
                  <label className="form-label">Tên danh mục <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleNameChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Slug <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="slug" 
                    value={formData.slug} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea 
                    className="form-control" 
                    name="description" 
                    rows="4" 
                    value={formData.description} 
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="form-card mb-4">
                <h5 className="mb-3">Trạng thái</h5>
                <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active (Hoạt động)</option>
                  <option value="inactive">Inactive (Tạm ẩn)</option>
                </select>
              </div>

              <div className="form-card">
                <h5 className="mb-3">Ảnh đại diện</h5>
                
                {!(existingImage || previewImage) ? (
                  <label className="cat-upload-label">
                    <FiUploadCloud size={30} />
                    <span>Tải ảnh lên</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                  </label>
                ) : (
                  <div className="cat-image-preview">
                    <img 
                      src={previewImage || (existingImage.startsWith('http') ? existingImage : `http://localhost:5000${existingImage}`)} 
                      alt="preview" 
                    />
                    <button type="button" className="btn-remove-img" onClick={removeImage}>
                      <FiTrash2 />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4 pt-3 border-top">
            <Link to="/admin/categories" className="btn btn-outline-secondary me-2">Hủy</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu Danh mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminCategoryForm;
