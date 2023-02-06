type Token = {
  token: string
  refresh_token: string
}

export type LoginAction = {
  type: 'login/token' | 'login/logout'
  payload: Token
}

const initValue: Token = {
  token: '',
  refresh_token: '',
}

export default function reducer(state = initValue, action: LoginAction) {
  const { type, payload } = action
  if (type === 'login/token') {
    return payload
  }
  if (type === 'login/logout') {
    // 指定断言为Token类型才行、才能在indexts中getTokenInfo()赋值给login、否则store->indexts->login报错  login: getTokenInfo(),
    return {} as Token   
  }
  return state
} 