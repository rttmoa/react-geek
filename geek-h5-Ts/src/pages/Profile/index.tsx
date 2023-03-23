import Icon from '@/components/Icon'
import { RootState } from '@/store'
import { getUser } from '@/store/actions/profile'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import styles from './index.module.scss'



// 1. 经验
// 2. 百度 --- 谷歌
// 在AuthRoute组件中判断是否有Token 拦截到Login页面
const Profile = () => {
  
  const history = useHistory()
  const dispatch = useDispatch()
  // 泛型参数1：指定state的类型
  // 泛型参数2：指定返回值的类型
  // const user = useSelector<RootState, RootState['profile']['user']>(state => state.profile.user) // 指定泛型 拿到 返回的User类型
  const user = useSelector((state: RootState) => state.profile.user)// state有类型(RootState)、profile就有类型 | 变量user可以推断类型

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  
  return (
    <div className={styles.root}>
      <div className="profile">
        {/* 顶部个人信息区域 */}
        <div className="user-info">
          <div className="avatar">
            <img src={user.photo} alt="" />
          </div>
          <div className="user-name">{user.name}</div>
          <Link to="/profile/edit">个人信息<Icon type="iconbtn_right" /> </Link>
        </div>

        {/* 今日阅读区域 */}
        <div className="read-info"><Icon type="iconbtn_readingtime" />今日阅读 <span>10</span> 分钟</div>

        {/* 统计信息区域 */}
        <div className="count-list">
          <div className="count-item">
            <p>{user.art_count}</p>
            <p>动态</p>
          </div>
          <div className="count-item">
            <p>{user.follow_count}</p>
            <p>关注</p>
          </div>
          <div className="count-item">
            <p>{user.fans_count}</p>
            <p>粉丝</p>
          </div>
          <div className="count-item">
            <p>{user.like_count}</p>
            <p>被赞</p>
          </div>
        </div>

        {/* 主功能菜单区域 */}
        <div className="user-links">
          <div className="link-item">
            <Icon type="iconbtn_mymessages" />
            <div>消息通知</div>
          </div>
          <div className="link-item">
            <Icon type="iconbtn_mycollect" />
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

      {/* 更多服务菜单区域 */}
      <div className="more-service">
        <h3>更多服务</h3>
        <div className="service-list">
          <div className="service-item" onClick={() => history.push('/profile/feedback')} >
            <Icon type="iconbtn_feedback" />
            <div>用户反馈</div>
          </div>
          <div className="service-item" onClick={() => history.push('/profile/chat')}>
            <Icon type="iconbtn_xiaozhitongxue" />
            <div>小智同学</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
