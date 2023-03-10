import classnames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon'
import styles from './index.module.scss'
type Props = {
  className?: string
  src: string
  alt?: string
}
const Image = ({ className, src, alt }: Props) => {
  // const imgRef = useRef<number>(null)  // 如果是 number 类型 下面会报错
  const imgRef = useRef<HTMLImageElement>(null)  // useRef() 基于泛型来实现的
  // 控制是否在加载
  const [loading, setLoading] = useState(true)
  // 控制是否加载失败
  const [error, setError] = useState(false)

  // 加载成功
  const onLoad = () => {
    setError(false)
    setLoading(false)
  }
  const onError = () => {
    setLoading(false)
    setError(true)
  }
  useEffect(() => {
    // 监听图片
    const current = imgRef.current! // HTMLImageElement | null

    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (isIntersecting) {
        // 图片在可视区
        // current.src = current.dataset.src as string
        current.src = current.dataset.src! // 断言 src属性不会为 null
        // 取消监听
        observer.unobserve(current)
      }
    })
    observer.observe(current)
  }, [])
  return (
    <div className={classnames(styles.root, className)}>
      {/* 加载中 */}
      {loading && (
        <div className="image-icon">
          <Icon type="iconphoto" />
        </div>
      )}

      {/* 加载出错时显示的内容 */}
      {error && (
        <div className="image-icon">
          <Icon type="iconphoto-fail" />
        </div>
      )}

      <img
        alt={alt}
        ref={imgRef}
        data-src={src}
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  )
}

export default Image
