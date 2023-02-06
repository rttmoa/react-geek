import { AuthRoute } from '@/components/AuthRoute'
import { KeepAlive } from '@/components/KeepAlive'
import { history } from '@/utils'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import Article from './pages/Article'
import Layout from './pages/Layout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Chat from './pages/Profile/Chat'
import ProfileEdit from './pages/Profile/Edit'
import ProfileFeedback from './pages/Profile/Feedback'
import Search from './pages/Search'
import SearchResult from './pages/Search/Result'
// Layout

// TODO:

// FIXME:


//创建函数组件 rfc
function App() { 
  return (
    <Router history={history}> 
      
      <KeepAlive alivePath="/home" path="/home" exact component={Layout} />{/* 返回的组件如果true显示Layout、如果false就白屏 */}

      <Switch>
        
        <Route exact path="/" render={() => <Redirect to="/home/index" />} />
        <Route exact path="/home" render={() => <Redirect to="/home/index" />} />

        <Route path="/login" component={Login} />
        <Route path="/search" exact component={Search} />
        <Route path="/article/:id" component={Article} />
        <Route path="/search/result" exact component={SearchResult} />

        <AuthRoute path="/profile/edit" component={ProfileEdit} />
        <AuthRoute path="/profile/feedback" component={ProfileFeedback} />
        <AuthRoute path="/profile/chat" component={Chat} />

        {/* <Route path="*" component={NotFound} /> */}
        {/* 注意：因为 /home 不在 Switch 内部，所以，需要手动处理 /home 开头的路由，否则，会被当做 404 处理 */}
        <Route path="*" render={props => {
          // startsWith 如果字符串以指定的前缀开始，则返回 true；否则返回 false
          if (props.location.pathname.startsWith('/home')) {
            // http://localhost:3000/home/222
            // return <div>未找到页面哦</div>
            return null;
          }
          return <NotFound {...props} />
        }} />
      </Switch>
    </Router>

    // react-router配置方法: https://www.jb51.net/article/162399.htm
  )
}

export default App