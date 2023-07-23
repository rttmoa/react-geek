import NavBar from '@/components/NavBar'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import styles from './index.module.scss'
import { addComment } from '@/store/actions/article'





type Props = {
  onClose: () => void
  aritcleId: string
  name?: string
  onAddReply?: (content: string) => void
}
/** #### TODO: 评论文章 / 回复文章 (弹窗)  */
const CommentInput = ({ onClose, aritcleId, name, onAddReply }: Props) => {

  // 输入框内容
  const [value, setValue] = useState('')

  // 输入框引用
  const txtRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    // 5毫秒后 输入框自动聚焦
    setTimeout(() => {
      txtRef.current!.focus()  
    }, 500)
  }, [])

 
  
  // 发表评论
  const dispatch = useDispatch();
  const onSendComment = async () => {
    if (!value) return
    // 判断
    if (name) {
      // 添加是回复评论 
      onAddReply && onAddReply(value) // 不能调用可能是“未定义”的对象  如果有才调用  不可断言
      onClose()
    } else {
      // 发送请求，添加评论 - 新评论
      await dispatch(addComment(aritcleId, value))
      onClose()
    }
  }

  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar
        className="nav"
        onLeftClick={onClose}
        extra={<span className="publish" onClick={onSendComment}>发表</span>}
      >
        {name ? '回复评论' : '评论文章'}
      </NavBar>
      <div className="input-area">
        {/* 回复别人的评论时显示：@某某 */}
        {name && <div className="at">@{name}：</div>}
        {/* 评论内容输入框 */}  
        <textarea
          ref={txtRef}
          placeholder="说点什么~"
          rows={10}
          value={value}
          onChange={(e) => setValue(e.target.value.trim())}
        />
      </div>
    </div>
  )
}

export default CommentInput
