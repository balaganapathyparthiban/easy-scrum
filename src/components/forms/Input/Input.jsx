import React from 'react'
import PropTypes from 'prop-types'

const Input = ({
  placeholder = '',
  type = 'text',
  value,
  id,
  onChange,
  className,
  style = {},
}) => {
  return (
    <div
      className={`w-full border rounded border-gray-300 shadow p-2 flex justify-center items-center text-gray-800 ${className}`}
      style={style}
    >
      <input
        id={id}
        className="w-full h-full border-0 outline-none bg-white text-sm"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

Input.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  id: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
}

export default Input
