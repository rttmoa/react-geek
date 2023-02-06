import React from 'react'
import ReactDOM from 'react-dom'

import 'antd/dist/antd.less'// 导入antd的全局样式   --less
import './index.css'// 自己的全局样式
import App from './App'










// // 日历的使用 中文的配置
// import { ConfigProvider } from 'antd' 
// import moment from 'moment';
// import  locale from 'moment/locale/zh-cn';
// moment.locale('zh-cn'); 
// <ConfigProvider locale={locale}></ConfigProvider>


ReactDOM.render(<App />, document.getElementById('root'))