import  NavBars  from '@/components/NavBar';
import {history} from '@/utils/index'
import styles from './index.module.scss'
 
const Question = () => {
 



  
  return (
    <div className={styles.root}>
      <NavBars onLeftClick={() => history.go(-1)}>问答</NavBars>
      <div>
        <p>干净的页面, 测试组件及代码</p>
      </div>
      



    </div>

  )
}











export default Question


//静态结构
    /* 
      <div className="question-list">
        <div className="question-item">
          <div className="left">
            <h3>作为 IT 行业的过来人，你有什么话想对后辈说的？</h3>
            <div className="info">
              <span>赞同 1000+</span>
              <span>评论 500+</span>
              <span>1小时前</span>
            </div>
          </div>
          <div className="right">
            <img
              src="https://pic1.zhimg.com/80/v2-8e77b2771314f674cccba5581560d333_xl.jpg?source=4e949a73"
              alt=""
            />
          </div>
        </div>
        <div className="question-item">
          <div className="left">
            <h3>作为 IT 行业的过来人，你有什么话想对后辈说的？</h3>
            <div className="info">
              <span>赞同 1000+</span>
              <span>评论 500+</span>
              <span>1小时前</span>
            </div>
          </div>
          <div className="right">
            <img
              src="https://pic1.zhimg.com/80/v2-8e77b2771314f674cccba5581560d333_xl.jpg?source=4e949a73"
              alt=""
            />
          </div>
        </div>
        <div className="question-item">
          <div className="left">
            <h3>作为 IT 行业的过来人，你有什么话想对后辈说的？</h3>
            <div className="info">
              <span>赞同 1000+</span>
              <span>评论 500+</span>
              <span>1小时前</span>
            </div>
          </div>
          <div className="right">
            <img
              src="https://pic1.zhimg.com/80/v2-8e77b2771314f674cccba5581560d333_xl.jpg?source=4e949a73"
              alt=""
            />
          </div>
        </div>
        <div className="question-item">
          <div className="left">
            <h3>作为 IT 行业的过来人，你有什么话想对后辈说的？</h3>
            <div className="info">
              <span>赞同 1000+</span>
              <span>评论 500+</span>
              <span>1小时前</span>
            </div>
          </div>
          <div className="right">
            <img
              src="https://pic1.zhimg.com/80/v2-8e77b2771314f674cccba5581560d333_xl.jpg?source=4e949a73"
              alt=""
            />
          </div>
        </div>
        <div className="question-item">
          <div className="left">
            <h3>作为 IT 行业的过来人，你有什么话想对后辈说的？</h3>
            <div className="info">
              <span>赞同 1000+</span>
              <span>评论 500+</span>
              <span>1小时前</span>
            </div>
          </div>
          <div className="right">
            <img
              src="https://pic1.zhimg.com/80/v2-8e77b2771314f674cccba5581560d333_xl.jpg?source=4e949a73"
              alt=""
            />
          </div>
        </div>
      </div>  
      */