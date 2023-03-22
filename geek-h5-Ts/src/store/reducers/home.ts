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

const initValue: HomeType = {// 是否 as HomeType 查看返回类型
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
/**--- 返回的类型从F12控制台的 redux中获取具体的返回类型 - 查看 ---**/
export default function reducer(state = initValue, action: HomeAction) {
  // const { type, payload } = action  // 如果不用解构 那么直接用action点 并且查看返回类型
  switch (action.type) {
    case 'home/saveChannels':
      return {
        ...state,
        userChannels: action.payload,
      }
    case 'home/saveAllChannels':
      return {
        ...state,
        allChannels: action.payload,
      }
    case 'home/saveArticleList':
      const { list, timestamp, channelId } = action.payload

      return {
        ...state,
        articles: {
          ...state.articles,
          [channelId]: {
            timestamp: timestamp,
            // 如果是loadMore，追加数据，否则，覆盖数据
            list: list,
          },
        },
      }
    case 'home/saveMoreArticleList':
      // const oldList = state.articles[action.payload.channelId].list  // const oldList: Ariticle[]
      return {
        ...state,
        articles: {
          ...state.articles,
          [action.payload.channelId]: {
            timestamp: action.payload.timestamp,
            list: [
              ...state.articles[action.payload.channelId].list,
              ...action.payload.list,
            ],
          },
        },
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
