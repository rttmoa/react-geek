import classnames from 'classnames'
import PropTypes from 'prop-types'







const Icon = ({ type, className, onClick }) => {
  return (
    <svg className={classnames('icon', className)}   onClick={onClick} aria-hidden="true" >
      <use xlinkHref={`#${type}`}></use>
    </svg> 
  )
}

Icon.propTypes = {
  type: PropTypes.string.isRequired
}

export default Icon




// 原模板 xlinkHref的类名不同
  /* 
      <div className="tabbar-item">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconbtn_qa"></use>
        </svg>
        <span>回答</span>
      </div>
      <div className="tabbar-item">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconbtn_video"></use>
        </svg>
        <span>视频</span>
      </div>
      <div className="tabbar-item">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconbtn_mine"></use>
        </svg>
        <span>我的</span>
      </div> 
  */