import NavBar from '@/components/NavBar'
import styles from './index.module.scss'
import Input from '@/components/Input'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { login, sendCode } from '@/store/actions/login'
import { Toast } from 'antd-mobile'
import { useState } from 'react'
import { useHistory, useLocation } from 'react-router'



export default function Login() {

  const history = useHistory() // useHistory<unknown>()
  // useLocation钩子也需要泛型，参数类型用于指定state的类型
  const location = useLocation<{ from: string }>();
  const dispatch = useDispatch();
  const [time, setTime] = useState(0);

  const onExtraClick = async () => {
    if (time > 0) return;
    // 先对手机号进行验证
    if (!/^1[3-9]\d{9}$/.test(mobile)) {
      formik.setTouched({ mobile: true })
      return;
    }

    await dispatch(sendCode(mobile));

    Toast.success('获取验证码成功', 1)

    // 开启倒计时
    setTime(5);
    let timeId = setInterval(() => {
      // 当我们每次都想要获取到最新的状态，需要写成 箭头函数的形式
      setTime((time) => {
        if (time === 1) {
          clearInterval(timeId);
        }
        return time - 1;
      });
    }, 1000);
  }
  const formik = useFormik({
    initialValues: {
      mobile: '13911111111',
      code: '246810',
    },
    // 当表单提交的时候，会触发
    async onSubmit(values) {
      await dispatch(login(values));
      Toast.success('登录成功');
      const pathname = location.state ? location.state.from : '/home';
      // history.go(-1) 页面回退
      // history.go(1) 页面前进
      // history.push() 页面跳转，并且往页面栈中添加一条记录
      // history.replace() 页面跳转，但是不会添加一条记录，而且替换当前的记录
      history.replace(pathname)
    },

    validationSchema: Yup.object({
      mobile: Yup.string().required('手机号不能为空').matches(/^1[3-9]\d{9}$/, '手机号格式错误'),
      code: Yup.string().required('验证码不能为空').matches(/^\d{6}$/, '验证码格式错误'),
    }),
  })
  const {
    values: { mobile, code },
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    touched,
    isValid,
  } = formik;
  return (
    <div className={styles.root}>
      {/* 导航条 */}
      <NavBar>登录</NavBar>
      {/* 内容 */}
      <div className="content">
        <h3>短信登录</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-item">
            <Input
              placeholder="请输入手机号"
              value={mobile}
              name="mobile"
              autoComplete="off"
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={11}
            ></Input>
            {touched.mobile && errors.mobile ? (<div className="validate">{errors.mobile}</div>) : null}
          </div>
          <div className="input-item">
            <Input
              placeholder="请输入验证码"
              extra={time === 0 ? '获取验证码' : time + 's后获取'}
              onExtraClick={onExtraClick}
              value={code}
              name="code"
              onChange={handleChange}
              autoComplete="off"  
              onBlur={handleBlur}
              maxLength={6}
            ></Input>
            {touched.code && errors.code ? (<div className="validate">{errors.code}</div>) : null}
          </div>
          {/* 登录按钮 产品 */}
          <button
            type="submit"
            className={classNames('login-btn', { disabled: !isValid })}
            disabled={!isValid}
          >
            登录
          </button>
        </form>
      </div>
    </div>
  )
}
