import React from "react";

import Logo from "../../shared/Logo/Logo";

const Header = () => {
  return (
    <div className="w-full h-full bg-transparent flex flex-row items-center justify-center">
      <div className="w-auto h-auto tablet:-translate-x-2 computer:-translate-x-2">
        <Logo />
      </div>
    </div>
  );
};

export default Header;
