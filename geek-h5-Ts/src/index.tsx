// console.log(_.random(1.1, 3.2))
import ReactDOM from 'react-dom'
import App from './App'
import store from '@/store'
import { Provider } from 'react-redux'

// 导入通用样式
// import 'antd-mobile/dist/antd-mobile.css'
import '@scss/index.scss'

import dayjs from 'dayjs'

// 扩展dayjs，有显示相对时间的功能
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入中文包
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')



ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)