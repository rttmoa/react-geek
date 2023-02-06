import styles from './index.module.scss'



/**头像和性别  性别：男,女,取消   头像:拍照,本地,取消   在封装的组件中 返回结构   */
const EditList = ({ config, onClose }) => {
  // console.log(config) // {title: '?', onClick: f}

  // 返回到父组件的结构 - 三个盒子的样式及回调函数 - 男,女,取消  ||  拍照,本地上传,取消
  return (
    <div className={styles.root}>
      {
        config.map((item, index) => (
          <div key={index} className="list-item" onClick={item.onClick}>
            {item.title}
          </div>
        ))
      }

      <div className="list-item" onClick={onClose}>
        取消
      </div>
    </div>
  )
}

export default EditList