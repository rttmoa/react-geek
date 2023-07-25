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
  
  // 泛型参数1：指定state的类型  RootState中有login,profile,home,search,article的类型，即可推出后面的属性
  // 泛型参数2：指定返回值的类型
  // const user = useSelector<RootState, RootState['profile']['user']>(state => state.profile.user)
  const user = useSelector((state: RootState) => state.profile.user)


  useEffect(() => {
    dispatch(getUser()); // TODO: action中获取User接口数据后，存储redux中，页面中从redux中获取数据渲染
  }, [dispatch]);

  

  return (
    // FIXME: 修改 height
    <div className={styles.root}>

      <div className="profile">

        <div className="user-info">
          <div className="avatar">
            <img src={user.photo} alt="" />
          </div>
          <div className="user-name">{'UserName' || user.name}</div>
          <Link to="/profile/edit"><span className='text'>个人信息 {/* {">"} */}</span><Icon type="iconbtn_right" /> </Link>
        </div>

        <div className="read-info">
          <Icon type="iconbtn_readingtime" />今日阅读<span>34</span> 分钟
        </div>

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
          <div className="service-item" onClick={() => history.push('/profile/feedback')}>
            <Icon type="iconbtn_feedback" />
            <div style={{color: '#4119f4'}}>用户反馈</div>
          </div>
          <div className="service-item" onClick={() => history.push('/profile/chat')}>
            <Icon type="iconbtn_xiaozhitongxue" />
            <div style={{color: '#4119f4'}}>小智同学</div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Profile
