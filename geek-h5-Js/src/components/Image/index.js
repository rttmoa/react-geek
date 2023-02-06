import { useEffect, memo } from 'react'
import classnames from 'classnames'
import { useState, useRef } from 'react'
import Icon from '../Icon'
import styles from './index.module.scss'



/**功能： 1.图片懒加载  2.renderPlaceholder函数 图片占位符(是否错误, 是否正在加载)  3. renderImage函数渲染图片  返回图片结构     */
const Image = memo(({ src, className }) => {

  const [isError, setIsError] = useState(false)//TODO: 控制是否加载失败
  const [isLoading, setIsLoading] = useState(true)//TODO: 控制是否加载

  const imgRef = useRef(null)

  // 图片加载完成
  const onLoad = () =>  setIsLoading(false)  

  // 图片加载失败
  const onError = () =>  setIsError(true)  

  /**渲染 loading or error 占位符  */
  const renderPlaceholder = () => {
    if (isError) {
      return (
        <div className="image-icon">
          <Icon type="iconphoto-fail" />
        </div>
      )
    }

    if (isLoading) {//TODO 修改3G网络即可 查看正在加载的图标
      return (
        <div className="image-icon">
          <Icon type="iconphoto" />
        </div>
      )
    }

    return null
  }

  /**注释： 渲染图片  返回图片结构 */
  const renderImage = () => {
    if (isError) return null
    return (
      <img
        ref={imgRef}    
        data-src={src}   //TODOS: src表示图片的链接地址
        onLoad={onLoad}
        onError={onError}
        alt=""
      />
    )
  }

  // 图片懒加载
  useEffect(() => {
    // 监听图片
    const imageObserver = new IntersectionObserver(
      (entries, imgObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 图片在可视区
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src           
            // console.log(lazyImage)

          }
        })
      }
      // ,
      // {
      //   // 可滚动元素
      //   // root: document.querySelector('.articles').firstElementChild,
      //   // 提前或延迟加载的距离
      //   // 比如，140px 表示距离图片展示在可视区域还有 140px 时，就家在图片
      //   // rootMargin: '140px 0px 140px 0px'
      // }
    )

    imageObserver.observe(imgRef.current)

    return () => imageObserver.disconnect()
  }, [])





  
  return (
    <div className={classnames(styles.root, className)}>
      {renderPlaceholder()}    {/* 渲染 loading or error 占位符 */}
      {renderImage()}          {/* 渲染图片 返回图片结构         */} 
    </div>
  )
})

export default Image
