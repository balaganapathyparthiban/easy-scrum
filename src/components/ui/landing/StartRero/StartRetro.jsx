import React, { useState } from 'react'
import { GoCheck } from 'react-icons/go'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'

import { db, hash, RETRO_SCHEMA } from '../../../../utils/db'
import Button from '../../../forms/Button/Button'
import Input from '../../../forms/Input/Input'
import CONST from '../../../../utils/constants'

import './StartRetro.css'

function StartRetro({
  submitText = 'CONTINUE',
  editMode = false,
  editRetroName = '',
  editTemplates = RETRO_SCHEMA.templates,
  editShowCardAuthor = RETRO_SCHEMA.showCardAuthor,
  editSubmitHandler = () => {},
}) {
  const { push } = useHistory()

  const retroData = { ...RETRO_SCHEMA }

  const [userName, setUserName] = useState('Scrum master')
  const [retroName, setRetroName] = useState(editRetroName)
  const [templates, setTemplates] = useState(editTemplates)
  const [showCardAuthor, setShowCardAuthor] = useState(editShowCardAuthor)
  const [isLoading, setLoading] = useState(false)

  const continueToRetro = async () => {
    if (userName?.length === 0) return alert('Name is required.')
    if (
      templates[0].name?.length === 0 ||
      templates[1].name?.length === 0 ||
      templates[2].name?.length === 0
    )
      return alert("Please enter template column's name must not be empty.")

    if (editMode) {
      editSubmitHandler({
        retroName: retroName,
        templates: templates,
        showCardAuthor: showCardAuthor,
      })
      return
    }

    setLoading(true)

    const id = uuidV4()
    const roomId = uuidV4()

    retroData.retroName = retroName
    retroData.templates = templates
    retroData.showCardAuthor = showCardAuthor

    const retroSecret = await SEA.encrypt(JSON.stringify(retroData), hash)
    const userSecret = await SEA.encrypt(
      JSON.stringify({
        id,
        admin: true,
        name: userName,
      }),
      hash
    )

    db.get(roomId).put({ data: retroSecret })
    db.get(`${roomId}-users`).put({ [id]: userSecret })

    localStorage.setItem(CONST.USER_ID, id)
    localStorage.setItem(CONST.ROOM_ID, roomId)

    setLoading(false)
    push({
      pathname: CONST.RETRO,
      search: `?room=${roomId}`,
    })
  }

  return (
    <div className="pb-12 w-full h-full flex flex-col items-center overflow-y-scroll overflow-x-hidden">
      <div className="w-6/12 mobile:w-full h-12 mobile:h-auto text-center">
        <p className="text-2xl mobile:text-lg mobile:px-4">
          Choose a name and template for your sprint retrospective
        </p>
      </div>
      {!editMode ? (
        <>
          <div className="w-6/12 mobile:w-full mobile:px-4 h-auto mt-4">
            <label htmlFor="userName" className="opacity-50">
              Name
            </label>
            <Input
              id="userName"
              className="h-12"
              placeholder="Enter name"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
          </div>
        </>
      ) : null}
      <div className="w-6/12 mobile:w-full mobile:px-4 h-auto mt-4">
        <label htmlFor="retroName" className="opacity-50">
          Retro Name
        </label>
        <Input
          id="retroName"
          className="h-12"
          placeholder="Enter retro name"
          value={retroName}
          onChange={(event) => setRetroName(event.target.value)}
        />
      </div>
      <div className="w-6/12 mobile:w-full mobile:px-4 h-auto mt-4">
        <label htmlFor="retroName" className="opacity-50">
          Template Column's
        </label>
        {templates.map((template, index) => (
          <div
            key={[index].join('_')}
            className="w-full h-16 flex flex-row justify-center items-center relative"
          >
            <div
              style={{ backgroundColor: template.color }}
              className="w-6 h-6 absolute left-2 rounded"
            ></div>
            <Input
              className="h-12 pl-10"
              placeholder="Enter template column name"
              value={template.name}
              onChange={(event) => {
                const tempArr = [...templates]
                tempArr[index].name = event.target.value
                setTemplates([...tempArr])
              }}
            />
          </div>
        ))}
      </div>
      <div className="w-6/12 mobile:w-full mobile:px-4 h-auto mt-4">
        <div className="flex flex-row customCheckbox customCheckboxYellow mt-2 relative">
          <input
            id="showCardAuthor"
            type="checkbox"
            className="opacity-0 absolute w-5 h-5"
            checked={showCardAuthor}
            onChange={(event) => setShowCardAuthor(event.target.checked)}
          />
          <div className="w-5 h-5 flex flex-shrink-0 justify-center items-center rounded bg-white border-2 border-yellow-400 focus-within:bg-yellow-400">
            <GoCheck className="hidden text-white" />
          </div>
          <label htmlFor="showCardAuthor" className="ml-2">
            Show card's author
          </label>
        </div>
      </div>
      <div className="w-6/12 mobile:w-full mobile:px-4 h-12 mt-6">
        <Button
          fullWidth
          fullHeight
          bgColor="yellow"
          textColor="white"
          onClick={continueToRetro}
        >
          {isLoading ? (
            <div className="loader" style={{ fontSize: '3px' }}></div>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </div>
  )
}

StartRetro.propTypes = {
  submitText: PropTypes.string,
  editMode: PropTypes.bool,
  editRetroName: PropTypes.string,
  editTemplates: PropTypes.array,
  editShowCardAuthor: PropTypes.bool,
  editSubmitHandler: PropTypes.func,
}

export default StartRetro
