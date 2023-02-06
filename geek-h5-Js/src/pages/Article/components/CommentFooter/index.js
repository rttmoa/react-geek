import Icon from '@/components/Icon'
import styles from './index.module.scss'

const CommentFooter = ({ comm_count, attitude, is_collected, placeholder, onComment, onLike, onCollected, onShare, onShowComment, type = 'normal' }) => {
  // type类型   普通评论(normal)   回复评论(reply)

  return (
    <div className={styles.root}>
      <div className="input-btn" onClick={onComment}>{/* TODO: 底部左侧输入框 */}
        <Icon type="iconbianji" />
        <span>{placeholder}</span>
      </div>
      {
        type === 'normal' && (
          <>
            <div className="action-item" onClick={onShowComment}>{/* 底部评论图标 */}
              <Icon type="iconbtn_comment" />
              <p>评论</p>
              {comm_count !== 0 && <span className="bage">{comm_count}</span>}
            </div>
            <div className="action-item" onClick={onLike}>{/* 底部点赞图标 */}
              <Icon
                type={attitude === 1 ? 'iconbtn_like_sel' : 'iconbtn_like2'}
              />
              <p>点赞</p>
            </div>
          </>
        )
      }

      <div className="action-item" onClick={onCollected}>
        <Icon type={is_collected ? 'iconbtn_collect_sel' : 'iconbtn_collect'} />
        <p>收藏</p>
      </div>
      <div className="action-item" onClick={onShare}>
        <Icon type="iconbtn_share" />
        <p>分享</p>
      </div>
    </div>
  )
}

export default CommentFooter
