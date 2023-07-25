import React from 'react'
import styles from './index.module.scss'


 

export default function Ts() {
    return(
        <div className={styles.root}>
            <div className='content'> 
                <p>1.个人页：静态</p>
                <p>2.个人信息修改页：修改头像，姓名，简介，生日</p>
                <p>3.聊天机器人中: socket+scroll</p>
            </div>
        </div>
    )
}   
// Intro