import ArticleItem from '@/components/ArticleItem'
import NavBar from '@/components/NavBar'
import { getSearchList } from '@/store/actions'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import styles from './index.module.scss'



/**
 * 功能实现:
 * 根据搜索的关键词 获取搜索到的文章 遍历文章ArticleItem结构
 */
const SearchResult = () => {
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()

  const articles = useSelector(state => state.search.searchList)

  // console.log(location.search) // ?q=101 | ?q=koa     测试、 ?q=koa&user=zhangsan
  const params = new URLSearchParams(location.search) // https://nodejs.org/api/url.html#class-urlsearchparams
  const q = params.get('q')
  // const u = params.get('user')
  // console.log(q) // 101 | koa
  // const obj = {}
  // obj.q = q;
  // obj.u = u;
  // console.log(obj) // {q: 'koa', u: 'zhangsan'}



  useEffect(() => { 
    dispatch(getSearchList(q))
  }, [q, dispatch])

  const onToAritcleDetail = art_id => {
    // console.log('进入文章')
    // return
    history.push(`/article/${art_id}`)
  }

  // const { page, per_page, results, total_count } = articles // 这里先不用分页功能、所以只要结果渲染即可
  const { results } = articles

  return (
    <div className={styles.root}>
      <NavBar onLeftClick={() => history.go(-1)}>搜索结果</NavBar>
      <div className="article-list">
        {results?.map(item => {
          // console.log(item)
          // const isLogin = true // 传递一个isLogin=true、外壳显示就有 x 图标
            const { aut_name, comm_count, pubdate, title, art_id, cover: { type, images }} = item
            
            const articleItemProps = { type, title, aut_name, comm_count, pubdate, images};
  
            return (
              /**--- 渲染外壳 - 点击盒子跳转到文章详情 ---**/
              <div key={art_id} onClick={() => onToAritcleDetail(art_id)}>
                <ArticleItem key={item.art_id} {...articleItemProps} />
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default SearchResult
