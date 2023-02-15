// 封装和文章相关的接口
import request from 'utils/request'



export const getArticles = ( params ) => {
    console.log(params)
    return request({
        url: '/mp/articles',
        method: "get",
        params,
    })
}

/**
 * 删除文章接口
 * @param {*} id 
 * @returns 
 */
export const delArticle = (id) => {
    return request.delete(`/mp/articles/${id}`)
}