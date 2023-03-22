import { Route, Redirect, useLocation, RouteProps } from 'react-router-dom'
import { hasToken } from '@/utils/storage'




// 1. 谷歌
// 2. 源码
// 3. 积累
interface Props extends RouteProps {
  //component :React.ReactElement()  (JSX类型)
  component: React.ComponentType<any>  // 表示只能传组件
}

export default function AuthRoute({ component: Component, ...rest }: Props) {

  const location = useLocation()
  return (
    <Route {...rest} render={() => {
        if (hasToken()) {
          return <Component></Component>
        } else {
          return <Redirect to={{ pathname: '/login', state: { from: location.pathname } }}></Redirect>
        }
      }}
    ></Route>
  )
}
