import NavBar from '@/components/NavBar'
import NoComment from '../NoComment'
import CommentFooter from '../CommentFooter'
import styles from './index.module.scss'
import { Comment } from '@/store/reducers/article'
import CommentItem from '../CommentItem'
import { InfiniteScroll } from 'antd-mobile-v5'
import { useEffect, useState } from 'react'
import request from '@/utils/request'
import { Drawer } from 'antd-mobile'
import CommentInput from '../CommentInput'
import { useDispatch } from 'react-redux'
import { updateComment } from '@/store/actions/article'
/**
 * 回复评论界面组件
 * @param {Object} props.originComment 原评论数据
 * @param {String} props.articleId 文章ID
 * @param {Function} props.onClose 关闭抽屉的回调函数
 */
type Props = {
  articleId?: string
  onClose?: () => void
  originComment: Comment
}
const CommentReply = ({ articleId, onClose, originComment }: Props) => {
  const dispatch = useDispatch()
  // 获取文章的回复列表
  const [replyList, setReplyList] = useState({
    end_id: '',
    last_id: '',
    results: [] as Comment[],
    total_count: 0,
  })
  useEffect(() => {
    const fetchData = async () => {
      const res = await request.get('/comments', {
        params: {
          type: 'c',
          source: originComment.com_id,
        },
      })
      setReplyList(res.data)
    }
    fetchData()
  }, [originComment])

  const hasMore = replyList.end_id !== replyList.last_id

  const [drawerStatus, setDrawerStatus] = useState({
    visible: false,
  })

  const onCloseComment = () => {
    setDrawerStatus({
      visible: false,
    })
  }

  /***--- 加载更多 - 拼接新获取的数据 ---**/
  const loadMore = async () => {
    const res = await request.get('/comments', {
      params: {
        type: 'c',
        source: originComment.com_id,
        offset: replyList.last_id,
      },
    })
    setReplyList({
      ...res.data,
      results: [...replyList.results, ...res.data.results],
    })
  }

  // 发请求，添加回复
  const onAddReply = async (content: string) => {
    const res = await request.post('/comments', {
      target: originComment.com_id,
      content,
      art_id: articleId,
    })
    // 添加一条数据
    setReplyList({
      ...replyList,
      total_count: replyList.total_count + 1,
      results: [res.data.new_obj, ...replyList.results],
    })

    // 更新评论的状态
    dispatch(
      updateComment({
        ...originComment,
        reply_count: originComment.reply_count + 1,
      })
    )
  }
  return (
    <div className={styles.root}>
      <div className="reply-wrapper">
        {/* 顶部导航栏 */}
        <NavBar className="transparent-navbar" onLeftClick={onClose}>
          <div>{replyList.total_count}条回复</div>
        </NavBar>

        {/* 原评论信息 */}
        <div className="origin-comment">
          <CommentItem comment={originComment} type="reply"></CommentItem>
        </div>

        {/* 回复评论的列表 */}
        <div className="reply-list">
          <div className="reply-header">全部回复</div>
          {originComment.reply_count === 0 ? (
            <NoComment />
          ) : (
            replyList.results.map((item) => (
              <CommentItem
                comment={item}
                key={item.com_id}
                type="reply"
              ></CommentItem>
            ))
          )}
          <InfiniteScroll
            hasMore={hasMore}
            loadMore={loadMore}
          ></InfiniteScroll>
        </div>

        {/* 评论工具栏，设置 type="reply" 不显示评论和点赞按钮 */}
        <CommentFooter
          type="reply"
          onComment={() => setDrawerStatus({ visible: true })}
        />
      </div>

      {/* 评论回复抽屉 */}
      <Drawer
        className="drawer"
        position="bottom"
        style={{ minHeight: document.documentElement.clientHeight }}
        children={''}
        sidebar={
          <div className="drawer-sidebar-wrapper">
            {drawerStatus.visible && (
              <CommentInput
                aritcleId={articleId!} // articleId!：非空 
                onClose={onCloseComment}
                name={originComment.aut_name}
                onAddReply={onAddReply}
              />
            )}
          </div>
        }
        open={drawerStatus.visible}
        onOpenChange={onCloseComment}
      />
    </div>
  )
}

export default CommentReply
