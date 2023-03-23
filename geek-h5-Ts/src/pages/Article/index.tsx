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
// highlightElement(DOM) 就可以让代码高亮
import 'highlight.js/styles/monokai.css'

// 导入高亮的语言包
import 'highlight.js/lib/common'
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


const Article = () => { // http://localhost:3020/article/8026

  const history = useHistory()
  const { id } = useParams<{ id: string }>();  // 拿到地址栏 /id 的值
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getArticleDetail(id)) // 获取文章详情数据
  }, [dispatch, id])

  useEffect(() => {
    dispatch(getCommentList(id)) // 获取文章的评论
  }, [dispatch, id])


  const { detail, comment } = useSelector((state: RootState) => state.article);  // 先获取数据 再用redux获取数据

  
  useEffect(() => {
    // 配置 highlight.js -- 忽略未经转义的 HTML 字符
    hljs.configure({ignoreUnescapedHTML: true})
    // 获取到内容中所有的code标签
    const codes = document.querySelectorAll('.dg-html pre > code')
    codes.forEach((el) => {
      // 让code进行高亮
      hljs.highlightElement(el as HTMLElement)
    })
  }, [detail])

  // 是否显示顶部信息
  const [isShowAuthor, setIsShowAuthor] = useState(false)
  const authorRef = useRef<HTMLDivElement>(null) // 作者信息盒子
  const wrapRef = useRef<HTMLDivElement>(null)  // wrapRef: 页面内容盒子

  // 节流阀
  useEffect(() => {
    const onScroll = throttle(function () {
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

  const onFollowUser = async () => {
    await dispatch(followUser(detail.aut_id, detail.is_followed))
    Toast.show('操作成功')
  }

  const commentRef = useRef<HTMLDivElement>(null);
  const isShowComment = useRef(false);
  
  const goComment = () => { // 点击评论 - 跳转到评论部分
    const wrap = wrapRef.current!;
    if (isShowComment.current) {
      wrap.scrollTo(0, 0)
    } else {
      wrap.scrollTo(0, commentRef.current!.offsetTop - 46); // offsetTop: 13421-46
    }
    isShowComment.current = !isShowComment.current
  }

  const [share, setShare] = useState(false)
  const onCloseShare = () => {
    setShare(false)
  }

  // 添加评论的显示和隐藏
  const [showComment, setShowComment] = useState({
    visible: false,
  })

  const closeComment = () => {
    setShowComment({
      visible: false,
    })
  }

  const [showReply, setShowReply] = useState({
    // 是否可见
    visible: false,
    // 原始评论
    originComment: {} as Comment,
  })

  const closeReply = () => {
    setShowReply({
      visible: false,
      originComment: {} as Comment,
    })
  }
  const onShowReply = (comment: Comment) => { // 接收一个Comment类型
    setShowReply({
      visible: true,
      originComment: comment,
    })
  }





  return (
    <div className={styles.root}>
      <div className="root-wrapper">
        {/* 顶部导航栏 */}
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
                  <span className={classNames('follow', {followed: detail.is_followed,})} onClick={onFollowUser}>
                    {detail.is_followed ? '已关注' : '关注'}
                  </span>
                </div>
              </div>

              {/* 文章正文内容区域 */}
              <div className="content">
                <div
                  className="content-html dg-html"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(detail.content),
                  }}
                ></div>
                <div className="date">
                  发布文章时间：{dayjs(detail.pubdate).format('YYYY-MM-DD')} 
                </div>
              </div>
            </div>
            <div className="comment">
              {/* 评论总览信息 */}

              {/* Sticky 吸顶效果  */}
              {/* <Sticky top={46}> */}
              <div className="comment-header" ref={commentRef}>
                <span>全部评论（{detail.comm_count}）</span>
                <span>{detail.like_count} 点赞</span>
              </div>
              {/* </Sticky> */}
              {/* 评论列表 - 控制显示无评论还是展示评论信息 */}
              {
                detail.comm_count === 0 ? (
                  <NoComment></NoComment>
                ) : (
                  comment.results?.map((item) => (
                    <CommentItem
                      onReply={onShowReply}
                      key={item.com_id}
                      comment={item}
                    ></CommentItem>
                  ))
                )
              }
              <InfiniteScroll
                hasMore={hasMore}
                loadMore={loadMore}
              ></InfiniteScroll>
            </div>

          </div>
        </>
        <CommentFooter
          goComment={goComment}
          onShare={() => setShare(true)}
          onComment={() => setShowComment({visible: true})}
        ></CommentFooter>
      </div>




      {/* 分享抽屉 */}
      <Drawer
        className="drawer-share"
        position="bottom"
        children={''}
        sidebar={<Share onClose={onCloseShare} />}
        open={share}
        onOpenChange={onCloseShare}
      />

      {/* 添加评论的抽屉 */}
      {/* 评论抽屉 */}
      <Drawer
        className="drawer"
        position="bottom"
        children={''}
        sidebar={
          <div className="drawer-sidebar-wrapper">
            {showComment.visible && (
              <CommentInput onClose={closeComment} aritcleId={detail.art_id} />
            )}
          </div>
        }
        open={showComment.visible}
        onOpenChange={closeComment}
      />

      {/* 回复抽屉 */}
      <Drawer
        className="drawer-right"
        position="right"
        children={''}
        sidebar={
          <div className="drawer-sidebar-wrapper">
            {showReply.visible && (
              <CommentReply
                articleId={detail.art_id}
                onClose={closeReply}
                originComment={showReply.originComment}
              />
            )}
          </div>
        }
        open={showReply.visible}
        onOpenChange={closeReply}
      />
    </div>
  )
}

export default Article;
