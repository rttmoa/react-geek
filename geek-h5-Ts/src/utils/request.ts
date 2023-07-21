import { Toast } from 'antd-mobile'
import axios from 'axios'
import { getTokenInfo, removeTokenInfo, setTokenInfo } from './storage'
import history from './history'
import store from '@/store'
import { logout, saveToken } from '@/store/actions/login'
import { AxiosError } from 'axios'



const baseURL = 'http://geek.itheima.net/v1_0/'
const instance = axios.create({
  timeout: 5000,
  baseURL,
})

// 配置拦截器
instance.interceptors.request.use((config) => { 
    const token = getTokenInfo().token
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  }, (error: AxiosError<{ message: string }>) => {
    return Promise.reject(error); 
  }
)

// 配置响应拦截器
instance.interceptors.response.use((response) => {
    return response.data
  },
  // AxiosError<类型参数> 类型参数用于指定 data的类型
  async (err: AxiosError<{ message: string }>) => {
    // 如果因为网络原因，response没有，给提示消息
    if (!err.response) {
      Toast.info('网络繁忙，请稍后重试', .5)
      return Promise.reject(err)
    }

    const { response, config } = err
    // console.log(config)
    // 网络没问题，后台返回了有数据
    if (response.status !== 401) {
      // 不是token失效的问题
      Toast.info(response.data.message, .5) 
      return Promise.reject(err)
    }

    // 网络没问题，且是401 token失效的问题
    // 1. 判断有没有刷新token
    const { refresh_token } = getTokenInfo()
    if (!refresh_token) {
      // 没有token
      // 跳转到登录页
      history.replace({
        pathname: '/login',
        state: {
          from: history.location.pathname,
        },
      })
      return Promise.reject(err)
    }

    // 是401错误，且有刷新token
    // 尝试发请求，获取新的token, 注意：刷新token发送请求，不能使用封装的instance
    try {
      const res = await axios({
        method: 'put',
        url: baseURL + 'authorizations',
        headers: {
          Authorization: 'Bearer ' + refresh_token,
        },
      })
      // debugger
      // 刷新成功
      // 把新的token保存起来
      const tokenInfo = {
        token: res.data.data.token,
        refresh_token: refresh_token,
      }
      // store.dispatch({ type: 'login/token', payload: tokenInfo})
      store.dispatch(saveToken(tokenInfo))
      setTokenInfo(tokenInfo)

      // token刷新成功后，重新把最开始失败的请求重新发一次
      return instance(config)
    } catch {
      // 刷新token失败, 刷新token过期
      // store.dispatch 类型就是 Dispath,,,要求参数必须有type才行
      // 移除本地的token
      removeTokenInfo()
      store.dispatch(
        logout({
          token: '',
          refresh_token: '',
        })
      )
      // 跳转到登录页
      history.replace({
        pathname: '/login',
        state: {
          from: history.location.pathname,
        },
      })
      Toast.info('登录信息失效，请重新登录', .5)
      return Promise.reject(err)
    }
  }
)

export default instance;
