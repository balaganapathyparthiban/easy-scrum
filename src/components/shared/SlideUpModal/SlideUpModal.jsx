import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { VscChromeClose } from "react-icons/vsc";

const SlideUpModal = ({
  children,
  action,
  header,
  showSlideUpModal = false,
  actionHandler = () => {},
}) => {
  const [visible, setVisible] = useState(showSlideUpModal);

  useEffect(() => {
    setVisible(showSlideUpModal);
  }, [showSlideUpModal]);

  const toggleModal = () => {
    setVisible(!visible);
    actionHandler(!visible);
  };

  return (
    <>
      <div className="cursor-pointer" onClick={toggleModal}>
        {action}
      </div>
      <motion.div
        className="w-screen h-screen bg-white text-gray-800 absolute left-0 right-0 z-50 overflow-hidden"
        initial={{ top: "100vh", height: 0 }}
        animate={{
          top: visible ? 0 : "100vh",
          height: visible ? "100vh" : 0,
        }}
        transition={{
          ease: "easeInOut",
          type: "tween",
        }}
      >
        {visible ? (
          <div className="w-full h-full flex flex-col">
            <div className="w-full h-auto flex flex-row justify-between items-center px-6 mobile:px-4 py-8 mobile:py-4">
              <div className="w-auto h-auto">{header}</div>
              <div>
                <VscChromeClose fontSize={26} onClick={toggleModal} />
              </div>
            </div>
            <div className="w-full h-[calc(100%-4rem)]">{children}</div>
          </div>
        ) : null}
      </motion.div>
    </>
  );
};

SlideUpModal.propTypes = {
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
  showSlideUpModal: PropTypes.bool,
  actionHandler: PropTypes.func,
};

export default SlideUpModal;
