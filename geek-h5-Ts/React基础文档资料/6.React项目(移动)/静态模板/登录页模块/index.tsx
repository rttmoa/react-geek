import { Button, NavBar, Form, Input, List, Toast } from 'antd-mobile'
import styles from './index.module.scss'

const Login = () => {
  return (
    <div className={styles.root}>
      <NavBar></NavBar>
      <div className="login-form">
        <h2 className="title">账号登录</h2>
        <Form>
          <Form.Item name="mobile" className="login-item">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <List.Item className="login-code-extra">
            <Form.Item name="code" className="login-item">
              <Input placeholder="请输入验证码" autoComplete="off" />
            </Form.Item>
          </List.Item>
          <Form.Item noStyle>
            <Button
              block
              type="submit"
              color="primary"
              className="login-submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default Login
