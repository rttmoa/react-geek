import Icon from '@/components/Icon'
import NavBar from '@/components/NavBar'
import NoneComment from '@/components/NoneComment'
import Sticky from '@/components/Sticky'

import {
  deleteCollection, deleteCommentLiking, deleteFollow, deleteLiking, getArticleInfo, getCommentList, 
  getMoreComment, setComment, setInfo, updateCollection, updateCommentLiking, updateFollow, updateLiking 
} from '@/store/actions'

import { Drawer } from 'antd-mobile'
import classNames from 'classnames'
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
import throttle from 'lodash/fp/throttle';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ContentLoader from 'react-content-loader'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import CommentFooter from './components/CommentFooter'
import CommentInput from './components/CommentInput'
import CommentItem from './components/CommentItem'
import Reply from './components/Reply'
import Share from './components/Share'

import styles from './index.module.scss'





const useScroll = ( handleScroll = () => {}, {container, placeholder, isFinished = () => false,offset = 300,stop = false} ) => {
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)

  const onScroll = useMemo(
    () =>
      throttle(200, async () => {
        if (finished) return

        const { bottom: scrollBottom } = container.getBoundingClientRect()
        const { bottom: placehoderBottom } = placeholder.getBoundingClientRect()
        if (placehoderBottom - scrollBottom <= offset) {
          setLoading(true)
          await handleScroll()
          setLoading(false)
          setFinished(isFinished())
        }
      }),
    [handleScroll, placeholder, container, offset, finished, isFinished]
  )

  useEffect(() => {
    if (!container || !placeholder) return
    if (stop) return

    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [container, placeholder, onScroll, stop])

  return { loading, finished }
}







/**
 * FIXME: 文章组件
 * 
 */
