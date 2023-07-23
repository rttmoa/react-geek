import request from '@/utils/request'
import { getLocalChannels, hasToken, setLocalChannels } from '@/utils/storage'
import {  Channel,  HomeAction,  ArticlePayload,  MoreAction  } from '../reducers/home'
import { RootThunkAction } from '..' // RootThunkAction: 异步的函数指定返回类型





/** #### 获取用户的频道  */
export const getUserChannels = (): RootThunkAction => { // RootThunkAction: 异步的函数指定返回类型
  return async (dispatch) => {
    // 1. 判断用户是否登录
    if (hasToken()) {
      const res = await request.get('/user/channels')
      dispatch(saveUserChannels(res.data.channels))  
    } else {
      // 2. 没有token,从本地获取频道数据
      const channels = getLocalChannels()
      if (channels) {
        // 没有token，但本地有channels数据
        dispatch(saveUserChannels(channels))
      } else {
        // 没有token, 且本地没有channels数据
        const res = await request.get('/user/channels')
        dispatch(saveUserChannels(res.data.channels))
        // 保存到本地
        setLocalChannels(res.data.channels)
      }
    }
  }
}

/** #### TODO: 保存用户频道到redux  */
export const saveUserChannels = (payload: Channel[]): HomeAction => {// 返回要有提示、指定返回的类型 HomeAction
  return {
    type: 'home/saveChannels',
    payload,
  }
}

/** #### 获取所有频道  */
export const getAllChannels = (): RootThunkAction => {
  return async (dispatch) => {
    const res = await request.get('/channels')
    dispatch(saveAllChannels(res.data.channels)) 
  }
}

/** #### TODO: 保存所有频道  */
export const saveAllChannels = (payload: Channel[]): HomeAction => {
  return {
    type: 'home/saveAllChannels',
    payload,
  }
}

/** #### 删除频道  */
export const delChannel = (channel: Channel): RootThunkAction => {
  //原： return async (dispatch: Dispatch, getState: () => RootState){}
  return async (dispatch, getState) => {
    // 如果用户登录，需要发送请求删除频道
    // 如果用户没有登录，需要删除本地中的这个频道
    // 不管登录没登录，都需要修改redux中的频道
    const userChannels = getState().home.userChannels
    if (hasToken()) {
      // 发送请求
      await request.delete('/user/channels/' + channel.id) 
      dispatch(saveUserChannels(userChannels.filter((item) => item.id !== channel.id)))
    } else {
      // 没有登录
      // 修改本地，修改redux
      const result = userChannels.filter((item) => item.id !== channel.id)
      setLocalChannels(result)
      dispatch(saveUserChannels(result))
    }
  }
}

/** #### 添加频道  */
export const addChannel = (channel: Channel): RootThunkAction => {
  return async (dispatch, getState) => {
    const channels = [...getState().home.userChannels, channel]
    if (hasToken()) {
      // 发请求添加
      await request.patch('/user/channels', { channels: [channel] })
      dispatch(saveUserChannels(channels))
    } else {
      // 保存用户频道到redux + 保存频道数据到Localstoreage
      dispatch(saveUserChannels(channels))
      setLocalChannels(channels)
    }
  }
}

/** #### 获取文章列表数据  */
export const getArticleList = (channelId: number, timestamp: string): RootThunkAction => {
  return async (dispatch) => {
    const res = await request({
      method: 'get',
      url: '/articles',
      params: {
        timestamp: timestamp,
        channel_id: channelId,
      },
    })
    dispatch(
      setArticleList({
        channelId,
        timestamp: res.data.pre_timestamp,
        list: res.data.results,
      })
    )
  }
}

/** #### 加载更多文章列表数据 （更多文章数据）  */
export const getMoreArticleList = (channelId: number, timestamp: string): RootThunkAction => {
  return async (dispatch) => {
    const res = await request({
      method: 'get',
      url: '/articles',
      params: {
        timestamp: timestamp,
        channel_id: channelId,
      },
    })
    dispatch(
      setMoreArticleList({
        channelId,
        timestamp: res.data.pre_timestamp,
        list: res.data.results,
      })
    )
  }
}

/** #### 文章数据 （reducer）  */
export const setArticleList = (payload: ArticlePayload): HomeAction => {
  return {
    type: 'home/saveArticleList',
    payload,
  }
}

/** #### 更多文章数据 （reducer）  */
export const setMoreArticleList = (payload: ArticlePayload): HomeAction => {
  return {
    type: 'home/saveMoreArticleList',
    payload,
  }
}

/** #### 设置更多 （reducer）  */
export const setMoreAction = (payload: MoreAction): HomeAction => {
  return {
    type: 'home/setMoreAction',
    payload,
  }
}


/** #### 不感兴趣 文章 （action） <MoreAction />  */
export const unLinkArticle = (articleId: string): RootThunkAction => {
  return async (dispatch, getState) => {
    await request({
      method: 'post',
      url: '/article/dislikes',
      data: {
        target: articleId,
      },
    })
    // 把当前频道对应的文章删除
    const channelId = getState().home.moreAction.channelId
    const articles = getState().home.articles[channelId]
    // console.log(articles)
    dispatch(
      setArticleList({
        channelId,
        timestamp: articles.timestamp,
        list: articles.list.filter((item) => item.art_id !== articleId),
      })
    )
  }
}


/** #### 举报文章接口 传参类型和返回类型 （action） <MoreAction />  */
export const reportArticle = (articleId: string, reportId: number): RootThunkAction => {
  return async (dispatch, getState) => {
    await request({
      method: 'post',
      url: '/article/reports',
      data: {
        target: articleId,
        type: reportId,
      },
    })
    // 把当前频道对应的文章删除
    const channelId = getState().home.moreAction.channelId
    const articles = getState().home.articles[channelId]
    // console.log(articles)
    dispatch(
      setArticleList({
        channelId,
        timestamp: articles.timestamp,
        list: articles.list.filter((item) => item.art_id !== articleId),
      })
    )
  }
}
