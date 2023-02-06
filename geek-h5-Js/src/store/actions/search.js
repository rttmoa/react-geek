import { http } from '@/utils'

/**TODO: redux存储 */
// 获取输入建议列表
const setSuggetionList = list => ({ type: 'search/suggetion', payload: list })

// 清空搜索建议
const clear = () => ({ type: 'search/clear' })

// 获取搜索文章列表
const setSearchList = list => ({ type: 'search/list', payload: list })



/**注释: 
 * 获取输入联想建议列表  
 * @param {string} q 查询内容    
 * @returns thunk 
 */
const getSuggestion = q => {
  return async dispatch => {
    const res = await http.get('/suggestion', {  params: { q } })
    // bug - 输入框中输入 12 返回的options为 [null]
    // console.log( res.data.data.options[0] == null)  
    if(res.data.data.options[0] == null)  return
    const { options } = res.data.data;
    // console.log(options)
    const suggestionList = options.map(item => {
      // console.log('item', item.split(' '))
      const [suggest, rest = ''] = item.split(' ')
      return {
        suggest,
        rest
      }
    })
    // console.log('suggestionList', suggestionList)
    dispatch(setSuggetionList(suggestionList))
  }
}

/**注释: 
 * 清空建联想议列表  
 * @returns thunk 
 */
const clearSuggestion = () => {
  return dispatch => {
    dispatch(clear())
  }
}

/**注释: 1.获取搜索文章列表   2.@param {string} q 查询内容   3.@returns thunk */
const getSearchList = q => {
  return async dispatch => {
    const res = await http.get('/search', { params: { q } } ) 
    // console.log(res)
    dispatch(setSearchList(res.data.data))
  }
}

export { getSuggestion, clearSuggestion, getSearchList }
