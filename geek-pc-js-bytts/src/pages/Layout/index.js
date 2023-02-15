import { DesktopOutlined,  FileOutlined,  PieChartOutlined, DiffOutlined, TeamOutlined,  UserOutlined, ClusterOutlined, HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import history from "utils/history";
import styles from './index.module.scss'

import Home from 'pages/Home'
import First from 'pages/PcFirst/index'

import BindBox from './BindBox'
import BindBoxFinished from './BindBoxFinished'
import HighLight from 'pages/Layout/TestData'

import Material from 'pages/ConfigMaterial' // 原料屏幕

import ConfigScreen1 from 'pages/ConfigBox/Screen1' // 配餐屏幕*1
import ConfigScreen2 from 'pages/ConfigBox/Screen2' // 配餐屏幕*2

import MaterialScreen2 from 'pages/MaterialBox/Screen2' // 原料入库屏幕*2
import MaterialScreen3 from 'pages/MaterialBox/Screen3' // 原料入库屏幕*3



const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}
const items = [
  getItem(<Link to="/home">仓储管理系统</Link>, "/home", <HomeOutlined />),
  getItem(<Link to="/home/main">配餐环节</Link>, "/home/main", <DesktopOutlined />),
  getItem("绑定空箱环节", "/home/bind", <PieChartOutlined />, 
    [
      getItem(<Link to="/home/bind/box">查看Mes装配清单</Link>, "/home/bind/box"),        
      getItem(<Link to="/home/bind/finished">查看已绑定的空箱</Link>, "/home/bind/finished"),
      getItem(<Link to="/home/bind/highlight">测试高亮效果</Link>, "/home/bind/highlight"),
    ]),
  getItem("配餐空箱装配", "/home/config", <ClusterOutlined />, 
    [
      getItem(<Link to="/home/config/one">一号屏幕</Link>, "/home/config/one"),
      getItem(<Link to="/home/config/two">二号屏幕</Link>, "/home/config/two"),
      getItem(<Link to="/home/config/three">三号屏幕</Link>, "/home/config/three"),
      getItem(<Link to="/home/config/four">四号屏幕</Link>, "/home/config/four"), 
    ]),
  getItem("原料入库", "/home/material", <FileOutlined />,
    [
      getItem(<Link to="/home/material/two">二号屏幕</Link>, "/home/material/two"),
      getItem(<Link to="/home/material/three">三号屏幕</Link>, "/home/material/three"),
    ]
  ),
];






/**--- https://4x.ant.design/components/layout-cn/#components-layout-demo-side ---**/
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([history.location.pathname])
  const logoWidthRef = React.useRef(null);
  useEffect(() => {
    if(logoWidthRef.current.offsetWidth > 100){ 
       document.getElementsByClassName('logoText')[0].style.display = 'none';
    }else{ 
        document.getElementsByClassName('logoText')[0].style.display = 'block';
    }
    document.getElementsByClassName('logoText')[0].style.display = 'block';
  }, [collapsed])

  const selMenu = ({selectedKeys}) => { setSelectedKeys(selectedKeys) }
  // console.log(selectedKeys)  



  return (
    <Layout className={styles.root} style={{minHeight: "100vh"}}>
      <Sider
        ref={logoWidthRef}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo">
            <div className="logoText">昱庄自动化控制</div>
        </div>
        <Menu
          theme="dark"
          selectedKeys={selectedKeys}
          mode="inline"
          items={items}
          onSelect={selMenu}
        />
      </Sider>


      <Layout className="site-layout">
        {/* <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        /> */}
        <Content style={{ margin: "0 16px", }}>
             <Switch>
                <Route exact path="/home" component={Home}></Route> 
                {/* <Route path="/home/first" component={First}></Route> */}
                <Route exact path="/home/bind/box" component={BindBox}></Route>
                <Route exact path="/home/bind/finished" component={BindBoxFinished}></Route>
                <Route exact path="/home/bind/highlight" component={HighLight}></Route>
 
                <Route exact path="/home/main" component={Material}></Route>

                <Route exact path="/home/config/one" component={ConfigScreen1}></Route>
                <Route exact path="/home/config/two" component={ConfigScreen2}></Route>
                
                <Route exact path="/home/material/two" component={MaterialScreen2}></Route>
                <Route exact path="/home/material/three" component={MaterialScreen3}></Route>

              </Switch>
            {/* <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              Bill is a cat.
            </div> */}
        </Content>
       
      </Layout>
    </Layout>
  );
};
export default App;
