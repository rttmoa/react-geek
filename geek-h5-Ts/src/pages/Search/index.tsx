import Icon from '@/components/Icon'
import NavBar from '@/components/NavBar'
import classnames from 'classnames'
import { useHistory } from 'react-router'
import styles from './index.module.scss'
import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSuggestList, clearSuggestions, addSearchList, clearHistories, } from '@/store/actions/search'
import { RootState } from '@/store'
import { Dialog } from 'antd-mobile-v5'
// import debounce from 'lodash/debounce'
// import { DebouncedFunc } from 'lodash'
// let fetData: DebouncedFunc<() => void>



// NavBar中传递搜索children
// 节流阀
// 搜索建议列表 高亮文本 dangerouslySetInnerHTML={{ __html: highlight(item, keyword) }}
// 搜索跳转页面 history.push('/search/result?key=' + key) 及 结果页面接收 keyword




const Search = () => {
  const history = useHistory()
  const [keyword, setKeyword] = useState('')
  const dispatch = useDispatch()
  const { suggestions, histories } = useSelector((state: RootState) => state.search)

  // 是否显示搜索
  const [isSearching, setIsSearching] = useState(false)
  // if (!fetData) {
  //   fetData = debounce(() => {
  //     console.log('发送请求')
  //   }, 500)
  // }
  
  const timerRef = useRef(-1);
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => { // 如果一直输入，如果有定时器 会先清除定时器，创建一个定时器

    const text = e.target.value.trim();   // 要去除字符串、发请求要用到
    setKeyword(text)

    window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      // console.log('发送请求')
      if (text) {
        setIsSearching(true);
        /***--- 关键词建议内容 ---**/
        dispatch(getSuggestList(text))
      } else {
        setIsSearching(false)
      }
    }, 500)
  }

  useEffect(() => {return () => {window.clearTimeout(timerRef.current);}}, [])

  /**
   * 让字符串中的指定内容高亮
   * @param str 字符串
   * @param key 指定内容
   */
  const highlight = (str: string, key: string) => {
    return str.replace(new RegExp(key, 'gi'), (match: string) => {
      return `<span style="color: red">${match}</span>`;
    })
  }

  const onClear = () => {
    // 清空搜索关键字
    setKeyword('')
    // 设置搜索状态
    setIsSearching(false)
    // 清空redux中的数据
    dispatch(clearSuggestions())
  }

  const onSearch = (key: string) => {
    
    // 保存搜索记录
    if (!key) return;

    dispatch(addSearchList(key))

    // 跳转页面
    history.push('/search/result?key=' + key)     //--> 跳转到 /search/result 页面 
  } 

  const onClearHistory = () => {
    // 清空历史记录
    Dialog.confirm({
      title: '温馨提示',
      content: '你确定要清空记录吗？',
      onConfirm: function () {
        dispatch(clearHistories())
      },
    })
  }



  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar className="navbar" onLeftClick={() => history.go(-1)} 
        extra={<span className="search-text" onClick={() => onSearch(keyword)}>搜索</span>}
      >
        <div className="navbar-search">
          <Icon type="iconbtn_search" className="icon-search" />

          <div className="input-wrapper">
            {/* 输入框 */}
            <input type="text" placeholder="请输入关键字搜索" value={keyword} onChange={(e) => onChange(e)}/>

            {/* 清空输入框按钮 */}
            <Icon type="iconbtn_tag_close" className="icon-close"  onClick={onClear}/>
          </div>
        </div>
      </NavBar>

      {/* 搜索历史 */}
      <div className="history" style={{ display: isSearching ? 'none' : 'block' }}>
        <div className="history-header">
          <span>搜索历史</span>
          <span onClick={onClearHistory}><Icon type="iconbtn_del" /> 清除全部</span>
        </div>

        <div className="history-list">
          {histories.map((item, index) => {
            return (
              <span className="history-item" key={index} onClick={() => onSearch(item)}>
                {/* index不等于0时 才渲染组件 */}
                {index !== 0 && <span className="divider"></span>}
                {item}
              </span>
            )
          })}
        </div>
      </div>

      {/* 搜素建议结果列表 */}
      <div className={classnames('search-result', {show: isSearching})}>
        {suggestions.map((item, index) => (
          <div className="result-item" key={index} onClick={() => onSearch(item)}>
            <Icon className="icon-search" type="iconbtn_search" />
            {/* Vue中使用HTML：v-html    高亮展示的是纯文本  需要使用HTML格式展示 */}
            <div className="result-value" dangerouslySetInnerHTML={{ __html: highlight(item, keyword) }}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search
