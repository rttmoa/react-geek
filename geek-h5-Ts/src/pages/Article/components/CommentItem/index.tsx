import Icon from '@/components/Icon'
import { Comment } from '@/store/reducers/article'
import styles from './index.module.scss'
import dayjs from 'dayjs'



type Props = {
  comment: Comment
  onReply?: (comment: Comment) => void
  type?: string
}
/** #### TODO: 全部评论中渲染每一项 Item （渲染评论者信息）  */
const CommentItem = ({ comment, onReply, type = 'normal' }: Props) => {
  return (
    <div className={styles.root}> 
      <div className="avatar">
        <img src={comment.aut_photo} alt="" />
      </div> 
      <div className="comment-info"> 
        <div className="comment-info-header">
          <span className="name">{comment.aut_name}</span> 
          <span className="thumbs-up">
            {comment.like_count}
            <Icon type={comment.is_liking ? 'iconbtn_like_sel' : 'iconbtn_like2'}/>
          </span>
        </div> 
        {/* 评论内容 */}
        <div className="comment-content">{comment.content}</div> 
        <div className="comment-footer"> 
          {type === 'reply' ? null : (  
            <span className="replay" onClick={() => onReply && onReply(comment)}>
              {comment.reply_count} 回复<Icon type="iconbtn_right" />
            </span>
          )}
          <span className="comment-time">
            {dayjs(comment.pubdate).fromNow()}  
          </span>
        </div>
      </div>
    </div>
  )
}

export default CommentItem
