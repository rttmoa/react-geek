import NavBar from '@/components/NavBar'
import { ImagePicker, InputItem } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import styles from './index.module.scss'


/**
 * 功能实现： 
 * 1.静态资源渲染    
 * 2.NavBar的封装
 */
const FeedBack = () => {
  const history = useHistory()

  return (
    <div className={styles.root}>

      <NavBar onLeftClick={() => history.go(-1)} /* rightContent={<div>有意见?</div>} */ >意见反馈</NavBar>

      <div className="wrapper">

        <div className="feedback-item">

          <p className="title">简介</p>

          <div className="textarea-wrap">
            <textarea className="textarea" placeholder="请输入"></textarea>
            <div className="count">0/100</div>
          </div>

          <ImagePicker files={[]} multiple />

          <p className="image-picker-desc">最多6张, 单个图片不超过20M。</p>

        </div>

        <div className="feedback-item">
          <p className="title">联系方式</p>
          <InputItem className='inputitem' placeholder="请输入手机号码便于联系（非必填）" />
        </div>

        <div className="feedback-item feedback-submit">
          <button>提交反馈</button>
        </div>

      </div>


    </div>
  )
}

export default FeedBack
