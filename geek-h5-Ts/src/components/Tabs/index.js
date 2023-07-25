import React, { useEffect, useState, useRef } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styles from './index.module.scss' 




const Tabs = ({ index = 0, tabs = [], children, onChange }) => { // 索引，用户频道，内容，切换index
  const navRef = useRef()  // 绑定Nav的DOM盒子
  const lineRef = useRef() // 控制选中的 红色下划线

  // 切换顶部导航栏，监听顶部导航栏
  const [activeIndex, setActiveIndex] = useState(index);   
  const changeTab = (index) => {
    setActiveIndex(index);
    onChange && onChange(index);
  }
  useEffect(() => {
    setActiveIndex(index);
  }, [index])


  // 当activeIndex发生了改变，修改线的位置以及tabBar中心的位置
  useEffect(() => {
    const activeTab = navRef.current.children[activeIndex];
    // console.log(navRef.current) // 所有DOM：<div class="tabs-nav">....</div>
    // console.log(navRef.current.children) // HTMLCollection(15) [...]
    // console.log(navRef.current.childNodes) // NodeList(15) [...]
    // console.log(navRef.current.children[activeIndex]) // 当前DOM：<div class="tab active"><span>区块链</span></div>
    // console.log(Boolean(activeTab)) // 有DOM为ture，无DOM为false
    if (!activeTab) return
    // console.log(activeTab.offsetLeft)
    // console.log(navRef.current.offsetWidth)

    const activeTabWidth = activeTab.offsetWidth || 60; // 盒子宽度
    // 注意：第一次获取 offsetLeft 值为 0 ，以后每次获取为 8    所以，设置默认值 8，让所有情况下 offsetLeft 值都相同
    const activeOffsetLeft = activeTab.offsetLeft || 8
    const tabWidth = navRef.current.offsetWidth || 289

    const to = activeOffsetLeft - (tabWidth - activeTabWidth) / 2
    // navRef.current.scrollLeft = to
    const from = navRef.current.scrollLeft;
    const frames = Math.round((0.2 * 1000) / 16);
    let count = 0;
    function animate() {
      navRef.current.scrollLeft += (to - from) / frames
      if (++count < frames) {
        requestAnimationFrame(animate)
      }
    } 
    animate()

    // window.innerWidth / 375： 手动处理 JS 移动端适配
    // 说明：15 表示 Line 宽度的一半
    // console.log(activeTabWidth) // 点击activeIndex选中的DOM盒子的宽度
    // console.log(activeOffsetLeft) // 点击的activeIndex距离DOM盒子最左侧的距离
    // console.log(window.innerWidth) // 设备的宽度
    lineRef.current.style.transform = `translateX(${
      activeOffsetLeft + (activeTabWidth / 2) - (15 * (window.innerWidth / 375))
    }px)`;

    // 注意:由于 tabs 数据是动态获取的，所以，为了能够在 tabs 数据加载完成后, 获取到 tab，所以，此处将 tabs 作为依赖项。
      // 否则，会导致 navRef.current.children[activeIndex] 拿到的是 line 而不是第一个tab
  }, [activeIndex, tabs])



  return (
    <div className={styles.root}>
      <div className="tabs">
        
        <div className="tabs-wrap">
          <div className="tabs-nav" ref={navRef}>
            {tabs.map((item, index) => {
              let cx = classnames('tab', index === activeIndex ? 'active' : '');
              return (
                <div className={cx} key={index} onClick={() => changeTab(index)}>
                  <span>{item.name}</span>
                </div>
              )
            })}
            <div className="tab-line" ref={lineRef}></div>
          </div>
        </div>

        <div className="tabs-content">
          {React.Children.map(children, (child, index) => { // children为所有的DOM盒子，child为每一个选项卡
            // console.log(child)
            return (
              <div className="tabs-content-wrap" style={{ display: index === activeIndex ? 'block' : 'none' }}>
                {/* 为每个子元素生成副本，并传入选中选项卡的 id 值 */}
                {React.cloneElement(child, { aid: tabs[activeIndex]?.id || 0 })}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
Tabs.propTypes = {
  tabs: PropTypes.array.isRequired,
}
export default Tabs
