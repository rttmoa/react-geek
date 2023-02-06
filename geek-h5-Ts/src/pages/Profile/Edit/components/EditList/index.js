import styles from './index.module.scss'
const EditList = ({ config, onClose, type }) => {
  const list = config[type]
  return (
    <div className={styles.root}>
      {list.map((item) => (
        <div key={item.title} className="list-item" onClick={item.onClick}>
          {item.title}
        </div>
      ))}

      <div className="list-item" onClick={onClose}>
        取消
      </div>
    </div>
  )
}
export default EditList
