import axios from 'axios'
// import history from 'utils/history'   // window.location.href = '/login'   //history.push('/home')

// 创建axios实例
//request 接口请求实例: 
    // 1.内容管理中 选择文章频道: HTML、开发者咨询、C++、CSS......  
    // 2.const res = await request.get('/channels')
const instance = axios.create({
  baseURL: 'http://127.0.0.1:5000',   ////http://geek.itheima.net/v1_0/mp/articles
  timeout: 2000,
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer apikey,AT2UE2vdkazQS_5yz5S2qIdWTq_BsnvFjuhtzSS8S_j`
    return config
  },
  function (error) {
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
    // console.log(error)
    // 对响应错误做点什么
    // 对token过期进行统一的处理
    // console.log(error)
    // if (error.response.status === 401) {
    //   // 代表token过期了
    //   // 1. 删除token
    //   // removeToken()
    //   // 2. 给提示消息
    //   message.warn('登录信息过期了', 1)
    //   // 3. 跳转到登录页
    //   // 怎么跳转到登录？？？
    //   // 难点：在非组件中，，，我们是无法使用 Redirect  也无法访问到history对象
    //   // window.location.href = '/login'
    //   history.push('/home')
    // }
    // return error
    return Promise.reject(error)
  }
)

export default instance
