import Icon from '@/components/Icon'
import Tabs from '@/components/Tabs'
import { getUser, getUserChannel } from '@/store/actions'
import { isAuth } from '@/utils'
import { Drawer } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ArticleList from './components/ArticleList'
import Channels from './components/Channels'
import MoreAction from './components/MoreAction'
import styles from './index.module.scss'

const CHANNEL_KEY = 'itcast_channel_k'


/**
 * 0.useState()默认参数可以是 布尔值/数字类型/字符串/数组类型/对象类型/任意类型
 * 1.控制频道列表下标
 * 2.控制抽屉组件的显示与隐藏
 * 3.复用的组件有: Tabs(动画效果) | ArticleList | Channels | moreAction
 * 
 * 如何正确使用的组件???
 * 1.点击哪个频道 显示对应的频道数据  2.显示频道数据中的关闭按钮 如何渲染  3.滑动才加载请求
 */
 

// rfc生成函数组件
const Home = ({ history }) => {

  const dispatch = useDispatch();

  /**--- 所有的频道... 推荐, 开发者咨询, html..... ---**/
  const tabs = useSelector(state => state.home.userChannel) 
  // console.log('用户频道', tabs)

  /**--- index控制哪个频道高亮 | 点击了哪个频道 ---**/
  const [tabActiveIndex, setTabActiveIndex] = useState(0) 

  /**--- 控制抽屉组件的开启/关闭(布尔值) ---**/
  const [open, setOpen] = useState(false)


  // 获取 频道 信息   
  useEffect(() => {
    const loadData = async () => {
      const isLogin = isAuth();
      // 如果未登录 
      if (!isLogin) {
        const localTabs = JSON.parse(localStorage.getItem(CHANNEL_KEY)) || [];
        // 本地缓存中有 频道 数据    localTabs：本地缓存数据的数组
        if (localTabs.length > 0) {
          dispatch(getUser(localTabs))    
          return
        }
      }else{
        // 已登陆、发请求获取数据、存到redux中
        dispatch(getUserChannel())
      }
    }
    loadData()
  }, [dispatch])


  useEffect(() => {
    if (tabs.length === 0) return
    localStorage.setItem(CHANNEL_KEY, JSON.stringify(tabs))
  }, [tabs]) // 监听频道变化、如果变化就存到localStoreage中


 

  // console.log(tabs)
  // console.log(tabActiveIndex)


  return (
    <div className={styles.root}>
      {/* 根据索引下标去渲染哪部分内容 */}
      <Tabs
        index={tabActiveIndex} 
        tabs={tabs}  
        onChange={index => {
          // console.log('子组件传递的索引下标', index);
          setTabActiveIndex(index)
        }}
      >
        {/* 渲染每个ArticleList都发请求了  只是要选择哪个频道 哪个频道去发请求就可以了 */}
        {/* 传入的ArticleList属性中加一个 activeId={tabs[active].id}  拿到所有频道对应激活的id  在组件Tabs里面的 渲染React.Children.map()  */}
        
        {
          // 先注释掉这部分
          tabs.map(item => {
            // console.log(item) 
            return <ArticleList key={item.id} channelId={item.id} />
          })  
        }

      </Tabs>
      {/* ====================================首页-Tab栏========================================= */}



      <div className="tabs-opration">
        <Icon type="iconbtn_search" onClick={() => history.push('/search')} />
        <Icon type="iconbtn_channel" onClick={() => setOpen(true)} />    
      </div>  
      {/* ====================================首页-Tab栏 右侧搜索图标和频道列表============================= */}



      <Drawer
        className="my-drawer"
        style={{ minHeight: document.documentElement.clientHeight }}
        sidebar={
          // 如果 tab栏 频道有数据 渲染 Channels组件 否则 ''       一来不用渲染 如果有数据才渲染
          tabs.length > 0 ? (
            <Channels
              tabActiveIndex={tabActiveIndex}
              userChannles={tabs} 
              onClose={() => setOpen(false)}
              onChange={(value) => dispatch(getUser(value))} 
              onChannelClick={index => setTabActiveIndex(index)} 
            />
          ) : ('')
        }
        open={open}
        onOpenChange={() => setOpen(false)}
      >
        {''}
      </Drawer>
      {/* =====================================渲染频道的数据=========================================== */}



                                                <MoreAction />
      {/* =====================================频道上的举报功能=========================================== */}

      </div>
  )
}
export default Home






// 在useEffect发请求获取数据 数据给setTabs存储起来
/**
  const [tabs, setTabs] = useState([ ])
  useEffect(() => {
    const loadTabsData = async () => {
      const res = await http.get('/channels')
      const { channels } = res.data.data
      const newTabs = channels.map(item => ({ title: item.name }))
      setTabs(newTabs)
    }
    loadTabsData()
  }, [])
*/