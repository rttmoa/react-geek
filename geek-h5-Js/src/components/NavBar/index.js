import classnames from 'classnames'
import styles from './index.module.scss'

// import { withRouter} from 'react-router-dom'
// 1.withRouter的使用
// history, match, location  这个组件必须通过路由去配置的 <Route></Route>
// 自己渲染的组件, 无法获取到路由信息 <NarBar></NavBar>

// 2.路由提供了几个和路由相关的hook
// useHistory, useLocation, useParams

const NavBar = ({ children, className, rightContent, onLeftClick }) => {
  // NavBar：如果传入calssName 类名会为left,title,right   scss中有类名的引用
  return (
    <div className={classnames(styles.root, className)}>
      <div className="left" onClick={onLeftClick}>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconfanhui"></use>
        </svg>
      </div>
      <div className="title">{children}</div>{/* children-> 比如 <div>标题</div> */}
      <div className="right">{rightContent}</div>
    </div>
  )
}

export default NavBar
