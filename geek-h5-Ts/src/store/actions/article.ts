import request from '@/utils/request'
import { RootThunkAction } from '..'
import { ArticleAction, Comment } from '../reducers/article'



/** #### 获取文章详情数据 （action + reducer）  */
export function getArticleDetail(id: string): RootThunkAction {  // 点赞，收藏，关注作者，添加评论，
  return async (dispatch) => {
    // 获取新闻详情 （ /v1_0/articles/:article_id）： http://geek.itheima.net/api.html
    const res = await request.get('/articles/' + id) 
    // FIXME: reducer
    dispatch({ type: 'artcile/saveDetail', payload: res.data })
  }
}

/** #### 获取文章的评论 （action + reducer）  */
export function getCommentList(id: string): RootThunkAction { 
  return async (dispatch) => {
    // 获取评论或评论回复 （/v1_0/comments）： http://geek.itheima.net/api.html
    const res = await request.get('/comments', {
      params: {
        type: 'a',
        source: id,
      },
    })
    // FIXME: 存储文章评论
    dispatch({ type: 'article/saveComment', payload: res.data })
  }
} 

/** #### 获取更多评论，下拉加载更多 （action）  */
export function getMoreCommentList( id: string, offset: string ): RootThunkAction {
  return async (dispatch) => {
    const res = await request.get('/comments', {
      params: {
        type: 'a',  // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复 
        source: id, // 源id，文章id或评论id
        offset,     // 获取评论数据的偏移量
      },
    })
    // FIXME: 存储回复评论 
    dispatch({ payload: res.data, type: 'article/saveMoreComment' })
  }
}

/** #### TODO: 点赞   MVVM模式   点赞之后重新获取数据  MVVM  */
export function likeAritcle(id: string, attitude: number): RootThunkAction {
  return async (dispatch) => {
    if (attitude === 1) {
      // 取消点赞
      await request.delete('/article/likings/' + id)
    } else {
      // 点赞
      await request.post('/article/likings', { target: id })
    }
    // 重新获取文章数据，使用状态管理重新渲染页面
    await dispatch(getArticleDetail(id))
  }
}

/** #### 收藏   MVVM模式   点赞之后重新获取数据  MVVM */
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
    // 重新获取文章数据，使用状态管理重新渲染页面
    await dispatch(getArticleDetail(id))
  }
}

/** #### 关注作者 / 取消关注作者  */
export function followUser( userId: string, is_follow: boolean): RootThunkAction {
  return async (dispatch, getState) => {
    // 参数： 作者ID，是否关注
    if (is_follow) await request.delete('/user/followings/' + userId); // 取消关注
    else await request.post('/user/followings', { target: userId })
    // 重新加载页面
    await dispatch(getArticleDetail(getState().article.detail.art_id)) 
  }
}


/** #### 添加评论  */
export function addComment(articleId: string, content: string): RootThunkAction {
  return async (dispatch, getState) => {
    const res = await request.post('/comments', {
      target: articleId,
      content,
    })
    // FIXME: 评论成功 - 返回的新评论
    dispatch({ type: 'article/saveNewComment', payload: res.data.new_obj })
    dispatch(getArticleDetail(getState().article.detail.art_id)) // 全部评论的数量, 重新拿一下文章数据 - 传递Id
  }
}

/** #### 更新评论 （reducer）  */
export function updateComment(comment: Comment): ArticleAction {
  // 更新某一个评论消息
  return {
    type: 'article/updateComment',
    payload: comment,
  }
}
