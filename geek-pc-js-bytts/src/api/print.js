// 封装和文章相关的接口
import request from 'utils/request'



// 获取立体库数据      获取立库货架-待上架原料表数据
export const getSeniorLibrary = (params) => {
    return request({
        url: '/api/select/senior',
        method: "get",
        params,
    })
}

// 获取普通库数据      获取erp详情表数据
export const getCommonLibrary = (params) => {
    return request({
        url: '/api/select/common',
        method: "get",
        params,
    })
}