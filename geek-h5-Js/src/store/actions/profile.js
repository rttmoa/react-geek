import { http } from '@/utils'

/**TODO: redux存储 */
// 我的
const setUser = userInfo => ({ type: 'profile/user', payload: userInfo }) //-->对象格式  属性为Profile主页的数据
// 个人资料
const setUserProfile = userProfile => ({ type: 'profile/profile', payload: userProfile })

// 修改 昵称、简介、生日、性别 个人资料信息
const updateUserProfile = (name, value) => ({ type: 'profile/update', payload: { name, value } })



/**获取用户主页信息   */
const getProfile = () => {
  return async dispatch => {
      const res = await http.get('/user') //获取用户信息属性：art_count, fans_count, id, intro, name, photo   
      dispatch(setUser(res.data.data))
  }
}

/**获取用户个人资料  */
const getUserProfile = () => {
  return async dispatch => {
      const res = await http.get('/user/profile')//获取用户个人资料信息: birthday, gender, id, intro, name, mobile, photo
      dispatch(setUserProfile(res.data.data))
  }
}

/**修改 昵称、简介、生日、性别 个人资料信息    */
const updateProfile = (name, value) => {
  return async dispatch => {
    // 在这里给后台传递的格式为 {gender: '0/1'}, {name: '昵称'}, {intro: '简介'}
    const res = await http.patch('/user/profile', {   [name]: value  }) // 让值变为属性名
    // console.log(res) // 查看参数
    res.data.message === 'OK' &&  dispatch(updateUserProfile(name, value))   //代替 if() {} 格式   表示res为true, 就渲染dispatch
  }
}

/**--- 更新头像 ---**/
const updateAvatar = formData => {
  // return
  return async dispatch => {
    // console.log(formData)
    const res = await http.patch('/user/photo', formData, {  headers: { 'Content-Type': 'multipart/form-data'  } })
    const { photo } = res.data.data;
    // console.log(photo)
    dispatch(updateUserProfile('photo', photo))   //-----> data: {photo: 'http://toutiao.itheima.net/uploads/1657022985170.jpg'}
  }
}


export { getProfile, getUserProfile, updateProfile, updateAvatar }