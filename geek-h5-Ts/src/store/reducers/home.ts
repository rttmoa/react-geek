export type Channel = {
  id: number
  name: string
}

export type MoreAction = {
  visible: boolean
  articleId: string
  channelId: number
}

export type Ariticle = {
  art_id: string
  title: string
  aut_id: string
  aut_name: string
  comm_count: string
  pubdate: string
  cover: {
    type: string
    images: string[]
  }
}

export type Articles = {
  [index: number]: {
    timestamp: string
    list: Ariticle[]
  }
}
type HomeType = {
  userChannels: Channel[]
  allChannels: Channel[]
  moreAction: MoreAction
  articles: Articles
}

export type ArticlePayload = {
  channelId: number
  timestamp: string
  list: Ariticle[]
}

const initValue: HomeType = { // 是否 as HomeType 查看返回类型
  userChannels: [],
  allChannels: [],
  // 存储所有的文章列表
  articles: {},
  moreAction: {
    visible: false,
    articleId: '',
    channelId: -1, // -1表示空 没有具体的一个频道
  },
} as HomeType

export type HomeAction =
  | {
      type: 'home/saveChannels'
      payload: Channel[]
    }
  | {
      type: 'home/saveAllChannels'
      payload: Channel[]
    }
  | {
      type: 'home/saveArticleList'
      payload: ArticlePayload
    }
  | {
      type: 'home/saveMoreArticleList'
      payload: ArticlePayload
    }
  | {
      type: 'home/setMoreAction'
      payload: MoreAction
    }

    
/** #### 控制台中 [redux] 查看所有state  */
export default function reducer(state = initValue, action: HomeAction) {
  // const { type, payload } = action  // 如果不用解构 那么直接用action点 并且查看返回类型

  switch (action.type) {
    // 保存 用户频道
    case 'home/saveChannels':
      return {
        ...state,
        userChannels: action.payload, // userChannels: Channel[]
      }
    // 保存 所有频道
    case 'home/saveAllChannels': {
      return {
        ...state,
        allChannels: action.payload,  // allChannels: Channel[]
      }
    } 
    // 存储文章数据 (存储频道的可视数据)
    case 'home/saveArticleList': {
      const { list, timestamp, channelId } = action.payload;
      // action.payload: {channelId: 4, timestamp: '1689215627278', list: Array(10)}
      // console.log('state.articles', state['articles'])
      return {
        ...state,
        // articles: { [x: number]: { timestamp: string; list: Ariticle[] } }
        articles: {
          ...state.articles,
          [channelId]: {
            timestamp: timestamp,
            // 如果是loadMore，追加数据，否则，覆盖数据
            list: list,
          },
        },
      }
    } 
    // 获取更多文章数据 (存储频道下拉加载的数据)
    case 'home/saveMoreArticleList': {
      // const oldList = state.articles[action.payload.channelId].list  // const oldList: Ariticle[]
      // action.payload: {channelId: 6, timestamp: '1687765986204', list: Array(10)}
      const { list, timestamp, channelId } = action.payload;
      return {
        ...state,
        articles: {
          ...state.articles,
          // 获取article[channelId]频道，再获取article[channelId].list, 再像频道中追加加载的新数据
          [channelId]: {
            timestamp: timestamp,
            list: [
              ...state.articles[channelId].list, 
              ...list,  
            ],
          },
        },
      }
    } 
    case 'home/setMoreAction': {
      return {
        ...state,
        moreAction: action.payload,
      }
    }
    default:
      return state
  }
}
