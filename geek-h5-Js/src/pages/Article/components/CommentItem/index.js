import Icon from '@/components/Icon'
import classnames from 'classnames'
import dayjs from 'dayjs'
import styles from './index.module.scss'

const CommentItem = (
  {com_id,aut_photo,aut_name,like_count,is_followed, is_liking, content, reply_count, pubdate, onThumbsUp, onOpenReply = () => {}, type = 'normal' }) => {
  
  // normal 普通
  // origin 回复评论的原始评论
  // reply 回复评论

  // console.log(type)

  /** 作者/用户的用户名后面的 关注or点赞 */
  const thumbsUp = type === 'normal' ? (
      // 渲染评论者的喜欢数量or是否点赞
      <span className="thumbs-up" onClick={onThumbsUp}>
        {like_count}
        <Icon type={is_liking ? 'iconbtn_like_sel' : 'iconbtn_like2'} />
      </span>
    ) : (
      // 渲染origin的信息
      <span className={classnames('follow', is_followed ? 'followed' : '')}>
        {is_followed ? '已关注' : '关注'}
      </span>
    )

  /**回复按钮和回复数量 */
  const replyJSX = type === 'normal' ? (
      <span className="replay" onClick={() => onOpenReply(com_id)}>
        {reply_count === 0 ? '' : reply_count}回复
        <Icon type="iconbtn_right" />
      </span>
    ) : null

  return (
    <div className={styles.root}>

      {/* 渲染所有用户的头像 */}
      <div className="avatar">
        <img src={aut_photo} alt="" />
      </div>
      
      <div className="comment-info">
        {/* 渲染所有用户的用户名 */}
        <div className="comment-info-header">
          <span className="name">{aut_name}</span>
          {thumbsUp}
        </div>
        <div className="comment-content">{content}</div>
        <div className="comment-footer">
          {replyJSX}
          <span className="comment-time">{dayjs().from(pubdate)}</span>
          {/* 未提供举报评论接口 */}
          <Icon className="close" type="iconbtn_essay_close" />
        </div>
      </div>
    </div>
  )
}

export default CommentItem
