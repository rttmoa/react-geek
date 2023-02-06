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
    return {
      ...state,
      suggestions: action.payload,
    }
  }
  if (action.type === 'search/clearSuggestions') {
    return {
      ...state,
      suggestions: [], // 清空搜索内容
    }
  }
  if (action.type === 'search/saveHistories') {
    return {
      ...state,
      histories: action.payload,
    }
  }
  if (action.type === 'search/clearHistories') {
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
