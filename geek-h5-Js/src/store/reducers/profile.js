const initialState = {
  user: {},//TODOS: 个人中心信息的数据
  userProfile: {}//TODOS: 编辑页面中的用户信息
}

const profile = (state = initialState, action) => {
  // const { type, payload } = action 
  // console.log('state', state) // 这是个人信息的 state
  switch (action.type) {
    case 'profile/user':
      return { ...state, user: { ...action.payload } }  //----> ...state是初始的user和userProfile   ...action.payload是Profile主页的数据

    case 'profile/profile':
      return { ...state, userProfile: { ...action.payload } }

    case 'profile/update':
      const { name, value } = action.payload;
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          [name]: value  // 这里Test文件夹中有示例
        }
      }
    default:
      return state
  }
}

export { profile }
