import request from 'utils/request'


// 获取原料入库的详情数据
export const getMaterialBoxData = (loc) => {
    return request({
      method: 'GET',
      url: '/api/pc/13/material/storage/request',
      params: {
        loc
      }
      /**--- 后台获取到的数据为  req.query { loc: '1001' } ---**/
    })
}


// 原料入库回库接口(投料区)
export const postMaterialPutBackToStorage = (Loc, Sign) => {
  // console.log(Loc) // 3003
  // console.log(Sign) // BackToStorage
  return request({
    method: 'POST',
    url: '/api/pc/21/material/put/back/to/storage',
    data: {
      Loc,
      Sign,
    }
  })
}