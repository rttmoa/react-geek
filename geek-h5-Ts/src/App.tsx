import React, { Suspense } from 'react'
import { Router, Route, Switch, Redirect } from 'react-router-dom'// 需要下载 "@types/react-router-dom": "^5.1.9",
import './App.scss'
import AuthRoute from './components/AuthRoute'
import history from './utils/history'
import KeepAlive from './components/KeepAlive'


const Login = React.lazy(() => import('@/pages/Login'))
const Home = React.lazy(() => import('@/pages/Layout'))
const ProfileEdit = React.lazy(() => import('@/pages/Profile/Edit'))
const ProfileChat = React.lazy(() => import('@/pages/Profile/Chat'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))
const ProfileFeedback = React.lazy(() => import('@/pages/Profile/Feedback'))
const Search = React.lazy(() => import('@/pages/Search'))
const SearchResult = React.lazy(() => import('@/pages/Search/Result'))
const Article = React.lazy(() => import('@/pages/Article'));



export default function App() {
  return (
    <Router history={history}>
      <div className="app">
          <Suspense fallback={<div>Loading...</div>}> 
            <KeepAlive
              alivePath="/home"
              path="/home"
              component={Home}
              exact
            ></KeepAlive>
            {/* <Route path="/home" component={Home}></Route> */}

            <Switch>
              <Redirect exact from="/" to="/home/index"></Redirect>
              <Route path="/login" component={Login}></Route>
              <Route path="/search" exact component={Search}></Route>
              <Route path="/search/result" exact component={SearchResult}></Route>
              <Route path="/article/:id" exact component={Article}></Route>

              {/* 需要登录才能访问 */}
              <AuthRoute path="/profile/edit" component={ProfileEdit}></AuthRoute>
              <AuthRoute path="/profile/chat" component={ProfileChat}></AuthRoute>
              <AuthRoute path="/profile/feedback" component={ProfileFeedback}></AuthRoute>

              <Route render={(props) => {
                  if (!props.location.pathname.startsWith('/home')) return <NotFound />
                }}
              ></Route>
            </Switch>
          </Suspense>
      </div>
    </Router>
  )
}
