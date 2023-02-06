import ArticleItem from '@/components/ArticleItem'
import { setMoreAction } from '@/store/actions'
import { http, isAuth } from '@/utils'
import { PullToRefresh } from 'antd-mobile'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import ContentLoader from 'react-content-loader'//TODO: Loader 生成列表加载占位组件、低俗3g看效果
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { areEqual, VariableSizeList as List } from 'react-window'//TODO: react-window 中的 areEqual
import InfiniteLoader from 'react-window-infinite-loader'//TODO: 滚动加载器
import styles from './index.module.scss'
 

 
/**--- 正在加载的时候、占位用的、表示正在加载中、还没有渲染出ArticleItem外壳 ---**/
const Row = memo(({ index, style, data, setSize }) => {//TODOS: 渲染列表占位符 | 渲染主页每条新闻数据 | 点击进入文章 | 点击举报
  const dispatch = useDispatch()
  const isLogin = isAuth()
  const rowRef = useRef()
  const history = useHistory()
  const item = data.list[index];
  // console.log('索引', index)
  // console.log('数据', data)
  // console.log(item)

  useEffect(() => {

    // TODO: 获取DOM元素、top值不断累加
    // console.log(rowRef.current)

    // 滚动后、顶部的每一个Item盒子的高度
    // console.log(rowRef.current.scrollHeight)

    if (rowRef.current){
      // 回调的函数在155行
      setSize(index, rowRef.current.scrollHeight)   
    }

  }, [rowRef, index, setSize])


  //TODO: 页面一进入时、如果没有文章 渲染出列表加载占位符  item代表每一篇文章
  if (!item) {
    return (
      // 占位组件 参考: https://www.jianshu.com/p/8169d8136624?utm_campaign=maleskine

      <ContentLoader
        speed={2}
        width={375}
        height={137}
        viewBox="0 0 375 137"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="16" y="15" rx="3" ry="3" width="223" height="22" />
        <rect x="245" y="14" rx="3" ry="3" width="110" height="80" />
        <rect x="16" y="105" rx="0" ry="0" width="50" height="22" />
        <rect x="76" y="105" rx="0" ry="0" width="50" height="22" />
        <rect x="136" y="105" rx="0" ry="0" width="50" height="22" />
      </ContentLoader>
    )
  }


  const { art_id } = item;

  /** TODO: 点击跳转到新闻页面 */
  const onToAritcleDetail = () => history.push(`/article/${art_id}`)

  /** TODO: 点击举报 */
  const onFeedback = art_id => {
    // console.log(art_id) // 08cfda7c-f062-43af-8cec-30bf8d41e2b0
    return dispatch(setMoreAction({ id: art_id, visible: true  }))
  }

  const {  aut_name,  comm_count,  pubdate,  title,  cover: { type, images }  } = item;

  // 把这些属性向ActicleItem组件中传递属性
  const articleItemProps = {  art_id, isLogin,     type, images, title,  aut_name,  comm_count,  pubdate  }
  // console.log(1, data.hasMore)
  // console.log(2, index === data.list.length-1 )

  return (
    <div
      style={style}
      className="article-item"
      ref={rowRef}
      onClick={onToAritcleDetail}
    >
      {/* 渲染外壳、每一条新闻的样式(标题, 图片, 数据信息) */}
      <ArticleItem {...articleItemProps} onFeedback={onFeedback} />  
      {
        !data.hasMore && index === data.list.length-1 && (
          <div className="list-no-more">没有更多文章了</div>
        )
      }
    </div>
  )
}, areEqual)

















