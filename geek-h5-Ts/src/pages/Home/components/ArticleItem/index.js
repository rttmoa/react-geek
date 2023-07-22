import classnames from 'classnames'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import dayjs from 'dayjs'
import Img from '@/components/Img'

import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setMoreAction } from '@/store/actions/home'
import { useHistory } from 'react-router'





/** #### TODO: 文章列表 - 每一个Article Box ---*/
const ArticleItem = ({ article, channelId }) => {

  const dispatch = useDispatch();
  const { cover: { type, images }, title, aut_name, comm_count, pubdate  } = article;
  const isLogin = useSelector((state) => !!state.login.token);
  const history = useHistory()

  return (
    <div className={styles.root} onClick={() => history.push('/article/' + article.art_id)}>
      {/* t3: 三图结构 none-mt没有图片结构  */}
      <div className={classnames('article-content', { t3: type === 3, 'none-mt': type === 0 })}>
        <h3>{title}</h3>
        {type !== 0 && (
          <div className="article-imgs">
            {images.map((item, i) => (
              <div className="article-img-wrapper" key={i}>
                <Img src={item} alt="" />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className={classnames('article-info', type === 0 ? 'none-mt' : '')}>
        <span>{aut_name}</span>
        <span>{comm_count} 评论</span>
        {/* fromNow: 距离现在的时间 */}
        <span>{dayjs(pubdate).fromNow()}</span>
        <span className="close">
          {isLogin && (<Icon type="iconbtn_essay_close" onClick = {
            () => dispatch(setMoreAction({
                visible: true,
                articleId: article.art_id,
                channelId,
              }))  
            }
          />)}
        </span>
      </div>
    </div>
  )
}

export default ArticleItem
