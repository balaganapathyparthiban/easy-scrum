import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CONST from './utils/constants'
import routes from './routes'

import './assets/styles/index.css'

const App = () => {
  useEffect(() => {
    if (localStorage.getItem("gun/")) {
      localStorage.removeItem("gun/")
    }
  }, [])
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
      <ToastContainer theme='dark' />
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
