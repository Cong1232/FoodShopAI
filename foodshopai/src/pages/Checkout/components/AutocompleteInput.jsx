import { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import './AutocompleteInput.css';

// Hàm loại bỏ dấu tiếng Việt để tìm kiếm không dấu
const removeAccents = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

function AutocompleteInput({ value, onChange, options, placeholder, disabled, error, id }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Lọc các options dựa trên giá trị input hiện tại
  const filteredOptions = useMemo(() => {
    const normalizedQuery = removeAccents(value);
    if (!normalizedQuery) return options; // Nếu chưa gõ gì thì hiện tất cả
    return options.filter((opt) => removeAccents(opt).includes(normalizedQuery));
  }, [value, options]);

  // Click outside để đóng danh sách
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <input
        id={id}
        type="text"
        className={`form-control ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
      {isOpen && !disabled && (
        <ul className="autocomplete-dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => (
              <li
                key={`${opt}-${index}`}
                className="autocomplete-item"
                onMouseDown={() => handleOptionClick(opt)} // Dùng onMouseDown thay vì onClick để trigger trước onBlur (dù không xài onblur nhưng dùng mousedown cho click list an toàn hơn)
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="autocomplete-empty">Không tìm thấy địa chỉ.</li>
          )}
        </ul>
      )}
    </div>
  );
}

AutocompleteInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  id: PropTypes.string
};

export default AutocompleteInput;
