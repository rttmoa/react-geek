import NavBar from '@/components/NavBar'
import {  getUserProfile,  logout, updateAvatar, updateProfile } from '@/store/actions'

import { DatePicker, Drawer, List, Modal, Toast } from 'antd-mobile'
import classnames from 'classnames'

import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import EditInput from './components/EditInput'
import EditList from './components/EditList'
import styles from './index.module.scss'

const Item = List.Item
const alert = Modal.alert






/**--- 上传头像 - FormData： https://zhuanlan.zhihu.com/p/111480177 ---**/
/**--- 抽屉组件的 参数传递方式 openListConfig 中 数组里面对象的配置 ---**/
/**--- 头像、性别  ||  昵称、简介  ||  生日  ||  退出的处理 ---**/
/**--- 组件封装处理、函数封装处理 ---**/
const ProfileEdit = () => {
  const dispatch = useDispatch()

  // 获取redux中profile数据
  const userInfo = useSelector(state => state.profile.userProfile)
  // console.log(123, userInfo) 

  const history = useHistory()
  const fileRef = useRef() //--->TODOS: 在输入框注册事件可点击 点击上传图片


  // 控制全屏抽屉的显示与隐藏
  const [openInput, setOpenInput] = useState({
    visible: false,
    type: 'input'
  })
  // 控制底部抽屉的显示与隐藏
  const [openList, setOpenList] = useState({
    visible: false,
    type: 'gender'
  })

  // 表示每次更新数据 都会获取用户个人信息资料
  useEffect(() => {
    dispatch(getUserProfile())///--------->获取用户个人资料信息: birthday, gender, id, intro, name, mobile, photo
  }, [dispatch])

  /**注释：关闭输入框组件-->setOpenInput: {visible: false}  */
  const onCloseOpenInput = () => {
    setOpenInput({
      visible: false,
      type: ''
    })
  }
  /**注释：关闭列表组件--> setOpenList: {visible: false}  */
  const onCloseOpenList = () => {
    setOpenList({
      visible: false,
      type: ''
    })
  }



  // 列表抽屉组件: 头像、性别配置
  const openListConfig = openList.type === 'avatar' ?
              [
                {
                  title: '拍照', 
                  onClick: () => {
                    console.log('拍照'); 
                    fileRef.current.click()
                  }
                },
                {
                  title: '本地选择', 
                  onClick: () => {
                    console.log('本地选择');
                    fileRef.current.click();
                    // 在上传头像函数中 关闭抽屉组件
                  }
                }
              ]:[
                {
                  title: '男', 
                  onClick: async () => { 
                    console.log('男');
                    // return;

                    await dispatch(updateProfile('gender', 0)); 
                    // return
                    setOpenList({ visible: false, type: ''})  
                  }
                },
                {
                  title: '女', 
                  onClick: async () => {
                    console.log('女');
                    await dispatch(updateProfile('gender', 1)); 
                    setOpenList({ visible: false, type: ''})  
                  }
                }
              ];


  // 全屏抽屉组件: 昵称、简介配置
  const openInputConfig = 
    openInput.type === 'name' ? {
      title: '昵称',
      type: 'name',
      value: userInfo.name
    }:{ 
      title: '简介',
      type: 'intro',
      value: userInfo.intro 
    };
      

  
  const onUpdateAvatar = e => {
    /**注释：
     * 更新头像/上传图片实现方法--> 
     * 1.事件函数获取文件 
     * 2.FormData上传图片 
     * 3.dispatch发请求更新头像 
     * 4.存储到redux  
     * 5.setOpenList为false 
     */
    const avatar = e.target.files[0];
    const formData = new FormData();
    formData.append('photo', avatar);
    // console.log(formData)
    // return;

    dispatch(updateAvatar(formData));
    Toast.success('更新头像成功', 1);

    // 关闭头像下拉菜单
    setOpenList({
      visible: false,
      type: ''
    })
  }

  /**注释：修改生日--> 1.onChange回调函数中获取date 2.通过dispatch发请求更新生日  3.返回值存储到redux中 4.通过useSelector获取数据 */
  const onBirthdayChange = value => {
    // this
    // console.log(value) // Sun Nov 01 1998 08:00:00 GMT+0800 (中国标准时间)   -   拿到的是中国标准时间
    // console.log(value.getFullYear()) // 1998
    const date = `${value.getFullYear()}-${ value.getMonth() + 1  }-${value.getDate()}`;
    // console.log(date) // 1998-11-1
    dispatch(updateProfile('birthday', date))
  }

  /**注释：修改昵称或简介--> 1.通过封装的EditInput组件中 回调函数拿到值 2.dispatch 3.存储到redux 4.useSelector获取数据 5.setOpenInput为false  */
  const onCommit = async (name, value) => {
    await dispatch(updateProfile(name, value)) // name 为 name/intro
    setOpenInput({visible: false, type: ''})
  }


 
  const onLogout = () => {
    // Modal.alert('温馨提示', '你确定要退出吗', [ {'取消'}, {'确认'} ])   第三个参数是 数组  const alert: (title: React.ReactNode, message: React.ReactNode, actions?: Action<React.CSSProperties>[], 
    /**注释：退出功能实现方法--> 
     * 1.显示弹窗 
     * 2.删除token(包括redux和本地) 
     * 3.跳转到登录页 
     */
    alert('温馨提示', '你确定退出吗？', [
      {text: '取消'},
      {style: { color: '#FC6627' },
       text: '确认',
        onPress: () => {
          dispatch(logout())
          history.replace('/login');
          Toast.info('退出登录成功!', 1);
        }}
    ])
    
  }


  // console.log(new Date(userInfo.birthday))



  // 渲染页面
  
  return (
    <div className={styles.root}>
      <div className="content">
        <NavBar onLeftClick={() => history.go(-1)}>个人信息</NavBar>

        {/* List.Item的使用: https://mobile.ant.design/zh/components/list */}
        <div className="wrapper">
          <List className="profile-list">
            
            {/* List.Item组件是控制外部结构(静态结构) */}
            <Item
              arrow="horizontal"  //----> 说明: 最右侧是否显示箭头图标   属性horizontal表示 头像右侧的  > 
              extra={// 列表项右侧区域  	React.ReactNode
                <span className="avatar-wrapper">
                  <img src={userInfo.photo} alt="" />
                </span>
              }
              onClick={() => setOpenList({ visible: true, type: 'avatar' })}
            >
              头像
            </Item>

            <Item
              arrow="horizontal"
              extra={userInfo.name}
              onClick={() => setOpenInput({ visible: true, type: 'name' })}
            >
              昵称
            </Item>

            <Item
              arrow="horizontal"
              extra={
                // 变量控制 样式 及 内容
                <span className={classnames('intro', userInfo.intro ? 'normal' : '')} >
                  {userInfo.intro || '未填写'}
                </span>
              }
              onClick={() => setOpenInput({ visible: true, type: 'intro' })}
            >
              简介
            </Item>
          </List>
          {/* =====================================头像、昵称、简介, List.Item 结构================================================================================= */}

          <List className="profile-list">
            <Item
              arrow="horizontal"
              extra={userInfo.gender === 0 ? '男' : '女'}
              onClick={() =>setOpenList({visible: true, type: 'gender'})}
            >
              性别
            </Item>

            <DatePicker
              mode="date"
              value={new Date(userInfo.birthday)}
              title="选择 年/月/日"
              minDate={new Date(1900, 1, 1, 0, 0, 0)}
              maxDate={new Date()}
              onChange={onBirthdayChange}//onChange中获取date、通过dispatch发请求更新生日  返回值存储到redux中
            >
              <Item arrow="horizontal" extra={userInfo.birthday}>
                生日
              </Item>
            </DatePicker>
          </List>
          {/* =====================================性别和生日, List.Item 结构================================================================================= */}
          <input type="file" hidden ref={fileRef} onChange={onUpdateAvatar} />  
        </div>

        <div className="logout">
          <button className="btn" onClick={onLogout}>
            退出登录
          </button>
        </div>
      </div>
      





      {/* 全屏表单抽屉的使用： https://antd-mobile-v2.surge.sh/components/drawer-cn/  */}
      <Drawer
        className="drawer"
        position="right"
        style={{ minHeight: document.documentElement.clientHeight }}
        sidebar={
          openInput.visible && (
            <EditInput
              config={openInputConfig}
              onClose={onCloseOpenInput}
              onCommit={onCommit}
            />
          )
        }
        open={openInput.visible}//开关状态 | boolean
        onOpenChange={onCloseOpenInput}//open 状态切换时调用  设置setOpenInput为false | open状态为关
      >
        {''}
      </Drawer>
      {/* =====================================昵称、简介 - 全屏 抽屉组件================================================================================= */}


      <Drawer
        className="drawer-list"
        position="bottom"
        sidebar={<EditList config={openListConfig} onClose={onCloseOpenList} />}
        open={openList.visible}
        onOpenChange={onCloseOpenList}
      >
        {''}
      </Drawer>
      {/* =====================================头像、性别 - 底部  抽屉组件================================================================================= */}
    </div>
  )
}

export default ProfileEdit