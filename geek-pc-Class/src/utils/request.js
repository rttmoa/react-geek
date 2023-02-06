import { message } from 'antd'
import axios from 'axios'
import { getToken, hasToken, removeToken } from 'utils/storage'
import history from 'utils/history'



// 创建axios实例
//request 接口请求实例: 
    // 1.内容管理中 选择文章频道: HTML、开发者咨询、C++、CSS......  
    // 2.const res = await request.get('/channels')
const instance = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0/',   ////http://geek.itheima.net/v1_0/mp/articles
  timeout: 1000,
})



// 配置拦截器  --- 目的是 获取后台的数据 res.data.data  只要内层的data
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (hasToken()) {
      config.headers.Authorization = `Bearer ${getToken()}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response.data
  },
  function (error) {
    // 对响应错误做点什么
    // 对token过期进行统一的处理
    if (error.response.status === 401) {
      // 代表token过期了
      // 1. 删除token
      removeToken()
      // 2. 给提示消息
      message.warn('登录信息过期了', 1);
      // 3. 跳转到登录页
      // 怎么跳转到登录？？？
      // 难点：在非组件中，，，我们是无法使用 Redirect  也无法访问到history对象
      // window.location.href = '/login'
      history.push('/login')
    }
    return Promise.reject(error)
  }
)

export default instance
