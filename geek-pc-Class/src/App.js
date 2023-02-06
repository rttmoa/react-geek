import { Router, Route, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from 'components/PrivateRoute'
import React, { Suspense } from 'react'
import history from 'utils/history' // createHashHistory()、createBrowserHistory()
const Login = React.lazy(()=> import('pages/Login'))
const Layout = React.lazy(()=> import('pages/Layout'))
// import AuthRoute from 'components/AuthRoute';
/**--- react-router 中文文档 http://react-guide.github.io/react-router-cn/index.html ---**/
/* 
  BrowserRouter与HashRouter的区别：
    参考1：https://blog.csdn.net/weixin_59489521/article/details/123520827
    参考2：https://blog.csdn.net/m0_45382009/article/details/123465036
*/

// console.log(React) // 读取react下的所有属性

function App() {
  return (
    <Router history={history}>  {/* history 官网router路由 */}
      <div className="App">
        {/* <Link to="/home">首页</Link> */}
 
        
        {/* 配置路由的规则 */}
        {/* fallback: 兜底、如果组件还没有加载、默认会显示fall的内容 */}
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Redirect exact from='/' to="/home"></Redirect>
            {/* 只要path是/home, render函数就会执行 */}
            {/* <AuthRoute path="/home" component={Layout}></AuthRoute> */}
            
            {/* <Route path="/login" render={(props)=>//有逻辑 可以判断是否有token  console.log(props) <Login {...props} />}></Route> */}
            <PrivateRoute path="/home" component={Layout}></PrivateRoute>

            <Route path="/login" component={Login}></Route>
            
          </Switch>
        </Suspense>
        
      </div>
    </Router>
  )
}

export default App
