import { useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FaMoneyBillWave, FaWallet, FaCreditCard } from 'react-icons/fa'
import { isValidEmail, isValidPhone } from '../../../utils/validators.js'
import AutocompleteInput from './AutocompleteInput'
import './CheckoutForm.css'

const PAYMENT_METHODS = [
  { value: 'COD', label: 'Thanh toán khi nhận hàng (COD)', icon: <FaMoneyBillWave className="me-2 text-success" /> },
  { value: 'Momo', label: 'Ví MoMo (Mock)', icon: <FaWallet className="me-2 text-danger" /> },
  { value: 'VNPay', label: 'VNPay (Mock)', icon: <FaCreditCard className="me-2 text-primary" /> }
]

/**
 * CheckoutForm - Form nhập thông tin giao hàng + chọn phương thức thanh toán.
 * Có 3 dropdown liên kết Tỉnh -> Quận -> Phường.
 *
 * Form này có id="checkout-form" để nút "Đặt hàng" đặt bên ngoài (trong CartSummary
 * ở trang Checkout) vẫn có thể submit được thông qua thuộc tính HTML `form="checkout-form"`.
 *
 * Props:
 * - defaultValues: giá trị điền sẵn (nếu người dùng đã đăng nhập)
 * - onSubmit(data): callback khi form hợp lệ và được submit
 */
