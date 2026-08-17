import { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import ProfileCard from './components/ProfileCard.jsx'
import ChangePasswordForm from './components/ChangePasswordForm.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './Profile.css'

// 2 tab của trang Profile - khai báo mảng để tránh lặp code khi render nút chuyển tab
const TABS = [
  { id: 'info', label: 'Thông tin cá nhân' },
  { id: 'password', label: 'Đổi mật khẩu' },
]

/**
 * Profile - Trang thông tin tài khoản người dùng.
 * Gồm 2 khu vực: ProfileCard (sidebar hiển thị nhanh) và khu vực nội dung
 * chuyển đổi giữa "Cập nhật thông tin" và "Đổi mật khẩu" bằng tab.
 *
 * Buổi 4: dữ liệu người dùng lấy từ AuthContext (mock, chưa có Backend thật).
 */
function Profile() {
  const { currentUser, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('info')

  // Form thông tin cá nhân - khởi tạo từ currentUser, chỉ tạo khi đã đăng nhập
  const [formData, setFormData] = useState(
    currentUser
      ? {
          fullName: currentUser.fullName,
          phone: currentUser.phone,
          address: currentUser.address,
          dob: currentUser.dob,
          gender: currentUser.gender,
        }
      : null,
  )
  const [successMessage, setSuccessMessage] = useState('')

  // ===== Trường hợp chưa đăng nhập: yêu cầu đăng nhập trước =====
  if (!currentUser) {
    return (
      <div className="section-container py-5 text-center">
        <h2 className="fw-bold mb-3">Bạn chưa đăng nhập</h2>
        <p className="text-muted mb-4">Vui lòng đăng nhập để xem thông tin tài khoản.</p>
        <Link to="/login" className="btn" style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
          Đăng nhập ngay
        </Link>
      </div>
    )
  }

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    setSuccessMessage('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    setSuccessMessage('Cập nhật thông tin thành công!')
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Tài khoản' }]} />

      <div className="section-container profile-page">
        <div className="row g-4">
          {/* ===== Sidebar thông tin nhanh ===== */}
          <div className="col-12 col-lg-4">
            <ProfileCard user={currentUser} />
          </div>

          {/* ===== Nội dung chính ===== */}
          <div className="col-12 col-lg-8">
            <div className="profile-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`profile-tab-btn ${activeTab === tab.id ? 'profile-tab-btn--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="profile-content">
              {activeTab === 'info' ? (
                <form onSubmit={handleSubmit} className="profile-form" noValidate>
                  {successMessage && <p className="profile-success-text">{successMessage}</p>}

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label htmlFor="profile-fullname">Họ tên</label>
                      <input
                        id="profile-fullname"
                        type="text"
                        className="form-control"
                        value={formData.fullName}
                        onChange={handleChange('fullName')}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="profile-email">Email</label>
                      <input id="profile-email" type="email" className="form-control" value={currentUser.email} disabled />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="profile-phone">Số điện thoại</label>
                      <input
                        id="profile-phone"
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="profile-dob">Ngày sinh</label>
                      <input
                        id="profile-dob"
                        type="date"
                        className="form-control"
                        value={formData.dob}
                        onChange={handleChange('dob')}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="profile-gender">Giới tính</label>
                      <select
                        id="profile-gender"
                        className="form-select"
                        value={formData.gender}
                        onChange={handleChange('gender')}
                      >
                        <option value="">-- Chọn --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="profile-address">Địa chỉ</label>
                      <input
                        id="profile-address"
                        type="text"
                        className="form-control"
                        value={formData.address}
                        onChange={handleChange('address')}
                      />
                    </div>
                  </div>

                  <button type="submit" className="profile-submit-btn">
                    Cập nhật
                  </button>
                </form>
              ) : (
                <ChangePasswordForm />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
