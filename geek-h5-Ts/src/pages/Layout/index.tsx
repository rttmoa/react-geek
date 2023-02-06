import React, { lazy, Suspense } from 'react'
import styles from './index.module.scss'
import Icon from '@/components/Icon'
import classNames from 'classnames'
import { Switch, Route, useHistory, useLocation } from 'react-router-dom'
import AuthRoute from '@/components/AuthRoute'
import KeepAlive from '@/components/KeepAlive'
const Home = lazy(() => import('@/pages/Home'))
const QA = lazy(() => import('@/pages/QA/index'))
const Video = lazy(() => import('@/pages/Video'))
const Profile = lazy(() => import('@/pages/Profile'))

// 这个tabBar类型推断 已经推出 是string类型
const tabBar = [
  {
    title: '首页', 
    icon: 'iconbtn_home',
    path: '/home/index',
  }, 
  { 
    title: '问答',
    icon: 'iconbtn_qa',
    path: '/home/qa',
  },
  {
    title: '视频',
    icon: 'iconbtn_video',
    path: '/home/video',
  },
  {
    title: '我的',
    icon: 'iconbtn_mine',
    path: '/home/profile',
  },
];
export default function Layout() {
  const history = useHistory()
  const location = useLocation()
  // console.log(location)
  return (
    <div className={styles.root}>
      {/* 区域一：点击按钮切换显示内容的区域 */}
      <div className="tab-content">
        {/* 配置二级路由 只要用了路由的懒加载，配合Suspense一起使用 */}
        <Suspense fallback={<div>loading...</div>}>
          {/* <Route path="/home" exact component={Home}></Route> */}
          <KeepAlive
            alivePath="/home/index"
            path="/home/index"
            component={Home}
          ></KeepAlive>
          <Switch>
            <Route path="/home/qa" component={QA}></Route>
            <Route path="/home/video" component={Video}></Route>
            {/* Route组件：只要path匹配了，component就会渲染 */}
            {/* 有些页面，就算path匹配到了，还需要登陆了才能访问，否则跳转到登陆页面，route提供了一种更复杂的使用方式，route可以不提供component，提供render */}
            {/* component={Profile} 等价于 render={() => <Profile></Profile>} */}
            {/* 需求：封装一个PrivateRoute,,这个组件把这些逻辑封装起来 */}
            <AuthRoute path="/home/profile" component={Profile}></AuthRoute>
          </Switch>
        </Suspense>
      </div>
      {/* 区域二：按钮区域，会使用固定定位显示在页面底部 */}
      <div className="tabbar">
        {tabBar.map((item) => (
          <div
            className={classNames(
              'tabbar-item',
              location.pathname === item.path ? 'tabbar-item-active' : ''
            )}
            key={item.title}
            onClick={() => history.push(item.path)}
          >
            <Icon
              type={
                location.pathname === item.path ? item.icon + '_sel' : item.icon
              }
            />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
