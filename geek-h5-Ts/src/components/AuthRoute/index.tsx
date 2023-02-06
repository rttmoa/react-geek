import { hasToken } from '@/utils/storage'
import { Route, Redirect, useLocation, RouteProps } from 'react-router-dom'

// 1. 谷歌
// 2. 源码
// 3. 积累
interface Props extends RouteProps {
  // any: 组件的props可以接收任意类型
  //component :React.ReactElement()  (JSX类型)
  // component: any
  component: React.ComponentType<any>  // 表示只能传组件
}

export default function AuthRoute({ component: Component, ...rest }: Props) {
  const location = useLocation()
  // console.log(location)
  return (
    <Route
      {...rest}
      render={() => {
        if (hasToken()) {
          return <Component></Component>
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  // 从哪儿来的
                  from: location.pathname,
                },
              }}
            ></Redirect>
          )
        }
      }}
    ></Route>
  )
}
