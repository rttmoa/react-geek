import request from '@/utils/request'
import { setTokenInfo } from '@/utils/storage'
import { Dispatch } from 'redux'
import { LoginAction } from '../reducers/login'


type Token = {
  token: string
  refresh_token: string
}

/** #### 发送验证码 （Get请求, action） */
export const sendCode = (mobile: string) => {
  return async () => {
    // 发送请求
    await request({
      url: '/sms/codes/' + mobile,
      method: 'get',
    })
  }
} 

// actionCreator
// utils报错 store.dispatch(saveToken(tokenInfo)) 返回值type:string 错误
// 把type推断为string类型 string类型无法给常量类型赋值、所以报错
// 解决一、指定返回类型LoginAction，不用推断返回类型，直接指定返回类型
// 解决二、type:'login/token' as const , 告诉他type是常量
export const saveToken = (payload: Token): LoginAction  => { //　这里指定类型才会有提示、否则不会有提示功能　
  return {
    // type: 'login/token',  
    type: 'login/token' as const,
    payload
  }
}

/**
 * 登录功能
 * @param {*} data
 * @returns
 */
export const login = (data: { mobile: string; code: string }) => {
  // dispatch发送的action必须要有type属性，，，以及任意的其他属性
  return async (dispatch: Dispatch) => {
    const res = await request({ method: 'post', url: '/authorizations', data })
    // 保存token到redux中
    dispatch(saveToken(res.data))
    // 保存到本地
    setTokenInfo(res.data)
  }
}

/** #### TODO: 退出 （reducer） ---*/
export const logout = (payload: Token) => {
  return {
    type: 'login/logout' as const,
    payload,
  }
}
