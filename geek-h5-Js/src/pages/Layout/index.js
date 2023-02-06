import Icon from '@/components/Icon'
import { AuthRoute } from '@/components/AuthRoute'
import { KeepAlive } from '@/components/KeepAlive'

import classnames from 'classnames'
import { Route, useHistory, useLocation } from 'react-router-dom'

import Home from '../Home'
import Profile from '../Profile'
import Question from '../Question'
import Video from '../Video'
import styles from './index.module.scss'

/**
 * 功能实现：
 * 1.路由组件KeepAlive、AuthRoute、Route的使用  三种渲染方式 component/render/children   优先级: component > render > children  
 *    render、children、component: https://blog.csdn.net/weixin_44809405/article/details/91393342
 *      第一种: component    第二种：KeepAlive中的childrend  第三种：AuthRoute中的render
 * 
 * 2.点击 底部组件： 图标高亮/字体高亮 & 控制图标和字体 选中
 *      渲染出数组的所有属性值, 根据pathname和数组中的to做判断 如果相等 就渲染出to对应的那个数组下标
 * 
 * 3.封装的 Icon 组件=====> 根据这个Icon可以看出组件如何封装?
 *      Icon组件中 Icon是变量名 其return返回了原结构 渲染<svg className aria-hidden > <use xlinkHref></use> </svg>
 */


const menus = [
  { id: 1, title: '首页', to: '/home/index', icon: 'iconbtn_home' },
  { id: 2, title: '问答', to: '/home/question', icon: 'iconbtn_qa' },
  { id: 3, title: '视频', to: '/home/video', icon: 'iconbtn_video' },
  { id: 4, title: '我的', to: '/home/profile', icon: 'iconbtn_mine' }
];

const Layout = () => {
  const history = useHistory()
  const  { pathname } = useLocation()///--------->   pathname: /home/question  |  /home/index  |  /home/profile  |   /home/video

  /**
   * 注意：
   * 区域一：点击按钮切换显示内容的区域
   * 配置二级路由, 只要用了路由懒加载， 配合 Suspense 一起使用
   *  { 基本配置：  <Swithch>     <Route path="/home/video" component={Video}>   </Route>  </Swithch> }
   * Route组件：只要path匹配到了，component就会渲染
   * 有些页面，就算path匹配到了 还需要登录了才能访问，否则跳转到登录页  
   * router提供了更复杂的使用方式  router可以不提供component，提供render
   * 
   */ 
  return (
    <div className={styles.root}>
      {/* Route组件的使用==> */}
      {/* react-router 5.0中，route组件有三个支持组建渲染的属性  =====> component/render/children */}
      {/* <Route path="/home/Profile" component={Profile} />                      两种方式相等                                               */}
      {/* <Route path="/home/Profile" render={() => { <Profile></Profile>}} />    内联写法?  &&  嵌套组合写法? render=(props)  里面有三个参数  */} 
      {/* <Route path="/home/Profile" children={ props => (<div className={props.match ? "active": ''}><Link to="path" />	</div>) />        */}
      <KeepAlive alivePath="/home/index" exact path="/home/index" component={Home} />
      <Route path="/home/question" component={Question} />
      <Route path="/home/video" component={Video} />
      <AuthRoute path="/home/profile" component={Profile} />
      

      {/* 点击 底部组件 图标高亮 & 字体高亮 */}
      <div className="tabbar">
        {
          menus.map(item => {
            const isSelected = item.to === pathname;
            // 根据哪个url命中了哪个盒子
            return (
              <div
                key={item.id}
                className={classnames('tabbar-item', isSelected ? 'tabbar-item-active' : '' )}
                onClick={() => history.push(item.to)}
              >
                {/* Icon组件中 Icon是变量名 其return返回了原结构 渲染<svg className aria-hidden > <use xlinkHref></use> </svg> */}
                <Icon type={`${isSelected ? `${item.icon}_sel` : item.icon}`} />
                <span>{item.title}</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Layout
