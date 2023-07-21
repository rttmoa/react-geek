import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'


export default function NotFound() {
  // useState<array>[] 泛型
  // useRef<string>('')   泛型
  // useEffect
  const [time, setTime] = useState<number>(3)
  const history = useHistory()

  // useEffect(() => {
  //   let timer = setTimeout(() => {
  //     setTime(time - 1)
  //   }, 1000)
  //   if (time === 0) {
  //     clearTimeout(timer)
  //     history.push('/home')
  //   }
  // }, [time, history])

  useEffect(() => {
    // 在ts中，使用定时器的时候，，，ts会默认把setTimeout和setInterval的类型定义为nodejs中的定时器。而不是浏览器中的
    // 以后使用定时器，推荐加上 window     |   加不加不影响功能，影响Js的推断
    let timer = window.setTimeout(() => {
      setTime(time - 1)
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  })

  useEffect(() => {
    if (time === 0) {
      history.push('/home/index')
    }
  }, [time, history])
  
  return (
    <div>
      <h1>对不起，你访问的内容不存在...</h1>
      <p>{time} 秒后，返回<Link to="/home">首页</Link></p>
    </div>
  )
}
