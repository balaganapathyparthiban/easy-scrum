import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

import Header from '../../components/layouts/Header/Header'
import Footer from '../../components/layouts/Footer/Footer'
import Button from '../../components/forms/Button/Button'
import tailwindcssConfig from '../../assets/config/tailwindcss.json'
import SlideUpModal from '../../components/shared/SlideUpModal/SlideUpModal'
import StartPlanning from '../../components/ui/landing/StartPlanning/StartPlanning'
import StartRetro from '../../components/ui/landing/StartRero/StartRetro'
import Logo from '../../components/shared/Logo/Logo'
import CONST from '../../utils/constants'

const Landing = () => {
  const isMobile =
    document.body.offsetWidth <= parseInt(tailwindcssConfig.screens.mobile.max)

  useEffect(() => {
    localStorage.removeItem(CONST.USER_ID)
    localStorage.removeItem(CONST.ROOM_ID)
  }, [])

  return (
    <div className="w-full h-full flex flex-col justify-end text-white overflow-hidden">
      <div className="absolute w-full h-auto top-0 z-10">
        <Header />
      </div>
      <div className="absolute top-0 w-full h-full flex flex-row mobile:flex-col">
        <motion.div
          initial={{ width: isMobile ? '100%' : '50%' }}
          animate={{ width: isMobile ? '100%' : '50%' }}
          whileHover={{ width: '85%' }}
          transition={{ ease: 'easeInOut', type: 'spring', stiffness: 75 }}
          className="flex-grow h-full mobile:w-full mobile:h-1/2 bg-blue-500 px-4 py-16"
        >
          <div className="w-full h-full flex flex-col px-6 pt-12 pb-6 mobile:py-2">
            <div className="w-full opacity-75">
              <p className="text-4xl mobile:text-2xl">Sprint planning</p>
            </div>
            <div className="w-full mt-4">
              <p className="text-6xl mobile:text-3xl">
                Sprints made simple. Estimates made easy.
              </p>
            </div>
            <div className="w-3/4 mt-4 opacity-75">
              <p>
                It is the fun way for agile teams to guide sprint planning and
                build accurate consensus estimates.
              </p>
            </div>
            <div className="w-full mt-6">
              <SlideUpModal
                action={<Button textColorWeight="600">START PLANNING</Button>}
                header={<Logo color="blue" colorWeight="400" />}
              >
                <StartPlanning />
              </SlideUpModal>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ width: isMobile ? '100%' : '50%' }}
          animate={{ width: isMobile ? '100%' : '50%' }}
          whileHover={{ width: '85%' }}
          transition={{ ease: 'easeInOut', type: 'spring', stiffness: 75 }}
          className="flex-grow h-full mobile:w-full mobile:h-1/2 bg-yellow-500 px-4 py-16 mobile:py-4"
        >
          <div className="w-full h-full flex flex-col px-6 pt-12 pb-6 mobile:py-2">
            <div className="w-full opacity-75">
              <p className="text-4xl mobile:text-3xl">Sprint retrospective</p>
            </div>
            <div className="w-full mt-4">
              <p className="text-6xl mobile:text-3xl">
                Improve with Fun Sprint Retro.
              </p>
            </div>
            <div className="w-3/4 mt-4 opacity-75">
              <p>
                Collaborate with your remote team and get better at what you do
                with a simple, intuitive and beautiful tool.
              </p>
            </div>
            <div className="w-full mt-6">
              <SlideUpModal
                action={
                  <Button textColor="yellow" textColorWeight="600">
                    START RETROSPECTIVE
                  </Button>
                }
                header={<Logo color="yellow" colorWeight="400" />}
              >
                <StartRetro />
              </SlideUpModal>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="w-full h-auto z-10">
        <Footer />
      </div>
    </div>
  )
}

export default Landing
