import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { BiChevronDown } from 'react-icons/bi'
import { motion } from 'framer-motion'

const Select = ({
  placeholder,
  options = [],
  onChange,
  className,
  style = {},
  value,
}) => {
  const [showDropDown, setShowDropDown] = useState(false)
  const [valueState, setValueState] = useState('')

  useEffect(() => {
    setValueState(value)
  }, [])

  const selectOptionHandler = (option) => {
    setValueState(option.name)
    onChange(option)
    setShowDropDown(false)
  }

  return (
    <div
      className={`w-full relative ${className}`}
      style={style}
      tabIndex="-1"
      onBlur={() => setShowDropDown(false)}
    >
      <div
        className="w-full h-full border rounded border-gray-300 shadow p-2 flex justify-between items-center text-gray-800"
        onClick={() => setShowDropDown(!showDropDown)}
      >
        <p style={{ opacity: valueState && !showDropDown ? 1 : 0.5 }}>
          {valueState}
        </p>
        <BiChevronDown
          style={{ opacity: showDropDown ? 1 : 0.5 }}
          fontSize={26}
        />
      </div>
      <motion.div
        className="w-full max-h-36 top-11 absolute bg-white shadow rounded border border-gray-300 overflow-y-auto overflow-x-hidden"
        style={{ borderTop: 0 }}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: showDropDown ? 1 : 0,
          height: showDropDown ? 'auto' : 0,
        }}
        transition={{ duration: 0.25, delayChildren: 500 }}
      >
        {options.map((option, index) => (
          <div
            key={[option, index].join('_')}
            className="cursor-pointer p-2 hover:bg-blue-400"
            onClick={() => selectOptionHandler(option)}
          >
            {option.name}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

Select.propTypes = {
  options: PropTypes.array,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.string,
}

export default Select
