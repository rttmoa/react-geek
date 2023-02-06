import Icon from '@/components/Icon'
import Input from '@/components/Input'
import NavBar from '@/components/NavBar'
import { getTokens } from '@/utils'
import { Toast } from 'antd-mobile'
import classnames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'
import styles from './index.module.scss'
// let client = null;  这里是全局 client 而在函数组件内部属于闭包  内部调用会访问不到



/**--- 黑马接口文档==>  http://toutiao.itheima.net/ ---**/
/**--- 此节内容、websocket、es6、css-flex、useEffect、useState、useRef、css-滚动 ---**/
/**--- useRef来控制连接的变量socketio和socketIO.current的绑定   emit发送消息使用useRef来控制 ---**/

/**--- useEffect使用简介: https://www.jianshu.com/p/a619861445d0  ---**/
/**--- useState和useEffect的参数作用: http://ourjs.com/detail/kbbgiz4hwsih ---**/
/**--- useRef： https://blog.csdn.net/u011705725/article/details/115634265  ---**/
const Chat = () => {
  const history = useHistory()
  
  const profile = useSelector(state => state.profile.user);

  const [value, setValue] = useState([]) // 输入框 value


  const [list, setList] = useState(
  [
    { name: 'xz', msg: '亲爱的用户您好，小智同学为您服务。' },
    { name: 'self', msg: '你好小智同学!' }
  ])

  const socketIO = useRef(null)  ///-----把 useEffect 中的 client 暴露出来 并用 useRef 绑定到 socketIO
  const chatListRef = useRef(null)

  // 和发请求一样, socketio连接, 连接一次就好  && 使用完清理副作用(关闭连接)
  useEffect(() => {
    // 这里需要加个请求 防止页面刷新 头像丢失 
    // dispatch(getUser())

    const socketio = io('http://toutiao.itheima.net', {
      query: {
        token: getTokens().token
      },
      transports: ['websocket']
    })

    socketio.on('connect', () => {
      setList(list => {
        // console.log(list)
        return [
          ...list,
          { name: 'xz', msg: 'Hello!' }
        ]
      })
      Toast.info('连接服务器成功， 开始聊天吧!', 0.5)
    })

    // 自己的消息添加到list数组中后、将服务器端返回的消息也添加到 list 数组中就ok
    socketio.on('message', data => {
      // console.log('message 消息', data)
      setList(list => [
        ...list, 
        { name: 'xz', msg: data.msg }
      ])
    })
 
    socketIO.current = socketio

    // !!!
    // 清除副作用
    // 组件销毁的时候 关闭socketio的连接
    return () => socketio.close()
  }, []);


  useEffect(() => {
    chatListRef.current.scrollTop = chatListRef.current.scrollHeight - chatListRef.current.offsetHeight;

  }, [list]) //---->监听list的变化,,,如果list变化 那么就更新 滚动


  
  const onSend = e => {
    /**
     * 底部输入框变成受控组件  
     * 实现功能:  
     * 1.需要给服务器发消息  emit
     * 2.setList数组中添加消息、将自己发送的消息添加到list中
     */
    if(!value) return
    if (e.keyCode === 13) {
      socketIO.current.emit('message', {
        msg: value, 
        timestamp: Date.now()
       })
      // console.log(list)
      // 设置 setList 为之前的...list 和 自己发的这个消息
      setList(
        [
          ...list, 
          { name: 'self', msg: value }
        ]
      );
      setValue('');
    }
  }




  return (
    <div className={styles.root}>

      <NavBar className="fixed-header" onLeftClick={() => history.go(-1)}>小智同学</NavBar>


      <div className="chat-list" ref={chatListRef}>
       
        {
          // item: {name: 'xz', msg: '欢迎您和小智聊天'} | {name: 'self', msg: '你好小智同学!'}   index: 0, 1, 2, 3, 4, 5
          list.map((item, index) => ( 
            <div
              className={classnames( 'chat-item', item.name === 'self' ? 'user' : '' )}
              key={index}
            >
              {
                item.name === 'self' ? 
                (<img src={ profile.photo || 'http://toutiao.itheima.net/images/user_head.jpg' } alt="" />) : (<Icon type="iconbtn_xiaozhitongxue" />)
              }
              <div className="message">{item.msg}</div>
            </div>
          ))
        }
      </div>



      <div className="input-footer">
        <Input
          className="no-border"
          placeholder="请描述您的问题"
          onKeyDown={onSend}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <Icon type="iconbianji" />
      </div>
    </div>
  )
}

export default Chat




/* 
  基本结构为:
    <div className='chat-item'> 
      <Icon type='iconbtn_xiaozhitongxue' />
      <div className='message'>你好!</div>
    </div>
*/