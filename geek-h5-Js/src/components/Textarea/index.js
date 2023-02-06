import { useState } from 'react'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useRef, useEffect } from 'react'




const Textarea = ({ className, value, onChange, placeholder, maxLength = 100 }) => {
  const [count, setCount] = useState(value.length || 0)

  const onValueChange = e => {
    onChange(e)
    // onChange && onChange(e)
    setCount(e.target.value.length)
  }

  const textRef = useRef(null)

  useEffect(() => {
    // 一进入页面 聚焦
    textRef.current.focus()
    textRef.current.setSelectionRange(-1, -1)   //光标位置在最后
  }, []);



  return (
    <div className={classnames(styles.root, className)}>  
      <textarea
        ref={textRef}
        className="textarea"
        value={value}
        onChange={onValueChange}
        maxLength={maxLength}
        placeholder={placeholder}
      />

      <div className="count">
        {count}/{maxLength}
      </div>
    </div>
  )
}

export default Textarea 