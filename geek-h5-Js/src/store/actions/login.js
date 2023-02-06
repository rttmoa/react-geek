import { http, removeTokens, setTokens } from '@/utils'   //utils下的indexjs

/**TODO: redux存储 */
const saveToken = tokens => ({ type: 'login/token', payload: tokens })

const sendSms = mobile => {
  // return async (dispatch) => { const res = await request({url: '/sms/mobile'+mobile, method: 'get'})}   300-视频中
  // 返回值中不传 dispatch => 因为不用存储到本地和redux中
  return () => http.get(`/sms/codes/${mobile}`);
}

const login = ({mobile, code}) => {
  return async dispatch => {
    const res = await http.post('/authorizations', {mobile, code}) ///--------->   {mobile: '13900001111', code: '246810'}
    // console.log(res.data.data)///--------->  {token: '6df8bbbc-1036-41df-a6a4-891b5792029c', refresh_token: '7184d0b5-cb74-4119-ad1d-3221e77280bf'}

    dispatch(saveToken(res.data.data))
    setTokens(res.data.data)
  }
}

const logout = () => {
  return () => {
    removeTokens()
  }
}

export { saveToken }
export { sendSms, login, logout }