const Article = () => {
  const dispatch = useDispatch()
  const { isLoading: isArticleLoading, info: articleDetail, comment: articleComment, isCommentLoading  } = useSelector(state => state.article)
  // console.log(articleDetail)//{art_id: '7262', title: '设计一个基于vue.js 2.x的虚拟滚动条', pubdate: '2019-03-11 09:00:00', aut_id: '1111', content: ', …}
  // console.log(articleComment)//{total_count: 2, end_id: 'f6b7352-f014d6374ac0', last_id: 'f6b7352f-a6-f014d6374ac0', results: Array(2)}


  const [commentOpen, setCommentOpen] = useState({ visible: false, id: 0 })//TODOS: 控制评论抽屉是否开启
  const [replyOpen, setReplyOpen] = useState({ visible: false, data: {} })//TODOS: 控制回复抽屉是否开启
  const [shareOpen, setShareOpen] = useState(false)//控制分享抽屉组件是否开启
  const [showNavAuthor, setShowNavAuthor] = useState(false)//控制NavBar组件是否显示
  // const [finished, setFinished] = useState(false)
  
  const authorRef = useRef()
  const wrapperRef = useRef()
  const commentRef = useRef()

  /**--- 评论列表 ---**/
  const listRootRef = useRef()
  const listPlaceholderRef = useRef()

  const { id } = useParams() // 获取地址栏中的id, http://localhost:3000/article/7611
  const history = useHistory()



  // TODO: 滚动部分
  // https://upmostly.com/tutorials/build-an-infinite-scroll-component-in-react-using-react-hooks
  const { finished /* loading */ } = useScroll(
    useCallback(() => {
      dispatch(
        getMoreComment({
          type: 'a',
          source: id,
          offset: articleComment.last_id
        })
      )
    }, [articleComment.last_id, dispatch, id]),
    {
      container: wrapperRef.current,
      placeholder: listPlaceholderRef.current,
      stop: isArticleLoading || articleComment.results.length === 0 || isCommentLoading,
      isFinished: () => articleComment.end_id === articleComment.last_id
    }
  )
 


  
  useEffect(() => {/**--- 文章详情 ---**/
    /**注释: 
     * 获取文章详情  
     * 1.获取地址栏中参数 并 发请求获取数据  
     * 2.返回值存储到Redux中  
     * 3.useSelector中获取Redux数据 
     */
    dispatch(getArticleInfo(id))
  }, [dispatch, id])

  
  useEffect(() => {/**--- 文章评论 ---**/
    /**注释: 获取文章评论   */
    dispatch(getCommentList({ type: 'a', source: id }))
  }, [dispatch, id])


  // 文章详情 高亮 黑底部分
  useEffect(() => {
    if (isArticleLoading) return

    /**--- 高亮的部分 即 背景为黑色 ---**/
    const dgHtml = document.querySelector('.dg-html') // 获取文章内容的盒子
    const codes = dgHtml.querySelectorAll('pre code')
    // console.log(dgHtml)
    // document.removeEventListener
    // document.contentType
    // document.cookie
    // document.createAttribute

    hljs.configure({
      // 忽略警告
      ignoreUnescapedHTML: true
    })

    if (codes.length > 0) {
      // 8个code高亮的标签NodeList(8)：http://localhost:3000/article/8168
      // console.log('codes', codes)
      codes.forEach(block => {
        hljs.highlightElement(block)
      })
      return
    }
    
    const pre = dgHtml.querySelectorAll('pre') // 获取所有 pre 标签的内容
    if (pre.length > 0) {
      // NodeList(4) [pre, pre, pre, pre]：http://localhost:3000/article/7942
      // console.log('pre', pre)
      pre.forEach(block => {
        // console.log(block)
        hljs.highlightElement(block)
      })
    }
  }, [isArticleLoading])


  // 监听滚动 - 控制NavBar显示与隐藏
  useEffect(() => {
    if (isArticleLoading) return
    // 原生JS
    const wrapperDOM = wrapperRef.current //TODOS: wrapperDOM是最外侧的大盒子
    // if(wrapperDOM){console.log(wrapperDOM)}//-查看静态元素

    // 节流
    const onScroll = throttle(200, () => {
      // console.log('执行了')
      const { top } = authorRef.current.getBoundingClientRect()//TODOS: getBoundingClientRect: 元素上边到视窗上边的距离
      // console.log(top)
      if (top <= 0) {
        setShowNavAuthor(true)
      } else {
        setShowNavAuthor(false)
      }
    })
    wrapperDOM.addEventListener('scroll', onScroll)

    // 清理副作用
    return () => wrapperDOM.removeEventListener('scroll', onScroll)
  }, [showNavAuthor, isArticleLoading])



  // 加载更多评论数据
  // useEffect(() => {
  //   if (isArticleLoading) return
  //   if (articleComment.results.length === 0) return
  //   if (isCommentLoading || finished) return

  //   // const listRootDOM = listRootRef.current
  //   const listPlacehoderDOM = listPlaceholderRef.current
  //   // 可滚动区域
  //   const wrapperDOM = wrapperRef.current

  //   const onScroll = throttle(200, async () => {
  //     const { bottom: scrollBottom } = wrapperDOM.getBoundingClientRect()
  //     const { bottom: placehoderBottom } =
  //       listPlacehoderDOM.getBoundingClientRect()

  //     if (placehoderBottom - scrollBottom <= 300) {
  //       // 触底
  //       if (articleComment.end_id === articleComment.last_id) {
  //         // 加载完成
  //         setFinished(true)
  //       } else {
  //         // 加载下一页数据
  //         dispatch(
  //           getMoreComment({
  //             type: 'a',
  //             source: id,
  //             offset: articleComment.last_id
  //           })
  //         )
  //       }
  //     }
  //   })

  //   wrapperDOM.addEventListener('scroll', onScroll)
  //   return () => wrapperDOM.removeEventListener('scroll', onScroll)
  // }, [
  //   dispatch,
  //   isArticleLoading,
  //   isCommentLoading,
  //   finished,
  //   id,
  //   articleComment.end_id,
  //   articleComment.last_id,
  //   articleComment.results.length
  // ])


  /**
   * 打开回复评论窗口
   * @param {*} data 
   * @setReplyOpen ({visible: true,data })  
   */
  const onOpenReply = data => {
    setReplyOpen({
      visible: true,
      data
    })
  }

  /**
   * 关闭回复评论窗口
   * @param {} 
   * @setReplyOpen ({visible: false, data: {}})
  */
  const onCloseReply = () => {
    setReplyOpen({
      visible: false,
      data: {}
    })
  }

  /**TODOS: 展示评论窗口(useState/setCommentOpen) */
  const onComment = () => {
    setCommentOpen({
      visible: true,
      id: art_id
    })
  }

  /**TODOS: 关闭评论窗口(setCommentOpen({visible: false,id: 0})) */
  const onCloseComment = () => {
    setCommentOpen({
      visible: false,
      id: 0
    })
  }

  /**TODOS: 发表评论后，插入到数据中(dispatch/setComment/setInfo) */
  const onInsertComment = comment => {
    dispatch(
      setComment({
        results: [comment, ...articleComment.results]
      })
    )

    dispatch(
      setInfo({
        comm_count: articleDetail.comm_count + 1
      })
    )
  }

  /**TODOS: 文章点赞(点赞/取消点赞) dispatch(deleteLiking/updateLiking) */
  const onLike = async () => {
    if (attitude === 1) {//登录1 表示已经点赞
      console.log('取消点赞')
      dispatch(deleteLiking(art_id))
      return
    }

    // 点赞
    dispatch(updateLiking(art_id))
  }

  /**TODOS: 收藏(收藏/取消收藏) dispatch(deleteCollection/updateCollection) */
  const onCollected = async () => {
    if (is_collected) {
      console.log('取消收藏')
      dispatch(deleteCollection(art_id))
      return
    }

    // 收藏
    dispatch(updateCollection(art_id))
  }

  /**TODOS: 关注(关注/取消关注) dispatch(deleteFollow/updateFollow)  */
  const onFollow = async () => {
    if (is_followed) {//TODOS: 表示是否已关注 
      console.log('取消关注')
      dispatch(deleteFollow(aut_id))
      return
    }
    dispatch(updateFollow(aut_id))// 关注
  }

  /**TODOS: 评论点赞(评论点赞/取消点赞) dispatch(deleteCommentLiking/updateCommentLiking) */
  const onThumbsUp = async (com_id, is_liking) => {
    if (is_liking) {
      console.log('取消评论点赞')
      dispatch(deleteCommentLiking(com_id))
      return
    }
    // 评论点赞
    dispatch(updateCommentLiking(com_id))
  }

  /**TODOS: 点击评论、跳转到评论的位置 */
  const onShowComment = () => {
    wrapperRef.current.scrollTop = commentRef.current.offsetTop - 46;
  }

  // 文章
  const { art_id,attitude,aut_id,aut_name,aut_photo,comm_count,content,is_collected,is_followed,like_count, pubdate, read_count, title } = articleDetail
  // console.log('是否关注?', is_followed)

  // 文章评论
  const { results } = articleComment

  const date = dayjs(pubdate).format('YYYY-MM-DD')














  /**
   * FIXME: 文章内部的结构
   * TODO: 顶部NavBar的显示与隐藏
   * TODO: 页面一进入是否显示占位符
   */
  return (
    <div className={styles.root}>
      <div className="root-wrapper">
        {/* TODO: 顶部导航栏 */}
        <NavBar
          onLeftClick={() => history.go(-1)}
          rightContent={
            <span onClick={() => setShareOpen(true)}>
              <Icon type="icongengduo" />
            </span>
          }
        >
          {
            showNavAuthor && (
              <div className="nav-author">
                <img src={aut_photo} alt="" />
                <span className="name">{aut_name}</span>
                <span onClick={onFollow} className={classNames('follow', is_followed ? 'followed' : '')} >
                  { is_followed ? '已关注' : '关注' }
                </span>
              </div>
            )
          }
        </NavBar>
        {/* ==============================================NavBar导航栏部分============================================= */}

        {
          isArticleLoading ? (//TODOS: Redux中获取是否加载  控制文章内部的数据 if(isArticleLoading) return
            <ContentLoader
              speed={2}
              width={375}
              height={230}
              viewBox="0 0 375 230"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              {/* https://skeletonreact.com/ */}
              <rect x="16" y="8" rx="3" ry="3" width="340" height="10" />
              <rect x="16" y="26" rx="0" ry="0" width="70" height="6" />
              <rect x="96" y="26" rx="0" ry="0" width="50" height="6" />
              <rect x="156" y="26" rx="0" ry="0" width="50" height="6" />
              <circle cx="33" cy="69" r="17" />
              <rect x="60" y="65" rx="0" ry="0" width="45" height="6" />
              <rect x="304" y="65" rx="0" ry="0" width="52" height="6" />
              <rect x="16" y="114" rx="0" ry="0" width="340" height="15" />
              <rect x="263" y="208" rx="0" ry="0" width="94" height="19" />
              <rect x="16" y="141" rx="0" ry="0" width="340" height="15" />
              <rect x="16" y="166" rx="0" ry="0" width="340" height="15" />
            </ContentLoader>
          ) : (
            <>
              <div className="wrapper" ref={wrapperRef}>
                {/* 头部标题、作者信息 */}
                <div className="article-wrapper">
                  <div className="header">
                    <h1 className="title">{title}</h1>
  
                    <div className="info">
                      <span>{date}</span>
                      <span>{read_count} 阅读</span>
                      <span>{comm_count} 评论</span>
                    </div>
  
                    <div className="author" ref={authorRef}>{/* -----测试  ref：设置监听滚动 */}
                      <img src={aut_photo} alt="" />
                      <span className="name">{aut_name}</span>
                      <span onClick={onFollow} className={classNames('follow', is_followed ? 'followed' : '' )} > 
                        {is_followed ? '已关注' : '关注'}
                      </span>
                    </div>
                  </div>
  
                  {/* 文章内容、后端返回DOM元素、前端渲染 */}
                  <div className="content"> 
                    <div
                      className="content-html dg-html"
                      dangerouslySetInnerHTML={{
                        // FIXME: 渲染文章内容、测试先关闭掉
                        __html: DOMPurify.sanitize(content || '')
                        // 内容先为空
                        // __html: DOMPurify.sanitize('')
                      }}
                    />
                    <div className="date">发布文章时间：{date}</div>
                  </div>
                </div>
  

                <div className="comment" ref={commentRef}>
                  {/* Sticky组件中因为盒子要随着下拉固定 所以要用ref控制盒子高度  */}
                  {/* TODO: 封装的Sticky组件 */}
                  <Sticky root={wrapperRef.current} height={51} offset={46}>
                    <div className="comment-header">
                      <span>全部评论( {comm_count} )</span>
                      <span>{like_count} 点赞</span>
                    </div>
                  </Sticky>
                  {/* ================================封装(固定的 全部评论/点赞) ================================ */}
                  {
                    comm_count === 0 ? (
                      // TODO: 封装
                      <NoneComment />
                    ) : (
                      <div className="comment-list" ref={listRootRef}>
                        {
                          results?.map(item => {
                            const { com_id, is_liking } = item; //TODOS: item解构出 文章的id和文章评论是否点赞
                            // console.log(is_liking)
                            return (
                              // TODO: 封装 - 评论数据
                              <CommentItem
                                key={com_id}
                                {...item}
                                onOpenReply={() => onOpenReply(item)}
                                onThumbsUp={() => onThumbsUp(com_id, is_liking)}
                              />
                            )
                          })
                        }
    
                        { isCommentLoading && ( <div className="list-loading">加载中...</div> )}
                        { finished && <div className="no-more">没有更多了</div> }
                        <div className="placeholder" ref={listPlaceholderRef}></div>
                      </div>
                    )
                  }
                  {/* =================================封装(是否显示评论人的数据 | 还没有人进行评论)================================ */}
                </div>
              </div>
              <CommentFooter
                comm_count={comm_count}//-----------------评论上面显示评论的数量
                placeholder={comm_count === 0 ? '抢沙发' : '去评论'}
                onComment={onComment}//-------------------点击去评论 useState展示评论窗口
                attitude={attitude}//---------------------控制点赞图标颜色 点赞是否为true  点赞图标为灰色?红色
                onLike={onLike}//-------------------------点击点赞 发请求点赞文章/取消点赞文章  点赞图标为灰色?红色
                is_collected={is_collected}//-------------控制收藏图标颜色 收藏是否为true  收藏图标为灰色?红色
                onCollected={onCollected}//---------------点击收藏 发请求收藏文章/取消收藏文章  收藏图标为灰色?红色
                onShare={() => setShareOpen(true)}//------点击分享 useState弹出抽屉组件
                onShowComment={onShowComment}//-----------点击评论 跳转到评论位置
              />
              {/* =================================================封装(底部评论/点赞/收藏/分享)================================== */}
            </>
          )
          /*============================================================文章结构===================================================================*/
        }
      </div>


      {/* 评论的抽屉组件 */}
      <Drawer
        className="drawer"
        position="bottom"
        style={{ minHeight: document.documentElement.clientHeight }}
        sidebar={
          <div className="drawer-sidebar-wrapper">
            {
              // TODO: CommentInput
              commentOpen.visible && ( <CommentInput id={commentOpen.id} onClose={onCloseComment} onComment={onInsertComment} />  )
            }
          </div>
        }
        open={ commentOpen.visible }
        onOpenChange={ onCloseComment }
      >
        {''}
      </Drawer>

      {/* 回复的抽屉组件 */}
      <Drawer
        className="drawer-right"
        position="right"
        style={{ minHeight: document.documentElement.clientHeight }}
        sidebar={
          <div className="drawer-sidebar-wrapper">
            {
              // TODO: Reply
              replyOpen.visible && ( <Reply data={replyOpen.data} art_id={art_id} onClose={onCloseReply} /> )   
            }
          </div>
        }
        open={replyOpen.visible}
        onOpenChange={onCloseReply}
      >
        {''}
      </Drawer>

      {/* 分享的抽屉组件 */}
      <Drawer
        className="drawer-share"
        position="bottom"
        style={{ minHeight: document.documentElement.clientHeight }}
        sidebar={
          // TODO: 封装分享组件
          <Share onClose={() => setShareOpen(false)} />
        }
        open={shareOpen}
        onOpenChange={() => setShareOpen(false)}
      >
        {''}
      </Drawer>
    </div>
  )
}

