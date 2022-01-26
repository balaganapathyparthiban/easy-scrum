import React from 'react'

import Logo from '../../shared/Logo/Logo'
import SlideUpModal from '../../shared/SlideUpModal/SlideUpModal'

const Footer = () => {
  return (
    <div className="w-full h-16 flex flex-row items-center justify-end px-10 text-lg">
      <SlideUpModal
        action={<p className="mr-4">About</p>}
        header={<Logo color="black" colorWeight="400" logoTitle="About" />}
      >
        <div className="pb-12 px-6 w-full font-thin h-full overflow-y-scroll overflow-x-hidden">
          <div className="w-9/12">
            <p className="my-2">
              Easy scrum is an open source D-APP(Decentralized application)
              where the data is stored in peer network instead of drive in cloud
              <a href="https://gun.eco/" target="_blank" rel="noreferrer">
                <span className="text-gray-400 "> (Powered by GunJS). </span>
              </a>
              This application helps agile and scrum development teams
              effectively set their sprint goals through collaborative planning
              and consensus-based estimations also helps to do the retrospective
              more productive and fun way.
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
      <p>|</p>
      <p className="ml-4 font-medium">@bginnovate</p>
    </div>
  )
}

export default Footer
