import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { hasToken } from 'utils/storage'
import { Redirect } from 'react-router-dom'


export default class AuthRoute extends Component {
  render() {
    console.log('AuthRoute indexjs this.props', this.props) ///查看是否能接收父组件的值
    
    // 把接收到的Component属性改成用render进行渲染

    const { component: Component, ...rest } = this.props
    console.log('AuthRoute indexjs rest', rest) ///{path:"/home", location:{...}, computeMatch: {...}}
    
    return (
      // 这段是个 Route 规则
      //  <Route path='???' component={Component}></Route>    path属性在rest里面  所以要给父组件传递 ...rest
      //  ===
      //  <Route {...rest} component={Component}></Route>
      //  ===
      //  <Route {...rest} render={() => {}}></Route>   这里如果没有 {}  直接返回的     render渲染组件
      //  ===
      <Route
        {...rest}
        render={(props) => {
          if (hasToken()) {  ////封装的是否有 Token
            // 有token，登录了
            // ...props 传递 给父组件 才不会丢失 history location match 属性  否则无法退出
            return <Component {...props}></Component> 
          } else {
            // 如果没有token，没有登录，渲染Redirect组件跳转到 /login
            return <Redirect to="/login"></Redirect>
            // ===
            // props.history.push('/login')
          }
        }}
      ></Route>
    )
  }
}
