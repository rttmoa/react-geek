import Icon from '@/components/Icon'
import NavBar from '@/components/NavBar'
import { clearSuggestion, getSuggestion } from '@/store/actions'
import classnames from 'classnames'
import debounce from 'lodash/debounce'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss';

/**--- 顶部 import 引入的组件 在代码中如何使用? Icon、NavBar、lodash/debounce、useMemo ---**/
/**--- getSuggestion() 函数 中 map的处理 及 es6的语法 ---**/
/**--- 页面不跳转 - 在App.js中加 exact 严格匹配 ---**/
/**--- useMemo组件的作用、https://blog.csdn.net/m0_46694056/article/details/122189832?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-122189832-blog-103559789.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-122189832-blog-103559789.pc_relevant_default&utm_relevant_index=2 ---**/
/**--- scss样式 很多无width ---**/


const Search = ({ history }) => {
  const dispatch = useDispatch()
  const suggestList = useSelector(state => state.search.suggest)//TODO:获取关键词

  const [searchValue, setSearchValue] = useState('')   //作用: 控制图标显示隐藏, 搜索按钮的提交事件
  const [isSearching, setIsSearching] = useState(false)//作用: 控制div的显示结构 控制类名 让盒子是否显示

  // 节流阀 - getSuggestion() 函数
  const showSuggest = useMemo(
    () => debounce(value => dispatch(getSuggestion(value)), 500),
    [dispatch]
  )

  const onSearchChange = e => {
    /**
     * 搜索框的onChange事件
     * 1.设置搜索的值为 事件对象e
     * 2.判断输入框中是否有值、控制是否显示搜索列表、是否发请求
     */
    const value = e.target.value
    setSearchValue(value) // 如果有值就设置值, 用来控制清空图标, 搜索按钮提交事件

    if (value.trim()) {
      // 表示有值
      setIsSearching(true)
      showSuggest(value)
    } else {
      setIsSearching(false)
    }
  }

  
  const onClear = () => {
    /**注释: 
     * 清空操作-> 
     * 1.输入框的值为空 
     * 2.设置 是否搜索 为false 
     * 3.发请求清空redux中的值  
     * */
    setSearchValue('')
    setIsSearching(false)
    dispatch(clearSuggestion())
  }



  const onGoToDetail = (value = searchValue) => {
    history.push(`/search/result?q=${value}`)
  }



  // console.log(suggestList)


  return (
    <div className={styles.root}>
       
      <NavBar
        className="navbar"
        onLeftClick={() => history.go(-1)}
        rightContent={
          <span className="search-text" onClick={() => onGoToDetail()}>
            搜索
          </span>
        }
      >
        <div className="navbar-search">
          <Icon type="iconbtn_search" className="icon-search" />
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="请输入关键字搜索"
              value={searchValue}
              onChange={onSearchChange}
            />
            {/* 如果有输入就显示图标  受控组件 */}
            {searchValue && (<Icon type="iconbtn_tag_close" className="icon-close" onClick={onClear}/>)}
          </div>
        </div>
      </NavBar>
      {/* ==========================================NavBar 头部结束====================================== */}


      <div className="history" style={{ display: isSearching ? 'none' : 'block' }}>
        <div className="history-header">
          <span>搜索历史</span>
          <span onClick={() => alert(123)}>
            <Icon type="iconbtn_del" />
            清除全部
          </span>
        </div>

        <div className="history-list">
          <span className="history-item">
            Python生成九宫格图片<span className="divider"></span>
          </span>
          <span className="history-item">
            Python<span className="divider"></span>
          </span>
          <span className="history-item">
            CSS<span className="divider"></span>
          </span>
          <span className="history-item">
            数据分析<span className="divider"></span>
          </span>
            静态结构渲染
        </div>
      </div>
      {/* ====================================搜索页面的静态结构部分======================================= */}


      <div className={classnames('search-result', isSearching ? 'show' : false)}>
        {suggestList.map((item, index) => (
          <div
            key={index}
            className="result-item"
            onClick={() => onGoToDetail(`${item.suggest}${item.rest}`)}
          >
            <Icon className="icon-search" type="iconbtn_search" />
            <div className="result-value">
              <span>{item.suggest}</span>
              {`${item.rest}`}
            </div>
          </div>
        ))}
      </div>
      {/* ====================================输入关键词搜索部分======================================= */}
    </div>
  )
}

export default Search
