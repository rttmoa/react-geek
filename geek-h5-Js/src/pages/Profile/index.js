import Icon from '@/components/Icon'
import { getProfile } from '@/store/actions'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import styles from './index.module.scss'



/**
 * 功能实现：
 * 1.从redux中获取数据(useSelector)的使用 && 一进入页面就发请求获取数据(useEffect)的使用 
 * 2.Icon图标的封装
 * 3.在更多服务当中, 点击用户反馈和小智同学 跳转： onClick={() => history.push('/profile/feedback')}  &&  ('/profile/chat')
 * 4.封装小智, 用户反馈, 编辑个人资料 组件
 */
const Profile = () => {

  const dispatch = useDispatch()
  const profile = useSelector(state => {
    // console.log(state)
    // console.log(state.profile)
    return state.profile.user
  })   

  const history = useHistory()
 
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch])

  const { art_count, fans_count, follow_count, like_count, name, photo } =  profile
  // console.log(photo)

  return (
    <div className={styles.root}>
      <div className="profile">

        <div className="user-info">
          <div className="avatar">
            <img src={photo} alt="头像" />
          </div>
          <div className="user-name">{name}</div> 
          <Link to="/profile/edit">个人信息<Icon type={`iconbtn_right`} /></Link>
        </div>

        <div className="read-info">
          <Icon type="iconbtn_readingtime" />
          今日阅读
          <span>66</span>
          分钟
        </div>

        <div className="count-list">
          <div className="count-item">
            <p>{art_count}</p>
            <p>动态</p>
          </div>
          <div className="count-item">
            <p>{follow_count}</p>
            <p>关注</p>
          </div>
          <div className="count-item">
            <p>{fans_count}</p>
            <p>粉丝</p>
          </div>
          <div className="count-item">
            <p>{like_count}</p>
            <p>被赞</p>
          </div>
        </div>

        <div className="user-links">
          <div className="link-item">
            <Icon type={`iconbtn_mymessages`} />
            <div>消息通知</div>
          </div>
          <div className="link-item">
            <Icon type={`iconbtn_mycollect`} />
            <div>收藏</div>
          </div>
          <div className="link-item">
            <Icon type="iconbtn_history1" />
            <div>浏览历史</div>
          </div>
          <div className="link-item">
            <Icon type="iconbtn_myworks" />
            <div>我的作品</div>
          </div>
        </div>

      </div>


      <div className="more-service">
        <h3>更多服务</h3>

        <div className="service-list">

          <div className="service-item" onClick={() => history.push('/profile/feedback')} >
            <Icon type="iconbtn_feedback" />
            <div>用户反馈</div>
          </div>

          <div className="service-item" onClick={() => history.push('/profile/chat')} >
             <Icon type="iconbtn_xiaozhitongxue" />
            <div>小智同学</div>
          </div>
          
        </div>

      </div>
    </div>
  )
}

export default Profile
