import { isAuth } from '@/utils'
import { Navigate } from 'react-router-dom'




// 校验函数
// 检验逻辑：如果没有token 直接跳转到login 有token 正常渲染
const AuthRoute = ({ children }) => {
  return !isAuth() ? <Navigate to='/login' replace /> : <>{children}</>
}

export { AuthRoute }