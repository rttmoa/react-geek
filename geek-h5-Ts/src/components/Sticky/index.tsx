import styles from './index.module.scss'
import { useEffect, useRef } from 'react'


type Props = {
  children: React.ReactElement | string
  top?: number
}
const Sticky = ({ children, top = 0 }: Props) => {
  const placeRef = useRef<HTMLDivElement>(null)
  const childrenRef = useRef<HTMLDivElement>(null)

  // top的换算 - 如果屏幕变宽 传入的top=46 需要去换算 因为?
  // top/375 = x/当前屏幕的宽度

  useEffect(() => {
    let value = (top / 375) * document.documentElement.clientWidth // doc获取屏幕宽度 
    const place = placeRef.current!
    const child = childrenRef.current!
    const onScroll = () => {
      if (place.getBoundingClientRect().top <= value) {
        // 应该吸顶
        child.style.position = 'fixed'
        child.style.top = value + 'px' 
        place.style.height = child.offsetHeight + 'px'
      } else {
        child.style.position = 'static'
        child.style.top = 'auto'
        place.style.height = '0px'
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [top])

  return (
    <div className={styles.root}>
      {/* 占位元素 */}
      <div className="sticky-placeholder" ref={placeRef} />

      {/* 吸顶显示的元素 */}
      <div className="sticky-container" ref={childrenRef}>
        {children}
      </div>
    </div>
  )
}

export default Sticky
