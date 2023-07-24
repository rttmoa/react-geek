import { Ariticle } from './home'

type SeartchType = {
  suggestions: string[]
  histories: string[]
  results: Ariticle[]
}
const initValue: SeartchType = {
  // 存放推荐的结果(输入关键词， 建议你搜索哪个文章)
  suggestions: [],
  // 存放历史记录
  histories: [],
  // 存放搜索的结果
  results: [],
}

export type SearchAction =
  | {
      type: 'search/saveSuggestions'
      payload: string[]
    }
  | {
      type: 'search/clearSuggestions'
    }
  | {
      type: 'search/saveHistories'
      payload: string[]
    }
  | {
      type: 'search/clearHistories'
    }
  | {
      type: 'search/saveResults'
      payload: Ariticle[]
    }

    
export default function reducer(state = initValue, action: SearchAction) {
  if (action.type === 'search/saveSuggestions') { 
    // action.payload: a ['postMessage', 'koa', 'Toast', 'localStorage', 'FormData', 'webpack', 'canvas', 'app', 'a']
    return {
      ...state,
      suggestions: action.payload, // suggestions: string[]
    }
  }
  if (action.type === 'search/clearSuggestions') {  // 清空搜索建议
    // 将redux中suggestions数组置空
    return {
      ...state,
      suggestions: [],
    }
  }
  if (action.type === 'search/saveHistories') { // 存储 搜索历史关键词
    // console.log(action.payload) // (10) ['v', 'a', 'o', 'g', 'f', 'r', 'y', 'b', 'Tips', 'sessionStorage']
    return {
      ...state,
      histories: action.payload, // histories: string[]
    }
  }
  if (action.type === 'search/clearHistories') { // 清空 历史关键词
    return {
      ...state,
      histories: [],
    }
  }
  if (action.type === 'search/saveResults') {
    return {
      ...state,
      results: [...state.results, ...action.payload],
    }
  }
  return state
}
