import React, { Component } from 'react'
import { Card, Form, Input, Button, Checkbox, message } from 'antd'    
import styles from './index.module.scss'
import logo from 'assets/logo.png'
import { login } from 'api/user'
import { setToken } from 'utils/storage'
//****  styles  -->    {login: 'Login_login__HU5sV'}

/**--- 
 * 登陆模块：
 * 一、html、css布局形式
 * 二、antd组件库中表单Form组件的规则使用
 * 三、完成后onFinish的处理
 * 四、login模块的封装、Token的封装
 * 五、控制按钮是否加载中...
 * 
 */
export default class Login extends Component {
  state = {
    loading: false,
  }

  // onFinish = (value) => { console.log(value) } //1.{mobile: '15303663375', code: '246810', agree: true}  2.请求接口
  onFinish = async ({ mobile, code }) => {

    this.setState({loading: true})
    
    try {
      const res = await login(mobile, code) // 封装-闭包-> login(mobile: string, code: string): AxiosPromise<any>

      // 3. 提示消息
      message.success('登录成功', 1, () => {
        // 登录成功
        // 1. 保存token
        // localStorage.setItem('token', res.data.token)
        setToken(res.data.token)

        // 2. 跳转到首页
        // 判断location.state中是否有值
        const { state } = this.props.location
        if (state) {
          this.props.history.push(state.from) // 从哪里拦截的登陆/哪个页面来的 再回去
        } else {
          this.props.history.push('/home')
        }
      })
    } catch (error) {
      /**--- 如果输入的手机号及验证码输入的不正确会阻止登陆、提示错误信息 ---**/
      message.warning(error.response.data.message, 1, () => {
        this.setState({loading: false})
      })
    }
  }
  // onFinish({mobile, code}) { this.setState({ loading: true  });}


  render() {
    return (
      <div className={styles.login}>{/* 查看布局 html、css */}

        <Card className="login-container">

          <img src={logo} alt="" className="login-logo" />

          <Form
            size="large"
            validateTrigger={['onChange', 'onBlur']} ///失去焦点
            // onFinish={this.onFinish.bind(this)}  ///校验成功事件
            onFinish={this.onFinish}
            initialValues={{
              mobile: '13911111111',
              code: '246810',
              agree: true,
            }}
          >
            {/* 账号 */}
            <Form.Item
              name="mobile" ////接口文档中的参数
              rules={[  ///验证规则    antd官网中
                {
                  required: true,
                  message: '手机号不能为空',
                },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '手机号格式错误',
                },
              ]}
            >
              <Input placeholder="请输入你的手机号" autoComplete="on" /> {/* autoComplete: 是否填充 是否完成 完成的数据是否显示 */}
            </Form.Item>

            {/* 密码 */}
            <Form.Item
              name="code"  ////接口文档中的参数
              rules={[
                {
                  required: true,
                  message: '验证码不能为空',
                },
                {
                  pattern: /^\d{6}$/,
                  message: '验证码格式错误',
                },
              ]}
            >
              <Input placeholder="请输入验证码" autoComplete="off"></Input>
            </Form.Item>

              {/* 是否 阅读协议 */}
            <Form.Item
              valuePropName="checked"
              name="agree"
              rules={[
                {
                  // 自定义校验规则
                  validator: (rule, value) =>
                  // { if(value) {return Promise.resolve()}else{ return Promise.reject(new Error('请阅读并同意用户协'))} } 
                  // Promise.reject(new Error('123')) === new Promise((resolve, reject) => {reject(new Error("123"))})
                  
                  value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意用户协议')),
                },
              ]}
            >
              <Checkbox>我已阅读并同意[隐私条款]和[用户协议]</Checkbox>
            </Form.Item> 

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={this.state.loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
  
}
