import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'
import store from './store'
// console.log(store)///--------->  {dispatch: ƒ (action), subscribe: ƒ, getState: ƒ getState(), replaceReducer: ƒ, @@observable: ƒ}

// 主要: 要先搭建redux环境


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)