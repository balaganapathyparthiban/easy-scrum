import React from 'react'
import { RiVipCrownFill } from 'react-icons/ri'
import PropTypes from 'prop-types'
import colors from 'tailwindcss/colors'

const Logo = ({ color = 'white', colorWeight = null, logoTitle = '', hideTitleInMobile = false }) => {
  return (
    <div
      className="h-full w-auto flex flex-row items-center justify-center"
      style={{
        color: colorWeight ? colors[color][colorWeight] : colors[color],
      }}
    >
      <RiVipCrownFill className="-translate-y-0.5" fontSize={30} />
      <p className={`ml-1 text-2xl font-bold capitalize ${hideTitleInMobile && (logoTitle.length > 4 || logoTitle.length === 0) ? "mobile:hidden" : ""}`}>
        {logoTitle.length === 0 ? 'Easy Scrum' : logoTitle}
      </p>
    </div>
  )
}

Logo.propTypes = {
  color: PropTypes.string,
  colorWeight: PropTypes.string,
  logoTitle: PropTypes.string,
  hideTitleInMobile: PropTypes.bool
}

export default Logo
