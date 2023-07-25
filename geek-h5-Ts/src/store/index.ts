import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';
import { getLocalHistories, getTokenInfo } from '@/utils/storage'
import { ThunkAction } from 'redux-thunk'
import { HomeAction } from './reducers/home'
import { LoginAction } from './reducers/login'
import { ProfileAction } from './reducers/profile'
import { SearchAction } from './reducers/search'
import { ArticleAction } from './reducers/article'


// 参数1：reducer
// 参数2：指定store的初始值
// 参数3：指定中间件 
const store = createStore(reducer, {
    login: getTokenInfo(),
    // 指定初始值
    search: {
      suggestions: [],
      // results: {list: [], page: 1}
      results: [],
      histories: getLocalHistories(),  
    },
  },
  composeWithDevTools(applyMiddleware(thunk))
)

// 获取RootState的类型
// typeof: 获取store.getState的类型
// ReturnType 获取返回值的类型
export type RootState = ReturnType<typeof store.getState>


// URL: https://redux.js.org/usage/usage-with-typescript#type-checking-redux-thunks
// R：thunk的action的返回类型  void Promise<void>
// S: 需要指定个getState的返回类型  RootState
// E: extra: 额外的参数 any
// A: 需要指定Action的类型 Action AnyAction [extraProps: string]: any
// ThunkAction<R, S, E, A>
type RootAction =
  | HomeAction
  | LoginAction
  | ProfileAction
  | SearchAction
  | ArticleAction
  
export type RootThunkAction = ThunkAction<Promise<void>, RootState, unknown, RootAction>

export default store 