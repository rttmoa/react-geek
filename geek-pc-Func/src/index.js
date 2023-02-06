import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// https://github.com/ant-design/ant-design/issues/33327
import 'antd/dist/antd.min.css'
import './index.scss'


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
  ,
  document.getElementById('root')
)