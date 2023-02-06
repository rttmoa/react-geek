import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import NavBar from '@/components/NavBar'
import { List, DatePicker, Drawer, Toast, Modal } from 'antd-mobile'
import { useDispatch } from 'react-redux'
import { getProfile, updatePhoto, updateProfile } from '@/store/actions/profile'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import EditInput from './components/EditInput'
import EditList from './components/EditList'
import dayjs from 'dayjs'
import { useHistory } from 'react-router'
import { logout } from '@/store/actions/login'
const { Item } = List
export default function ProfileEdit() {
  const dispatch = useDispatch()
  const history = useHistory()
  const fileRef = useRef(null)
  const [open, setOpen] = useState({
    visible: false,
    type: '',
  })

  // 控制列表抽屉的显示和隐藏
  const [listOpen, setListOpen] = useState({
    visible: false,
    // avatar gender
    type: '',
  })

  const config = {
    photo: [
      {
        title: '拍照',
        onClick: () => {
          console.log('拍照')
        },
      },
      {
        title: '本地选择',
        onClick: () => {
          // 触发点击事件
          fileRef.current.click()
        },
      },
    ],
    gender: [
      {
        title: '男',
        onClick: () => {
          onCommit('gender', 0)
        },
      },
      {
        title: '女',
        onClick: () => {
          onCommit('gender', 1)
        },
      },
    ],
  }

  const onClose = () => {
    setOpen({
      visible: false,
      type: '',
    })
    setListOpen({
      visible: false,
      type: '',
    })
  }
  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  // 获取redux中的profile数据
  const profile = useSelector((state) => state.profile.profile)
  // console.log(profile)

  const onCommit = async (type, value) => {
    // console.log(type, value)
    await dispatch(
      updateProfile({
        [type]: value,
      })
    )
    Toast.success('修改成功', 1, null, false)
    onClose()
  }

  const onFileChange = async (e) => {
    const file = e.target.files[0]
    const fd = new FormData()
    // 把文件上传到服务器
    fd.append('photo', file)

    await dispatch(updatePhoto(fd))
    Toast.success('修改头像成功')
    onClose()
  }

  const onBirthChange = (e) => {
    onCommit('birthday', dayjs(e).format('YYYY-MM-DD'))
  }

  const logoutFn = () => {
    // 1. 显示弹窗
    // 2. 删除token (包括redux和本地)
    // 3. 跳转到登录页
    Modal.alert('温馨提示', '你确定要退出吗', [
      { text: '取消' },
      {
        text: '确定',
        style: { color: '#FC6627' },
        onPress() {
          dispatch(logout())
          // 跳转到登录页
          history.push('/login')
          // 提示
          Toast.success('退出登录成功', 1)
        },
      },
    ])
  }

  return (
    <div className={styles.root}>
      <div className="content">
        {/* 顶部的导航栏 */}
        <NavBar>个人信息</NavBar>

        <div className="wrapper">
          <List className="profile-list">
            <Item
              arrow="horizontal"
              onClick={() => {
                setListOpen({
                  visible: true,
                  type: 'photo',
                })
              }}
              extra={
                <span className="avatar-wrapper">
                  <img src={profile.photo} alt="" />
                </span>
              }
            >
              头像
            </Item>
            <Item
              arrow="horizontal"
              extra={profile.name}
              onClick={() => {
                setOpen({
                  visible: true,
                  type: 'name',
                })
              }}
            >
              昵称
            </Item>
            <Item
              arrow="horizontal"
              extra={
                <span
                  className={classNames('intro', profile.intro ? 'normal' : '')}
                >
                  {profile.intro || '未填写'}
                </span>
              }
              onClick={() => {
                setOpen({
                  visible: true,
                  type: 'intro',
                })
              }}
            >
              简介
            </Item>
          </List>

          <List className="profile-list">
            <Item
              extra={profile.gender === 0 ? '男' : '女'}
              arrow="horizontal"
              onClick={() => {
                setListOpen({
                  visible: true,
                  type: 'gender',
                })
              }}
            >
              性别
            </Item>
            <DatePicker
              mode="date"
              value={new Date(profile.birthday)}
              onChange={onBirthChange}
              minDate={new Date('1900-01-01')}
              maxDate={new Date()}
              title="选择生日"
            >
              <Item arrow="horizontal" extra={'2020-02-02'}>
                生日
              </Item>
            </DatePicker>
          </List>
        </div>
        <input type="file" hidden ref={fileRef} onChange={onFileChange} />
        {/* 底部栏：退出登录按钮 */}
        <div className="logout" onClick={logoutFn}>
          <button className="btn">退出登录</button>
        </div>
      </div>
      {/* 全屏表单抽屉 */}
      <Drawer
        position="right"
        className="drawer"
        sidebar={
          open.visible && (
            <EditInput
              onClose={onClose}
              type={open.type}
              onCommit={onCommit}
            ></EditInput>
          )
        }
        children={''}
        open={open.visible}
      />

      {/* 列表的抽屉组件 */}
      {/* 头像、性别 */}
      <Drawer
        className="drawer-list"
        position="bottom"
        sidebar={
          listOpen.visible && (
            <EditList
              config={config}
              onClose={onClose}
              type={listOpen.type}
            ></EditList>
          )
        }
        open={listOpen.visible}
        onOpenChange={onClose}
      >
        {''}
      </Drawer>
    </div>
  )
}
