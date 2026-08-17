import PropTypes from 'prop-types'
import './ProfileCard.css'

/**
 * ProfileCard - Thẻ sidebar hiển thị avatar + thông tin nhanh của người dùng.
 * Component thuần hiển thị, không chứa logic chỉnh sửa (việc chỉnh sửa nằm ở
 * form riêng trong Profile.jsx).
 *
 * Props:
 * - user: { fullName, email, phone, avatar }
 */
function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      <img src={user.avatar} alt={user.fullName} className="profile-card-avatar" />
      <h3 className="profile-card-name">{user.fullName}</h3>
      <p className="profile-card-email">{user.email}</p>
      <p className="profile-card-phone">{user.phone}</p>
    </div>
  )
}

ProfileCard.propTypes = {
  user: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
}

export default ProfileCard
