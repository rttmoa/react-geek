import styles from './index.module.scss'
import ArticleItem from '../ArticleItem'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getArticleList, getMoreArticleList } from '@/store/actions/home'
import { useSelector } from 'react-redux'
import { PullToRefresh, InfiniteScroll } from 'antd-mobile-v5'
import { RootState } from '@/store'

/* 
  TODO: 获取文章列表的数据

  // 获取频道1下最新的文章数据
  request({
    channel_id: 1,
    timestamp: Date.now()
  })
  pre_timestamp

  // 1
  request({
    channel_id: 1,
    timestamp: pre_timestamp
  })

  redux中文章的数据格式

  articles: {
    频道的id1: {
      list: [文章的列表],
      timestamp: 时间戳
    },
    频道的id2: {
      list: [文章的列表],
      timestamp: 时间戳
    },
    频道的id3: {
      list: [文章的列表],
      timestamp: 时间戳
    },
    频道的id4: {
      list: [文章的列表],
      timestamp: 时间戳
    } 
  }
*/

/**
 * TODO: 文章列表组件
 * @param {String} props.channelId 当前文章列表所对应的频道ID （每个选项卡的ID）
 * @param {String} props.aid 当前Tab栏选中的频道ID （当前选项卡的ID）
 */
type Props = {
  channelId: number
  activeId: number
}
const ArticleList = ({ channelId, activeId }: Props) => {  
  const dispatch = useDispatch();
  const current = useSelector((state: RootState) => state.home.articles[channelId]);
  // console.log(channelId, activeId)
  // console.log(current)

  // TODO: getArticleList (获取文章列表数据接口)
  // TODO: getMoreArticleList (加载更多文章列表数据)
  useEffect(() => {
    // 如果该频道有文章数据，没必要一进来就发送请求
    if (current) return;
    if (channelId === activeId) {
      dispatch(getArticleList(channelId, Date.now() + '')) // number => string
    }
  }, [channelId, activeId, dispatch, current])

  const onRefresh = async () => {
    // 下拉刷新，需要重新加载最新的数据
    setHasMore(true);
    await dispatch(getArticleList(channelId, Date.now() + '')) 
  }

  // 控制是否有更多数据
  const [hasMore, setHasMore] = useState(true); 

  // 是否正在加载中
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    // 如果在加载中，不允许重复加载
    if (loading) return

    // 如果不是当前的频道，也不需要加载
    if (channelId !== activeId) return;
    // console.log(channelId, activeId) // 相等时才加载

    // 如果没有更多数据
    if (!current.timestamp) {
      setHasMore(false)
      return
    }

    // 正在加载
    setLoading(true)
 
    try {
      await dispatch(getMoreArticleList(channelId, current.timestamp))
    } catch (error) {
      
    } finally {
      setLoading(false)
    } 
  }

  // 如果不是当前频道，没有文章数据，先不渲染
  if (!current) return null;
  return (
    <div className={styles.root}>
      <div className="articles">
        <PullToRefresh onRefresh={onRefresh}>
          {current.list.map((item) => {
            // console.log(item)
            // console.log(channelId)
            return (
              <div className="article-item" key={item.art_id}>
                {/* 文章列表 - 每一个Article Box */}
                <ArticleItem channelId={channelId} article={item}></ArticleItem>
              </div>
            )
          })}
        </PullToRefresh>
        {/* 上拉加载更多 */}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </div>
    </div>
  )
}

export default ArticleList
