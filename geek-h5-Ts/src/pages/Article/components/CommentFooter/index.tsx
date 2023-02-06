import Icon from '@/components/Icon'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'
import { likeAritcle, collectArticle } from '@/store/actions/article'
import { Toast } from 'antd-mobile'


type Props = {
  goComment?: () => void
  onShare?: () => void
  onComment?: () => void
  type?: string
}
const CommentFooter = ({ goComment, onShare, onComment, type = 'normal', }: Props) => {
  const { detail } = useSelector((state: RootState) => state.article)

  const dispatch = useDispatch()
  const onLike = async () => {
    await dispatch(likeAritcle(detail.art_id, detail.attitude))
    Toast.info('点赞成功/取消成功')
  }
  const collect = async () => {
    await dispatch(collectArticle(detail.art_id, detail.is_collected))
    Toast.info('收藏成功/收藏成功')
  }

  return (
    <div className={styles.root}>
      <div className="input-btn" onClick={onComment}>
        <Icon type="iconbianji" />
        <span>去评论</span>
      </div>

      {type === 'reply' ? null : (
        <>
          <div className="action-item" onClick={goComment}>
            <Icon type="iconbtn_comment" />
            <p>评论</p>
            <span className="bage">{detail.comm_count}</span>
          </div>
          {/* 'iconbtn_like2' */}
          <div className="action-item" onClick={onLike}>
            <Icon
              type={
                detail.attitude === 1 ? 'iconbtn_like_sel' : 'iconbtn_like2' // 等于1是点赞、等于-1是取消点赞
              }
            />
            <p>点赞</p>
          </div>
        </>
      )}
      <div className="action-item" onClick={collect}>
        {/* 'iconbtn_collect' */}
        <Icon
          type={detail.is_collected ? 'iconbtn_collect_sel' : 'iconbtn_collect'}
        />
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
