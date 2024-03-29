import NavBar from '@/components/NavBar'
import styles from './index.module.scss'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchResults } from '@/store/actions/search'
import { RootState } from '@/store'
import ArticleItem from '@/pages/Home/components/ArticleItem'
import { InfiniteScroll } from 'antd-mobile-v5'
import { useState } from 'react'




// 地址栏参数获取：
  // 通过 history.push('search/result?key=' + key)  传递过来
  // 跳转 http://localhost:3020/search/result?key=v 页面当中
  // 通过 new URLSearchParams(useLocation().location.search).get("key")!
let page = 1  // 全局变量  如果放在里面  会一直调用1
const SearchResult = () => {
  const location = useLocation()
  const search = new URLSearchParams(location.search) // new URLSearchParams("?key=cookie")
  const key = search.get('key')!   // URLSearchParams {} key: cookie
  const dispatch = useDispatch()

  // 获取搜索结果
  const results = useSelector((state: RootState) => state.search.results);
  // console.log(results) // {art_id: '303', title: 'electron-vue邮件客户端总结', aut_id: '1111', aut_name: '黑马程序员(改不了)', comm_count: 0, …}

  
  // 是否有更多数据
  const [hasMore, setHasMore] = useState(true);
  // 加载状态
  const [loading, setLoading] = useState(false);
  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await dispatch(getSearchResults(key, page))
      page = page + 1;
    } finally {
      setLoading(false);
    }
    if (page > 5) {
      setHasMore(false);
    }
  }

  return (
    <div className={styles.root}>
      <NavBar className="navBar">搜索结果</NavBar>
      <div className="article-list">
        {results.map((item) => <ArticleItem key={item.art_id} article={item} channelId={-1}></ArticleItem>)}
      </div>
      {/* TODO: 滚动加载 */}
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  )
}

export default SearchResult
