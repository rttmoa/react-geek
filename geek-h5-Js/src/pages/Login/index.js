import Input from '@/components/Input'
import NavBar from '@/components/NavBar'
import { login, sendSms } from '@/store/actions'
import { Toast } from 'antd-mobile'
import classnames from 'classnames'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import * as Yup from 'yup'
import styles from './index.module.scss'



/**
 * 实现功能：
 * 1.yup模块
 * 2.formik模块
 * 3.dispatch发送验证码
 * 6.封装 Input 输入框
 * 7.classNames的使用
 */
const Login = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const [time, setTime] = useState(0)


  const formik = useFormik({
    initialValues: {
      mobile: '13900001111',
      code: '246810'
      // mobile: '',
      // code: ''
    },
    // 表单验证
    validationSchema: Yup.object().shape({
      mobile: Yup.string().required('请输入手机号').matches(/^1[3456789]\d{9}$/, '手机号格式错误'),
      code: Yup.string().required('请输入验证码').matches(/^\d{6}$/, '验证码6个数字')
    }),
    // 表单提交：
    onSubmit: async ({mobile, code}) => {///--------->   {mobile: '13900001111', code: '246810'}  
      // debugger;
      await dispatch(login({mobile, code}))
      Toast.info('登录成功!', 1)

      // return; 
      // const pathname = location.state ? location.state.from : '/home'
      // history.go(-1): 页面后退
      // history.go(1): 页面前进
      // history.push(): 页面跳转，并且往页面栈中添加一条记录
      // history.replace(): 页面跳转，但是不会添加一条记录，而是替换当前记录
      // console.log(location)
      // return
      const { state } = location
      if (!state) {
        history.replace('/home/index')
      } else {
        // 跳转回要访问的页面
        history.replace(state.from)
      }
    }
  })


  // 发送验证码 - 排队机制功能
  const onSendSms = async () => {
    if(time > 0) return;
    // console.log(123)
    const { mobile } = formik.values;
    try {
      // await 返回Promise对象的处理结果、如果等待不是Promise对象、则返回该值本身  --> 官网:MDN
      await dispatch(sendSms(mobile));
      Toast.success('获取验证码成功', 1)
      // Toast.info('验证码发送成功!', 1)
      // return;

      // 获取验证码成功, 开启倒计时
      setTime(60);
      // setTime(value => console.log('v', value))
      let timeId = setInterval(()=> {
        setTime((time) => {
          if(time === 1 ) { clearInterval(timeId) }
          return time - 1;
        })
      },1000)
    } catch (err){
      // 保证response有值才行, 这里否则会直接访问 data.message
      // if(err.response){Toast.fail(err.response.data.message, 1)}  
      // else{Toast.fail('服务器繁忙,请重试')}
      console.error(err.response?.data.message)
    }
  }


  const onLeftClick = () => history.go(-1);
  const { errors, touched, values, isValid, handleChange, handleSubmit } = formik;  //-------解构formik属性  ?  touched 触摸到输入框中
  // debugger;
  // console.log(1, formik.errors)
  // console.log(2, formik.touched)


  return (
    // 盒子布局、无宽高、使用padding及margin撑起盒子
    <div className={styles.root}>
      <NavBar onLeftClick={onLeftClick} className='iconfanhui' />

      <div className="content">
        <h3>短信登录</h3>

        <form onSubmit={handleSubmit}>

          <div className="input-item">
            <Input
              name="mobile"
              value={values.mobile}
              onChange={handleChange}
              placeholder="请输入手机号"
              // onBlur={hanleBlur}    onBlur事件：失去焦点触发
              // autoComplete="off"
            />
            {errors.mobile && touched.mobile && (<div className="validate">{errors.mobile}</div>)}
            {/* {errors.mobile && (<div className="validate">{errors.mobile}</div>)} */}
          </div>

          <div className="input-item">
            <Input
              name="code"
              value={values.code}
              onChange={handleChange}
              placeholder="请输入验证码"
              extra={time === 0 ? '获取验证码' : time + 's后获取验证码' }
              onExtraClick={onSendSms}
              maxLength={6}
            />
            {errors.code && touched.code && (<div className="validate">{errors.code}</div>)}
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={classnames('login-btn', !isValid ? 'disabled' : '')}
          >
            登录
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
