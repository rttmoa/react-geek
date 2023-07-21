/***--- QA中测试代码 ---**/

/***--- Video：6-9-ts改造==> 07-非空断言的使用 ---**/
// 断言
// 类型断言： console.log((user as User).age)  和  使用泛型
// ! 非空断言 告诉ts   !  前面那货不可能为空
// 断言： 除非你很确定这个类型的值不为空采用、断言可能会导致bug
type User = {
  name: string
  age: number
} | null

function show (user: User){
  console.log(user.age)//对象可能为 "null"
  if(user){console.log(user.age)} // 解决1
  console.log(user?.age) // 解决2
  console.log(user!.age) // 非空断言
  console.log(user<User>)
}
show(null)


/***--- Video：6-9-ts改造==> 08-ts改造 修改 storage完成 ---**/
import {getTokenInfo, getLocalChannels} from '@/utils/storage'
getTokenInfo().refresh_token// 可以提示出
getLocalChannels().forEach((v) => console.log(v.name)) // 可以提示出 数组方法和id和name





import Icon from '@/components/Icon'
import Input from '@/components/Input' 
import TextArea from '@/components/Textarea'
import { useRef } from 'react'
 

// 联合类型
type MyType = number | string
let a: MyType = '123'
a = 123
console.log(a)

// 交叉类型
type Users = {
  name: string
  age: number
} 
type Demo = {
  gender: string
  age: string
} 
// 交叉类型，可以合并多个类型，，但是需要注意冲突的问题 Omit   (两个类型都存在一个属性)
type Type = Users & Demo;
type Type = Users & Omit<Demo, 'age'>

const t: Type = {
  name: 'zs',
  age: 18,
  gender: '女',
}


/***--- unknown 和 any的区别        unknown：更安全的any、通过判断类型进行收窄、确定类型了做确定的操作 | 安全(范围更窄) ---**/
let num: unknown = 'hello'
if(typeof num === 'string'){
  console.log(num.length)
}
if(typeof num === 'number'){
  console.log(num.toFixed())
}


/***--- 索引签名类型 ---**/
type Userb = {
  [index: number]: string
}
const user: Userb ={
  0:'123',
  1:'bcd',
  2:'ccc'
}


/***--- actions type ---**/
type Action = {
  type: string
  [key: string]: any
}
之前action： type必须, 其他类型随意
const a = {
  type: '123',
  a: '其他类型随意'
}


/***--- 获取函数fn的返回值的类型 ---**/
let obj = {
  name: 'zs',
  age: 19
}
const fn = (n1: number, n2: number): number => {
  return n1 + n2
}
// typeof 可以获取到某个值的类型
type MyTypes = typeof obj // type MyTypes = {name: string; age: number;}
type Myfn = typeof fn
// ReturnType: 可以获取某个函数类型的返回值
type Res = ReturnType<typeof fn>//type Res = number



/***--- 索引查询类型 ---**/
type UserN = {
  name: string
  age: number
}
type A  = UserN['name'] //type A = string


let nums = 12 as const;


/***--- 让所有的 关键词高亮 ---**/
let str = 'hello Eaa'
'h<span style="color:red">E</span>llo <span style="color:red">E</span>aa'

str = str.replace('e', '<span>e</span>')// 把e替换成<span>e</span>
console.log(str)
str = str.replace(/e/gi, '<span>e</span>')// 正则：全局所有的e, 忽略大小写
str = str.replace(new RegExp('e', 'gi'), '<span>e</span>')
str = str.replace(new RegExp('e', 'gi'), (match: string) => {
  console.log(match)
  // return match
  return `<span style="color: red">${match}</span>`
})


const Question = () => {
  // 使用useRef的注意点：
  // 1. useRef一般需要配合非空断言来一起使用 ref初始值给了null
  // 2. 使用useRef需要配合 泛型来执行useRef的类型
  // document.createElement('a')
  const Ref = useRef<HTMLAnchorElement>(null)
  console.log(Ref.current!.href)
  // document.createElement('img')
  const aRef = useRef<HTMLImageElement>(null)
  console.log(aRef.current!.src)
  return (
    // 测试组件 传参类型 和 语法提示 功能
    <div>
      <NavBar onLeftClick={() => console.log('123')} extra={<span>123</span>}>
        登录
      </NavBar>
      <a ref={Ref} href="#/123">哈哈哈</a>
      <img ref={aRef} src="1.jpg" alt="" />
      <button>按钮</button>  
      <input type="text" value="原生的支持各种属性" /> 
      <TextArea value="123" placeholder="哈哈哈"></TextArea>
      <Input
        autoFocus
        extra="获取验证码"
        onExtraClick={() => {
          console.log('哈哈')
        }}
        placeholder="你好啊"
        value={'哈哈哈'}
        type="text"
      ></Input>
    </div>
  )
}

export default Question
 