import {   useEffect, useRef } from 'react'
import styles from './index.module.scss'
import classNames from 'classnames'
// 理想效果：Input要和原生的input使用效果一样，，原生input支持的所有属性Inupt都要支持
// Button
// interface Props extends InputHTMLAttributes<HTMLInputElement> {
//   extra?: string
//   onExtraClick?: () => void
//   className?: string
//   autoFocus?: boolean
//   type?: 'text' | 'password'
// }
 
// 在QA中测试 无法传入 placeholder 和 velue等属性  需要使用 Omit (剔除原生)
type Props = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >, 'type'> & {
  extra?: string
  onExtraClick?: () => void
  className?: string
  autoFocus?: boolean
  type?: 'text' | 'password' | 'radio'
}
// 1.登陆时，短信登陆时的输入框
export default function Input({ extra, onExtraClick, className, autoFocus, ...rest}: Props) { 
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (autoFocus) {
      inputRef.current!.focus() // ! 非空断言
    }
  }, [autoFocus])

  
  return (
    <div className={styles.root}>
      <input ref={inputRef} className={classNames('input', className)} {...rest}/>
      {extra ? (<div className="extra" onClick={onExtraClick}> {extra} </div>) : null}
    </div>
  )
}
