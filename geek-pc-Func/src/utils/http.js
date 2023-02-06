import axios from 'axios'
import { getToken, clearToken, history } from '@/utils'

const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})

http.interceptors.request.use(config => {
  // if not login add token
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error?.response?.status === 401) {
      // // 删除token
      clearToken()
      // 跳转到登录页
      history.replace('/login')
    }
    return Promise.reject(error)
  }
)

export { http }