type Detail = {
  art_id: string
  title: string
  pubdate: string
  aut_id: string
  content: string
  aut_name: string
  aut_photo: string
  is_followed: boolean
  is_collected: boolean
  attitude: number
  comm_count: number
  read_count: number
  like_count: number
}

type ArticleType = {
  detail: Detail
  comment: CommentType
}

export type Comment = {
  aut_id: string
  aut_name: string
  aut_photo: string
  com_id: string
  content: string
  is_followed: boolean
  is_liking: boolean
  like_count: number
  pubdate: string
  reply_count: number
}

type CommentType = {
  end_id: string
  last_id: string
  total_count: number
  results: Comment[]
}

const initValue: ArticleType = {
  // 文章详情信息
  detail: {},
  // 评论信息
  comment: {},
} as ArticleType

export type ArticleAction =
  | {
      type: 'artcile/saveDetail'
      payload: Detail
    }
  | {
      type: 'article/saveComment'
      payload: CommentType
    }
  | {
      type: 'article/saveMoreComment'
      payload: CommentType
    }
  | {
      type: 'article/saveNewComment'
      payload: Comment
    }
  | {
      type: 'article/updateComment'
      payload: Comment
    }




export default function article(state = initValue, action: ArticleAction) { 

  if (action.type === 'artcile/saveDetail') { // 存储文章详情
    // TODO: 点赞，收藏，关注作者，添加评论后，会覆盖detail {}，重新刷新页面达到最新值
    return {
      ...state,
      detail: action.payload, // typeof detail: Detail {}
    }
  }

  if (action.type === 'article/saveComment') { // 存储文章评论
    return {
      ...state,
      comment: action.payload, // comment: CommentType
    }
  }

  if (action.type === 'article/saveMoreComment') { // 下拉更多评论
    // console.log('下拉更多评论', action.payload)
    return {
      ...state,
      comment: {
        ...action.payload, // 指的是 {end_id, last_id, total_count, results}
        results: [
          ...state.comment.results, // results累加 = state.comment[results] + payload[results]
          ...action.payload.results
        ],
      },
    }
  }

  if (action.type === 'article/saveNewComment') { // 评论成功 - 返回的新评论
    console.log('评论后的新数据', action.payload)
    console.log('state.comment', state.comment)
    return {
      ...state,
      comment: {
        ...state.comment,
        results: [
          action.payload, // 评论后，最新的数据显示到最顶部
          ...state.comment.results
        ],
      },
    }
  }

  if (action.type === 'article/updateComment') { // 更新新评论
    // 这里要的是 全部评论的数量
    return {
      ...state,
      comment: {
        ...state.comment,
        // 其他不变、只变results
        results: state.comment.results.map((item) => {
          if (item.com_id === action.payload.com_id) {
            return {
              ...action.payload, // 改掉这个评论、换成新的
            }
          } else {
            return item
          }
        }),
      },
    }
  }
  return state
}
