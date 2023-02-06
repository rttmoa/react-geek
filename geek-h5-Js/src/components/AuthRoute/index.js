import { isAuth } from '@/utils'
import { Redirect, Route,  } from 'react-router-dom'

// https://reactrouter.com/web/example/auth-workflow
// https://stackoverflow.com/a/64307442/15443637


/**功能: 访问个人中心时, 判断有无token, 可访问/重定向  */
const AuthRoute = ({ component: Component, ...rest }) => {   /// 父组件中传递的属性为 component & path
  // console.log(rest) // {path: '/home/profile'}
  return (
    <Route
      {...rest}  
      render={props => {
        // console.log(props) 

        if (!isAuth()) {   
          return (
            <Redirect to={{
              pathname: '/login',
              state: {
                from: props.location.pathname
              }
          }} />
          )
        }else{
          return <Component {...props} />    
        }
      }}
    />
  )
}

export { AuthRoute }
