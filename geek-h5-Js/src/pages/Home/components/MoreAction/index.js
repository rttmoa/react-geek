import Icon from '@/components/Icon'
import { setMoreAction } from '@/store/actions'
import { Modal } from 'antd-mobile'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'

/** 
 * 组件是 举报的❌渲染
 * 实现的功能：
 *  1.登录之后，主页频道，不感兴趣、反馈垃圾内容、拉黑作者 
    2.使用useState控制二级弹窗  Modal  控制结构的显示
 */

const list = [
  {id: 0, title: '其他问题'},{id: 1, title: '标题夸张'},{id: 2, title: '低俗色情'},{id: 3, title: '错别字多'},{id: 4, title: '就问重复'},
  {id: 5, title: '广告软文'},{id: 6, title: '内容部时'},{id: 7, title: '低俗内容'},{id: 8, title: '侵权文章'} 
]


const MoreAction = () => {
  const dispatch = useDispatch();

  const { id, visible } = useSelector(state => {
    // console.log(state.home.moreAction)
    return state.home.moreAction
  }) 

  
  // junk / normal
  const [feedbackType, setFeedbackType] = useState('normal')//TODO: 控制二级弹窗  Modal  控制结构的显示

  // 关闭弹窗时的事件监听函数
  const onClose = () => dispatch( setMoreAction({ id: id, visible: false }));

  // console.log(id, visible)

  // 拉黑
  // const unLike = async () => {
  //   await dispatch(unLikeArticle(moreAction.articleId))
  //   onClose()
  //   Toast.info('拉黑成功')
  // }

  const report = async (id) => {
    console.log('获取反馈垃圾内容的id', id)
    // await dispatch(reportArticle(moreAction.articleId, id))
    // onClose()
    // Toast.info('举报成功')
  }


  return (
    <div className={styles.root}>
      {/* 对话框：https://antd-mobile-v2.surge.sh/components/modal-cn/ */}

      <Modal
        title="更多"
        footer={[1]}
        transparent // 是否背景透明
        maskClosable
        visible={visible}
        onClose={onClose}
        className="more-action-modal"
      >
        <div className="more-action">
          {
            feedbackType === 'normal' ? (
              <>
                <div className="action-item">
                  <Icon type="iconicon_unenjoy1" />
                  不感兴趣
                </div>
                <div className="action-item" onClick={() => setFeedbackType('junk')}>
                  <Icon type="iconicon_feedback1" />
                  <span className="text">反馈垃圾内容</span>
                  <Icon type="iconbtn_right" />
                </div>
                <div className="action-item">
                  <Icon type="iconicon_blacklist" />
                  拉黑作者
                </div>
              </>
            ) : (
              <>
                <div className="action-item" onClick={() => setFeedbackType('normal')}> 
                  <Icon type="iconfanhui" />
                  <span className="back-text">反馈垃圾内容</span>
                </div>
  
                {
                  list.map((item)=>{
                    return(
                      <div key={item.id} className="action-item" onClick={()=> report(item.id)} >{item.title}</div>
                    )
                  })
                }
  
                {/* <div className="action-item">旧闻重复</div>
                <div className="action-item">广告软文</div>
                <div className="action-item">内容不实</div>
                <div className="action-item">涉嫌违法</div> */}
  
                <div className="action-item">
                  <span className="text">其他问题</span>
                  <Icon type="iconbtn_right" />
                </div>
              </>
            )
          }
        </div>
      </Modal>
    </div>
  )
}

export default MoreAction