export default Article










/*
// comment item
<div className="comment-item">
  <div className="avatar">
    <img
      src="http://toutiao.itheima.net/images/user_head.jpg"
      alt=""
    />
  </div>
  <div className="comment-info">
    <div className="comment-info-header">
      <span className="name">Wen Yahui</span>
      <span className="thumbs-up">
        1090
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconbtn_like2"></use>
        </svg>
      </span>
    </div>
    <div className="comment-content">
      现在实现的应该是类似于大脑信号的输出，有没有可能以后实现脑接口信号的输入，从此人类从一代一代知识的传递变成知识的直接下载，学习好累呀。
    </div>
    <div className="comment-footer">
      <span className="replay" onClick={() => setOpen1(true)}>
        2回复
        <span className="icon"> &gt;</span>
      </span>
      <span className="comment-time">2小时前</span>
      <svg className="icon close" aria-hidden="true">
        <use xlinkHref="#iconbtn_essay_close"></use>
      </svg>
    </div>
  </div>
</div>
*/

/*
  // footer
  <div className="footer">
    <div className="input-btn" onClick={() => setOpen(true)}>
      <Icon type="iconbianji" />
      <span>抢沙发</span>
    </div>
    <div className="action-item">
      <Icon type="iconbtn_comment" />
      <p>评论</p>
      {comm_count && <span className="bage">{comm_count}</span>}
    </div>
    <div className="action-item">
      <Icon type={is_followed ? 'iconbtn_like_sel' : 'iconbtn_like2'} />
      <p>点赞</p>
    </div>
    <div className="action-item">
      <Icon
        type={is_collected ? 'iconbtn_collect_sel' : 'iconbtn_collect'}
      />
      <p>收藏</p>
    </div>
    <div className="action-item">
      <Icon type="iconbtn_share" />
      <p>分享</p>
    </div>
  </div>
*/
