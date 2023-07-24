import http from '@/utils/request'
import { User, Profile, ProfileAction } from '../reducers/profile'
import { RootThunkAction } from '..'


// FIXME: 保存用户信息 reducers
export const saveUser = (payload: User): ProfileAction => {/**--- actionCreator: 创建action  必须要符合 ProfileAction类型 ---**/
  // console.log(payload) // {id: '1111', name: '黑马程序员(改不了)', photo: 'http://ge323780.jpg', intro: 'kkkk', art_count: 4714, …}
  return {
    type: 'profile/user',
    payload: payload,
  }
}

/** #### 获取用户信息 （action） ---*/
export const getUser = (): RootThunkAction => {
  return async (dispatch) => {
    const res = await http.get('/user')
    dispatch(saveUser(res.data))
  }
}

// FIXME: 存储个人信息 reducers
export const saveProfile = (payload: Profile): ProfileAction => { 
  // console.log(payload) // {id: '111', photo: 'ht6.jpg', name: '黑马程序员(改不了)', intro: "存储个人信息 payload", gender: 1, …} 
  return {
    type: 'profile/profile',
    payload,
  }
}

/** #### 获取用户个人信息+存储redux ---*/
export const getProfile = (): RootThunkAction => {
  return async (dispatch) => {
    const res = await http.get('/user/profile')
    dispatch(saveProfile(res.data))
  }
}

// 返回一个全部属性变成可选的类型
type PartialProfile = Partial<Profile>


// dispatch: Dispatch类型，，，参数必须符合Action类型 {type: T}
/** #### 修改用户的信息+重新获取用户信息 （action） ---*/
export const updateProfile = (data: PartialProfile): RootThunkAction => { // 修改的Profile是可选的
  return async (dispatch) => {
    await http.patch('/user/profile', data)
    dispatch(getProfile())
  }
}

// FormData是DOM中提供的 不需要导入
/** #### 更新用户头像+重新获取用户信息 （action） ---*/
export const updatePhoto = (fd: FormData): RootThunkAction => {
  return async (dispatch) => {
    await http.patch('/user/photo', fd)
    dispatch(getProfile())
  }
}