function CheckoutForm({ defaultValues = {}, onSubmit }) {
  const [locations, setLocations] = useState([])

  useEffect(() => {
    let isMounted = true
    const loadLocations = async () => {
      try {
        const res = await fetch('https://provinces.open-api.vn/api/?depth=3')
        if (!res.ok) throw new Error('API request failed')
        const data = await res.json()
        const formatted = data.map(p => ({
          province: p.name,
          districts: p.districts.map(d => ({
            district: d.name,
            wards: d.wards.map(w => w.name)
          }))
        }))
        if (isMounted) setLocations(formatted)
      } catch (err) {
        console.warn('Failed to fetch from open-api.vn, falling back to local JSON', err)
        try {
          const fallbackData = await import('../../../data/vn_locations.json')
          if (isMounted) setLocations(fallbackData.default || fallbackData)
        } catch (fallbackErr) {
          console.error('Failed to load local JSON fallback', fallbackErr)
        }
      }
    }
    loadLocations()
    return () => { isMounted = false }
  }, [])
  const [formData, setFormData] = useState({
    fullName: defaultValues.fullName || '',
    phone: defaultValues.phone || '',
    email: defaultValues.email || '',
    address: '',
    province: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'COD',
  })
  const [errors, setErrors] = useState({})

  // Danh sách Quận/Huyện tương ứng với Tỉnh/Thành đang chọn
  const districts = useMemo(() => {
    const found = locations.find((item) => item.province === formData.province)
    return found ? found.districts : []
  }, [formData.province, locations])

  // Danh sách Phường/Xã tương ứng với Quận/Huyện đang chọn
  const wards = useMemo(() => {
    const found = districts.find((item) => item.district === formData.district)
    return found ? found.wards : []
  }, [districts, formData.district])

  const handleChange = (field) => (value) => {
    // value có thể là string (từ AutocompleteInput) hoặc event (từ các input thường)
    const val = typeof value === 'object' && value.target ? value.target.value : value
    
    setFormData((prev) => {
      const next = { ...prev, [field]: val }
      if (field === 'province') {
        next.district = ''
        next.ward = ''
      }
      if (field === 'district') {
        next.ward = ''
      }
      return next
    })
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên.'

    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại.'
    else if (!isValidPhone(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ.'

    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email.'
    else if (!isValidEmail(formData.email)) newErrors.email = 'Email không hợp lệ.'

    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ cụ thể.'
    
    if (!formData.province.trim()) newErrors.province = 'Vui lòng nhập tên Tỉnh/Thành phố.'
    if (!formData.district.trim()) newErrors.district = 'Vui lòng nhập tên Quận/Huyện.'
    if (!formData.ward.trim()) newErrors.ward = 'Vui lòng nhập tên Phường/Xã.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    
    onSubmit(formData)
  }

  return (
    <form id="checkout-form" className="checkout-form" onSubmit={handleSubmit} noValidate>
      {/* ===== Thông tin khách hàng ===== */}
      <div className="checkout-section">
        <h3 className="checkout-section-title">Thông tin khách hàng</h3>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="checkout-fullname">Họ tên</label>
            <input
              id="checkout-fullname"
              type="text"
              className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
              value={formData.fullName}
              onChange={handleChange('fullName')}
            />
            {errors.fullName && <div className="checkout-error">{errors.fullName}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="checkout-phone">Số điện thoại</label>
            <input
              id="checkout-phone"
              type="tel"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              value={formData.phone}
              onChange={handleChange('phone')}
            />
            {errors.phone && <div className="checkout-error">{errors.phone}</div>}
          </div>

          <div className="col-12">
            <label htmlFor="checkout-email">Email</label>
            <input
              id="checkout-email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange('email')}
            />
            {errors.email && <div className="checkout-error">{errors.email}</div>}
          </div>

          <div className="col-12">
            <label htmlFor="checkout-address">Địa chỉ cụ thể</label>
            <input
              id="checkout-address"
              type="text"
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              placeholder="Số nhà, tên đường..."
              value={formData.address}
              onChange={handleChange('address')}
            />
            {errors.address && <div className="checkout-error">{errors.address}</div>}
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="checkout-province">Tỉnh/Thành phố</label>
            <AutocompleteInput
              id="checkout-province"
              value={formData.province}
              onChange={handleChange('province')}
              options={locations.map((item) => item.province)}
              placeholder="Chọn hoặc nhập tỉnh/thành..."
              error={!!errors.province}
            />
            {errors.province && <div className="checkout-error">{errors.province}</div>}
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="checkout-district">Quận/Huyện</label>
            <AutocompleteInput
              id="checkout-district"
              value={formData.district}
              onChange={handleChange('district')}
              options={districts.map((item) => item.district)}
              placeholder="Chọn hoặc nhập quận/huyện..."
              disabled={!formData.province}
              error={!!errors.district}
            />
            {errors.district && <div className="checkout-error">{errors.district}</div>}
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="checkout-ward">Phường/Xã</label>
            <AutocompleteInput
              id="checkout-ward"
              value={formData.ward}
              onChange={handleChange('ward')}
              options={wards}
              placeholder="Chọn hoặc nhập phường/xã..."
              disabled={!formData.district}
              error={!!errors.ward}
            />
            {errors.ward && <div className="checkout-error">{errors.ward}</div>}
          </div>

          <div className="col-12">
            <label htmlFor="checkout-note">Ghi chú (tuỳ chọn)</label>
            <textarea
              id="checkout-note"
              className="form-control"
              rows={3}
              placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
              value={formData.note}
              onChange={handleChange('note')}
            />
          </div>
        </div>
      </div>

      {/* ===== Phương thức thanh toán ===== */}
      <div className="checkout-section">
        <h3 className="checkout-section-title">Phương thức thanh toán</h3>

        <div className="checkout-payment-list">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.value}
              className={`checkout-payment-option ${
                formData.paymentMethod === method.value ? 'checkout-payment-option--active' : ''
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={method.value}
                checked={formData.paymentMethod === method.value}
                onChange={handleChange('paymentMethod')}
              />
              <span className="checkout-payment-icon">{method.icon}</span>
              <span>{method.label}</span>
            </label>
          ))}
        </div>
        <p className="checkout-payment-note">
          * Momo và VNPay hiện chỉ là giao diện minh hoạ, sẽ tích hợp cổng thanh toán thật ở giai đoạn Backend.
        </p>
      </div>
    </form>
  )
}

CheckoutForm.propTypes = {
  defaultValues: PropTypes.shape({
    fullName: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
}

export default CheckoutForm
