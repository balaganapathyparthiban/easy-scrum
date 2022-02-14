import colors from 'tailwindcss/colors'
import GUN from 'gun'
import 'gun/sea'

export const db = GUN([
  import.meta.env.VITE_GUN_PEER_1,
  import.meta.env.VITE_GUN_PEER_2,
  import.meta.env.VITE_GUN_PEER_3,
])

export const user = db.user()

export const hash = import.meta.env.VITE_DB_HASH

export const PLANNING_SCHEMA = {
  planningName: '',
  votingSystem: [
    { name: '0' },
    { name: '0.5' },
    { name: '1' },
    { name: '2' },
    { name: '3' },
    { name: '5' },
    { name: '8' },
    { name: '13' },
    { name: '21' },
    { name: '34' },
    { name: '55' },
    { name: '89' },
  ],
  showVoting: false,
}

export const RETRO_SCHEMA = {
  retroName: '',
  templates: [
    {
      id: 0,
      name: 'Went Well',
      color: colors['green']['400'],
      list: [],
    },
    {
      id: 1,
      name: 'To Improve',
      color: colors['red']['400'],
      list: [],
    },
    {
      id: 2,
      name: 'Action Items',
      color: colors['purple']['400'],
      list: [],
    },
  ],
  showCardAuthor: false,
}
