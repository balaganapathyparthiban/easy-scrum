import colors from 'tailwindcss/colors'

const helper = {}

helper.generateRandomColor = () => {
  const colorList = [
    'rose',
    'pink',
    'fuchsia',
    'purple',
    'violet',
    'indigo',
    'blue',
    'sky',
    'cyan',
    'teal',
    'emerald',
    'green',
    'lime',
    'yellow',
    'amber',
    'orange',
    'red',
    'warmGray',
    'trueGray',
    'gray',
    'coolGray',
    'blueGray',
  ]
  const colorWeightList = ['100', '200', '300']

  const randColor = colorList[Math.floor(Math.random() * colorList.length)]
  const randColorWeight =
    colorWeightList[Math.floor(Math.random() * colorWeightList.length)]

  return colors[randColor][randColorWeight]
}

export default helper
