import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'

type Props = Omit<
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  'maxLength' | 'value' | 'onChange'
> & {
  maxLength?: number
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export default function Textarea({
  maxLength = 100,
  className,
  value,
  onChange,
  ...rest
}: Props) {
  const [content, setContent] = useState(value || '')
  // 获取事件对象e的类型技巧
  // 直接给原生的元素注册对应的事件，通过鼠标查看e的类型
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    onChange && onChange(e)
  }
  const textRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    textRef.current!.focus()
    // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement/setSelectionRange
    textRef.current!.setSelectionRange(-1, -1)
  }, [])
  return (
    <div className={styles.root}>
      {/* 文本输入框 */}
      <textarea
        {...rest}
        className={classNames('textarea', className)}
        maxLength={maxLength}
        value={value}
        // onChange={e => {}} //e: React.ChangeEvent<HTMLTextAreaElement>
        onChange={handleChange}
        ref={textRef}
      />

      {/* 当前字数/最大允许字数 */}
      <div className="count">
        {content.length}/{maxLength}
      </div>
    </div>
  )
}
