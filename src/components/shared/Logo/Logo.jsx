import React from 'react'
import { RiVipCrownFill } from 'react-icons/ri'
import PropTypes from 'prop-types'
import colors from 'tailwindcss/colors'

const Logo = ({ color = 'white', colorWeight = null, logoTitle = '' }) => {
  return (
    <div
      className="h-full w-auto flex flex-row items-center justify-center"
      style={{
        color: colorWeight ? colors[color][colorWeight] : colors[color],
      }}
    >
      <RiVipCrownFill className="-translate-y-0.5" fontSize={30} />
      <p className="ml-1 text-2xl font-bold capitalize">
        {logoTitle.length === 0 ? 'Easy Scrum' : logoTitle}
      </p>
    </div>
  )
}

Logo.propTypes = {
  color: PropTypes.string,
  colorWeight: PropTypes.string,
  logoTitle: PropTypes.string,
}

export default Logo