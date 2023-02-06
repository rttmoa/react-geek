import { getTokens } from '@/utils'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

let middlewares = applyMiddleware(thunk)

// 需要传入 {}
const composeEnhancers = composeWithDevTools({ })
middlewares = composeEnhancers(middlewares)

// 刷新页面时，读取本地缓存中的 tokens
const preloadedState = getTokens()

// 可以传入三个参数: 参数1：reducer， 参数2：指定store的初始值， 参数3：指定中间件
const store = createStore(
  rootReducer,
  {
    login: preloadedState || {}    //表示 login 模块
  },
  middlewares
)

export default store