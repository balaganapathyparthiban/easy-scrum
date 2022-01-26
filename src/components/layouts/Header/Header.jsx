import React from 'react'

import Logo from '../../shared/Logo/Logo'

const Header = () => {
  return (
    <div className="w-full h-16 bg-transparent flex flex-row items-center justify-center mobile:justify-start">
      <div className="w-auto h-auto tablet:-translate-x-2 computer:-translate-x-2">
        <Logo />
      </div>
    </div>
  )
}

export default Header
