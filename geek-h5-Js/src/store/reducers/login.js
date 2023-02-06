// redux中存储 初始值 token和refresh_token
const initialState = {
  token: '',
  refresh_token: ''
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'login/token':
      return { ...action.payload }
    case 'login/logout': 
      return { ...action.payload }
    default:
      return state
  }
}

export { login }