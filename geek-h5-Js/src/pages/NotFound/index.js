import { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'



/**
 * 实现功能：
 * 1.useEffect的使用   ?秒后,返回首页
 * 2.通过timerRef.current演示函数组件闭包的问题  函数组件的内部变量和外部变量
 */
const NotFound = () => {
  // const [time, setTime] = useState(3)
  const [leftSecond, setLeftSecond] = useState(3)
  const timerRef = useRef(-1)  //给空值 或者 -1
  const history = useHistory()


  // http://localhost:3000/333

  // 原
  // let timer = setInterval(()=> {
  //   setTimeout((time) => {
  //   console.log(time)
  //     if(time===1){
  //       clearInterval(timer)
  //       history.push('/home')
  //     }
  //     return time - 1
  //   }, 1000);
  // })

  // 第一种写法:
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (leftSecond <= 1) {
        return history.push('/home');
      }
      setLeftSecond(leftSecond - 1);
    }, 1000)

    // 清理副作用
    return () => clearInterval(timerRef.current)
  }, [leftSecond, history])

  // 第二种写法：
  // useEffect(() => {
  //   let timer = setInterval(() => {
      
  //     if(time === 1){
  //       console.log('倒计时完成!')
  //       clearInterval(timer)
  //       return time - 1
  //     }

  //     setTime(time - 1)

  //   }, 1000)
  //   return () => clearInterval(timer)
  // },[ time, history ])

  return (
    <div>
      <h1>对不起，你访问的内容不存在...</h1>
      <p>
        {leftSecond} 秒后，返回<Link to="/home">首页</Link>
      </p>
    </div>
  )
}

export default NotFound
