import { Router, Switch, Redirect,Route } from 'react-router-dom'
import PrivateRoute from 'components/PrivateRoute'
import React, { Suspense } from 'react'
import history from 'utils/history'
const print = React.lazy(() => import('pages/Print'))
const qrcode = React.lazy(() => import('pages/Print/qrcode'))
const Layout = React.lazy(()=> import('pages/Layout'))
// const Text = React.lazy(() => import('pages/Layout')) 

function App() {  
  return (
    <Router history={history}>  {/* history 官网router路由 */}
      <div className="App">
        

        {/* fallback: 兜底、如果组件还没有加载、默认会显示fall的内容 */}
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
          <Redirect exact from='/' to="/home"></Redirect>


          <PrivateRoute path="/home" component={Layout}></PrivateRoute>

          <Route path="/p" exact component={print} ></Route>
          <Route path="/pqrcode" exact component={qrcode}></Route>

          {/* <Route path="/t" component={Text}></Route> */}
          </Switch>
        </Suspense>
        
      </div>
    </Router>
  )
}

export default App
