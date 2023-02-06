import React, { Component } from 'react'
import styles from './index.module.scss'
import { Layout, Menu, message, Popconfirm } from 'antd'  ///Popconfirm: 弹出确认框
import { Switch, Route, Link } from 'react-router-dom'
import { LogoutOutlined, HomeOutlined, DiffOutlined, EditOutlined} from '@ant-design/icons'
import { removeToken } from 'utils/storage'
import { getUserProfile } from 'api/user'
const Home = React.lazy(()=> import('pages/Home'))
const ArticleList = React.lazy(()=> import('pages/ArticleList'))
const ArticlePublish = React.lazy(()=> import('pages/ArticlePublish'))
const Design = React.lazy( ()=> import('pages/Design'))
const { Header, Content, Sider } = Layout



/**--- 
 * 一、antd组件的css使用
 * 
 * 
 * 
 **/
export default class LayoutComponent extends Component {
  state = {
    profile: {},
    selectedKey: this.props.location.pathname
  }

  // 发送请求进行 登录
  async componentDidMount() {
    const res = await getUserProfile() // getUserProfile(): AxiosPromise<any>
    this.setState({profile: res.data})
  }

  // 组件更新完钩子函数、路由变化了、组件也会重新渲染
  // prevProps: 上一次的props
  componentDidUpdate(prevProps) {   
    // console.log(prevProps)
    // console.log("我更新了")
    // 判断 url 地址 是否发生了变化、如果是 才更新
    // 在 componentDidUpdate 要添加判断  否则会死循环
   let pathname = this.props.location.pathname
    if(this.props.location.pathname !== prevProps.location.pathname){// 当前的路由和上一次的路由作对比
      
      // console.log('我点击了别的组件!')

      if(pathname.startsWith('/home/publish')){
         pathname = '/home/publish'
      }
      this.setState({
        selectedKey: pathname
      })
    } 
  }


  // 退出系统
  onConfirm = () => {
    // console.log('点击了确定按钮')
    // return

    // 移除token
    // localStorage.removeItem('token')
    removeToken()
    // 跳转到登录页
    this.props.history.push('/login')
    // 提示消息
    message.success('退出成功')
  }



 

  render() {
    /**--- 
     * 组件==>
     * Layout、https://ant.design/components/layout-cn/
     * Popconfirm、https://ant.design/components/popconfirm-cn/#API
     * icon、https://ant.design/components/icon-cn/
     * Menu、https://ant.design/components/menu-cn/
     * Link、https://ant.design/components/anchor-cn/#Link-Props
     */
    // const {name: Username} = this.state.profile;
    const {profile, selectedKey} = this.state;
    // console.log(selectedKey)
    return (
      <div className={styles.layout}>
        {/* 
          <div className={styles.aa}>首页布局组件</div>
          <div className={styles.bb}>bb盒子</div>
          <div className={styles['user-list']}></div> 类名为 .user-list
          <div className={styles.userList}></div> 驼峰命名法 
          需求：想要修改字体图标的颜色
          <span className={`${ styles.iconfont } iconfont icon-duigou`}> </span>
          分页组件 使用 :global() {}  css的使用  index.modules.scss 文件案例
          <Pagination defaultCurrent={1} total={50}> 
        */}
        <Layout>
          <Header className="header">
            <div className="logo" />
            <div className="profile">
              <span>{profile.name}</span>      
              <span>
                <Popconfirm
                  title="你确定要退出本系统吗?"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={this.onConfirm}
                >
                  <LogoutOutlined />{' '}退出
                </Popconfirm>
              </span>
            </div>
          </Header>

          <Layout>

            <Sider width={200}>
              {/* 如果默认高亮不会变、使用 defaultSelectedKeys */}
              {/* 如果默认高亮会变化、需要使用selectedKeys */}
              <Menu
                theme="light"
                mode="inline"
                // 这个 keys 指的是 选择哪个 地址
                // defaultSelectedKeys={[this.props.location.pathname]}   /* 从地址栏中 拿到 侧边栏的 url */
                selectedKeys={[selectedKey]}
                style={{ height: '100%', borderRight: 0 }}
              >
                <Menu.Item key="/home" icon={<HomeOutlined />}>  
                  <Link to="/home">数据概览</Link>   
                </Menu.Item>
                <Menu.Item key="/home/list" icon={<DiffOutlined />}>
                  <Link to="/home/list">内容管理</Link>
                </Menu.Item>
                <Menu.Item key="/home/publish" icon={<EditOutlined />}>
                  <Link to="/home/publish">发布文章</Link>
                </Menu.Item>
                <Menu.Item key="/home/design" icon={<EditOutlined />}>
                  <Link to="/home/design">Design</Link>
                </Menu.Item>
              </Menu>
            </Sider>

            <Layout style={{ padding: '24px' }}>
              <Content className="site-layout-background">
                
                {/* 路由规则 */}
                <Switch>
                    <Route exact path="/home" component={Home}></Route>
                    <Route path="/home/list" component={ArticleList}></Route>
                    <Route exact path="/home/publish" component={ArticlePublish} key="add"></Route>
                    <Route path="/home/publish/:id" component={ArticlePublish} key="edit"></Route>
                    <Route path="/home/design" component={Design}></Route>
                </Switch>
              
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    )
  }
  
}
