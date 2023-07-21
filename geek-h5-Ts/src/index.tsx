// console.log(_.random(1.1, 3.2))
import ReactDOM from 'react-dom'
import App from './App'
import store from '@/store'
import { Provider } from 'react-redux'

// 导入通用样式
// import 'antd-mobile/dist/antd-mobile.css'
import '@scss/index.scss'


import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // 扩展dayjs，有显示相对时间的功能
import 'dayjs/locale/zh-cn' // 导入中文包
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')



ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)