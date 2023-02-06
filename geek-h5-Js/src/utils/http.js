import { Toast } from 'antd-mobile'
import axios from 'axios'
import { history } from './history'
import { getTokens, removeTokens, setTokens } from './token'


const http = axios.create({
  baseURL: 'http://toutiao.itheima.net/v1_0'   // baseURL: 'http://geek.itheima.net/v1_0'
})
// console.log(http)

// 配置请求, 响应拦截器
// 请求拦截器
http.interceptors.request.use(config => {//->成功的函数config, 错误信息
  // console.log(config)///--------->   {url: '/user/channels', method: 'get', headers: {…}, baseURL: 'http://toutiao.itheima.net/v1_0',  …}
  // if (config.method === 'post') { config.headers['Content-Type'] = 'application/json' }
  
  // config.headers.Authorization = 'Bearer' + token;
  config.headers['Authorization'] = `Bearer ${getTokens().token}`
  
  return config
},(error) => { return Promise.reject(error) } )


// 响应拦截器
http.interceptors.response.use(response => {
  // console.log(response)///--------->   {data: {data: {…}, message: 'OK'}, config: {…请求的参数}, status: 200, statusText: 'OK', headers: {…},  …}
  // debugger;
  return response

}, async error => {//如果有错误, 返回Promise
  // 错误问题汇总==>
  // 如果没有response
  // 如果有response 但是状态码不为401
  // 如果有response 但是状态码不为401 但是没有刷新token (跳到登录页 重新登录)
  // 是401错误， 且有刷新token， 刷新token
  // 尝试发请求， 获取新的token

  console.error('error', error.response)
 

   // 网络没有问题 后台返回了有数据
   if (error.response.status === 401) {
    const { token, refresh_token } = getTokens()
    // debugger;

      if (!token || !refresh_token) { //表示没有token或者没有refresh_token
        history.replace('/login', {
          from: history.location.pathname || '/home'
        })
        return Promise.reject(error)
      }

        try {
          // 自动刷新 token
          const res = await http.put('/authorizations', null, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Bearer ${refresh_token}`
            }
          })
          console.log('自动刷新token iS', res)

          // 把新的 token 保存起来   1.保存到redux中 & 保存到localstorage中
          setTokens({
            refresh_token,  //---- refresh_token ==== refresh_token: refresh_token
            token: res.data.data.token   //---原生的 axios 发的请求  两层data
          })

          // 继续发送刚才错误的请求      <无感刷新token  token刷新成功后，重新把最开始的失败的请求重新发一次 >
          return http(error.config)//返回 AxiosPromise  return
          // http要的数据为：  http({url:'', data: { } }})   config就是一个对象

          
        } catch (error) {
          // 失败，说明 refresh_token 失效了
          console.log(error.response)
          console.log(history.location.pathname)

          removeTokens()
          history.push('/login', {
            from: history.location.pathname || '/home'
          })
          Toast.info('登录信息失效！ 请重新登录', 1)
          return Promise.reject(error)
        }
  }

  return Promise.reject(error)
})

export { http }