/**--- FIXME: ArticleList ---**/
/**--- 参数1：channelId、父组件传递过来的item.id ---**/
/**--- 参数2：activeId、Tabs组件中、 {return React.cloneElement(child,{activeId: tabs[activeIndex]?.id || 0})} ---**/
const ArticleList = ({ channelId, activeId }) => {
  // console.log('ArticleList activeId', activeId) // 拿到Item.id的值


  // <InfiniteLoader />组件中使用的listRef.current及sizeMap.current
  // 解决办法Github: https://github.com/bvaughn/react-window/issues/6#issuecomment-548897123
  const listRef = useRef()
  const sizeMap = useRef({}) 
  const setSize = useCallback((index, size) => { // size表示盒子的高度
    // console.log(index, size)
    if (sizeMap.current[index]) return
    sizeMap.current = { ...sizeMap.current, [index]: size }
    listRef.current.resetAfterIndex(index)
  }, []);
  const getSize = useCallback(index => {
    return sizeMap.current[index] || 70
  }, [])


  // 这里 setRefreshing(false) 表示没有更多数据了   setRefreshing(true)表示有更多数据
  const [refreshing, setRefreshing] = useState(false)//TODO: 控制PullToRefresh组件是否加载更多数据, 一进来不用加载更多数据

  const [articles, setArticles] = useState( { list: [], preTimestamp: +new Date()} )
  // console.log('文章数据', articles.list)

  const [hasMore, setHasMore] = useState(true)


  // TODO: 页面一进来执行一下useEffect函数(article:10)、还会执行一次loadMoreItems函数(article:20)
  useEffect(() => {
    // 注意：useEffect中应该是同步的  如果是异步的 返回的是Promise  返回的就不是函数了  错误
    // 清理副作用 是函数 不是Promise
    const loadData = async () => {
      const res = await http.get('/articles', {
        params: {
          channel_id: channelId, 
          timestamp: +new Date()
        }
      })
      const { results, pre_timestamp } = res.data.data
      setArticles({ list: results, preTimestamp: pre_timestamp }) 
    }

    // 保证只在组件第一次被“激活”并且 list 列表为空时，发送请求   ||  刷新页面
    if (activeId === channelId && articles.list.length === 0) {
      // console.log('第一次执行*1、初始 useEffect 执行， 只执行一次、第二次条件就不满足了')
      loadData()
    }
    // 如果在加载中，不允许重复加载    if(loading) return
    // 如果不是当前的频道，也不需要加载  if(channelId !== activeId )  return
    // 正在加载 setLoading(true)
  }, [channelId, activeId, articles])


  // console.log('列表数据长度', articles.list.length)
  const loadMoreItems = (startIndex, stopIndex) => {
    // 列表数据为空时，说明当前 tab 还没有被激活，此时，不需要加载数据
    // console.log('第一次执行*2、loadMoreItems')
    if (articles.list.length === 0) return Promise.resolve()
 
    return new Promise(async resolve => {
      const res = await http.get('/articles', {
        params: {
          channel_id: channelId,
          timestamp: articles.preTimestamp
        }
      })
 
      resolve()

      const { results, pre_timestamp } = res.data.data

      if (!pre_timestamp) {
        setHasMore(false) // 没有数据了、不用加载了
      } else {
        setArticles({
          // 这个list表示、useEffect中的list或者下拉时所有的list数据
          list: [...articles.list, ...results],
          preTimestamp: pre_timestamp
        })
      }
      
    })
  }
  
  const onPullToRefresh = async () => {
    // 控制加载、刷新为true
    setRefreshing(true) 
    // console.log(new Date()) // Sat Oct 22 2022 20:23:20 GMT+0800 (中国标准时间)
    // console.log(+new Date())// 1666441400286
    // return;

    // console.log('频道ID', channelId, activeId)
    const res = await http.get('/articles', {
      params: { 
        channel_id: channelId,
        timestamp: +new Date()
      }
    })
    // console.log(res)
    const { results, pre_timestamp } = res.data.data
    setArticles({
      list: results,
      preTimestamp: pre_timestamp
    })


    // 主动加载下一页数据
    loadMoreItems()
    setRefreshing(false)
  }



  const isItemLoaded = index => {
    // console.log(1, index) 
    // console.log(2, articles.list)
    // console.log(3, articles.list[index])
    // console.log(4, !!articles.list[index])

    return !!articles.list[index];
  }



  const itemCount = hasMore ? articles.list.length + 1 : articles.list.length
  // console.log(itemCount) // 1, 11, 21










   
  /**
   * TODO: 下拉刷新及滚动无限加载组件
   * https://bvaughn.github.io/forward-js-2017/#/12/5  
   * https://zhuanlan.zhihu.com/p/129791566 
   * 下拉刷新、<PullToRefresh />  - https://antd-mobile-v2.surge.sh/components/pull-to-refresh-cn/#API
   * 滚动加载、<InfiniteLoader /> - https://github.com/bvaughn/react-window-infinite-loader#documentation
   * 滚动加载案例                   https://github.com/bvaughn/react-window-infinite-loader#creating-an-infinite-loading-list
   * ref                           https://github.com/bvaughn/react-window/issues/324#issuecomment-528887341
   */
  return (
    // 是否隐藏其他盒子、两个key做比较
    <div className={styles.root} style={{ display: activeId === channelId ? 'block' : 'none' }}>

      <PullToRefresh
        // 拉动距离限制
        damping={60}
        // 是否显示刷新状态
        refreshing={refreshing} //TODO 控制是否加载更多数据
        // 必选, 刷新回调函数
        onRefresh={onPullToRefresh} //TODO 要加载刷新 发请求
      >
        {/* 显示所有文章数据的大盒子 */}
        <div className="articles">  

          {/* InfiniteLoader配合react-window使用 */}
          <InfiniteLoader
            // 负责跟踪每页数据的加载状态的函数
            isItemLoaded={isItemLoaded}

            // 列表中的行数；如果实际数字未知，则可以是任意高数字
            // itemCount={10}
            itemCount={itemCount}

            // 必须加载更多行时调用的回调。它应该返回一个 Promise，一旦所有数据完成加载，该 Promise 就会被解决
            loadMoreItems={loadMoreItems}
          >
            {
              ({ onItemsRendered, ref }) => {
                // 
                return (
                  // List是VariableSizeList
                  <List
                    height={(window.innerHeight - 90) * (window.innerWidth / 375)}
                    itemCount={itemCount}
                    itemSize={getSize}
                    onItemsRendered={onItemsRendered}
                    itemData={{ list: articles.list, hasMore}}
                      
                    ref={list => {
                      if (list) {
                        ref(list)
                        listRef.current = list
                      }
                    }}
                  >
                    {props => {
                        // console.log(props)
                        // props: { data:{list: Array(20),hasMore}, 
                        //          index:8, 
                        //          isScrolling:undefined, 
                        //          style:{height, left, position,right, top, width}}
                        // console.log(props.isScrolling)
                        return(<Row {...props} setSize={setSize} />)
                      }}
                  </List>
                )
              }
            }
          </InfiniteLoader>
        </div>
      </PullToRefresh>
    </div>
  )
}

export default ArticleList