import { NavBar } from 'antd-mobile'
import classNames from 'classnames'
import styles from './index.module.scss'
import Icon from '@/components/Icon'
import CommentFooter from './components/CommentFooter'

const Article = () => {
  const RenderArticle = () => {
    // 文章详情
    return (
      <div className="wrapper">
        <div className="article-wrapper">
          <div className="header">
            <h1 className="title">react是最好的语言</h1>
            <div className="info">
              <span>2022-03-16</span>
              <span>80阅读</span>
              <span>120 评论</span>
            </div>
            <div className="author">
              <img alt="" />
              <span className="name">{'jack'}</span>
              <span className={classNames('follow', true ? 'followed' : '')}>
                {true ? '已关注' : '关注'}
              </span>
            </div>
          </div>

          <div className="content">
            <div className="content-html dg-html" />
            <div className="date">发布文章时间：2022-03-16</div>
          </div>
        </div>

        <div className="comment">
          <div className="comment-header">
            <span>全部评论 32</span>
            <span>100 点赞</span>
          </div>

          <div className="comment-list">
            {/* 没有评论显示占位 有评论显示正常评论列表 */}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.root}>
      <div className="root-wrapper">
        <NavBar
          right={
            <span>
              <Icon type="icongengduo" />
            </span>
          }>
          <div className="nav-author">
            <img alt="" />
            <span className="name">{'张三'}</span>
            <span className={classNames('follow', true ? 'followed' : '')}>
              {true ? '已关注' : '关注'}
            </span>
          </div>
        </NavBar>
        {/* 文章详情和评论 */}
        <RenderArticle />
        {/* 底部评论栏 */}
        <CommentFooter />
      </div>
    </div>
  )
}

export default Article
