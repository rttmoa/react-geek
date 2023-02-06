export type User = {
  id: string
  name: string
  photo: string
  art_count: number
  follow_count: number
  fans_count: number
  like_count: number
}

export type Profile = {
  id: string
  photo: string
  name: string
  mobile: string
  gender: number
  birthday: string
}

type InitType = {// 指定类型
  user: User
  profile: Profile
}
// type ProfileAction = { type: 'profile/user'| 'profile/profile', payload: User | Profile}
export type ProfileAction =
  | {
      type: 'profile/user'
      payload: User
    }
  | {
      type: 'profile/profile'
      payload: Profile
    }

const initValue: InitType = { 
  user: {},
  profile: {},
} as InitType // 指定类型

// 原initValue
// const initValue = {
//   user: {},
//   profile: {},
// }

/** 
 * 处理个人信息的reducer
 * @param {*} state
 * @param {*} action
 * @returns
 */
export default function reducer(state = initValue, action: ProfileAction) {
  // state.profile.birthday 可以 . 出来上面的类型
  // const { type, payload } = action
  // if(type === 'profile/user'){
  //   return {
  //     ...state,
  //     user: payload,
  //   }
  // }
  // if(type === 'profile/profile'){
  //   return {
  //     ...state,
  //     Profile: payload
  //   }
  // }
  
  
  
   
  
  if (action.type === 'profile/user') {
    return {
      ...state,// state: InitType
      user: action.payload,// payload: User
    }
  }
  if (action.type === 'profile/profile') {
    return {
      ...state,
      profile: action.payload,
    }
  }
  return state
}
