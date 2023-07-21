import React, { lazy, Suspense } from 'react'
import styles from './index.module.scss'
import Icon from '@/components/Icon'
import classNames from 'classnames'
import { Switch, Route, useHistory, useLocation } from 'react-router-dom'
import AuthRoute from '@/components/AuthRoute'
import KeepAlive from '@/components/KeepAlive'
import { tabBar } from '@/utils/constant'
const Home = lazy(() => import('@/pages/Home'))
const Total = lazy(() => import('@/pages/total'))
// const QA = lazy(() => import('@/pages/QA'))
// const Video = lazy(() => import('@/pages/Video'))
const Profile = lazy(() => import('@/pages/Profile'))

 

export default function Layout () {

  const history = useHistory()
  const location = useLocation()
  return (
    <div className={styles.root}>
      {/* 区域一：点击按钮切换显示内容的区域 */}
      <div className="tab-content">
        {/* 配置二级路由 只要用了路由的懒加载，配合Suspense一起使用 */}
        <Suspense fallback={<div>loading...</div>}>
          <KeepAlive alivePath="/home/index" path="/home/index" component={Home}></KeepAlive>
          <Switch>
            {/* 需求：封装一个PrivateRoute,这个组件把这些逻辑封装起来 */}
            <Route path="/home/total" component={Total}></Route>
            {/* <Route path="/home/qa" component={QA}></Route> */}
            {/* <Route path="/home/video" component={Video}></Route> */}
            {/* component={Profile} 等价于 render={() => <Profile></Profile>} */} 
            <AuthRoute path="/home/profile" component={Profile}></AuthRoute>
          </Switch>
        </Suspense>
      </div>
      {/* 区域二：按钮区域，会使用固定定位显示在页面底部 */}
      <div className="tabbar">
        {tabBar.map((item) => (
          <div
            className={classNames( 'tabbar-item', location.pathname === item.path ? 'tabbar-item-active' : "" )}
            key={item.title}
            onClick={() => history.push(item.path)}
          >
            <Icon type={ location.pathname === item.path ? item.icon + '_sel' : item.icon }/>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
