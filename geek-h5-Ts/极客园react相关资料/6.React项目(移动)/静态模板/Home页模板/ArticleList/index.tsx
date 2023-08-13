import ArticleItem from '../ArticleItem/ArticleItem'
import styles from './index.module.scss'

type Props = {
  channelId: number
}

const ArticleList = ({ channelId }: Props) => {
  return (
    <div className={styles.root}>
      {/* 文章列表中的每一项 */}
      <div className="article-item">
        <ArticleItem type={1} />
      </div>
    </div >
  )
}

export default ArticleList
