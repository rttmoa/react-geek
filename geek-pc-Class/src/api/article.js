import request from 'utils/request'


/**--- 获取文章数据 ---**/
export const getArticles = ( params ) => {
    // console.log(params)
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


/**--- 修改文章 ---**/
export const modifyArticle = (url, data) => {
    return request.put(url, data)
}


/**--- 添加文章 ---**/
export const addArticle = (url, data) => {
    return request.post(url, data)
}