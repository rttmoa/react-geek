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
  if (action.type === 'artcile/saveDetail') {
    return {
      ...state,
      detail: action.payload, // payload的返回类型： payload: Detail
    }
  }
  if (action.type === 'article/saveComment') {
    return {
      ...state,
      comment: action.payload,// 这个是直接覆盖
    }
  }
  if (action.type === 'article/saveMoreComment') {
    return {
      ...state,
      comment: {// 这个是拼接
        ...action.payload,
        results: [...state.comment.results, ...action.payload.results],// results 里面:  [原来的数据, 发请求得到的数据]
      },
    }
  }
  if (action.type === 'article/saveNewComment') {
    // console.log(action.payload)
    return {
      ...state,
      comment: {
        ...state.comment,
        results: [action.payload, ...state.comment.results],// 表示追加一条评论
      },
    }
  }

  if (action.type === 'article/updateComment') {
    // 这里要的是 全部评论的数量
    return {
      ...state,
      comment: {
        ...state.comment,
        // 其他不变、只变results
        results: state.comment.results.map((item) => {
          if (item.com_id === action.payload.com_id) {
            return {
              ...action.payload,//改掉这个评论、换成新的
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
