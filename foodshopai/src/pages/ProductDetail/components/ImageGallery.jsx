import { useState } from 'react'
import PropTypes from 'prop-types'
import { getImageUrl } from '../../../utils/getImageUrl'
import './ImageGallery.css'

/**
 * ImageGallery - Hiển thị ảnh lớn + dải ảnh thu nhỏ (thumbnail) bên dưới.
 * Người dùng bấm vào thumbnail để đổi ảnh lớn đang xem.
 *
 * Props:
 * - images: mảng URL ảnh sản phẩm
 * - alt: text mô tả ảnh (dùng tên sản phẩm)
 */
function ImageGallery({ images, alt }) {
  // Ảnh đang được chọn để hiển thị lớn - mặc định là ảnh đầu tiên
  const [activeIndex, setActiveIndex] = useState(0)

  // Trường hợp sản phẩm không có ảnh nào - hiển thị ảnh placeholder mặc định
  const gallery = images && images.length > 0 ? images : ['https://placehold.co/500x500?text=No+Image']

  return (
    <div className="image-gallery">
      <div className="image-gallery-main">
        <img src={getImageUrl(gallery[activeIndex])} alt={alt} />
      </div>

      {/* Chỉ hiển thị dải thumbnail khi có nhiều hơn 1 ảnh */}
      {gallery.length > 1 && (
        <div className="image-gallery-thumbs">
          {gallery.map((image, index) => (
            <button
              type="button"
              key={image}
              className={`image-gallery-thumb ${index === activeIndex ? 'image-gallery-thumb--active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Xem ảnh ${index + 1}`}
            >
              <img src={getImageUrl(image)} alt={`${alt} - ảnh ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  alt: PropTypes.string.isRequired,
}

ImageGallery.defaultProps = {
  images: [],
}

export default ImageGallery
