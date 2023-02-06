import styles from './index.module.scss'
import noComment from '@/assets/none.png'

/**没有评论 ->文章 ->全部评论-> 渲染图片   最简单的组件封装 函数组件直接返回结构  */
const NoneComment = () => {
  return (
    <div className={styles.root}>
      <img src={noComment} alt="" />
      <p className="no-comment">还没有人评论哦！</p>
    </div>
  )
}

export default NoneComment
