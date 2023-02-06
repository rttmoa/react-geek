import Input from '@/components/Input'
import NavBar from '@/components/NavBar'
import Textarea from '@/components/Textarea'
import { useState } from 'react'
import styles from './index.module.scss'



const EditInput = ({ config, onClose, onCommit }) => {
  // 获取编辑用户的数据


  // Input输入框变成受控组件
  const [value, setValue] = useState(config.value || '') // 初始值为 对象中传递过来的 || ''

  const { title, type } = config
  // console.log(title)
  

  return (
    <div className={styles.root}>
      <NavBar
        className="navbar"
        onLeftClick={onClose}
        rightContent={
          <span className="commit-btn" onClick={() => onCommit(type, value)}>
            提交
          </span>
        }
      >
        编辑{title}
      </NavBar>


      <div className="content">
        <h3>{title}</h3>
        {/* 329-个人中心-回显了昵称或简介 */}
        {
          type === 'name' ? (
            <div className="input-wrap">
              {/* <Input value={value} onChange={onValueChange} autoFocus /> */}
              <Input value={value} onChange={(e) => {setValue(e.target.value)} } autoFocus />
            </div>
          ) : (
            <Textarea
              placeholder="请输入"
              value={value}
              // onChange={onValueChange}
              onChange={(e) => {setValue(e.target.value)} }
            />
          )
        }
      </div>
    </div>
  )
  // const onValueChange = e => { setValue(e.target.value) }
}

export default EditInput
