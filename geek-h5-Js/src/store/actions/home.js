import { http } from '@/utils'
import differenceBy from 'lodash/differenceBy'


/**TODO: 用户频道数据 */
const getUser = channels => ({ type: 'home/channel', payload: channels })

/**TODO: 推荐频道 */
const getRecommend = channels => ({ type: 'home/recommend', payload: channels })

const setMoreAction = ({ id, visible }) => ({ type: 'home/more_action', payload: { id, visible } })

/**注释: 获取频道数据 */
const getUserChannel = () => {
  return async dispatch => {
    try {
      const res = await http.get('/user/channels')
      const { channels } = res.data.data;
      // console.log(channels)
      const newChannels = channels.map(item => ({
        id: item.id,
        title: item.name
      }))
      // console.log(newChannels) // {id: 0, name: '推荐'} ==> {id: 0, title: '推荐'}
      
      dispatch(getUser(newChannels))
    } catch(e){} 
  }
}

/**注释: 
 * 获取所有频道中排除用户自己的频道数据 (newChannels推荐频道) 
 * @param {Array} userChannles 用户频道
 * @returns thunk  
 */
const getRecommendChannel = userChannles => {
  return async dispatch => {
      const res = await http.get('/channels')
      // 所有的频道数据25个
      let { channels } = res.data.data; 
      channels = channels.map(item => ({ id: item.id, title: item.name }))
      // 去掉我的频道中已有项(推荐频道)
      const newChannels = differenceBy(channels, userChannles, 'id')//TODO: newChannels过滤的是 推荐频道中的数据  如果都添加到我的频道  newChannels为[]
      // console.log(newChannels)
      dispatch(getRecommend(newChannels))
  }
}





/**注释:  
 * 删除频道   
 * @params {Object} deleteChannel 要删除的频道数据   
 * @params {boolean} isLogin 是否登录 
 * @returns thunk 
 */
const deleteChannel = (deleteChannel, isLogin) => {
  return async (dispatch, getState) => {
    // 如果用户登录， 需要发送请求删除频道
    // 如果用户没有登录， 需要删除本地的这个频道
    // 不管登录还是没登录 都要删除redux中的频道
    if (isLogin) { await http.delete(`/user/channels/${deleteChannel.id}`) }

    // 这里表示有没有登录 都要删除redux里面的数据
    // getState可以拿到所有的redux数据  属性有 home/login/profile
    const { home } = getState()
    const channelsList = home.recommendChannel
    // console.log(1, [...channelsList, deleteChannel])

    const newChannels = [...channelsList, deleteChannel].sort((a, b) => { // sort 排序、根据id排序
      return a.id - b.id
    })
    // console.log(2, newChannels)
    dispatch(getRecommend(newChannels))
  }
}





/**  
 * 添加频道 
 * @param {Object} addChannel 用户频道要添加的频道数据
 * @param {Boolean} isLogin 是否登录 
 * @returns thunk 
 */
const addChannel = (addChannel, isLogin) => {
  return async (dispatch, getState) => {
    // 1.登录的就发请求去添加  ?  没有登录的添加到本地就可以
    if (isLogin) { 
      try{
        await http.patch('/user/channels', { channels: addChannel }) 
      }catch(e){}
    }

    // 2.保存数据到redux中 和 localStoreage中
    // 有token往redux中存一份  没有token往redux存一份  本地存一份
    const { home } = getState()
    const channelsList = home.recommendChannel
    const newChannels = channelsList.filter(item => item.id !== addChannel.id) // 推荐频道中过滤掉选择的那个频道 - 然后存到redux
    dispatch(getRecommend(newChannels))
  }
}



export {
  getUserChannel,
  getUser,
  getRecommendChannel,
  deleteChannel,
  addChannel,
  setMoreAction
}
