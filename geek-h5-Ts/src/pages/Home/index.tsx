import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import Tabs from '@/components/Tabs'
import { useDispatch } from 'react-redux'
import { getAllChannels, getUserChannels, setMoreAction } from '@/store/actions/home'
import { useSelector } from 'react-redux'
import Icon from '@/components/Icon'
import { Drawer } from 'antd-mobile'
import Channels from './components/Channels'
import ArticleList from './components/ArticleList'
import MoreAction from './components/MoreAction'
import { RootState } from '@/store'
import { useHistory } from 'react-router'




// Tabs 计算中心的位置
// Channels 使用lodash/differenceBy
export default function Home () {

  const dispatch = useDispatch()
  const history = useHistory()

  // 获取用户频道 & 获取所有频道
  useEffect(() => {
    dispatch(getUserChannels())
    dispatch(getAllChannels())
  }, [dispatch])

  const [open, setOpen] = useState(false) 
  const onClose = () => { setOpen(false) }

  const tabs = useSelector((state: RootState) => state.home.userChannels)
  // console.log('用户频道', tabs)

  // TODO: 控制高亮 & 切换Tab
  const [active, setActive] = useState(0); // 点击的Tab回调index
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

      <Tabs tabs={tabs} index={active} onChange={changeActive}>
        {tabs.map((item) => {
          // TODO: ArticleList 
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

      {/* TODO: MoreAction */}
      <MoreAction></MoreAction>

    </div>
  )
}
