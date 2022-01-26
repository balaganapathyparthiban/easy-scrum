import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { VscChromeClose } from 'react-icons/vsc'

const PopUpModal = ({
  children,
  action,
  header,
  showModal = false,
  disableAction = false,
  actionHandler = () => {},
}) => {
  const [visible, setVisible] = useState(showModal)

  useEffect(() => {
    setVisible(showModal)
  }, [showModal])

  const toggleModal = () => {
    setVisible(!visible)
    actionHandler(!visible)
  }
  return (
    <>
      {disableAction ? null : (
        <div className="cursor-pointer" onClick={toggleModal}>
          {action}
        </div>
      )}
      <motion.div
        className="absolute top-0 left-0 right-0 w-screen z-50 flex flex-col justify-center items-center"
        style={{ backgroundColor: '#25252550', height: visible ? '100vh' : 0 }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: visible ? 1 : 0,
        }}
        transition={{ ease: 'easeInOut', type: 'tween' }}
      >
        {visible ? (
          <>
            <div className="w-96 h-auto max-w-md max-h-80 pb-6 bg-white text-gray-800 overflow-hidden rounded shadow flex flex-col">
              <div className="w-full h-auto flex flex-row justify-between items-center p-4">
                <div className="w-auto h-auto">{header}</div>
                <div>
                  <VscChromeClose fontSize={26} onClick={toggleModal} />
                </div>
              </div>
              <div className="w-full h-auto overflow-x-hidden overflow-y-auto px-6">
                {children}
              </div>
            </div>
          </>
        ) : null}
      </motion.div>
    </>
  )
}

PopUpModal.propTypes = {
  action: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  header: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  actionHandler: PropTypes.func,
  showModal: PropTypes.bool,
  disableAction: PropTypes.bool,
}

export default PopUpModal
