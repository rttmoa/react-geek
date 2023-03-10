import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { hasToken } from 'utils/storage'




export default class PrivateRoute extends Component {
  render() {
    // console.log(this.props) //{path: '/home', component: {…}, location: {…}, computedMatch: {…}}
    const { component: Component, ...rest } = this.props
    // console.log({...rest})
    return (
      /**--- react-router基本使用==> https://blog.csdn.net/u010660202/article/details/113517811 ---**/
      <Route
        {...rest}
        render={(routeProps) => {
          // console.log('routeProps Is',routeProps)//{history: {…}, location: {…}, match: {…}, staticContext: undefined}
          // 判断用户是否登录，判断是否token
          if (hasToken()) {
            return <Component {...routeProps}></Component>
          } else {
          
            // 跳转到登录页面的时候，我们需要把当前的地址传过去，登录成功就能够跳转回来
            return (
              <Redirect
                to={{
                  pathname: '/login',
                  // 通过search传递参数
                  // search: '?from=' + routeProps.location.pathname,    ////localhost:3000/login?from=/home/publish
                  // search: '?id=123',
                  state: {from: routeProps.location.pathname},
                }}
              ></Redirect>
            )
          }
        }}
      ></Route>
    )
  }
}
