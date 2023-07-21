import request from '@/utils/request'
import { removeLocalHistories, setLocalHistories } from '@/utils/storage'
import { RootThunkAction } from '..'
import { Ariticle } from '../reducers/home'
import { SearchAction } from '../reducers/search'

/**
 * 获取推荐列表
 * @param keyword 关键字
 */
type SuggestListRes = {
  options: string[]
}
export function getSuggestList(keyword: string): RootThunkAction {
  return async (dispatch) => {
    // axios.request<T>()  axios.get<T>() axios.post<T>()
    // T默认是any类型，用于指定data的类型
    // 如何给axios指定泛型
    // request.get<>()
    // axios.post<T>()
    const res = await request.get<SuggestListRes>('/suggestion?q=' + keyword)  // 指定接口返回值的类型 SuggestListRes  \ 更严格化
    // const res = await request({url: '/suggestion',method:'get',params:{ q:keyword }})
    let options = res.data.options  
    // 后台搜索 结果如果没有数据，返回的结果为[null],遍历就会报错，所以如果是这种情况，默认为[]
    if (!options[0]) {
      options = []
    } 
    dispatch({// dispatch完 在控制台redux中查看储存的数据 - 存储到Redux 
      type: 'search/saveSuggestions',
      payload: options, // let options: string[]
    })
  }
}


/** #### 清空推荐记录 （action）  */
export function clearSuggestions(): SearchAction {
  return {
    type: 'search/clearSuggestions',
  }
}


/** #### 添加搜索关键词 存储Localstoreage+Redux  */
export function addSearchList(keyword: string): RootThunkAction {
  return async (dispatch, getState) => {
    let histories = getState().search.histories;  
    // 1. 不允许有重复的历史记录, 先删除原来历史记录中的keyword
    histories = histories.filter((item) => item !== keyword)
    histories = [keyword, ...histories]
    if (histories.length > 10) {
      histories = histories.slice(0, 10);
    }
    // 保存 redux
    dispatch({ type: 'search/saveHistories', payload: histories })
    // 保存到本地
    setLocalHistories(histories)
  }
}

/** #### 清空历史记录Localstoreage+Redux （action）  */
export function clearHistories(): RootThunkAction {
  return async (dispatch) => {
    // 清空本地历史记录
    removeLocalHistories()
    // 清空redux数据
    dispatch({ type: 'search/clearHistories' })
  }
}


type ResultRes = {
  page: number
  per_page: number
  results: Ariticle[]
  total_count: number
}

/**
 * 获取搜索结果数据
 */
export function getSearchResults( keyword: string, page: number ): RootThunkAction {
  return async (dispatch) => {
    const res = await request.get<ResultRes>('search', {params: {q: keyword, page, per_page: 10}})
    // console.log(res.data.page)// 在get后指定泛型后、这里有提示功能
    dispatch({
      type: 'search/saveResults',
      payload: res.data.results,
    })
  }
}
