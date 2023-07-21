import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import NavBar from "@/components/NavBar";
import { List, DatePicker, Drawer, Toast, Modal } from "antd-mobile";
import { useDispatch } from "react-redux";
import {  getProfile,  updatePhoto,  updateProfile, } from "@/store/actions/profile";
import { useSelector } from "react-redux";
import classNames from "classnames";
import EditInput from "./components/EditInput";
import EditList from "./components/EditList";
import dayjs from "dayjs";
import { useHistory } from "react-router";
import { logout } from "@/store/actions/login";
import { removeTokenInfo } from "@/utils/storage";
const { Item } = List;




/** #### 编辑个人信息 ---*/
export default function ProfileEdit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const fileRef = useRef(null);

  const [open, setOpen] = useState({ visible: false, type: "" });

  // 控制列表抽屉的显示和隐藏 （avatar / gender）
  const [listOpen, setListOpen] = useState({ visible: false, type: "" });

 
  const config = {
    photo: [
      {
        title: "拍照",
        onClick: () => {
          console.log("拍照");
        },
      },
      {
        title: "本地选择",
        onClick: () => {
          // 触发点击事件 （onClick事件）
          fileRef.current.click();
        },
      },  
    ],
    // gender: [{title: '男', onClick: f}, ..]
    gender: [
      {
        title: "男",
        onClick: () => {
          onCommit("gender", 0);
        },
      },
      {
        title: "女",
        onClick: () => {
          onCommit("gender", 1);
        },
      },
    ],
  };

  const onClose = () => { // 关闭弹窗及抽屉组件
    setOpen({ visible: false, type: "", });
    setListOpen({ visible: false, type: "", });
  };

  useEffect(() => {
    dispatch(getProfile()); // TODO: 获取用户编辑信息
  }, [dispatch]);

  const profile = useSelector(state => state.profile.profile);
  // console.log(profile)


  const onCommit = async (type, value) => { // 修改生日，性别
    await dispatch(
      updateProfile({ [type]: value })
    );
    Toast.success("修改成功", 1, null, false);
    onClose();
  };

  const onFileChange = async (e) => { // 上传文件 File
    // console.log(e) 
    const file = e.target.files[0]; // file attr： name, size, type. lastModifiedDate
    const fd = new FormData(); 
    fd.append("photo", file); // 把文件上传到服务器
    await dispatch(updatePhoto(fd));
    Toast.success("修改头像成功");
    onClose();
  };

  const onBirthChange = (e) => { // 修改User生日
    // console.log('onchange E', e) // onchange E Sun Nov 01 1998 08:00:00 GMT+0800 (中国标准时间)
    // console.log('dayjs', dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")) // dayjs 2023-07-21 11:25:50
    onCommit("birthday", dayjs(e).format("YYYY-MM-DD")); // FIXME: 格式化时间
  };

  const logoutFn = () => { // 退出登陆
    // 1. 显示弹窗
    // 2. 删除token  （localStoreage & redux）
    // 3. 跳转到登录页并提示Message
    Modal.alert("温馨提示", "你确定要退出吗", [
      { text: "取消" },
      {
        text: "确定",
        style: { color: "#FC6627" },
        onPress() {
          dispatch(logout());
          removeTokenInfo();
          // 跳转到登录页
          history.push("/login");
          // 提示
          Toast.success("退出登录成功", .5);
        },
      },
    ]);
  };

  return (
    <div className={styles.root}>
      <div className="content">

        <NavBar>个人信息</NavBar> 

        <div className="wrapper">
          <List className="profile-list">
            <Item
              arrow="horizontal"
              onClick={() => { setListOpen({ visible: true, type: "photo", }); }}
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
              onClick={() => { setOpen({ visible: true, type: "name", }); }}
            >
              昵称
            </Item>
            <Item
              arrow="horizontal"
              extra={<span className={classNames("intro", profile.intro ? "normal" : "")}>{profile.intro || "未填写"}</span>}
              onClick={() => { setOpen({ visible: true, type: "intro", }); }}
            >
              简介
            </Item>
          </List>

          <List className="profile-list">
            <Item
              extra={profile.gender === 0 ? "男" : "女"}
              arrow="horizontal"
              onClick={() => {setListOpen({ visible: true, type: "gender"});}}
            >
              性别
            </Item>
            <DatePicker
              mode="date"
              value={new Date(profile.birthday)}
              onChange={onBirthChange}
              minDate={new Date("1900-01-01")}
              maxDate={new Date()}
              title="选择生日"
            >
              <Item arrow="horizontal" extra={"2020-02-02"}>
                生日
              </Item>
            </DatePicker>
          </List>
        </div>
        {/* FIXME: 文件上传到服务器中 */}
        <input type="file" hidden ref={fileRef} onChange={onFileChange} />
        <div className="logout" onClick={logoutFn}>
          <button className="btn">退出登录</button>
        </div>
      </div>



      {/* 全屏表单抽屉 （简介、昵称） */}
      <Drawer
        position="right"
        className="drawer"
        sidebar={
          open.visible && <EditInput onClose={onClose} type={open.type} onCommit={onCommit}></EditInput>
        }
        children={""}
        open={open.visible}
      />

      {/* 列表的抽屉组件 （头像、性别） */} 
      <Drawer
        className="drawer-list"
        position="bottom"
        sidebar={
          listOpen.visible && <EditList config={config} onClose={onClose} type={listOpen.type}></EditList>
        }
        open={listOpen.visible}
        onOpenChange={onClose}
      >
        {""}
      </Drawer>
    </div>
  );
}
