import { useEffect, useState, useRef } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
import React from 'react'

/**首页-推荐/开发者咨询....  */
const Tabs = ({ index = 0, tabs = [], children, onChange }) => {
  const navRef = useRef()
  const lineRef = useRef()

  const [activeIndex, setActiveIndex] = useState(index);

  const changeTab = index => {
    setActiveIndex(index)
    onChange(index)
  }

  // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
  // https://github.com/facebook/react/issues/14830
  useEffect(() => {
    setActiveIndex(index)
  }, [index])

  // TODO: 操作DOM、完成顶部滚动动画效果 - 未完成
  useEffect(() => {
    // TODO: 清理上一次的 animate

    // console.log(navRef.current.children[activeIndex])    // 获取原生DOM元素
    const activeTab = navRef.current.children[activeIndex]; // 获取原生DOM元素

    const activeTabWidth = activeTab.offsetWidth || 60;    // 文字盒子的宽度 

    const activeOffsetLeft = activeTab.offsetLeft || 8;     // 文字距离左侧的距离

    const tabWidth = navRef.current.offsetWidth || 289;     // 点击的默认宽度 318

    // console.log(activeOffsetLeft)
    
    const to = activeOffsetLeft - (tabWidth - activeTabWidth) / 2;
    // const to = 文字距离左侧的距离 - (默认宽度318 - 文字盒子的宽度) / 2;
    // navRef.current.scrollLeft = to
    const from = navRef.current.scrollLeft; // 当开始滚动的距离最左侧的距离 s20u,    0 - 428
    const frames = Math.round((0.2 * 1000) / 16); // Math.round: 四舍五入   13
    // console.log('to', to)
    // console.log('from', from)



    let count = 0
    function animate() {
      // console.log(navRef.current.scrollLeft)
      navRef.current.scrollLeft += (to - from) / frames

      if (++count < frames) {
        requestAnimationFrame(animate)
      }
    }

    animate()

    /**--- 底部的下划线跟随高亮文字移动 ---**/
    // window.innerWidth / 375： 手动处理 JS 移动端适配
    // 说明：15 表示 Line 宽度的一半 
    lineRef.current.style.transform = 
    `translateX(${activeOffsetLeft + activeTabWidth / 2 - 15 * (window.innerWidth / 375)}px)`;


    // 注意： 由于 tabs 数据是动态获取的，所以，为了能够在 tabs 数据加载完成后
    //       获取到 tab，所以，此处将 tabs 作为依赖项。
    //       否则，会导致 navRef.current.children[activeIndex] 拿到的是 line 而不是第一个tab
  }, [activeIndex, tabs])



  // console.log('navRef', navRef)
  // console.log('lineRef', lineRef)
  // console.log('tabs', tabs)
  // console.log(React.Children)
  // console.log('Tabs activeId', tabs[activeIndex]) // {id: 10, title: '产品'}、  activeId可以拿到item的id

  
  

  return (
    <div className={styles.root}>
      <div className="tabs">
        <div className="tabs-wrap">
          <div className="tabs-nav" ref={navRef}>
            {
              tabs.map((item, i) => {
                // console.log(item) // item可以拿到每一个id
                return(
                  <div className={classnames('tab', i === activeIndex ? 'active' : '')} key={i} onClick={() => {changeTab(i)}}>
                    <span>{item.title}</span>
                  </div>
                )
              })
            }
            {/* 底部下划线 */}
            <div className="tab-line" ref={lineRef}></div>
          </div>
        </div>

        <div className="tabs-content">
          {
            React.Children.map(children, child => {//TODOS: 为每个子元素生成副本，并传入选中选项卡的 id 值
              return React.cloneElement(child, {activeId: tabs[activeIndex]?.id || 0})})
          }
        </div>
      </div>
    </div>
  )
}

Tabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  children: PropTypes.arrayOf(PropTypes.element)
}

export default Tabs
