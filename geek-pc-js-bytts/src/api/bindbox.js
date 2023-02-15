import request from 'utils/request'

// 获取Mes装配计划 
export const getMesAllData = (params) => {
    return request({
        url: '/api/pc/1/mes/bind/box',
        method: "get",
        params,
    })
}


// 提交数据绑定选择好的空箱
export const postBindBoxData = (result, position) => {
    // console.log(result, value)
    return request({
      method: 'POST',
      url: '/api/pc/2/mes/submit/box',
      data: {
        result,
        position,
      },
    })
  }

// 获取已绑定的所有空箱子、查找标记字段为record的所有记录 
export const getMesBindBoxData = (params) => {
  return request({
    method: 'GET',
    url: '/api/pc/3/mes/bind/box/finished',
    params
  })
}



// 配餐时获取原料箱的数据 - 查找状态为'到达'的数据
export const getMaterialData = () => { 
  return request({
    method: 'GET',
    url: '/api/pc/11/material/request',
    // params
  })
}


// 配餐时获取配餐空箱的数据 - 查找状态为位置的数据 - 1001, 1002, 1003...
export const getNullBoxData = (loc) => {
  // console.log(params)
  return request({
    method: 'GET',
    url: '/api/pc/12/nullbox/request',
    params: {
      loc
    }
    /**--- 后台获取到的数据为  req.query { loc: '1001' } ---**/
  })
}



/**--- (拣选区)原料回库接口 ---**/
export const postMaterialPickBackToStorage = (Loc, Sign) => {
  // console.log(Loc) // 2010
  // console.log(Sign) // BackToStorage
  return request({
    method: 'POST',
    url: '/api/pc/22/material/pick/back/to/storage',
    data: {
      Loc,
      Sign,
    }
  })
}