import classnames from 'classnames'
import { useRef, useEffect } from 'react'
import styles from './index.module.scss'





// index.modules.scss
const Input = ({type = 'text', value, autoFocus, onChange, name, className, placeholder, extra, onExtraClick, ...rest }) => {
  // console.log(rest)

  // 受控组件
  const inputRef = useRef()

  useEffect(() => {
    // console.log(autoFocus) //undefined
    if(autoFocus) inputRef.current.focus();
  }, [autoFocus]);

  return (
    <div className={classnames(styles.root, className)}> 
      <input
        ref={inputRef}
        autoFocus  ///自动获取焦点
        value={value}
        name={name}
        className="input"
        placeholder={placeholder}
        type={type}
        onChange={onChange}
        {...rest}
      />
      {extra && ( <span className="extra" onClick={onExtraClick}>{extra}</span> )}
    </div>
  )
}

export default Input
