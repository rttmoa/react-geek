import request from '@/utils/request'
import { RootThunkAction } from '..'
import { ArticleAction, Comment } from '../reducers/article'



/**--- 获取文章详情数据 ---**/
export function getArticleDetail(id: string): RootThunkAction {
  return async (dispatch) => {
    const res = await request.get('/articles/' + id) 
    /**--- 先写reducers再写dispatch ---**/
    dispatch({
      type: 'artcile/saveDetail',
      payload: res.data,
    })
  }
}

/**--- 获取文章的评论 ---**/
export function getCommentList(id: string): RootThunkAction {
  // common接口地址：http://geek.itheima.net/api.html#u83b7u53d6u8bc4u8bbau6216u8bc4u8bbau56deu590d0a3ca20id3du83b7u53d6u8bc4u8bbau6216u8bc4u8bbau56deu590d3e203ca3e
  return async (dispatch) => {
    const res = await request.get('/comments', {
      params: {
        type: 'a',
        source: id,
      },
    })
    dispatch({
      type: 'article/saveComment',
      payload: res.data,
    })
  }
}
/**--- getCommentList和getMoreCommentList 的方法几乎相同， 一个是覆盖一个是新增 ---**/

// 获取文章的评论(获取更多评论)
export function getMoreCommentList( id: string, offset: string ): RootThunkAction {
  return async (dispatch) => {
    const res = await request.get('/comments', {
      params: {
        type: 'a',
        source: id,
        offset,
      },
    })
    dispatch({
      type: 'article/saveMoreComment',
      payload: res.data,
    })
  }
}

/**--- 点赞  -- MVVM   点赞之后重新获取数据  MVVM --- * */
export function likeAritcle(id: string, attitude: number): RootThunkAction {
  return async (dispatch) => {
    if (attitude === 1) {
      // 取消点赞
      await request.delete('/article/likings/' + id)
    } else {
      // 点赞
      await request.post('/article/likings', { target: id })
    }
    // 更新
    await dispatch(getArticleDetail(id))
  }
}

// 收藏
export function collectArticle( id: string, is_collected: boolean ): RootThunkAction {
  return async (dispatch) => {
    if (is_collected) {
      // 取消收藏
      await request.delete('/article/collections/' + id)
    } else {
      // 收藏
      await request.post('/article/collections', {
        target: id,
      })
    }
    await dispatch(getArticleDetail(id))
  }
}

export function followUser( userId: string, is_follow: boolean): RootThunkAction {
  return async (dispatch, getState) => {
    if (is_follow) {
      // 取消关注
      await request.delete('/user/followings/' + userId)
    } else {
      // 关注
      await request.post('/user/followings', {
        target: userId,
      })
    }
    await dispatch(getArticleDetail(getState().article.detail.art_id))
  }
}

/**--- 添加评论 ---**/
export function addComment(articleId: string,content: string): RootThunkAction {
  return async (dispatch, getState) => {
    const res = await request.post('/comments', {
      target: articleId,
      content,
    })
    dispatch({
      type: 'article/saveNewComment',
      payload: res.data.new_obj,// 评论成功 - 返回的新评论
    })
    dispatch(getArticleDetail(getState().article.detail.art_id))// 全部评论的数量, 重新拿一下文章数据 - 传递Id
  }
}



export function updateComment(comment: Comment): ArticleAction {/**--- 同步方法 ---**/
  // 更新某一个评论消息
  return {
    type: 'article/updateComment',
    payload: comment,
  }
}
