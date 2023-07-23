import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { likeAritcle, collectArticle } from '@/store/actions/article'
import { Toast } from 'antd-mobile'
import Icon from '@/components/Icon'
import styles from './index.module.scss'



type StringType = "reply" | "normal"
type Props = {
  goComment?: () => void
  onShare?: () => void
  onComment?: () => void
  type?: StringType
  // type?: string
}
/** #### TODO: 底部Footer：去评论 / 点赞 / 收藏 / 分享  */
const CommentFooter = ({ goComment, onShare, onComment, type = 'normal' }: Props) => {

  const dispatch = useDispatch();

  const { detail } = useSelector((state: RootState) => state.article);

  const onLike = async () => {
    await dispatch(likeAritcle(detail.art_id, detail.attitude))
    Toast.info('成功, 刷新页面MVVM', .5)
  }
  const collect = async () => {
    await dispatch(collectArticle(detail.art_id, detail.is_collected))
    Toast.info('成功, 刷新页面MVVM', .5)
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
          <div className="action-item" onClick={onLike}> 
            <Icon type={detail.attitude === 1 ? 'iconbtn_like_sel' : 'iconbtn_like2'} />
            <p>点赞</p>
          </div>
        </>
      )}
      <div className="action-item" onClick={collect}>
        <Icon  type={detail.is_collected ? 'iconbtn_collect_sel' : 'iconbtn_collect'} />
        <p>收藏</p>
      </div>
      <div className="action-item" onClick={onShare}>
        <Icon type="iconbtn_share" />
        <p>分享</p>
      </div>
    </div>
  )
}

export default CommentFooter;
