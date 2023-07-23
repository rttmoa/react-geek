import Icon from '@/components/Icon'
import NavBar from '@/components/NavBar'
import { useHistory, useParams } from 'react-router'
import { useEffect, useState, useRef } from 'react'
import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
// import Sticky from '@/components/Sticky'
import { getArticleDetail, getCommentList, getMoreCommentList, followUser } from '@/store/actions/article'
import { RootState } from '@/store'
import classNames from 'classnames'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify' // 防止XSS攻击

import hljs from 'highlight.js' 
import 'highlight.js/styles/monokai.css' 
import 'highlight.js/lib/common' // 导入高亮的语言包

import throttle from 'lodash/throttle'
import NoComment from './components/NoComment'
import CommentItem from './components/CommentItem'
import { InfiniteScroll, Toast } from 'antd-mobile-v5'
import CommentFooter from './components/CommentFooter'
import Share from './components/Share'
import { Drawer } from 'antd-mobile'
import CommentInput from './components/CommentInput'
import CommentReply from './components/CommentReply'
import { Comment } from '@/store/reducers/article'

// const dirty = '<a onclick="javascript:alert(document.cookie) href="#">哈哈哈</a>'
// const clean = DOMPurify.sanitize(dirty)
// console.log(clean)




// 节流阀 - 作者信息盒子固定到NavBar
// NavBar中传递children
const Article = () => {  

  const history = useHistory()
  const { id } = useParams<{ id: string }>();  // 拿到地址栏 /id 的值
  const dispatch = useDispatch()

  // 获取文章详情数据 && 获取文章的评论
  useEffect(() => {
    dispatch(getArticleDetail(id))    
  }, [dispatch, id])
  useEffect(() => {
    dispatch(getCommentList(id))   
  }, [dispatch, id])
  const { detail, comment } = useSelector((state: RootState) => state.article);   

  
  useEffect(() => { // highlightjs
    // 配置 highlight.js -- 忽略未经转义的 HTML 字符
    hljs.configure({ignoreUnescapedHTML: true})
    // 获取到内容中所有的code标签
    const codes = document.querySelectorAll('.dg-html pre > code')
    codes.forEach((el) => {
      // 让code进行高亮
      hljs.highlightElement(el as HTMLElement)
    })
  }, [detail])


  const [isShowAuthor, setIsShowAuthor] = useState(false)
  const authorRef = useRef<HTMLDivElement>(null) // <div className="author" ref={authorRef}></div>
  const wrapRef = useRef<HTMLDivElement>(null)  // <div className="wrapper" ref={wrapRef}></div> 
  useEffect(() => { // authorRef.current?.getBoundingClientRect()
    const onScroll = throttle(function () {
      // console.log(authorRef.current?.getBoundingClientRect().top) // DOM盒子距离顶部的距离 由+到-
      const rect = authorRef.current?.getBoundingClientRect()!   // 作者信息盒子
      if (rect && rect.top <= 0) {
        setIsShowAuthor(true);
      } else {
        setIsShowAuthor(false);
      }
    }, 300);
    const wrap = wrapRef.current!
    wrap.addEventListener('scroll', onScroll);
    return () => {wrap.removeEventListener('scroll', onScroll)}
  }, [])

  



  const hasMore = comment.last_id !== comment.end_id; // 如果last与end值不相等 就表示还有数据

  const loadMore = async () => {
    await dispatch(getMoreCommentList(id, comment.last_id))
  }

  const onFollowUser = async () => {  // 关注作者 （接口中传递作者ID + 是否关注）
    await dispatch(followUser(detail.aut_id, detail.is_followed))
    Toast.show('操作成功')
  }

  const commentRef = useRef<HTMLDivElement>(null); // <div className="comment-header" ref={commentRef}></div>
  const isShowComment = useRef(false);
  const goComment = () => {   // 跳转到评论部分
    const wrap = wrapRef.current!;
    if (isShowComment.current) {
      wrap.scrollTo(0, 0)
    } else {
      wrap.scrollTo(0, commentRef.current!.offsetTop - 46); // offsetTop: 13421-46
    }
    isShowComment.current = !isShowComment.current
  }


  // 分享
  const [share, setShare] = useState(false)
  const onCloseShare = () => {
    setShare(false)
  }


  // 添加评论
  const [showComment, setShowComment] = useState({ visible: false })
  const closeComment = () => {
    setShowComment({ visible: false })
  }


  // 回复评论组件 
  const [showReply, setShowReply] = useState({ visible: false, originComment: {} as Comment }) // originComment:原始评论
  const closeReply = () => {
    setShowReply({ visible: false, originComment: {} as Comment })
  }
  const onShowReply = (comment: Comment) => { 
    setShowReply({ visible: true,  originComment: comment })
  }




  // TODO: url: http://localhost:3020/article/7874
  return (
    <div className={styles.root}>
      <div className="root-wrapper">
        <NavBar className="navBar" onLeftClick={() => history.go(-1)} extra={<span><Icon type="icongengduo" /></span>}>
          {isShowAuthor ? (
            <div className="nav-author">
              <img src={detail.aut_photo} alt="" />
              <span className="name">{detail.aut_name}</span>
              <span className={classNames('follow', detail.is_followed ? 'followed' : '' )} onClick={onFollowUser}>
                {detail.is_followed ? '已关注' : '关注'}
              </span>
            </div>
          ) : ("")}
        </NavBar>
        <>
          <div className="wrapper" ref={wrapRef}>
            {/* TODO: 文章内容部分：标题 + 内容 */}
            <div className="article-wrapper">
              {/* 文章描述信息栏 */}
              <div className="header">
                <h1 className="title">{detail.title}</h1> 
                <div className="info">
                  <span>{detail.pubdate}</span>
                  <span>{detail.read_count} 阅读</span>
                  <span>{detail.comm_count} 评论</span>
                </div>
                <div className="author" ref={authorRef}>
                  <img src={detail.aut_photo} alt="" />
                  <span className="name">{detail.aut_name}</span>
                  <span className={classNames('follow', {followed: detail.is_followed})} onClick={onFollowUser}>
                    {detail.is_followed ? '已关注' : '关注'}
                  </span>
                </div>
              </div>
              {/* 文章正文内容区域 */}
              <div className="content">
                <div
                  className="content-html dg-html"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(detail.content)
                  }}
                ></div>
                <div className="date">
                  发布文章时间：{dayjs(detail.pubdate).format('YYYY-MM-DD')} 
                </div>
              </div>
            </div>
            {/* TODO: 评论部分 */}
            <div className="comment">
              {/* Sticky 吸顶效果  （<Sticky top={46}>）  */} 
              <div className="comment-header" ref={commentRef}>
                <span>全部评论（{detail.comm_count}）</span>
                <span>{detail.like_count} 点赞</span>
              </div>
              {detail.comm_count === 0 ? (
                <NoComment></NoComment>
              ) : (
                comment.results?.map((item) => (
                  <CommentItem onReply={onShowReply} key={item.com_id} comment={item}></CommentItem>
                ))
              )}
              <InfiniteScroll hasMore={hasMore} loadMore={loadMore}></InfiniteScroll>
            </div> 
          </div>
        </>
        {/* TODO: 底部：评论，点赞，收藏，分享 */}
        <CommentFooter
          goComment={goComment}
          onShare={() => setShare(true)}
          onComment={() => setShowComment({visible: true})}
        ></CommentFooter>
      </div>


      {/* FIXME: Drawer */}
      <Drawer
      // Shary
        className="drawer-share"
        position="bottom"
        children={''}
        sidebar={<Share onClose={onCloseShare} />}
        open={share}
        onOpenChange={onCloseShare}
      />
 
      <Drawer
      // Comment
        className="drawer"
        position="bottom"
        children={''}
        sidebar={
          <div className="drawer-sidebar-wrapper">
            {showComment.visible && <CommentInput onClose={closeComment} aritcleId={detail.art_id} />}
          </div>
        }
        open={showComment.visible}
        onOpenChange={closeComment}
      />

      <Drawer
      // Reply
        className="drawer-right"
        position="right"
        children={''}
        sidebar={
          <div className="drawer-sidebar-wrapper">
            {showReply.visible && <CommentReply articleId={detail.art_id} onClose={closeReply} originComment={showReply.originComment}/>}
          </div>
        }
        open={showReply.visible}
        onOpenChange={closeReply}
      />
    </div>
  )
}

export default Article;
