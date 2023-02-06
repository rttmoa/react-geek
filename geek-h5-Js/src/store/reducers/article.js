const initialState = {
  isLoading: true,
  info: {},
  comment: {
    results: []
  },
  isCommentLoading: true
}

const article = (state = initialState, action) => {
  switch (action.type) {
    case 'article/pengding'://TODOS：点击进入文章, 文章先加载再发请求
    // console.log(action)
      return { ...state, isLoading: true }

    case 'article/success'://TODOS: 发请求存数据， 成功的数据存储到payload
      return { ...state, info: action.payload, isLoading: false }

    case 'article/set_info'://TODOS：更新数据, 设置更改文章的数据(点赞/收藏/关注)
      const partialInfo = action.payload
      return {
        ...state,
        info: {
          ...state.info,
          ...partialInfo
        }
      }
    case 'article/commeng_loading'://TODOS: 点击进入文章, 评论先加载再发起请求
      return { ...state, isCommentLoading: true  }

    case 'article/comment'://TODOS：发请求存数据， 成功的数据存储到payload
      return {
        ...state,
        isCommentLoading: false,
        comment: {
          ...action.payload,
          results: action.payload.results
        }
      }

    case 'article/comment_more'://TODOS 猜测 回复评论?
      return {
        ...state,
        isCommentLoading: false,
        comment: {
          ...action.payload,
          results: [...state.comment.results, ...action.payload.results]
        }
      }

    case 'article/set_comment'://TODOS：评论点赞/取消评论点赞
      const commentPartial = action.payload
      return {
        ...state,
        comment: {
          ...state.comment,
          ...commentPartial
        }
      }
    default:
      return state
  }
}

export { article }
