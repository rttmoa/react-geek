import { Route } from 'react-router-dom'

import styles from './index.module.scss'


const KeepAlive = ({ alivePath, component: Component, ...rest }) => {
  // console.log('Component', Component)
  return (
    // 两个参数：  第一个参数: ...rest     第二个参数: children
    <Route
      {...rest}
      children={props => {
        // console.log(props)
        const {  location: { pathname }  } = props;
        // console.log(1,pathname)
        // console.log(2,alivePath)
        // console.log(3,pathname === alivePath)
        // console.log(4,pathname.startsWith(alivePath))
        const isMatch = pathname === alivePath || pathname.startsWith(alivePath)
        // console.log('是否匹配', isMatch)

        return (
          <div
            className={styles.root}
            style={{ display: isMatch ? 'block' : 'none' }} // 取反 白屏
          > 
            <Component {...props} />{/* 返回的是Home组件 - 可以测试传递的component={Question} 测试 */}
          </div>
        )
      }}
    />
  )
}

export { KeepAlive }