import React, { useEffect, useState } from 'react'
import { FiLogOut, FiSettings, FiShare2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { VscChevronDown, VscEye } from 'react-icons/vsc'
import { v4 as uuidV4 } from 'uuid'

import { db, hash, RETRO_SCHEMA } from '../../utils/db'
import Button from '../../components/forms/Button/Button'
import CONST from '../../utils/constants'
import Logo from '../../components/shared/Logo/Logo'
import SlideUpModal from '../../components/shared/SlideUpModal/SlideUpModal'
import StartRetro from '../../components/ui/landing/StartRero/StartRetro'
import PopUpModal from '../../components/shared/PopUpModal/PopUpModal'
import Input from '../../components/forms/Input/Input'
import RetroCard from './RetroCard'
import { toast } from 'react-toastify'

const Retro = () => {
  const { push, location } = useHistory()

  const [retroData, setRetroData] = useState(RETRO_SCHEMA)
  const [users, setUsers] = useState({})
  const [role, setRole] = useState(CONST.USER)
  const [tempTemplates, setTempTemplates] = useState(RETRO_SCHEMA.templates)
  const [inputValues, setInputValue] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [userName, setUserName] = useState('')
  const [showDropDown, setShowDropDown] = useState(false)
  const [showSlideUpModal, setShowSlideUpModal] = useState(false)

  useEffect(() => {
    const query = new URLSearchParams(location.search)

    if (!query.get('room')) {
      push(CONST.LANDING)
    }

    localStorage.setItem(CONST.ROOM_ID, query.get('room'))

    if (!localStorage.getItem(CONST.USER_ID)) {
      setShowModal(true)
    } else {
      listenPlanningDataChanges()
    }
  }, [])

  const listenPlanningDataChanges = () => {
    const query = new URLSearchParams(location.search)

    db.get(query.get('room'))
      .map()
      .on(async (response) => {
        if (!response) return

        const data = await SEA.decrypt(response, hash)

        tempTemplates[0].name = data.templates[0]?.name
        tempTemplates[0].color = data.templates[0]?.color
        tempTemplates[1].name = data.templates[1]?.name
        tempTemplates[1].color = data.templates[1]?.color
        tempTemplates[2].name = data.templates[2]?.name
        tempTemplates[2].color = data.templates[2]?.color

        setTempTemplates(tempTemplates)
        setRetroData(data)
      })

    db.get(`${query.get('room')}-users`)
      .map()
      .on(async (response) => {
        if (!response) return

        const user = await SEA.decrypt(response, hash)

        if (user.id === localStorage.getItem(CONST.USER_ID)) {
          if (user.admin) {
            setRole(CONST.ADMIN)
          }
          setUserName(user.name)
        }

        users[user.id] = { ...user }
        setUsers({ ...users })
      })

    db.get(`${query.get('room')}-templates`)
      .map()
      .on(async (response) => {
        if (!response) return

        const template = await SEA.decrypt(response, hash)

        const ttIndex = tempTemplates[template.index].list.findIndex(
          (tt) => tt?.id === template?.value?.id
        )

        if (ttIndex === -1) {
          tempTemplates[template.index].list.unshift(template.value)
        } else {
          tempTemplates[template.index].list[ttIndex] = { ...template.value }
        }
        setTempTemplates([...tempTemplates])
      })
  }

  const joinUserToRoom = async () => {
    if (!userName) {
      toast.error('Name is required')
      return
    }

    const query = new URLSearchParams(location.search)
    const userId = localStorage.getItem(CONST.USER_ID)

    if (userId) {
      users[userId].name = userName

      const userSecret = await SEA.encrypt(
        JSON.stringify({
          ...users[userId],
        }),
        hash
      )

      db.get(`${query.get('room')}-users`).put({ [userId]: userSecret })
      setShowModal(false)
    } else {
      const id = uuidV4()
      const userSecret = await SEA.encrypt(
        JSON.stringify({
          id,
          name: userName,
        }),
        hash
      )

      db.get(`${query.get('room')}-users`).put({ [id]: userSecret })
      localStorage.setItem(CONST.USER_ID, id)

      listenPlanningDataChanges()
      setShowModal(false)
    }
  }

  const addNewTemplateList = (index) => {
    const tempArr = [...tempTemplates]
    tempArr[index].list.unshift({
      message: '',
      likes: 0,
      status: CONST.RETRO_STATUS_EDIT,
    })
    setTempTemplates(tempArr)
  }

  const submitNewTemplateList = async (index, tlIndex, status) => {
    const query = new URLSearchParams(location.search)

    if (!inputValues[`value${index}${tlIndex}`]) {
      toast.error('Empty message not allowed')
      return
    }

    if (tempTemplates[index]?.list[tlIndex]?.id) {
      const templateSecret = await SEA.encrypt(
        JSON.stringify({
          index: index,
          value: {
            ...tempTemplates[index].list[tlIndex],
            message: inputValues[`value${index}${tlIndex}`],
            status: CONST.RETRO_STATUS_NONE,
          },
        }),
        hash
      )
      db.get(`${query.get('room')}-templates`).put({
        [tempTemplates[index].list[tlIndex].id]: templateSecret,
      })
    } else {
      const templateId = uuidV4()

      const templateSecret = await SEA.encrypt(
        JSON.stringify({
          index: index,
          value: {
            id: templateId,
            userId: localStorage.getItem(CONST.USER_ID),
            message: inputValues[`value${index}${tlIndex}`],
            likes: 0,
            status: CONST.RETRO_STATUS_NONE,
          },
        }),
        hash
      )
      db.get(`${query.get('room')}-templates`).put({
        [templateId]: templateSecret,
      })
    }

    delete inputValues[`value${index}${tlIndex}`]
    delete tempTemplates[index].list[tlIndex]
    setTempTemplates([...tempTemplates])
  }

  const deleteTemplateList = async (index, tlIndex) => {
    const query = new URLSearchParams(location.search)

    const templateSecret = await SEA.encrypt(
      JSON.stringify({
        index: index,
        value: {
          ...tempTemplates[index].list[tlIndex],
          status: CONST.RETRO_STATUS_DELETE,
        },
      }),
      hash
    )
    db.get(`${query.get('room')}-templates`).put({
      [tempTemplates[index].list[tlIndex].id]: templateSecret,
    })
    db.get(`${query.get('room')}-templates`).put({
      [tempTemplates[index].list[tlIndex].id]: null,
    })
  }

  const editTemplateList = (index, tlIndex) => {
    const tempArr = [...tempTemplates]
    inputValues[`value${index}${tlIndex}`] =
      tempArr[index].list[tlIndex].message
    tempArr[index].list[tlIndex].status = CONST.RETRO_STATUS_EDIT
    setTempTemplates(tempArr)
  }

  const cancelEditTemplateList = (index, tlIndex) => {
    const tempArr = [...tempTemplates]
    inputValues[`value${index}${tlIndex}`] = ''
    tempArr[index].list[tlIndex].status = CONST.RETRO_STATUS_NONE
    setTempTemplates(tempArr)
  }

  const cancelTemplateList = (index, tlIndex) => {
    const tempArr = [...tempTemplates]
    delete tempArr[index].list[tlIndex]
    setTempTemplates(tempArr)
  }

  const addLikeTemplateList = async (index, tlIndex) => {
    const query = new URLSearchParams(location.search)

    tempTemplates[index].list[tlIndex].likes++

    const templateSecret = await SEA.encrypt(
      JSON.stringify({
        index: index,
        value: tempTemplates[index].list[tlIndex],
      }),
      hash
    )
    db.get(`${query.get('room')}-templates`).put({
      [tempTemplates[index].list[tlIndex].id]: templateSecret,
    })
  }

  const editStartRetro = async (data) => {
    if (role !== CONST.ADMIN) return

    const query = new URLSearchParams(location.search)
    const userId = localStorage.getItem(CONST.USER_ID)

    if (users[userId].admin) {
      retroData.retroName = data.retroName
      retroData.templates[0].name = data.templates[0].name
      retroData.templates[1].name = data.templates[1].name
      retroData.templates[2].name = data.templates[2].name
      retroData.showCardAuthor = data.showCardAuthor

      const retroSecret = await SEA.encrypt(JSON.stringify(retroData), hash)
      db.get(query.get('room')).put({ data: retroSecret })

      setShowSlideUpModal(false)
    }
  }

  const copyLink = () => {
    const copyText = document.getElementById('share-url')
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(copyText.value)
    toast.info('Link Copied.')
  }

  const onLogout = () => {
    localStorage.removeItem(CONST.USER_ID)
    localStorage.removeItem(CONST.ROOM_ID)
    push(CONST.LANDING)
  }

  return (
    <>
      <div className="w-full h-auto flex flex-row justify-between items-center px-6 pt-8 pb-6 mobile:p-4 tablet:p-4">
        <div className="flex flex-row justify-center items-center">
          <Link to={CONST.LANDING}>
            <Logo
              color="yellow"
              colorWeight="400"
              logoTitle={retroData.retroName}
              hideTitleInMobile
            />
          </Link>
          {role === CONST.ADMIN ? (
            <SlideUpModal
              showSlideUpModal={showSlideUpModal}
              action={
                <FiSettings fontSize="24" className="mobile:text-xl ml-4 text-gray-800" />
              }
              actionHandler={(data) => {
                setShowSlideUpModal(data)
              }}
              header={<Logo color="yellow" colorWeight="400" />}
            >
              <StartRetro
                submitText="UPDATE"
                editMode
                editRetroName={retroData.retroName}
                editTemplates={retroData.templates}
                editShowCardAuthor={retroData.showCardAuthor}
                editSubmitHandler={editStartRetro}
              />
            </SlideUpModal>
          ) : null}
        </div>
        <div className="flex flex-row items-center">
          <div className="flex flex-row mr-4 mobile:mr-2 items-center">
            <div
              className="flex flex-row items-center relative hover:bg-gray-100 focus:bg-gray-100 p-2 mobile:p-0 mobile:ml-2 rounded outline-none"
              onClick={() => setShowDropDown(!showDropDown)}
              tabIndex="-1"
              onBlur={() => setShowDropDown(false)}
            >
              <p className="uppercase text-sm rounded-full bg-blue-400 w-7 h-7 flex flex-row justify-center items-center mr-2 text-white">
                {userName[0]}
              </p>
              <p className="cursor-pointer mr-2 capitalize mobile:hidden">{userName}</p>
              <VscChevronDown className="cursor-pointer" strokeWidth={2} />
              {showDropDown ? (
                <>
                  <div className="w-56 h-56 rounded shadow-lg bg-white absolute top-14 mobile:top-8 right-0 mobile:-right-16 z-10 border">
                    <div className="w-full h-auto flex flex-row p-2">
                      <p className="flex flex-row justify-center items-center text-xl uppercase rounded-full bg-blue-400 w-12 h-12 mr-2 text-white">
                        {userName[0]}
                      </p>
                      <div className="flex flex-col justify-center items-start">
                        <p className="cursor-pointer mr-2 capitalize">
                          {userName}
                        </p>
                        <div
                          className="bg-yellow-400 text-white text-sm px-2 rounded cursor-pointer"
                          onClick={() => setShowModal(true)}
                        >
                          <p>edit</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-auto border-t p-2 flex flex-row items-center">
                      <FiLogOut />
                      <p className="ml-2 cursor-pointer" onClick={onLogout}>
                        Logout
                      </p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div onClick={copyLink}>
            <input
              type="text"
              id="share-url"
              style={{ fontSize: 0, width: 0, height: 0 }}
              value={window.location.href}
              autoFocus={false}
              readOnly
            />
            <Button bgColor="yellow" bgColorWeight="400" textColor="white">
              <FiShare2 fontSize="20" className="text-base mr-2 relative" />
              <span className='mobile:text-xs'>Copy link</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-96px)] mobile:h-[calc(100vh-64px)] tablet:h-[calc(100vh-76px)] px-6 mobile:px-4 tablet:px-4 pb-6 mobile:pb-4 tablet:pb-4 flex flex-row mobile:flex-col">
        {tempTemplates.map((template, index) => (
          <RetroCard
            key={[index].join('_')}
            users={users}
            template={template}
            inputValues={(tlIndex) => inputValues[`value${index}${tlIndex}`]}
            setInputValue={(value, tlIndex) =>
              setInputValue({
                ...inputValues,
                [`value${index}${tlIndex}`]: value,
              })
            }
            showCardAuthor={retroData.showCardAuthor}
            addNewTemplateList={() => addNewTemplateList(index)}
            editTemplateList={(tlIndex) => editTemplateList(index, tlIndex)}
            deleteTemplateList={(tlIndex) => deleteTemplateList(index, tlIndex)}
            submitNewTemplateList={(tlIndex, tlStatus) =>
              submitNewTemplateList(index, tlIndex, tlStatus)
            }
            cancelEditTemplateList={(tlIndex) =>
              cancelEditTemplateList(index, tlIndex)
            }
            cancelTemplateList={(tlIndex) => cancelTemplateList(index, tlIndex)}
            addLikeTemplateList={(tlIndex) =>
              addLikeTemplateList(index, tlIndex)
            }
          />
        ))}
      </div>
      <PopUpModal
        showModal={showModal}
        disableAction
        header="Personal Details"
        actionHandler={(status) => {
          if (!status && !localStorage.getItem(CONST.USER_ID)) {
            push(CONST.LANDING)
            return
          } else {
            setUserName(users[localStorage.getItem(CONST.USER_ID)]?.name)
            setShowModal(false)
          }
        }}
      >
        <div>
          <div className="w-full h-auto mt-4">
            <label htmlFor="scrumMasterName" className="opacity-50">
              Name
            </label>
            <Input
              id="scrumMasterName"
              className="h-12"
              placeholder="Enter planning name"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
          </div>
          <div className="w-full h-12 mt-6">
            <Button
              fullWidth
              fullHeight
              bgColor="blue"
              textColor="white"
              onClick={joinUserToRoom}
            >
              CONTINUE
            </Button>
          </div>
        </div>
      </PopUpModal>
    </>
  )
}

export default Retro
