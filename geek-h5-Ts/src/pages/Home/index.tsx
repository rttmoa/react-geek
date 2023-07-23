import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { useDispatch } from 'react-redux'
import { getAllChannels, getUserChannels, setMoreAction } from '@/store/actions/home'
import { useSelector } from 'react-redux'
import Icon from '@/components/Icon'
import { Drawer } from 'antd-mobile'
import { RootState } from '@/store'
import { useHistory } from 'react-router'

// TODO: 封装组件复用
import Tabs from '@/components/Tabs'
import ArticleList from './components/ArticleList'
import Channels from './components/Channels'
import MoreAction from './components/MoreAction'




// Tabs 计算中心的位置
// Channels 使用lodash/differenceBy
export default function Home () {

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    // 获取用户频道 & 获取所有频道
    dispatch(getUserChannels())
    dispatch(getAllChannels())
  }, [dispatch])

  const [open, setOpen] = useState(false) 
  const onClose = () => { setOpen(false) }

  const tabs = useSelector((state: RootState) => state.home.userChannels) // 从redux中获取最新的 userChannels
  // console.log('用户频道', tabs)

  // TODO: 控制高亮 & 切换Tab
  const [active, setActive] = useState(0);  
  const changeActive = (e: number) => {
    setActive(e);
    dispatch(setMoreAction({
      visible: false,
      articleId: '',
      channelId: tabs[e].id,
    }))
  }

  
  return (
    <div className={styles.root}>

      {/* TODO: 封装Tabs组件 + 封装ArticleList组件  */}
      <Tabs tabs={tabs} index={active} onChange={changeActive}>
        {tabs.map((item) => {
          return <ArticleList key={item.id} channelId={item.id} activeId={tabs && tabs[active].id}></ArticleList>
        })}
      </Tabs>

      <div className="tabs-opration">
        <Icon type="iconbtn_search" onClick={() => history.push('/search')} />
        <Icon type="iconbtn_channel" onClick={() => setOpen(true)} />
      </div>

      <Drawer
        className="my-drawer"
        position="left"
        children={''}
        // TODO: Channels组件：添加频道，删除频道，获取推荐频道，切换频道
        sidebar={open && <Channels onClose={onClose} index={active} onChange={changeActive}></Channels>}
        open={open}
      ></Drawer>

      {/* TODO: MoreAction实现过程 */}
      <MoreAction></MoreAction>
    </div>
  )
}
