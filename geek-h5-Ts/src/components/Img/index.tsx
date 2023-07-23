import classnames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon'
import styles from './index.module.scss'




type Props = {
  className?: string
  src: string
  alt?: string
}
/** #### TODO: 图片进入可视区后，控制图片加载状态  */
const Image = ({ className, src, alt }: Props) => {

  // const imgRef = useRef<number>(null)  // 如果是 number 类型 下面会报错
  const imgRef = useRef<HTMLImageElement>(null)   
  // 控制是否在加载
  const [loading, setLoading] = useState(true)
  // 控制是否加载失败
  const [error, setError] = useState(false)

  // 加载成功
  const onLoad = () => {
    setError(false);
    setLoading(false);
  }
  const onError = () => {
    setLoading(false);
    setError(true);
  }
  useEffect(() => {
    // 监听图片
    const current = imgRef.current!; // HTMLImageElement | null
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
      {(loading || error) && (
        <div className="image-icon">
          {loading ? <Icon type="iconphoto" /> : <Icon type="iconphoto-fail" />}
        </div>
      )} 
      <img
        alt={alt}
        ref={imgRef}
        data-src={src}
        onLoad={onLoad}
        onError={onError}
      />
      {/* {loading && <div className="image-icon"><Icon type="iconphoto" /></div>} */}
      {/* {error && <div className="image-icon"><Icon type="iconphoto-fail" /></div>} */}
    </div>
  )
}

export default Image
