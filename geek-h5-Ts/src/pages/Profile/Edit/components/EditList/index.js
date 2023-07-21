import styles from './index.module.scss'









const EditList = ({ config, onClose, type }) => {
  const list = config[type]; // config[gender]
  // console.log(list)
  
  return (
    <div className={styles.root}>
      {/* gender: [{title: '男', onClick: f}, ..] */}
      {list.map((item) => (
        <div key={item.title} className="list-item" onClick={item.onClick}>
          {item.title}
        </div>
      ))}
      <div className="list-item" onClick={onClose}>取消</div>
    </div>
  )
}
export default EditList
