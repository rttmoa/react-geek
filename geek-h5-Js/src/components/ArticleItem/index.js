import { memo } from 'react'
import classnames from 'classnames'

import dayjs from 'dayjs'; // 模块标准时间 转换为 多长时间之前 比如2022-03-11 09:00:00 - 四年前
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

import Icon from '@/components/Icon'
import Image from '@/components/Image'

import styles from './index.module.scss'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)



/**--- 渲染外壳 ---**/
/**--- clssnames控制外壳显示的样式、是否显示举报图标 ---**/
/**--- React.memo组件的使用、https://blog.csdn.net/sinat_41747081/article/details/108750629 ---**/
const ArticleItem = memo(({art_id,isLogin,type,title,images,aut_name,comm_count,pubdate, onFeedback}) => {// 父组件中是否传递了这些属性 未传递就是undefined
    
    // console.log(123, art_id)
    // console.log(isLogin)
    // http://localhost:3000/search/result?q=FormData
    // console.log(123, images)

    return (
      <div className={styles.root}>
        <div className={classnames('article-content',type === 3 ? 't3' : '', type === 0 ? 'none-mt':'')}>
            
          <h3>{title}</h3>
            {type !== 0 && (
                <div className="article-imgs">
                  {
                    images.map((item, i) => {
                      return (
                        <div className="article-img-wrapper" key={i}>
                          <Image src={item} />
                        </div>
                      )
                    })
                  }
                </div>
              )}
        </div>
        {/* ==============================渲染标题和图片(type值为:无图、一张、三张)========================================= */}

        <div className={classnames('article-info', type === 0 ? 'none-mt' : '')}>
          <span>{aut_name}</span>
          <span>{comm_count} 评论</span>
          <span>{dayjs().from(pubdate)}</span>
          
          {isLogin && (
              <span className="close" onClick={e => { e.stopPropagation(); onFeedback(art_id) }} >
                <Icon type="iconbtn_essay_close" />
              </span>
            )}
        </div>
        {/* ================================渲染底部 作者、评论数、时间、x举报============================================== */}
      </div>
    )
  }
)

export default ArticleItem