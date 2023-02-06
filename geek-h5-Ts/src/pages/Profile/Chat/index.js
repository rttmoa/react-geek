import Icon from '@/components/Icon'
import Input from '@/components/Input'
import NavBar from '@/components/NavBar'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import io from 'socket.io-client'
import { getTokenInfo } from '@/utils/storage'
import { useDispatch } from 'react-redux'
import { getUser } from '@/store/actions/profile'

const Chat = () => {
  const [messageList, setMessageList] = useState([
    // 放两条初始消息
    { type: 'robot', text: '亲爱的用户您好，小智同学为您服务。' },
    { type: 'user', text: '你好' },
  ])
  const [msg, setMsg] = useState('')
  const photo = useSelector((state) => state.profile.user.photo)
  // socketio的链接
  const clientRef = useRef(null)
  const listRef = useRef(null)
  const dispatch = useDispatch()
  useEffect(() => {
    // 获取用户信息
    dispatch(getUser())
    // socket io的连接对象
    // client.close() 关闭链接
    // client.on()  监听事件
    // client.emit() 主动的给服务器发送消息
    const client = io('http://geek.itheima.net', {
      query: {
        token: getTokenInfo().token,
      },
      transports: ['websocket'],
    })
    clientRef.current = client

    //链接服务器成功的事件
    client.on('connect', function () {
      // console.log('连接服务器成功')
      // Toast.info('链接服务器成功，开始聊天吧')
      setMessageList((messageList) => {
        return [
          ...messageList,
          { type: 'robot', text: '我是小智，有什么想要问我的？' },
        ]
      })
    })

    // 接收到服务器的事件
    client.on('message', function (e) {
      setMessageList((messageList) => {
        return [
          ...messageList,
          {
            type: 'robot',
            text: e.msg,
          },
        ]
      })
    })

    return () => {
      // 组件销毁的时候，需要关闭socketio的链接
      client.close()
    }
  }, [dispatch])

  useEffect(() => {
    // 当messageList发生改变，就会执行
    // 让滚动条滚动到最底部
    listRef.current.scrollTop =
      listRef.current.scrollHeight - listRef.current.offsetHeight
  }, [messageList])

  const onKeyUp = (e) => {
    if (e.keyCode !== 13) return
    if (!msg) return
    // 回车的时候，
    // 1. 需要给服务器发送消息
    // 2. 把自己的消息添加到消息列表中
    setMessageList([
      ...messageList,
      {
        type: 'user',
        text: msg,
      },
    ])
    clientRef.current.emit('message', {
      msg,
      timestamp: Date.now(),
    })
    // 清空消息
    setMsg('')
  }
  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar className="fixed-header">小智同学</NavBar>

      {/* 聊天记录列表 */}
      <div className="chat-list" ref={listRef}>
        {messageList.map((item, index) => {
          if (item.type === 'robot') {
            return (
              <div key={index} className="chat-item">
                <Icon type="iconbtn_xiaozhitongxue" />
                <div className="message">{item.text}</div>
              </div>
            )
          } else {
            return (
              <div key={index} className="chat-item user">
                <img src={photo} alt="" />
                <div className="message">{item.text}</div>
              </div>
            )
          }
        })}
      </div>

      {/* 底部消息输入框 */}
      <div className="input-footer">
        <Input
          className="no-border"
          placeholder="请描述您的问题"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <Icon type="iconbianji" />
      </div>
    </div>
  )
}

export default Chat
