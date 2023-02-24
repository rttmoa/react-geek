



export const ArticleStatus = [
    // {0: { text: '草稿', color: 'gold' },}
    {id:0, value: -1, name: '全部', color: "green"},
    {id:1, value: 0, name: '草稿', color: "green"},
    {id:2, value: 1, name: '待审核', color: "green"},
    {id:3, value: 2, name: '审核通过', color: "green"},
    {id:4, value: 3, name: '审核失败', color: "green"},
]



// 通过对象来优化if/switch
// 使用方式：articleStatus[0] => { text: '草稿', color: '' }
export const articleStatus = {
    0: { text: '草稿', color: 'gold' },
    1: { text: '待审核', color: 'lime' },
    2: { text: '审核通过', color: 'green' },
    3: { text: '审核失败', color: 'red' }
}
