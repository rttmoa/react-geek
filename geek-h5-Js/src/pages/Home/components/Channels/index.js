import Icon from '@/components/Icon'
import { addChannel, deleteChannel, getRecommendChannel } from '@/store/actions'
import { isAuth } from '@/utils'
import { Toast } from 'antd-mobile'
import classnames from 'classnames'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'


/**
 * 首页左侧抽屉组件里面的内容
 * 功能:
 * 1.添加频道
 * 2.删除频道
 * 3.切换频道
 * 4.控制className编辑/保存  实现我的频道的样式  编辑? 保存?
 */
const Channels = ({ userChannles = [], tabActiveIndex, onClose, onChange, onChannelClick }) => {
 
  const dispatch = useDispatch()

  const channelsList = useSelector(state => state.home.recommendChannel)// 推荐频道

  const [isEdit, setIsEdit] = useState(false)//TODO: 控制 编辑/保存 默认是保存状态

  const isLogin = isAuth() 

  useEffect(() => {
    if (channelsList.length === 0) {
      dispatch(getRecommendChannel(userChannles))
    }
  }, [dispatch, userChannles, channelsList.length])

  const onEdit = () => setIsEdit(!isEdit)//TODO: 这里默认是false  点击取反就好了 




  const onDeleteChannel = async data => {/**--- 删除频道 - 这里处理的数据、用户及推荐的Redux数据都是处理过的 ---**/
    //TODO: data->{id: 21, title: '面试'}

    if(userChannles.length <= 4){ Toast.info('至少保留4个频道呦', 1);   return } 

    const newTabs = userChannles.filter(item => {
      return item.id !== data.id
    })

    // return

    onChange(newTabs) // 直接传入redux中

    // 删除频道
    dispatch(deleteChannel(data, isLogin))


    // 高亮处理  需要接收一个  i   在 onClick中也要传递 一个 i
    // 1.如果删除的 i 和 index 相等,默认让推荐 0 高亮
    // 2.如果删除的 i 小于 index, 默认让 i - 1 高亮
    // 3.如果删除的 i 大于 index, 不用处理
    // if(i < index) {onChange(i - 1)}else if(i === index){onChange(0)}else{onChange(i)

  }

  
 
  const onAddChannel = async data => {/**--- 添加频道 - 需要处理用户频道及推荐频道  ---**/
    
    const newTabs = [...userChannles, data] 
    // console.log(newTabs)
    // return 
    onChange(newTabs) // 用户频道 

    dispatch(addChannel(data, isLogin))//TODO: 添加频道
  }

 
  const onChannelItemClick = index => {/**--- 点击切换频道 ---**/
    // console.log('切换频道', index)
    // return

    // 如果点击了编辑、需要关闭掉、否则再次进入还是编辑状态
    setIsEdit(false) 
    // 这里需要关闭抽屉、否则点击虽然切换了频道、但是回不到主页面
    onClose()
    // 重新设置索引下标
    onChannelClick(index)
  }







/**Home主页中 返回的结构
 * 参数为 
 * userChannles(用户的频道), 
 * tabActiveIndex(当前频道的索引下标), 
 * onClose(关闭抽屉组件), 
 * onChange(频道的变化-回调), 
 * onChannelClick(切换频道的索引下标)
 */
  return (
    <div className={styles.root}>
      <div className="channel-header">
        <Icon type="iconbtn_channel_close" onClick={onClose} />
      </div>

      {/* 渲染我的频道结构 */}
      <div className="channel-content">

        <div className={classnames('channel-item', isEdit ? 'edit' : '')}>
          <div className="channel-item-header">
            <span className="channel-item-title">我的频道</span>
            <span className="channel-item-title-extra">
              点击{isEdit ? '删除' : '进入'}频道
            </span>
            <span className="channel-item-edit" onClick={onEdit}>
              {isEdit ? '保存' : '编辑'}
            </span>
          </div>
          <div className="channel-list">
            {
              userChannles.map((item, index) => (
                <span
                  key={item.id} 
                  className={classnames('channel-list-item', index === tabActiveIndex ? 'selected' : '')}
                  onClick={() => onChannelItemClick(index)}
                >
                  {item.title}
                  {item.id !== 0 &&  <Icon type="iconbtn_tag_close" onClick={e => { e.stopPropagation(); onDeleteChannel(item) }} /> } 
                </span>
              ))
            }

            {/* <span className="channel-list-item">开发者资讯(静态测试)</span> */}
          </div>
        </div>


        {/* 渲染频道推荐结构 */}
        <div className="channel-item">
          <div className="channel-item-header">
            <span className="channel-item-title">频道推荐</span>
            <span className="channel-item-title-extra">点击添加频道</span>
            <span className="channel-item-edit">添加</span>
          </div>
          <div className="channel-list">
            {
              channelsList.map(item => (
                <span key={item.id} className="channel-list-item" onClick={() => onAddChannel(item)} >
                  +{item.title}
                </span>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )     
}

export default Channels
