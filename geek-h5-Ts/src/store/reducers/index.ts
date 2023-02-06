import login from './login'
import profile from './profile'
import home from './home'
import { combineReducers } from 'redux' // es6
import search from './search'
import article from './article'


const reducer = combineReducers({ // (alias) combineReducers<{ }>(reducers: { }): Reducer<...> 
  login,
  profile,
  home,
  search,
  article,
})

export default reducer
