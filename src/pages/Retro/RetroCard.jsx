import React from 'react'
import PropTypes from 'prop-types'
import { AiFillLike } from 'react-icons/ai'
import { BiEditAlt } from 'react-icons/bi'
import { FaTimes, FaUserAlt } from 'react-icons/fa'
import { GoCheck } from 'react-icons/go'
import { MdDelete } from 'react-icons/md'
import { IoMdAdd } from 'react-icons/io'

import CONST from '../../utils/constants'

const RetroCard = ({
  template,
  setInputValue,
  showCardAuthor,
  addNewTemplateList,
  editTemplateList,
  submitNewTemplateList,
  addLikeTemplateList,
  deleteTemplateList,
  cancelEditTemplateList,
  inputValues,
  users,
}) => {
  return (
    <div className="w-1/3 h-full flex flex-col border rounded p-2 mx-1">
      <p className="text-lg opacity-50">{template.name}</p>
      <div
        className="w-full h-8 bg-gray-200 rounded mt-2 mb-2 flex flex-row justify-center items-center cursor-pointer"
        onClick={addNewTemplateList}
      >
        <IoMdAdd className="opacity-50" />
      </div>
      <div className="w-full h-[calc(100%-50px)] overflow-x-hidden overflow-y-auto">
        {template.list.map((tl, index) => (
          <>
            {tl.status === CONST.RETRO_STATUS_DELETE ? null : (
              <div
                key={tl.id}
                className="w-full h-auto p-2 my-2 rounded text-white border-2 flex flex-col"
                style={{
                  backgroundColor:
                    tl.status === CONST.RETRO_STATUS_EDIT
                      ? 'white'
                      : template.color,
                  borderColor: template.color,
                }}
              >
                {tl.status === CONST.RETRO_STATUS_EDIT ? (
                  <input
                    text="text"
                    className="outline-none w-full h-6 text-gray-800"
                    placeholder="type something..."
                    value={inputValues(index)}
                    onChange={(event) =>
                      setInputValue(event.target.value, index)
                    }
                  />
                ) : (
                  <p className="break-words">{tl.message}</p>
                )}
                <div className="w-full flex flex-row justify-between items-center text-sm">
                  <div className="flex flex-row text-gray-800 items-center">
                    {showCardAuthor && users && users[tl.userId] ? (
                      <>
                        <FaUserAlt />
                        <p className="text-gray-800 ml-2">
                          {users[tl.userId].name}
                        </p>
                      </>
                    ) : null}
                  </div>
                  <div className="flex flex-row">
                    {tl.status === CONST.RETRO_STATUS_NONE ? (
                      <>
                        <div
                          className="text-gray-800 mr-1 flex flex-row cursor-pointer"
                          onClick={() => addLikeTemplateList(index)}
                        >
                          <AiFillLike fontSize={20} />
                          <span>{tl.likes}</span>
                        </div>
                        {tl.userId === localStorage.getItem(CONST.USER_ID) ? (
                          <div
                            className="text-gray-800 mx-1 cursor-pointer"
                            onClick={() => editTemplateList(index)}
                          >
                            <BiEditAlt fontSize={20} />
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <div
                        className="text-gray-800 mx-1 cursor-pointer"
                        onClick={() => submitNewTemplateList(index, tl.status)}
                      >
                        <GoCheck fontSize={20} />
                      </div>
                    )}
                    {tl.userId === localStorage.getItem(CONST.USER_ID) &&
                    tl.status === CONST.RETRO_STATUS_NONE ? (
                      <div
                        className="text-gray-800 ml-1 cursor-pointer"
                        onClick={() => deleteTemplateList(index)}
                      >
                        <MdDelete fontSize={20} />
                      </div>
                    ) : null}
                    {tl.userId === localStorage.getItem(CONST.USER_ID) &&
                    tl.status === CONST.RETRO_STATUS_EDIT ? (
                      <div
                        className="text-gray-800 ml-1 cursor-pointer"
                        onClick={() => cancelEditTemplateList(index)}
                      >
                        <FaTimes fontSize={20} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  )
}

RetroCard.propTypes = {
  template: PropTypes.object,
  addNewTemplateList: PropTypes.func,
  setInputValue: PropTypes.func,
  inputValues: PropTypes.func,
  showCardAuthor: PropTypes.bool,
  editTemplateList: PropTypes.func,
  submitNewTemplateList: PropTypes.func,
  deleteTemplateList: PropTypes.func,
  cancelEditTemplateList: PropTypes.func,
  addLikeTemplateList: PropTypes.func,
  users: PropTypes.object,
}

export default RetroCard
