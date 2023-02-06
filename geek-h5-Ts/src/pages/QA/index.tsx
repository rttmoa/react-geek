// import Sticky from '@/components/Sticky'
const Question = () => {
  // 使用useRef的注意点：
  // 1. useRef一般需要配合非空断言来一起使用 ref初始值给了null
  // 2. 使用useRef需要配合 泛型来执行useRef的类型
  // const aRef = useRef<HTMLImageElement>(null)
  // console.log(aRef.current!.src)
  return <div style={{ height: 2000 }}>啦啦啦啦</div>
}

export default Question
