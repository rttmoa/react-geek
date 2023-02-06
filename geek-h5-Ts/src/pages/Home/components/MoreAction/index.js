import Icon from '@/components/Icon'
import {
  setMoreAction,
  unLinkArticle,
  reportArticle,
} from '@/store/actions/home'
import { Modal, Toast } from 'antd-mobile'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'

/* 
  1. 在redux中，需要新增一个数据
    moreAction: { visible: false, articleId: '', auth_id: '' }

  2. 在actions中新增一个action
    export const setMoreAction = (payload) => {
      return {
        type: 'home/setMoreAction',
        payload,
      }
    }
  3. reducer处理这个action
    case 'home/setMoreAction': {
      return {
        ...state,
        moreAction: payload,
      }
    }
  
  4. articleItem组件中，点击举报按钮，需要显示弹窗
    onClick={() =>
      dispatch(
        setMoreAction({
          visible: true,
          articleId: article.art_id,
        })
      )
    }
  
  5. 在moreAction中，点击遮罩，onClose事件，，，，关闭弹窗
        // 关闭弹框时的事件监听函数
        const onClose = () => {
          dispatch(
            setMoreAction({
              visible: false,
              articleId: '',
            })
          )
        }
*/

/**
 * 举报反馈菜单
 */
const list = [
  { id: 0, title: '其他问题' },
  { id: 1, title: '标题夸张' },
  { id: 2, title: '低俗色情' },
  { id: 3, title: '错别字多' },
  { id: 4, title: '旧闻重复' },
  { id: 5, title: '广告软文' },
  { id: 6, title: '内容不适' },
  { id: 7, title: '涉嫌违法犯罪' },
  { id: 8, title: '侵权' },
]
const FeedbackActionMenu = () => {
  // 举报类型：normal 不感兴趣或拉黑作者 | junk 垃圾内容
  const moreAction = useSelector((state) => state.home.moreAction)
  const dispatch = useDispatch()
  const [type, setType] = useState('normal')

  // 关闭弹框时的事件监听函数
  const onClose = () => {
    setType('normal')
    dispatch(
      setMoreAction({
        visible: false,
        articleId: '',
      })
    )
  }

  const unLike = async () => {
    await dispatch(unLinkArticle(moreAction.articleId))
    onClose()
    Toast.info('拉黑成功')
  }

  const report = async (id) => {
    await dispatch(reportArticle(moreAction.articleId, id))
    onClose()
    Toast.info('举报成功')
  }

  return (
    <div className={styles.root}>
      <Modal
        className="more-action-modal"
        title=""
        transparent
        maskClosable
        footer={[]}
        onClose={onClose}
        visible={moreAction.visible}
      >
        <div className="more-action">
          {/* normal 类型时的菜单内容 */}
          {type === 'normal' && (
            <>
              <div className="action-item" onClick={unLike}>
                <Icon type="iconicon_unenjoy1" /> 不感兴趣
              </div>
              <div className="action-item" onClick={() => setType('junk')}>
                <Icon type="iconicon_feedback1" />
                <span className="text">反馈垃圾内容</span>
                <Icon type="iconbtn_right" />
              </div>
              <div className="action-item">
                <Icon type="iconicon_blacklist" /> 拉黑作者
              </div>
            </>
          )}

          {/* junk 类型时的菜单内容 */}
          {type === 'junk' && (
            <>
              <div className="action-item" onClick={() => setType('normal')}>
                <Icon type="iconfanhui" />
                <span className="back-text">反馈垃圾内容</span>
              </div>
              {list.map((item) => (
                <div
                  key={item.id}
                  className="action-item"
                  onClick={() => report(item.id)}
                >
                  {item.title}
                </div>
              ))}
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default FeedbackActionMenu
