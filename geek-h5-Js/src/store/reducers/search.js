const initialState = {
  suggest: [],
  searchList: []
}

const search = (state = initialState, action) => {
  // console.log(action.payload)
  switch (action.type) {
    case 'search/suggetion':
      return {
        ...state,
        suggest: action.payload
      }
    case 'search/clear':
      return {
        ...state,
        suggest: []
      }
    case 'search/list':
      return {
        ...state,
        searchList: action.payload
      }
    default:
      return state  //--->表示如果action.type没有case到属性  就默认返回初始化的state(initialState对象)
  }
}

export { search }
