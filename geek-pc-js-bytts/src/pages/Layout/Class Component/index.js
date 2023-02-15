import React, { Component } from "react";
import styles from "./index.module.scss";
import { Layout, Menu} from "antd"; ///Popconfirm: 弹出确认框
import { Switch, Route, Link } from "react-router-dom";
import { ClusterOutlined, HomeOutlined } from "@ant-design/icons";
const Home = React.lazy(() => import("pages/Home")); 
const First = React.lazy(() => import("pages/PcFirst")); 

const { Header, Content } = Layout;




export default class Index extends Component {
  state = {
    profile: {},
    selectedKey: this.props.location.pathname,
  };
  componentDidUpdate(prevProps) {
    let pathname = this.props.location.pathname;
    if (this.props.location.pathname !== prevProps.location.pathname) {
      if (pathname.startsWith("/home/publish")) {
        pathname = "/home/publish";
      }
      this.setState({
        selectedKey: pathname,
      });
    }
  }

  render() {
    return (
      <div className={styles.layout}>
        <Layout className="layout">
          <Header className="header">
            <Menu
              theme="dark"
              mode="horizontal"
              // 这个 keys 指的是 选择哪个 地址
              // defaultSelectedKeys={[this.props.location.pathname]}   /* 从地址栏中 拿到 侧边栏的 url */
              selectedKeys={[this.state.selectedKey]}
              style={{ height: "100%", borderRight: 0 }}
            >
              {/* 左侧导航 */}
              <Menu.Item key="/home" icon={<ClusterOutlined />}> 
                <Link to="/home">主屏幕</Link>
              </Menu.Item>
              <Menu.Item key="/home/list" > 
                <Link to="/home/list">内容管理</Link>
              </Menu.Item>
              <Menu.Item key="/home/publish" icon={<HomeOutlined />}>
                <Link to="/home/publish">发布文章</Link>
              </Menu.Item>
              <Menu.Item key="/home/first" icon={<HomeOutlined />}>
                <Link to="/home/first">1/2</Link>
              </Menu.Item>
              {/* <Menu.Item key="/home/center" icon={<HomeOutlined />}>
                <Link to="/home/center">3/4/5/6</Link>
              </Menu.Item>
              <Menu.Item key="/home/right" icon={<HomeOutlined />}>
                <Link to="/home/right">7/8</Link>
              </Menu.Item> */}
              {/* <Menu.Item key="/home/print" icon={<HomeOutlined />}>
                <Link to="/home/print">打印</Link>
              </Menu.Item> */}
            </Menu>
          </Header>
          <Content className="site-layout-background">
            <Switch>
              <Route exact path="/home" component={Home}></Route>
              <Route path="/home/list" component={ArticleList}></Route>
              <Route exact path="/home/publish" component={ArticlePublish} key="add" ></Route>
              <Route path="/home/publish/:id" component={ArticlePublish} key="edit" ></Route>
              <Route path="/home/first" component={First}></Route>
              {/* <Route path="/home/center" component={Center}></Route> */}
              {/* <Route path="/home/right" component={Right}></Route> */}
              
            </Switch>
          </Content> 
        </Layout>
      </div>
    );
  }

}