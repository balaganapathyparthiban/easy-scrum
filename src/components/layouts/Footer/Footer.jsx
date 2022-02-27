import React from "react";
import { AiOutlineInfoCircle, AiOutlineCode } from 'react-icons/ai'

import Logo from "../../shared/Logo/Logo";
import SlideUpModal from "../../shared/SlideUpModal/SlideUpModal";

const Footer = () => {
  return (
    <div className="w-full h-full mobile:h-auto flex flex-row mobile:flex-col items-center justify-between px-10 mobile:px-4 mobile:py-2 text-lg mobile:text-sm tablet:text-base">
      <div className="flex flex-row items-center">
        <SlideUpModal
          action={
            <div className="mr-2 mobile:mr-2 flex items-center">
              <AiOutlineInfoCircle className="text-lg" />
              <span className="pl-1">About</span>
            </div>
          }
          header={<Logo color="black" colorWeight="400" logoTitle="About" />}
        >
          <div className="pb-12 px-6 w-full font-thin h-full overflow-y-scroll overflow-x-hidden">
            <div className="w-9/12">
              <p className="my-2">
                Easy scrum is an open source D-APP(Decentralized application)
                where the data is stored in peer network instead of drive in
                cloud
                <a href="https://gun.eco/" target="_blank" rel="noreferrer">
                  <span className="text-gray-400 "> (Powered by GunJS). </span>
                </a>
                This application helps agile and scrum development teams
                effectively set their sprint goals through collaborative
                planning and consensus-based estimations also helps to do the
                retrospective more productive and fun way.
              </p>
              <p className="mt-4">For project source code check below link</p>
              <p className="my-2">
                Github:
                <a
                  className="ml-2 text-gray-400"
                  href="https://github.com/balaganapathyparthiban/easy-scrum"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://github.com/balaganapathyparthiban/easy-scrum
                </a>
              </p>
            </div>
          </div>
        </SlideUpModal>
        <a href="https://github.com/balaganapathyparthiban/easy-scrum" target="_blank">
          <div className="ml-4 flex items-center">
            <AiOutlineCode className="text-xl" />
            <span className="pl-1">Source code</span>
          </div>
        </a>
      </div>
      <div className="flex flex-row items-center mobile:text-xs">
        <p>Open Source</p>
        <a href="https://bginnovate.com" target="_blank">
          <p className="ml-2 font-medium">@bginnovate</p>
        </a>
      </div>
    </div>
  );
};

export default Footer;
