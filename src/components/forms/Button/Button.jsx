import React from 'react'
import PropTypes from 'prop-types'
import colors from 'tailwindcss/colors'

const Button = ({
  children,
  bgColor = 'white',
  bgColorWeight = '400',
  textColor = 'blue',
  textColorWeight = '400',
  className = '',
  fullWidth = false,
  fullHeight = false,
  onClick = () => {},
}) => {
  return (
    <div
      className={`inline-flex flex-row items-center justify-center rounded shadow px-4 py-2 mobile:py-2 mobile:px-2 cursor-pointer font-medium ${className}`}
      style={{
        width: fullWidth ? '100%' : 'auto',
        height: fullHeight ? '100%' : 'auto',
        backgroundColor:
          bgColor === 'black' || bgColor === 'white'
            ? colors[bgColor]
            : colors[bgColor][bgColorWeight],
        color:
          textColor === 'black' || textColor === 'white'
            ? colors[textColor]
            : colors[textColor][textColorWeight],
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  bgColor: PropTypes.string,
  bgColorWeight: PropTypes.string,
  textColor: PropTypes.string,
  textColorWeight: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
  fullHeight: PropTypes.bool,
}

export default Button
