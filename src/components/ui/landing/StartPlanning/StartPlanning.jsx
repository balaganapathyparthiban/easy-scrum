import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { GoCheck } from 'react-icons/go'

import { db, hash, PLANNING_SCHEMA } from '../../../../utils/db'
import Button from '../../../forms/Button/Button'
import Input from '../../../forms/Input/Input'
import CONST from '../../../../utils/constants'
import MultipleInput from '../../../forms/MultipleInput/MultipleInput'

function StartPlanning({
  submitText = 'CONTINUE',
  editMode = false,
  editPlanningName = '',
  editVotingSystem = PLANNING_SCHEMA.votingSystem,
  editSubmitHandler = () => {},
}) {
  const { push } = useHistory()

  const planningData = { ...PLANNING_SCHEMA }

  const [userName, setUserName] = useState('Scrum master')
  const [isSpectator, setIsSpectator] = useState(true)
  const [planningName, setPlanningName] = useState(editPlanningName)
  const [votingSystem, setVotingSystem] = useState(editVotingSystem)
  const [isLoading, setLoading] = useState(false)

  const continueToPlanning = async () => {
    if (userName?.length === 0) return alert('Name is required.')
    if (votingSystem?.length === 0)
      return alert('Voting system must have atlease one.')

    if (editMode) {
      editSubmitHandler({
        planningName: planningName,
        votingSystem: votingSystem,
      })
      return
    }

    setLoading(true)

    const id = uuidV4()
    const roomId = uuidV4()

    planningData.planningName = planningName
    planningData.votingSystem = votingSystem

    const planningSecret = await SEA.encrypt(JSON.stringify(planningData), hash)
    const userSecret = await SEA.encrypt(
      JSON.stringify({
        id,
        admin: true,
        name: userName,
        isSpectator: isSpectator,
        vote: null,
      }),
      hash
    )

    db.get(roomId).put({ data: planningSecret })
    db.get(`${roomId}-users`).put({ [id]: userSecret })

    localStorage.setItem(CONST.USER_ID, id)
    localStorage.setItem(CONST.ROOM_ID, roomId)

    setLoading(false)
    push({
      pathname: CONST.PLANNING,
      search: `?room=${roomId}`,
    })
  }

  return (
    <div className="pb-12 w-full h-full flex flex-col items-center overflow-y-scroll overflow-x-hidden">
      <div className="w-6/12 h-12 text-center">
        <p className="text-2xl">
          Choose a name and voting system for your sprint planning
        </p>
      </div>
      {!editMode ? (
        <>
          <div className="w-6/12 h-auto mt-4">
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
          <div className="w-6/12 h-auto mt-4 customCheckbox customCheckboxBlue flex flex-row relative">
            <input
              id="isSpectator"
              type="checkbox"
              className="opacity-0 absolute w-5 h-5"
              checked={isSpectator}
              onChange={(event) => setIsSpectator(event.target.checked)}
            />
            <div className="w-5 h-5 flex flex-shrink-0 justify-center items-center rounded bg-white border-2 border-blue-400 focus-within:bg-blue-400">
              <GoCheck className="hidden text-white" />
            </div>
            <label htmlFor="isSpectator" className="ml-2">
              Only Spectate?
            </label>
          </div>
        </>
      ) : null}

      <div className="w-6/12 h-auto mt-4">
        <label htmlFor="planningName" className="opacity-50">
          Planning name
        </label>
        <Input
          id="planningName"
          className="h-12"
          placeholder="Enter planning name"
          value={planningName}
          onChange={(event) => setPlanningName(event.target.value)}
        />
      </div>
      <div className="w-6/12 h-auto mt-4">
        <label htmlFor="votingSystem" className="opacity-50">
          Voting system
        </label>
        <MultipleInput
          placeholder="Enter voting system values"
          list={votingSystem}
          onAdd={(value) => {
            if (parseFloat(value) < 0) {
              alert('Only positive number allowed')
              return
            }
            if (votingSystem.length >= 12) {
              alert('Only 12 voting values allowed')
              return
            }
            if (votingSystem.filter((vs) => vs.name === value).length > 0) {
              alert(`${value} already exists`)
              return
            }
            votingSystem.push({
              name: value,
            })
            setVotingSystem(
              [...votingSystem].sort((a, b) => {
                if (parseFloat(a.name) > parseFloat(b.name)) return 1
                if (parseFloat(a.name) < parseFloat(b.name)) return -1
                if (parseFloat(a.name) == parseFloat(b.name)) return 0
              })
            )
          }}
          onDelete={(list) => setVotingSystem([...list])}
        />
      </div>
      <div className="w-6/12 h-12 mt-6">
        <Button
          fullWidth
          fullHeight
          bgColor="blue"
          textColor="white"
          onClick={!isLoading ? continueToPlanning : null}
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

StartPlanning.propTypes = {
  submitText: PropTypes.string,
  editMode: PropTypes.bool,
  editPlanningName: PropTypes.string,
  editVotingSystem: PropTypes.array,
  editSubmitHandler: PropTypes.func,
}

export default StartPlanning
