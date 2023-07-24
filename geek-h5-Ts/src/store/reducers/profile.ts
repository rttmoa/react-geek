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

type InitType = { 
  user: User
  profile: Profile
}
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


/** 
 * 处理个人信息的reducer
 * @param {*} state
 * @param {*} action
 * @returns
 */
export default function reducer(state = initValue, action: ProfileAction) { 
  // state.profile.birthday 可以 . 出来上面的类型
  // console.log(state.profile.birthday)
  if (action.type === 'profile/user') {
    // action.payload: {id: '1111', name: '黑马程序员(改不了)', photo: 'http://ge323780.jpg', intro: 'kkkk', art_count: 4714, …}
    return {
      ...state, // state: InitType
      user: action.payload, // payload: User {}
    }
  }
  if (action.type === 'profile/profile') {
    // action.payload: {id: '111', photo: 'ht6.jpg', name: '黑马程序员(改不了)', intro: "存储个人信息 payload", gender: 1, …} 
    return {
      ...state,
      profile: action.payload, // typeof profile: {}
    }
  }
  return state
}
