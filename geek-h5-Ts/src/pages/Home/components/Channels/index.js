import Icon from '@/components/Icon'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'
// import { differenceBy } from 'lodash'
import differenceBy from 'lodash/differenceBy'
import classNames from 'classnames'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addChannel, delChannel } from '@/store/actions/home'
import { Toast } from 'antd-mobile'






const Channels = ({ onClose, index, onChange }) => {

  const userChannels = useSelector((state) => state.home.userChannels)
  const dispatch = useDispatch()

  // 推荐频道
  const recommendChannels = useSelector((state) => {
    const { userChannels, allChannels } = state.home;
    return differenceBy(allChannels, userChannels, 'id');  // 推荐频道 = 所有频道 - 用户频道
  })

  // 切换
  const changeChannel = (i) => {
    // 如果是编辑状态，不允许跳转
    if (editing) return;
    // console.log(typeof i) // 查看传递到index组件的类型
    // FIXME: 高亮处理 
    // 1. 如果删除的 i 和 index相等，默认让推荐 0 高亮
    // 2. 如果删除的 i 小于 index, 默认让 i - 1高亮
    // 3. 如果删除的i  大于 index  不用处理
    onChange(i);
    onClose();
  }

  // 处理编辑状态
  const [editing, setEditing] = useState(false);

  // 删除频道
  const del = (channel, i) => {
    if (userChannels.length <= 4) { Toast.info('至少保留4个频道了啦'); return }
    dispatch(delChannel(channel))
    // 删除的时候，需要处理高亮
    if (i === index) {
      onChange(0);
    }
    if (i < index) {
      onChange(index - 1);
    }
  }

  const add = async (channel) => { // @params: channel: {id: 11, name: '后端'} 
    await dispatch(addChannel(channel))
    Toast.success('添加成功', .3)
  }


  return (
    <div className={styles.root}>
      {/* 关闭按钮 */}
      <div className="channel-header">
        <Icon type="iconbtn_channel_close" onClick={onClose} />
      </div>

      <div className="channel-content">
        {/* 我的频道 */}
        <div className={classNames('channel-item', { edit: editing })}>
          <div className="channel-item-header">
            <span className="channel-item-title">我的频道</span>
            <span className="channel-item-title-extra">
              {editing ? '点击删除频道' : '点击进入频道'}
            </span>
            <span className="channel-item-edit" onClick={() => setEditing(!editing)}>
              {editing ? '完成' : '编辑'}
            </span>
          </div>
          <div className="channel-list">
            {userChannels.map((item, i) => (
              <span
                className={classNames('channel-list-item', { selected: index === i })}
                key={item.id}
                onClick={() => changeChannel(i)}
              >
                {item.name}
                {/* 推荐不允许删除 */}
                {item.id !== 0 && <Icon type="iconbtn_tag_close" onClick={() => del(item, i)} />}
              </span>
            ))}
          </div>
        </div>

        {/* 频道列表 */}
        <div className="channel-item">
          <div className="channel-item-header">
            <span className="channel-item-title">频道推荐</span>
            <span className="channel-item-title-extra">点击添加频道</span>
          </div>
          <div className="channel-list">  
            {recommendChannels.map((item) => (
              <span key={item.id} className="channel-list-item" onClick={() => add(item)}>
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channels
