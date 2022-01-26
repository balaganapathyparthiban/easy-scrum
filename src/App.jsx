import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import CONST from './utils/constants'
import routes from './routes'

import './assets/styles/index.css'

const App = () => {
  return (
    <div className="w-screen h-screen bg-white text-gray-800 overflow-hidden">
      <Switch>
        {routes.map((options, index) => (
          <Route key={index} {...options} />
        ))}
        <Route
          path={CONST.UNKNOWN}
          render={() => <Redirect to={CONST.LANDING} />}
        />
      </Switch>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
